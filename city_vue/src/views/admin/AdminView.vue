<script>
import { RouterLink, RouterView } from "vue-router";
import LogoIcon from "@/components/icons/LogoIcon.vue";

export default {
  data() {
    return {
      selectedOption: "aicam",

      // 進入帳號頁
      atAccount: false,
    };
  },
  components: {
    LogoIcon,
    RouterView,
  },
  methods: {
    handleChange() {
      // option 切換 Router
      this.$router.push({ path: "/admin/" + this.selectedOption });
    },
    // 進入帳號頁
    toAccountPage() {
      // this.atAccount = true;
    },
    // // 全螢幕
    // toggleFullScreen() {
    //   const elem = document.documentElement; // 取得整個文件節點
    //   if (document.fullscreenElement) {
    //     // 如果已經是全螢幕，則退出全螢幕
    //     document.exitFullscreen();
    //   } else {
    //     // 否則進入全螢幕
    //     if (elem.requestFullscreen) {
    //       elem.requestFullscreen();
    //     } else if (elem.webkitRequestFullscreen) {
    //       // Safari
    //       elem.webkitRequestFullscreen();
    //     } else if (elem.msRequestFullscreen) {
    //       // IE11
    //       elem.msRequestFullscreen();
    //     }
    //   }
    // },
  },
  mounted() {
    const vm = this;
    // 網址路徑
    const fullPath = vm.$route.fullPath;
    // 拆解
    const pathSegments = fullPath.split("/");
    // 獲取第二個路由；pathSegments範例：['', 'admin', 'aicam', 'dashboard']
    vm.selectedOption = pathSegments[2];
    vm.handleChange();
  },
};
</script>

<template>
  <div>
    <div
      class="d-flex justify-content-between align-items-center border-bottom px-3"
      style="height: 70px"
    >
      <div class="d-flex">
        <RouterLink
          to="/admin/aicam"
          style="text-decoration: unset; color: white"
        >
          <div class="d-flex align-items-center position-relative whiteLine">
            <LogoIcon style="font-size: 42px"></LogoIcon>
            <h2 class="fs-5 m-0 ms-2 fw-bold" style="padding-right: 16px">
              AI 精準消防平台
            </h2>
          </div>
        </RouterLink>
        <!-- <template v-if="!atAccount"> -->
        <select
          v-model="selectedOption"
          @change="handleChange"
          class="systemSelected"
        >
          <option value="aicam" style="color: #222222">
            AI 監視器影像辨識系統
          </option>
          <option value="radio" style="color: #222222">
            任務無線電辨識系統
          </option>
        </select>
        <!-- </template> -->
      </div>
      <div class="d-flex flex-row flex-nowrap align-items-center">
        <div class="pe-3" @click="toAccountPage">帳號設定</div>
        <div>
          <i class="icon-user-linear fs-3"></i>
        </div>
      </div>
    </div>
  </div>

  <RouterView></RouterView>
</template>

<style lang="scss" scoped>
.whiteLine::after {
  content: "";
  position: absolute;
  right: 0px;
  top: 12px;
  width: 2px;
  height: 50%;
  background: white;
}

.systemSelected {
  border: unset;
  background-color: unset;
  color: white;
  margin-left: 12px;
  &:focus-visible {
    outline: unset;
  }
}
</style>
