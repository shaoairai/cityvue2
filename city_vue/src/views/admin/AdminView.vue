<script>
import { RouterView } from "vue-router";
import LogoIcon from "@/components/icons/LogoIcon.vue";

export default {
  data() {
    return {
      selectedOption: "aicam",
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
    // 全螢幕
    toggleFullScreen() {
      const elem = document.documentElement; // 取得整個文件節點
      if (document.fullscreenElement) {
        // 如果已經是全螢幕，則退出全螢幕
        document.exitFullscreen();
      } else {
        // 否則進入全螢幕
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          // Safari
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          // IE11
          elem.msRequestFullscreen();
        }
      }
    },
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
        <div class="d-flex align-items-center position-relative whiteLine">
          <LogoIcon style="font-size: 42px"></LogoIcon>
          <h2 class="fs-5 m-0 ms-2 fw-bold" style="padding-right: 16px">
            AI 精準消防平台
          </h2>
        </div>
        <select
          v-model="selectedOption"
          @change="handleChange"
          style="
            border: unset;
            background-color: unset;
            color: white;
            margin-left: 12px;
          "
        >
          <option value="aicam" style="color: #222222">
            AI 監視器影像辨識系統
          </option>
          <!-- <option value="radio" style="color: #222222">
            任務無線電辨識系統
          </option> -->
        </select>
      </div>
      <div class="d-flex flex-row flex-nowrap align-items-center">
        <div class="pe-3">帳號設定</div>
        <div @click="toggleFullScreen">
          <i class="icon-user-linear fs-3"></i>
        </div>
      </div>
    </div>
  </div>

  <RouterView></RouterView>
</template>

<style scoped>
.whiteLine::after {
  content: "";
  position: absolute;
  right: 0px;
  top: 12px;
  width: 2px;
  height: 50%;
  background: white;
}
</style>
