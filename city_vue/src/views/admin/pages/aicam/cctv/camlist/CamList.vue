<!-- 攝影機列表 -->
<script>
import { RouterLink } from "vue-router";
import axios from "axios";
import { mapActions, storeToRefs } from "pinia";
import cameraStore from "@/stores/cameraStore";
import CheckDel from "@/components/pops/adminview/general/CheckDel.vue";
import DelFinishPop from "@/components/pops/adminview/general/DelFinishpop.vue";
import CameralistPagination from "@/components/pagination/CameralistPagination.vue";

import { verifyToken } from "@/utils/verify.js";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  data() {
    return {
      delCamId: "",

      // 使用者搜尋內容
      cameraSearch: "",
      // 攝影機搜尋後列表
      camListFilter: [],
      // pinia取來的攝影機列表
      camList: [],
    };
  },
  watch: {
    cameraSearch() {
      const vm = this;

      vm.camListFilter = vm.camList.filter((item) => {
        const thisIp = vm.splitRtsp(item.rtsp_url, 3);
        return (
          item.camera_place.match(vm.cameraSearch) ||
          item.camera_name.match(vm.cameraSearch) ||
          thisIp.match(vm.cameraSearch)
        );
      });

      // 切回第1頁
      this.$refs.refCameralistPagination.gotoPage(1);
    },
  },
  // computed: {
  //   ...mapState(cameraStore, ["camList"]),
  // },
  methods: {
    ...mapActions(cameraStore, ["getCamList", "splitRtsp"]),
    // 是否確定刪除pop
    isDelPop(delCamId, delCamName) {
      this.delCamId = delCamId;
      // 刪除項目文字
      this.$refs.refCheckDel.itemText = delCamName;
      this.$refs.refCheckDel.showModal();
    },
    async delCam() {
      const vm = this;

      // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      // 按鈕spinner
      vm.$refs.refCheckDel.showCheckBtn = false;
      console.warn("刪除了攝影機");

      const data = new FormData();
      data.append("id", vm.delCamId);

      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const config = {
        method: "DELETE",
        url: `${apiserver}/tpefunction/camera`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      axios(config)
        .then((res) => {
          console.log(res);

          // 刪除Frigate攝影機
          vm.delFrigateCam();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    async delFrigateCam() {
      const vm = this;

      // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      const data = new FormData();
      data.append("cameraName", String(vm.delCamId)); // 這裡要放攝影機id，因名稱不可中文
      const config = {
        method: "DELETE",
        url: "./editCamConf",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      axios(config)
        .then((res) => {
          console.log(res);

          // Frigate要重啟時間
          setTimeout(async function () {
            // token測試
            // const hasToken = await verifyToken();
            // if (!hasToken) {
            //   alert("請重新登入！");
            //   vm.logout();
            // }

            // 重新取得攝影機列表
            await vm.getCamList();
            // 攝影機資料放入Filter
            vm.getCamListFilter();

            // 移除確認刪除Modal
            vm.$refs.refCheckDel.showCheckBtn = true;
            vm.$refs.refCheckDel.hideModal();

            // 刪除成功Modal
            vm.$refs.refDelFinishPop.showModal();
          }, 21000);
        })
        .catch(async (err) => {
          console.log(err.response);

          // token測試
          // const hasToken = await verifyToken();
          // if (!hasToken) {
          //   alert("請重新登入！");
          //   vm.logout();
          // }

          // 重新取得攝影機列表
          await vm.getCamList();
          // 攝影機資料放入Filter
          vm.getCamListFilter();

          // 移除確認刪除Modal
          vm.$refs.refCheckDel.showCheckBtn = true;
          vm.$refs.refCheckDel.hideModal();

          // 刪除成功Modal
          vm.$refs.refDelFinishPop.showModal();

          // // 再次嘗試刪除
          // setTimeout(function () {
          //   vm.delFrigateCam();
          // }, 15000);
        });
    },
    // 根據辨識項目顯示icon
    recognitionIcon(item) {
      if (item == "人流判斷") {
        return "icon-user";
      } else if (item == "年齡性別") {
        return "icon-gender";
      } else if (item == "遺留物") {
        return "icon-briefcase";
      } else if (item == "工地安全") {
        return "icon-fire";
      } else if (item == "無") {
        return "";
      }
    },

    // 攝影機資料放入Filter
    getCamListFilter() {
      const vm = this;
      // 深層拷貝
      vm.camListFilter = JSON.parse(JSON.stringify(vm.camList));
      // console.log("vm.camListFilter");
      // console.log(vm.camListFilter);
    },
  },
  components: {
    RouterLink,
    CheckDel,
    DelFinishPop,
    CameralistPagination,
  },
  async mounted() {
    const vm = this;

    // token測試
    // const hasToken = await verifyToken();
    // if (!hasToken) {
    //   alert("請重新登入！");
    //   vm.logout();
    // }

    // 取得攝影機列表
    await vm.getCamList();

    const store = cameraStore(); // 取得該 Store
    const { camList } = storeToRefs(store); // 使用 storeToRefs(store)
    vm.camList = camList; // 存入該頁變數

    // 攝影機資料放入Filter
    vm.getCamListFilter();
  },
};
</script>

<template>
  <div class="content page-content-bg">
    <!-- <h4 class="fw-bold">攝影機設定</h4> -->
    <!-- {{ camList }} -->
    <!-- 功能區域 -->
    <div class="d-flex align-items-end ms-4 mt-4">
      <RouterLink to="create" style="text-decoration: none">
        <button
          type="button"
          class="btn btn-primary d-flex align-items-center me-2"
        >
          <i class="icon-add fs-4"></i>
          建立攝影機
        </button>
      </RouterLink>

      <div class="me-2" style="width: 220px" v-if="camList.length != 0">
        <div>
          <input
            type="text"
            class="form-control"
            placeholder="請輸入關鍵字查詢"
            v-model="cameraSearch"
          />
        </div>
      </div>
    </div>
    <div class="content-area rounded-3 p-4 m-4 bg-white text-black">
      <CameralistPagination
        ref="refCameralistPagination"
        :camList="camList"
        :camListFilter="camListFilter"
        :recognitionIcon="recognitionIcon"
        :isDelPop="isDelPop"
      ></CameralistPagination>
    </div>
  </div>

  <!-- 刪除pop -->
  <CheckDel ref="refCheckDel" :delFunc="delCam"></CheckDel>

  <!-- 刪除成功pop -->
  <DelFinishPop ref="refDelFinishPop"></DelFinishPop>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

// .page-content-bg {
//   background: $gray-100;
// }

.content-area {
  min-height: calc(100vh - 150px);
}

tr {
  border-bottom: 1px solid $gray-100;
}

td {
  padding: 16px 0;
  text-align: center;
}
</style>
