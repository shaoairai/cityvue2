<!-- 步驟3攝影機設定頁 -->
<script>
import axios from "axios";
import { verifyToken } from "@/utils/verify";
import { RouterLink } from "vue-router";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  props: ["stepAdd", "camId"],
  data() {
    return {
      // Frigate 轉網址後的路徑
      rtspImgSrc: "",
      // rtspImg 寬高如果0，表示讀取失敗，定時重取
      rtspImgBlock: "",
      // setInterval
      // rtspInterval: "",
      // 只執行一次重設畫面
      restartSrcOnce: true,
      // 只執行一次取資料
      restartGetdataOnce: true,

      // 是否正在繪製按鈕
      isStartDraw: false,
      // 是否正在刪除按鈕
      isDelDraw: false,

      // 所有框
      allAreaData: [],
      // 繪製相關參數
      newAreaX: 0,
      newAreaY: 0,
      newAreaW: 0,
      newAreaH: 0,
      // 正選取的要刪除框
      chooseDivTmp: "",
    };
  },
  watch: {
    async camId() {
      const vm = this;

      // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      // console.log("watch camId");
      const frigateip = document
        .querySelector("#FRIGATEIPWEB")
        .getAttribute("data-url");
      vm.rtspImgSrc = `${frigateip}/api/${vm.camId}?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1`;
      const data = new FormData();
      data.append("id", vm.camId);
      data.append(
        "camera_link",
        `${frigateip}/api/${vm.camId}?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1`
      );
      // 修改 camera_link 欄位
      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");
      const patchConfig = {
        method: "PATCH",
        url: `${apiserver}/tpefunction/camera`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      axios(patchConfig)
        .then(() => {
          // console.log("修改 camera_link 欄位：");
          // console.log(res);
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
  methods: {
    // 加載 rtsp 畫面
    loadingRstpInterval() {
      // 重新加載或按上一步驟，都先清空重加載
      document.querySelector("#rtspImg").src = "";
      document.querySelector("#newDivSquare").innerHTML = "";

      // console.log("加載 rstpInterval");
      // Call checkImageSize every 15 seconds
      window.rtspInterval = setInterval(this.checkImageSize, 5000);
    },
    checkImageSize() {
      const vm = this;
      // console.log("進入checkImageSize");
      const frigateip = document
        .querySelector("#FRIGATEIPWEB")
        .getAttribute("data-url");
      // console.log(frigateip);
      const img = new Image();
      img.src = vm.rtspImgSrc;
      img.onload = async () => {
        // console.log("進入onload");
        const width = document.querySelector("#rtspImg").width;
        const height = document.querySelector("#rtspImg").height;
        // console.log(document.querySelector("#rtspImg").width);
        // console.log(document.querySelector("#rtspImg").height);
        if (width > 50 && height > 50) {
          // console.log("已正常顯示");

          if (vm.restartGetdataOnce) {
            // 確定畫面有顯示後
            // 取得所有辨識框
            await vm.getAllArea();
            // 顯示現有框
            vm.loadImg();

            // 為了只執行此函式內容一次
            vm.restartGetdataOnce = false;
          }
        } else if ((width < 50 || height < 50) && vm.restartSrcOnce) {
          // console.log("進入 vm.restartSrcOnce 重設 src");
          vm.rtspImgSrc = "";
          setTimeout(async function () {
            vm.rtspImgSrc = `${frigateip}/api/${vm.camId}?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1`;
            vm.restartSrcOnce = false;
            clearInterval(window.rtspInterval);
            vm.checkImageSize();
          }, 0);
        } else {
          // console.log("純粹等待");
          setTimeout(function () {
            vm.checkImageSize();
          }, 1000);
        }
      };
    },
    // 繪製按鈕
    startDrawBtn() {
      const vm = this;

      if (vm.isDelDraw) {
        // 如果刪除狀態未解除，要先解除
        vm.delDrawBtn();
        vm.startDrawBtn();
      } else {
        if (!vm.isStartDraw) {
          vm.isStartDraw = true;
          // 進入繪製狀態
          vm.startDraw();
        } else {
          vm.isStartDraw = false;
          // 移除繪製的監聽，節點移除重置
          vm.recreateCanvas();
        }
      }
    },
    // 刪除按鈕
    delDrawBtn() {
      const vm = this;
      if (vm.isStartDraw) {
        // 如果新增狀態未解除，要先解除
        vm.startDrawBtn();
        vm.delDrawBtn();
      } else {
        if (!vm.isDelDraw) {
          vm.isDelDraw = true;
          // 進入刪除狀態
          vm.switchDelArea();
        } else {
          vm.isDelDraw = false;
          // 離開刪除狀態
          // 顯示現有框
          vm.loadImg();
        }
      }
    },

    // 取得所有該鏡頭 id 的辨識區
    async getAllArea() {
      const vm = this;

      // await verifyToken();

      const placeId = vm.camId;
      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const config = {
        method: "GET",
        url: `${apiserver}/tpefunction/detection`,
      };

      await axios(config)
        .then((res) => {
          // console.log(res);
          // 取得的辨識區數據
          const allAreaDataTmp = [...res.data.data];
          // console.log(allAreaDataTmp);
          vm.allAreaData = allAreaDataTmp.filter((item) => {
            // console.log(item);
            // console.log(item.place_id);
            // console.log(placeId);
            return Number(item.place_id) === Number(placeId);
          });
          // console.log("getAllArea allAreaData");
          // console.log(vm.allAreaData);
        })
        .catch((err) => {
          console.log(err.response);
        });
    },

    // 取得辨識區 直接建立 div 元素，不判斷串流 onload
    loadImg() {
      const vm = this;

      // 影片尺寸
      const rtspImg = document.querySelector("#rtspImg");
      // div 區塊的框，寬高等於影片尺寸
      const newDivSquare = document.querySelector("#newDivSquare");
      // newDivSquare.style.width = rtspImg.offsetWidth + "px";
      // newDivSquare.style.height = rtspImg.offsetHeight + "px";

      // 清除所有框
      newDivSquare.innerHTML = "";
      // console.log(newDivSquare.offsetWidth);
      // console.log(newDivSquare.offsetHeight);
      // console.log(rtspImg.offsetWidth);
      // console.log(rtspImg.offsetHeight);
      // 每個框
      vm.allAreaData.forEach((item) => {
        // 建立 div
        let divEl = document.createElement("div");
        divEl.id = `div-${item.id}`;
        divEl.style.width = item.w * rtspImg.offsetWidth + "px";
        divEl.style.height = item.h * rtspImg.offsetHeight + "px";
        divEl.style.left = item.x * rtspImg.offsetWidth + "px";
        divEl.style.top = item.y * rtspImg.offsetHeight + "px";
        divEl.style.backgroundColor = "rgba(0, 0, 0, 0.533)";
        divEl.classList.add(
          "position-absolute",
          "translate-middle",
          "choose-div"
        );

        // 放到畫面上
        newDivSquare.appendChild(divEl);
      });
      // console.log("finish loadImg");
    },

    // 開始繪製
    startDraw() {
      const vm = this;

      const canvas = document.querySelector("#drawCanvas");
      canvas.classList.add(
        "drawCanvas",
        "position-absolute",
        "top-0",
        "start-0"
      );
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "100%";

      // 繪製設定
      const ctx = canvas.getContext("2d");
      const boxColor = "#00000088";
      const borderColor = "#00000055";

      console.log(document.querySelector("#rtspImg").offsetWidth);
      console.log(document.querySelector("#rtspImg").offsetHeight);
      canvas.width = Math.floor(
        document.querySelector("#rtspImg").offsetWidth - 1
      );
      canvas.height = Math.floor(
        document.querySelector("#rtspImg").offsetHeight - 1
      );

      let isDragging = false;
      let startX, startY;
      let canvasOffsetLeft, canvasOffsetTop;

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);

      function handleMouseDown(event) {
        if (event.button === 0) {
          // 滑鼠左鍵
          startX = event.clientX;
          startY = event.clientY;
          isDragging = true;

          const { left, top } = canvas.getBoundingClientRect();
          canvasOffsetLeft = left;
          canvasOffsetTop = top;
        }
      }

      function handleMouseMove(event) {
        if (isDragging) {
          const currentX = event.clientX;
          const currentY = event.clientY;

          // 清除畫布
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 繪製四方型
          ctx.fillStyle = boxColor;
          // ctx.strokeStyle = borderColor;
          ctx.strokeStyle = "#f7b52c";
          ctx.lineWidth = 2;

          const width = Math.abs(currentX - startX);
          const height = Math.abs(currentY - startY);
          const left = Math.min(currentX, startX) - canvasOffsetLeft;
          const top = Math.min(currentY, startY) - canvasOffsetTop;
          // const centerX = left + width / 2;
          // const centerY = top + height / 2;
          ctx.fillRect(left, top, width, height);
          ctx.strokeRect(left, top, width, height);
        }
      }

      function handleMouseUp(event) {
        // 放開時若繪製框寬或高為0
        let isZero = false;
        if (event.button === 0 && isDragging) {
          isDragging = false;
          const releaseX = event.clientX;
          const releaseY = event.clientY;

          // 清除畫布
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 繪製四方型
          ctx.fillStyle = boxColor;
          ctx.strokeStyle = borderColor;
          const width = Math.abs(releaseX - startX);
          const height = Math.abs(releaseY - startY);
          const left = Math.min(releaseX, startX) - canvasOffsetLeft;
          const top = Math.min(releaseY, startY) - canvasOffsetTop;
          const centerX = left + width / 2;
          const centerY = top + height / 2;
          ctx.fillRect(left, top, width, height);
          ctx.strokeRect(left, top, width, height);

          // 輸出四方形訊息
          console.log("左上角:", left, top);
          console.log("中心點:", centerX, centerY);
          console.log("寬度:", width);
          console.log("高度:", height);

          console.log("canvas.width:", canvas.width);
          console.log("canvas.height:", canvas.height);
          // 同時壓縮成小數點比例
          vm.newAreaX = centerX / canvas.width;
          vm.newAreaY = centerY / canvas.height;
          vm.newAreaW = width / canvas.width;
          vm.newAreaH = height / canvas.height;
          console.log("newAreaX:", vm.newAreaX);
          console.log("newAreaY:", vm.newAreaY);
          console.log("newAreaW:", vm.newAreaW);
          console.log("newAreaH:", vm.newAreaH);

          // 建立相同的 <div> 元素
          const newDiv = document.createElement("div");
          newDiv.id = "currentShape";
          newDiv.classList.add("position-absolute", "choose-div");
          newDiv.style.width = `${width}px`;
          newDiv.style.height = `${height}px`;
          newDiv.style.left = `${left}px`;
          newDiv.style.top = `${top}px`;
          newDiv.style.border = `2px solid #f7b52c`;
          newDiv.style.backgroundColor = "#00000088";

          // 清除按鈕放入新建立的 div 中
          const clearBtn = document.createElement("div");
          clearBtn.id = "clear-draw-area-btn";
          clearBtn.classList.add(
            "d-inline-block",
            "position-absolute",
            "ms-1",
            "text-white",
            "d-flex",
            "align-items-center",
            "justify-content-center",
            "bg-orange",
            "cursor-pointer"
          );
          clearBtn.style.right = `0px`;
          clearBtn.style.top = `36px`;
          clearBtn.style.width = `32px`;
          clearBtn.style.height = `32px`;
          clearBtn.style.zIndex = "999";
          clearBtn.addEventListener("click", vm.clearNewArea);
          clearBtn.innerHTML =
            '<i class="icon-cctv-delete" style="font-size: 32px;color: #fab844;background: white;"></i>';
          newDiv.appendChild(clearBtn);

          // 確認按鈕放入新建立的 div 中
          const confirmBtn = document.createElement("div");
          confirmBtn.id = "confirm-draw-area-btn";
          confirmBtn.classList.add(
            "d-inline-block",
            "position-absolute",
            "ms-1",
            "text-white",
            "d-flex",
            "align-items-center",
            "justify-content-center",
            "bg-orange",
            "cursor-pointer"
          );
          confirmBtn.style.right = `0px`;
          confirmBtn.style.top = `0px`;
          confirmBtn.style.width = `32px`;
          confirmBtn.style.height = `32px`;
          confirmBtn.style.zIndex = "999";
          confirmBtn.addEventListener("click", vm.confirmNewArea);
          confirmBtn.innerHTML =
            '<i class="icon-cctv-correct" style="font-size: 32px;color: #fab844;background: white;"></i>';
          newDiv.appendChild(confirmBtn);

          // 整塊插入
          document.querySelector("#newDivSquare").appendChild(newDiv);

          // 清除畫布
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 上一步驟和完成按鈕不可按
          document.querySelector("#cctvAreaCover").classList.remove("d-none");
          document.querySelector("#fincctvArea").disabled = true;
          document.querySelector("#new-area-btn").disabled = true;
          document.querySelector("#del-area-btn").disabled = true;

          if (width === 0 || height === 0) {
            alert("寬、高不可為 0，請重新繪製！");
            isZero = true;
          }
        }

        // 消除監聽事件
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);

        if (isZero) {
          vm.clearNewArea();
        }
      }
    },

    // 確認繪製
    async confirmNewArea() {
      const vm = this;
      const newId = await vm.boxRecord(
        vm.newAreaX.toFixed(3),
        vm.newAreaY.toFixed(3),
        vm.newAreaW.toFixed(3),
        vm.newAreaH.toFixed(3)
      );
      // console.log("newId");
      // console.log(newId);
      // 重取資料
      // 取得所有辨識框
      await vm.getAllArea();
      // 顯示現有框
      vm.loadImg();

      // 新增成功就重設
      vm.clearNewArea();
      // 使用者可重新再繪製
      // vm.startDraw();
    },
    // 傳送繪製框資訊
    async boxRecord(x, y, w, h) {
      const vm = this;

      // await verifyToken();
      // console.log("x, y, w, h");
      // console.log(x);
      // console.log(y);
      // console.log(w);
      // console.log(h);

      const data = new FormData();
      data.append("place_id", vm.camId);
      data.append("x", x);
      data.append("y", y);
      data.append("w", w);
      data.append("h", h);

      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const config = {
        method: "POST",
        url: `${apiserver}/tpefunction/detection`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      return await axios(config)
        .then((res) => {
          // console.log("res.data.data");
          // console.log(res.data.data);
          return res.data.data;
        })
        .catch((err) => {
          console.log(err.response);
          alert("新增失敗，請稍後再試！");
        });
    },

    // 移除繪製的監聽，節點移除重置
    recreateCanvas() {
      document.querySelector("#squareCanvasArea").innerHTML = "";
      // 建立一個新的 canvas 元素
      const newCanvas = document.createElement("canvas");
      // 設置 canvas 的 id
      newCanvas.id = "drawCanvas";
      // 將 canvas 添加到 squareCanvasArea 中
      document.querySelector("#squareCanvasArea").appendChild(newCanvas);
    },

    // 清除畫布
    clearNewArea() {
      const vm = this;

      // 清除剛繪製的四方形
      vm.removeCreatingEl();
      vm.clearCanvas();

      // 上一步驟和完成按鈕復原
      document.querySelector("#cctvAreaCover").classList.add("d-none");
      document.querySelector("#fincctvArea").disabled = false;
      document.querySelector("#new-area-btn").disabled = false;
      document.querySelector("#del-area-btn").disabled = false;

      // 使用者可重新再繪製
      vm.startDraw();
    },

    // 清除剛繪製的四方形
    removeCreatingEl() {
      // 清除剛繪製的四方形
      const removeEl = document.querySelector("#currentShape");
      if (removeEl) {
        removeEl.remove();
      }
    },

    // 清除畫布
    clearCanvas() {
      const canvas = document.querySelector("#drawCanvas");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    },

    /* 刪除辨識框 */
    switchDelArea() {
      const vm = this;
      // 還原按鈕遮罩
      document.querySelector("#cctvAreaCover").classList.add("d-none");
      document.querySelector("#fincctvArea").disabled = false;
      document.querySelector("#new-area-btn").disabled = false;
      document.querySelector("#del-area-btn").disabled = false;

      // 加入 div 區塊的 class
      vm.changeClsToDiv("add");
      // 設定可選擇辨識區
      vm.canChooseDivSet();
    },

    // 恢復 div 成選取無效
    removeCanChooseDivSet() {
      const vm = this;
      const chooseDivCls = document.querySelectorAll(".choose-div");
      chooseDivCls.forEach((item) => {
        item.removeEventListener("click", vm.getChooseDivEl);
      });
    },

    // 加入或移除 div 上的 class
    changeClsToDiv(status) {
      const chooseDivCls = document.querySelectorAll(".choose-div");

      if (status === "add") {
        chooseDivCls.forEach((item) => {
          // 游標 class
          item.classList.add("cursor-pointer");
        });
      } else if (status === "remove") {
        chooseDivCls.forEach((item) => {
          // 游標 class
          item.classList.remove("cursor-pointer");
        });
      }
    },

    canChooseDivSet() {
      const vm = this;
      const chooseDivCls = document.querySelectorAll(".choose-div");
      chooseDivCls.forEach((item) => {
        item.addEventListener("click", (event) => {
          vm.getChooseDivEl(event);
        });
      });
    },

    getChooseDivEl(event) {
      const vm = this;
      const chooseDivTmp = event.target;
      vm.chooseDivTmp = chooseDivTmp;
      console.warn(vm.chooseDivTmp);

      // 移除所有其他 div 動畫，幫目前點的加上動畫
      vm.removeRemainingAni();
      chooseDivTmp.classList.add("chooseAnimation");

      // 插入刪除按鈕在該框上
      // 垃圾桶按鈕放入新建立的 div 中
      const clearBtn = document.createElement("div");
      clearBtn.id = "del-check-area-btn";
      clearBtn.classList.add(
        "d-inline-block",
        "position-absolute",
        "ms-1",
        "text-white",
        "d-flex",
        "align-items-center",
        "justify-content-center",
        "bg-orange",
        "cursor-pointer"
      );
      clearBtn.style.right = `0px`;
      clearBtn.style.top = `0px`;
      clearBtn.style.width = `32px`;
      clearBtn.style.height = `32px`;
      clearBtn.style.zIndex = "999";
      clearBtn.addEventListener("click", vm.delDiv);
      clearBtn.innerHTML =
        '<i class="icon-cctv-trash" style="font-size: 32px;color: #fab844;background: white;"></i>';

      if (chooseDivTmp.childElementCount === 0) {
        chooseDivTmp.appendChild(clearBtn);
      }
    },

    // 移除所有其他 div 動畫
    removeRemainingAni() {
      const chooseDivCls = document.querySelectorAll(".choose-div");
      chooseDivCls.forEach((item) => {
        item.classList.remove("chooseAnimation");

        // 清除所有 div 上面的垃圾桶按鈕
        item.innerHTML = "";
      });
    },

    async delDiv() {
      const vm = this;
      console.warn("delDiv() => vm.chooseDivTmp");
      console.warn(vm.chooseDivTmp);

      // 如果使用者有選擇某個框
      if (vm.chooseDivTmp) {
        // 實際刪除 div
        await vm.ajaxDelDiv(vm.chooseDivTmp);

        // 重新取得所有辨識框
        await vm.getAllArea();
        // 顯示現有框
        vm.loadImg();

        // 重新可以刪下一個
        vm.switchDelArea();

        // 移除暫存
        vm.chooseDivTmp = null;
      }
    },

    // 這裡的 this 會是垃圾桶的按鈕，因為呼叫時是 addEventListener 來的
    async ajaxDelDiv(delEl) {
      // await verifyToken();

      const currentId = Number(delEl.getAttribute("id").substring(4));
      // console.log(currentId);

      const data = new FormData();
      data.append("id", currentId);

      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const config = {
        method: "DELETE",
        url: `${apiserver}/tpefunction/detection`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      await axios(config)
        .then((res) => {
          console.log(res);
          console.log("刪除成功");
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
  async mounted() {
    // 加載 rtsp 畫面
    // this.loadingRstpInterval();
  },
  beforeUnmount() {
    // 卸載 rstpInterval
    // console.log("卸載 rstpInterval");
    clearInterval(window.rtspInterval);
  },
  components: { RouterLink },
};
</script>

<template>
  <div id="cctvAreaSet" class="p-4">
    <div class="mb-3">
      <span class="fs-5 pe-2"
        >編輯<span class="customCamName text-primary">攝影機名稱</span
        >的辨識區</span
      >
      <span class="text-gray-600">(步驟3/3)</span>
    </div>

    <!-- 視窗 -->
    <div id="cctvArea">
      <!--  style="min-height: calc(100vh - 274px)" -->
      <div class="row g-0">
        <!-- 右側畫面 -->
        <div
          id="main-scene"
          class="col-12 col-md-9 g-0 d-flex flex-column w-100"
        >
          <div class="h-100">
            <div
              id="operateBtnsArea"
              class="col d-flex flex-column flex-lg-row align-items-start align-items-lg-center py-2"
            >
              <div class="d-flex">
                <button
                  type="button"
                  id="new-area-btn"
                  class="btn d-flex align-items-center"
                  :class="[isStartDraw ? 'btn-warning' : 'btn-primary']"
                  @click="startDrawBtn"
                >
                  <i class="icon-area fs-4"></i>
                  <span style="white-space: nowrap">繪製</span>
                </button>
                <button
                  type="button"
                  id="del-area-btn"
                  class="btn d-flex align-items-center ms-2"
                  :class="[isDelDraw ? 'btn-warning' : 'btn-primary']"
                  @click="delDrawBtn"
                >
                  <i class="icon-trash fs-4"></i>
                  <span style="white-space: nowrap">刪除</span>
                </button>
              </div>
              <div class="ms-0 ms-lg-2">
                <div
                  class="d-flex flex-column flex-lg-row align-items-start align-items-lg-end"
                >
                  <div
                    id="cctv-area-caption"
                    class="d-flex flex-wrap align-items-end"
                  >
                    <div>
                      <span class="text-danger">新增： </span>
                      先點左方繪製鈕，於畫面上拖曳辨識區範圍。
                      <br />
                      <span class="text-danger"> 刪除： </span>
                      先點左方刪除鈕，選擇欲刪除的辨識框再點垃圾桶。
                    </div>
                    <br />
                    <div>
                      畫面若為綠色色塊，請檢查輸入參數是否正確，或鏡頭連線狀態是否正常！
                    </div>
                    <div class="text-primary">
                      建議辨識區數量：{{ allAreaData.length }}/2
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 畫面 style="height: calc(100vh - 220px)" -->
            <div class="col position-relative">
              <!-- max-height: 100% -->
              <img
                id="rtspImg"
                style="max-width: 100%; max-height: calc(100vh - 72px)"
                :src="rtspImgSrc"
                alt="攝影機建置中..."
              />
              <!--  切換使用 invisible -->
              <div
                id="newDivSquare"
                class="position-absolute top-0 start-0"
                style="width: 100%; height: 100%"
              ></div>
              <!-- 新增框 -->
              <div
                id="squareCanvasArea"
                class="position-absolute top-0 start-0"
                :class="{ 'd-none': !isStartDraw }"
                style="
                  width: 100%;
                  height: 100%;
                  max-width: 100%;
                  max-height: 100%;
                "
              >
                <canvas id="drawCanvas"></canvas>
              </div>
              <!-- 鏡頭Loading畫面 -->
              <div
                id="camLoadingOuter"
                class="w-100 h-100 bg-dark position-absolute top-0 start-0 d-flex align-items-center justify-content-center"
                :class="{ 'd-none': !restartGetdataOnce }"
                style="z-index: 9999; width: 150px !important"
              >
                <div class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span class="text-white">攝影機建置中...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="position-relative d-flex flex-wrap py-3">
      <!-- 上一頁按鈕 -->
      <div
        id="backCctvIdentifyItem"
        class="text-primary text-center d-inline-block cursor-pointer"
        style="padding: 6px 12px; width: 110px"
        @click="
          stepAdd(2), (restartSrcOnce = true), (restartGetdataOnce = true)
        "
      >
        上一步驟
      </div>
      <!-- 完成按鈕 -->
      <RouterLink to="setting">
        <button
          type="button"
          id="fincctvArea"
          class="btn btn-primary"
          style="width: 110px"
        >
          完成
        </button>
      </RouterLink>
      <!-- 未完成編輯或刪除的遮罩 -->
      <div
        id="cctvAreaCover"
        class="w-100 h-100 position-absolute top-0 start-0 d-none"
        style="background-color: rgba(0, 0, 0, 0); width: 110px"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

.text-gray-600 {
  color: $gray-600;
}
</style>
