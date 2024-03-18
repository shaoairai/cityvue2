<script>
import axios from "axios";
import { Offcanvas } from "bootstrap";
import { verifyToken } from "@/utils/verify";
import { storeToRefs, mapActions } from "pinia";
import notifyStore from "@/stores/notifyStore";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  data() {
    return {
      offcanvasNotifyModal: "",

      // pinia取出的所有資料
      notifyData: [],
      // 此使用者所有通知
      notifyDataNav: [],
      // 此使用者姓名
      thisAccountName: "",
    };
  },
  methods: {
    ...mapActions(notifyStore, ["getNotifyDataPinia"]),
    showModal() {
      this.offcanvasNotifyModal = new Offcanvas("#offcanvasNotify");
      this.offcanvasNotifyModal.show();
    },
    hideModal() {
      this.offcanvasNotifyModal.hide();
    },
    // 調整圖片路徑
    repath(item) {
      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      if (item) {
        return apiserver + item.substring(1);
      } else {
        return "";
      }
    },
    // 取得該登入使用者
    async getThisAccount() {
      const vm = this;

      // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const config = {
        method: "GET",
        url: `${apiserver}/member/permissions`,
      };

      await axios(config)
        .then((res) => {
          // 此帳號使用者姓名
          vm.thisAccountName = res.data.data.name;
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    // 取得資料
    async getThisNotify() {
      const vm = this;

      const store = notifyStore();
      const { notifyData } = storeToRefs(store);
      vm.notifyData = notifyData;

      const today = new Date(); // 取得今天日期
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // 設定一個月前的日期

      // 暫存是否全部讀取過，避免圖示閃爍
      let isAllReadTmp = true;
      const thisAccountData = vm.notifyData.filter((item) => {
        // 判斷是否都讀取過
        if (item.person === vm.thisAccountName && item.view != "true") {
          isAllReadTmp = false;
        }

        // 將 alert_time 字串轉換成日期物件進行比較
        const alertTime = new Date(item.alert_time);

        // 回傳此使用者 + 一個月內通知
        return (
          item.person === vm.thisAccountName &&
          alertTime >= oneMonthAgo &&
          alertTime <= today
        );
      });

      // 執行外層的函式
      vm.changeIsAllRead(isAllReadTmp);

      // 此帳號的所有通知
      vm.notifyDataNav = thisAccountData;
    },
    // 執行外層的函式 - 是否都讀取過
    changeIsAllRead(isAllReadTmp) {
      const vm = this;
      vm.$emit("isAllRead", isAllReadTmp);
    },
    // 全部通知變成已讀
    async allRead() {
      const vm = this;

      // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const config = {
        method: "POST",
        url: `${apiserver}/tpefunction/notifyviewed`,
      };

      axios(config)
        .then(async () => {
          // console.log(res);
          // 重新取得資料
          await vm.getThisNotify();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    async keepGetNotify() {
      // console.log("keepGetNotify");
      const vm = this;
      // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   console.log("伺服器暫時斷線");
      //   // vm.logout();
      // }

      // 取得通知資料
      await vm.getNotifyDataPinia();

      // 篩選此帳號通知資料
      await vm.getThisNotify();
    },
  },
  async mounted() {
    const vm = this;

    // 取得此使用者姓名
    await vm.getThisAccount();

    window.getNotifyInterval = setInterval(vm.keepGetNotify, 3000);
  },
  unmounted() {
    clearInterval(window.getNotifyInterval);
  },
};
</script>

<template>
  <div>
    <div
      class="offcanvas offcanvas-end"
      tabindex="-1"
      id="offcanvasNotify"
      aria-labelledby="offcanvasNotifyLabel"
      style="--bs-offcanvas-width: 260px"
    >
      <div class="offcanvas-header text-white">
        <h5 class="offcanvas-title p-1" id="offcanvasNotifyLabel">通報訊息</h5>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <div v-if="notifyDataNav.length == 0">無通報紀錄</div>
        <template v-else>
          <div
            class="notify-line py-3"
            v-for="(item, i) in notifyDataNav"
            :key="i"
          >
            <div class="text-gray-600 pb-2">{{ item.alert_time }}</div>
            <div class="pb-2">
              {{ item.text }}
            </div>
            <a
              :href="repath(item.picture)"
              target="_blank"
              style="text-decoration: none"
              v-show="item.picture"
            >
              <div>觀看擷圖></div>
            </a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";
.notify-line {
  border-bottom: 1px solid $gray-100;
}

.offcanvas-header {
  background: $teal;
}
</style>
