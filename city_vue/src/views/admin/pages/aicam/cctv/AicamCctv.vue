<!-- 攝影機設定頁 -->
<script>
import { verifyToken } from "@/utils/verify";
import { RouterView } from "vue-router";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  components: {
    RouterView,
  },
  async mounted() {
    const vm = this;
    // // token測試
    // const hasToken = await verifyToken();
    // if (!hasToken) {
    //   alert("請重新登入！");
    //   vm.logout();
    // }
  },
};
</script>

<template>
  <RouterView></RouterView>
</template>
