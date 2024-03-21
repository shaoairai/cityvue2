<script>
import axios from "axios";
export default {
  data() {
    return {
      // 是否重啟過
      frigateReloadFlag: false,

      // 網址參數
      paramid: "",
    };
  },
  methods: {
    // 檢查 Frigate 狀態
    frigateStats() {
      const vm = this;

      const config = {
        method: "GET",
        url: "./frigatestats",
      };

      axios(config)
        .then((res) => {
          console.log(res);
          console.log(res.data.cameras[`camera${vm.paramid}`].camera_fps);
          if (res.data.cameras[`camera${vm.paramid}`].camera_fps == 0) {
            // 因原本沒畫面，須重啟
            vm.frigateReloadFlag = true;
            // 顯示說明文字
            document
              .querySelector("#frigateRestartText")
              .classList.remove("d-none");
            document.querySelector("#frigateIframe").classList.add("d-none");

            document.querySelector("#restartFrigate").disabled = true;
          } else {
            if (vm.frigateReloadFlag) {
              vm.frigateReloadFlag = false;

              setTimeout(function () {
                document.querySelector("#restartFrigate").disabled = false;
                document
                  .querySelector("#frigateRestartText")
                  .classList.add("d-none");
                document
                  .querySelector("#frigateIframe")
                  .classList.remove("d-none");
                location.reload();
              }, 1000);
            }
          }
        })
        .catch((err) => {
          // 因原本沒畫面，須重啟
          vm.frigateReloadFlag = true;
          // 顯示說明文字
          document
            .querySelector("#frigateRestartText")
            .classList.remove("d-none");
          document.querySelector("#frigateIframe").classList.add("d-none");
          document.querySelector("#restartFrigate").disabled = true;
          console.log(err.response);
        });
    },
    // 重啟 Frigate
    restartFrigate() {
      console.log("restartFrigate");

      const config = {
        method: "POST",
        url: "./restartFrigate",
      };

      axios(config)
        .then((res) => {
          console.log("重啟");
          console.log(res);
          location.reload();
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
  mounted() {
    const vm = this;
    // 所有網址參數
    const queryParams = this.$route.query;
    const paramValue = queryParams.id;
    console.log(paramValue);

    vm.paramid = paramValue;

    // 重整按鈕
    document
      .querySelector("#restartFrigate")
      .addEventListener("click", vm.restartFrigate);

    // GET /api/stats 目前Frigate狀態
    vm.frigateStats();
    setInterval(vm.frigateStats, 2000);

    // 上線用
    const frigateip = document
      .querySelector("#FRIGATEIPWEB")
      .getAttribute("data-url");
    document.querySelector(
      "#frigateIframe"
    ).src = `${frigateip}/cameras/camera${vm.paramid}/editor`;
  },
};
</script>

<template>
  <div>
    <div class="container">
      <!-- 重整按鈕 -->
      <div class="text-end pt-3">
        <button type="button" id="restartFrigate" class="btn btn-primary">
          完成設定
        </button>
      </div>
      <div
        id="frigateRestartText"
        class="d-flex align-items-center justify-content-center flex-column d-none"
        style="height: calc(100vh - 154px); margin-top: 20px"
      >
        <div class="spinner-border mb-3 text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        攝影機正在重啟中
      </div>
      <iframe
        allow="*"
        id="frigateIframe"
        src=""
        frameborder="0"
        class="w-100"
        style="height: calc(100vh - 154px); margin-top: 20px"
      ></iframe>
    </div>
  </div>
</template>
