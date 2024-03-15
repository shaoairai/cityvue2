// 登出
import { delCookieToken } from "@/utils/verify.js";
export default {
  methods: {
    async logout() {
      // 移除 cookie 的 token
      await delCookieToken();
      // 移除 localStorage 參數
      localStorage.clear();

      // 移除所有 setInterval
      this.stopAllIntervals();

      this.$router.push("/login");
    },
    stopAllIntervals() {
      // 停止所有的 setInterval
      clearInterval(window.getBatteryInterval);
      clearInterval(window.getNotifyInterval);
      clearInterval(window.getNotifyValInterval);
      clearInterval(window.rtspInterval);
      clearInterval(window.getCameraStatusInterval);
    },
  },
};
