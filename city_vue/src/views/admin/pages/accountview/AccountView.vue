<!-- 帳號權限設定頁 -->
<script>
import { verifyToken } from "@/utils/verify";
import axios from "axios";
import CreateAccount from "@/views/admin/pages/accountview/accountpop/CreateAccount.vue";
import EditAccount from "@/views/admin/pages/accountview/accountpop/EditAccount.vue";
import CheckdelAccount from "@/views/admin/pages/accountview/accountpop/CheckdelAccount.vue";
import AccountPagination from "@/views/admin/pages/accountview/AccountPagination.vue";
import DelFinishpop from "@/components/pops/adminview/general/DelFinishpop.vue";

import { storeToRefs, mapActions } from "pinia";
import cameraStore from "@/stores/cameraStore.js";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  data() {
    return {
      // 假資料

      accountData: [],
      // 查詢
      search: "",
      accountDataFilter: [
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
        {
          type: "admin",
          name: "王大同",
          phone: "0912345678",
          account: "admin@gmail.com",
        },
      ],
      // 攝影機資料
      camList: [],
    };
  },
  watch: {
    search() {
      this.searchFilter();
    },
  },
  methods: {
    ...mapActions(cameraStore, ["getCamList"]),
    async getAccountData() {
      const vm = this;

      // // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      const apiserver = document
        .querySelector("#apiserver")
        .getAttribute("data-api");

      const config = {
        method: "GET",
        url: apiserver + "/member/account",
      };
      axios(config)
        .then((res) => {
          // console.log(res);
          vm.accountData = res.data.data;

          vm.accountDataFilter = [...vm.accountData];
          // 若有搜尋字存在
          vm.searchFilter();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    searchFilter() {
      const vm = this;
      if (vm.search != "") {
        vm.accountDataFilter = vm.accountData.filter((item) => {
          return (
            item.name.match(vm.search) ||
            item.account.match(vm.search) ||
            item.phone.match(vm.search)
          );
        });
      } else {
        vm.accountDataFilter = [...vm.accountData];
      }
    },
    showCreatePop() {
      const vm = this;
      vm.$refs.refCreateAccount.showModal();
    },
    showEditPop(thisData) {
      const vm = this;
      vm.$refs.refEditAccount.showModal(thisData);
    },

    // 刪除帳號pop
    showDelPop(thisData) {
      this.$refs.refCheckdelAccount.itemText = thisData.account;
      this.$refs.refCheckdelAccount.showModal();
    },
    // 刪除帳號
    async delFunc(itemText) {
      const vm = this;

      // // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      // 按鈕 spinner
      vm.$refs.refCheckdelAccount.showCheckBtn = false;

      const apiserver = document
        .querySelector("#apiserver")
        .getAttribute("data-api");

      const data = new FormData();
      data.append("account", itemText);

      const config = {
        method: "DELETE",
        url: apiserver + "/member/account",
        data: data,
      };
      axios(config)
        .then((res) => {
          console.log(res);

          // 恢復按鈕
          vm.$refs.refCheckdelAccount.showCheckBtn = true;

          // 關閉
          vm.$refs.refCheckdelAccount.hideModal();

          // 重新取得資料
          vm.getAccountData();

          // 刪除成功訊息
          vm.$refs.refDelFinishpop.showModal();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
  components: {
    CreateAccount,
    EditAccount,
    CheckdelAccount,
    AccountPagination,
    DelFinishpop,
  },
  async mounted() {
    const vm = this;
    // // token測試
    // const hasToken = await verifyToken();
    // if (!hasToken) {
    //   alert("請重新登入！");
    //   vm.logout();
    // }

    // vm.getAccountData();
    // 取得攝影機列表
    vm.getCamList();
    // console.log("取得攝影機列表");
    const store = cameraStore(); // 取得該 Store
    const { camList } = storeToRefs(store); // 使用 storeToRefs(store)
    vm.camList = camList; // 存入該頁變數
  },
};
</script>

<template>
  <div class="content">
    <div class="content-area rounded-3 p-4 m-4 bg-white text-black">
      <h4 class="fw-bold">帳號權限設定</h4>

      <!-- 篩選 -->
      <div class="content-area rounded-3 p-4 my-3">
        <div class="d-flex align-items-end">
          <button
            type="button"
            class="btn btn-primary d-flex align-items-center me-2"
            @click="showCreatePop"
          >
            <i class="icon-add fs-4"></i>
            建立帳號
          </button>

          <div class="me-2" style="width: 220px">
            <div>
              <input
                type="text"
                class="form-control"
                placeholder="請輸入關鍵字查詢"
                v-model="search"
              />
            </div>
          </div>
        </div>

        <!-- 列表+分頁 -->
        <AccountPagination
          :accountData="accountData"
          :accountDataFilter="accountDataFilter"
          :showDelPop="showDelPop"
          :showEditPop="showEditPop"
        ></AccountPagination>
      </div>
    </div>
  </div>

  <!-- 建立帳號 -->
  <CreateAccount
    ref="refCreateAccount"
    @getAccountData="getAccountData"
    :camList="camList"
  ></CreateAccount>

  <!-- 編輯帳號 -->
  <EditAccount
    ref="refEditAccount"
    @getAccountData="getAccountData"
    :camList="camList"
  ></EditAccount>

  <!-- 刪除帳號 -->
  <CheckdelAccount
    ref="refCheckdelAccount"
    :delFunc="delFunc"
  ></CheckdelAccount>

  <!-- 刪除成功 -->
  <DelFinishpop ref="refDelFinishpop"></DelFinishpop>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

.content-area {
  min-height: calc(100vh - 230px);
}

tr {
  border-bottom: 1px solid $gray-100;
}
td {
  padding: 16px 0;
  text-align: center;
}
</style>
