<script>
import axios from "axios";
import video1 from "@/assets/video/1.mp4";
import video2 from "@/assets/video/2.mp4";
import video3 from "@/assets/video/3.mp4";
import video4 from "@/assets/video/4.mp4";
import video5 from "@/assets/video/5.mp4";
import alertsound from "@/assets/sound/alertsound.mp3";

export default {
  data() {
    return {
      // 取得原始資料
      getRoadList: [
        {
          id: 1,
          cameraName: "矽銀工業區",
          status: "火焰煙霧",
          rtsp: video1,
          isClick: false,
        },
        {
          id: 2,
          cameraName: "博邦科學基地",
          status: "無異常",
          rtsp: video2,
          isClick: false,
        },
        {
          id: 3,
          cameraName: "尼山森林區",
          status: "無異常",
          rtsp: video3,
          isClick: false,
        },
        {
          id: 4,
          cameraName: "中山交叉路口",
          status: "無異常",
          rtsp: video4,
          isClick: false,
        },
        {
          id: 5,
          cameraName: "力坑快速道路",
          status: "無異常",
          rtsp: video5,
          isClick: false,
        },
        {
          id: Number(
            document.querySelector("#DEMOID").getAttribute("data-url")
          ),
          cameraName: "智慧城市展",
          status: "無異常",
          rtsp:
            document.querySelector("#FRIGATEIPWEB").getAttribute("data-url") +
            `api/camera${Number(
              document.querySelector("#DEMOID").getAttribute("data-url")
            )}?fps=30&h=1080&bbox=1`,
          isClick: false,
        },
      ],
      // 深層拷貝後真正使用的資料，加上是否active
      roadList: [],
      // 篩選項目
      filterProject: "all",
      // 篩選後
      filterList: [],
      // 目前選擇的攝影機物件資料
      activeCam: "",
      // 切換的id
      switchRoadId: "",
      // 讀取畫面中
      loadingCam: true,
      // 使用者輸入的篩選文字
      searchText: "",

      // Frigate 各鏡頭狀態
      frigatestats: "",
      // Frigate 該鏡頭事件 https://iseekwebfrigate.intemotech.com/api/events?cameras=cameraxxx
      frigateEvents: [],
      // Frigate 事件暫存
      eventsTmpFirstTmp: [],
      eventsTmpFirstNew: [],
      // 當下時間
      currentTime: "",
      // 是否正在播放音效
      isPlaying: false,

      video1: video1,
      video2: video2,
      video3: video3,
      video4: video4,
      video5: video5,
      alertsound: alertsound,
    };
  },
  watch: {
    filterProject() {
      const vm = this;
      vm.filterByItem();
    },
    searchText() {
      const vm = this;
      vm.filterByItem();
    },
  },
  methods: {
    // 取得資料
    async getRoadData() {
      // console.log("getRoadData重取資料");
      const vm = this;
      vm.roadList = JSON.parse(JSON.stringify(vm.getRoadList));

      // 合併目前點擊的項目
      vm.combine();

      vm.filterByItem();
    },
    // 合併目前點擊的項目
    combine() {
      const vm = this;
      vm.roadList?.forEach((item) => {
        if (vm.activeCam === "") {
          vm.activeCam = item;
        }
        if (item.id === vm.activeCam.id) {
          item.isClick = true;
        }
      });
    },
    // 切換鏡頭
    switchActiveCam(roadId) {
      console.log("切換鏡頭switchActiveCam");
      const vm = this;
      // 呈現 loading 狀態
      // vm.loadingCam = true;
      vm.roadList.forEach((item) => {
        if (item.id === roadId) {
          item.isClick = true;
          // 當前選擇
          vm.activeCam = item;
          vm.switchRoadId = item.id;
        } else {
          item.isClick = false;
        }
      });

      // filter 也要同步
      vm.filterList.forEach((item) => {
        if (item.id === roadId) {
          item.isClick = true;
        } else {
          item.isClick = false;
        }
      });
    },
    // 取得 Frigate 鏡頭數據
    async getFrigateStats() {
      const vm = this;
      const config = {
        method: "GET",
        url: "./frigatestats",
      };
      await axios(config)
        .then((res) => {
          console.log("./frigatestats res");
          vm.frigatestats = res.data.cameras;
          vm.isCamAlive();
        })
        .catch((err) => {
          console.log("./frigatestats err");
          console.log(err.response);
          vm.isCamAlive();
        });
    },
    // 取得 Frigate 事件
    async getFrigateEvents() {
      const vm = this;
      const config = {
        method: "GET",
        url: `./frigateevents`,
        // url: `./frigateevents?camid=${vm.switchRoadId}`,
      };

      await axios(config)
        .then((res) => {
          console.log(`./frigateevents`);
          console.log(res.data);

          // 取得各鏡頭Events
          vm.frigateEachEvents(res);
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    // 取得各鏡頭Events
    frigateEachEvents(res) {
      console.log("進入frigateEachEvents");
      const vm = this;
      // vm.getRoadList.forEach((item) => {
      const filteredData = res.data.filter(
        // (obj) => obj.camera === `camera${item.id}`
        (obj) =>
          obj.camera ===
          `camera${Number(
            document.querySelector("#DEMOID").getAttribute("data-url")
          )}`
      );

      // 如果沒此攝影機
      console.warn(filteredData);
      if (filteredData.length !== 0) {
        filteredData.sort((a, b) => {
          return b.end_time - a.end_time;
        });

        // console.log(filteredData[0].camera);
        // console.log(filteredData[0].end_time);

        vm.eventsTmpFirstNew = {
          cam: filteredData[0].camera,
          tmptime: filteredData[0].end_time,
        };
        vm.compareData();
      }
      // });

      console.log("結束frigateEachEvents");
    },
    // 比對
    compareData() {
      console.log("有跑compareData");
      const vm = this;
      if (vm.eventsTmpFirstTmp.tmptime !== vm.eventsTmpFirstNew.tmptime) {
        if (vm.eventsTmpFirstTmp.length != 0) {
          console.warn("火警");
          vm.getRoadList.forEach((item) => {
            if (
              item.id ===
              Number(document.querySelector("#DEMOID").getAttribute("data-url"))
            ) {
              item.status = "火焰煙霧";
            }
          });

          console.log("vm.getRoadList.forEach完成");

          vm.roadList.forEach((item) => {
            if (
              item.id ===
              Number(document.querySelector("#DEMOID").getAttribute("data-url"))
            ) {
              item.status = "火焰煙霧";
              if (!vm.isPlaying) {
                // 警示音效
                vm.audioPlay("true");
                vm.isPlaying = true;
              }
            }
          });

          console.log("vm.roadList.forEach完成");
          vm.eventsTmpFirstTmp = { ...vm.eventsTmpFirstNew };

          // 要切換才能更新狀態
          vm.switchActiveCam(vm.switchRoadId);
        } else {
          vm.eventsTmpFirstTmp = { ...vm.eventsTmpFirstNew };
        }
      }
      // const vm = this;
      // const result = [];
      // vm.eventsTmpFirstNew.forEach((currentItem) => {
      //   const previousItem = vm.eventsTmpFirstTmp.find(
      //     (item) => item.cam === currentItem.cam
      //   );
      //   if (previousItem && previousItem.tmp !== currentItem.tmp) {
      //     result.push(currentItem.cam);
      //   }
      // });
      // return result;
    },
    // 當前鏡頭是否有畫面
    isCamAlive() {
      // console.log("isCamAlive");
      const vm = this;
      // 尚未顯示再判斷
      if (vm.frigatestats[`camera${vm.switchRoadId}`]) {
        if (vm.frigatestats[`camera${vm.switchRoadId}`]?.camera_fps === 0) {
          // 尚未出現畫面
          // console.log("尚未出現畫面");
          vm.loadingCam = true;
        } else {
          // 顯示畫面
          // console.log("顯示畫面");
          vm.loadingCam = false;
        }
      } else {
        vm.loadingCam = true;
      }
    },
    // 依項目篩選
    filterByItem() {
      // console.log("filterByItem");
      const vm = this;
      if (vm.filterProject === "fire") {
        vm.filterList = vm.roadList.filter(
          (item) => item.status === "火焰煙霧"
        );
      } else if (vm.filterProject === "water") {
        vm.filterList = vm.roadList.filter((item) => item.status === "淹水");
      } else if (vm.filterProject === "people") {
        vm.filterList = vm.roadList.filter(
          (item) => item.status === "民眾路倒"
        );
      } else {
        // 全部
        vm.filterList = JSON.parse(JSON.stringify(vm.roadList));
      }

      // 依文字篩選
      vm.filterList = vm.filterList.filter((item) =>
        item.cameraName.match(vm.searchText)
      );
    },
    // 回到無異常狀態
    statusToNormal() {
      const vm = this;
      vm.audioPlay("false");
      vm.getRoadList.forEach((item) => {
        if (
          item.id ===
          Number(document.querySelector("#DEMOID").getAttribute("data-url"))
        ) {
          item.status = "無異常";
        }
      });

      vm.roadList.forEach((item) => {
        if (
          item.id ===
          Number(document.querySelector("#DEMOID").getAttribute("data-url"))
        ) {
          item.status = "無異常";
        }
      });

      // 要切換才能更新狀態
      vm.switchActiveCam(vm.switchRoadId);
    },
    // 音效
    initAudio() {
      const vm = this;
      if (vm.$refs.audioElement.paused) {
        vm.$refs.audioElement.play();
        vm.$refs.audioElement.loop = true;
      }
    },
    audioPlay(status) {
      const vm = this;
      if (status === "true") {
        console.log("播放");
        vm.$refs.audioElement.muted = false;
        // vm.audio.muted = false;
      } else {
        console.log("暫停");
        vm.$refs.audioElement.muted = true;
        vm.isPlaying = false;
        // vm.audio.muted = false;
      }
    },
    // 當下時間
    updateClock() {
      const vm = this;
      const now = new Date();
      vm.currentTime = `${now.getFullYear()}-${(
        "0" +
        (now.getMonth() + 1)
      ).slice(-2)}-${("0" + now.getDate()).slice(-2)} ${(
        "0" + now.getHours()
      ).slice(-2)}:${("0" + now.getMinutes()).slice(-2)}:${(
        "0" + now.getSeconds()
      ).slice(-2)}`;
    },
  },
  async mounted() {
    const vm = this;

    console.log(
      Number(document.querySelector("#DEMOID").getAttribute("data-url"))
    );
    // 時間
    vm.updateClock(); // 初始化
    setInterval(vm.updateClock, 1000); // 每秒更新

    await vm.getRoadData();
    await vm.getFrigateStats();
    await vm.getFrigateEvents();
    vm.initAudio();

    window.getRoadListInterval = setInterval(vm.getRoadData, 1000);
    window.getFrigateStatsInterval = setInterval(vm.getFrigateStats, 1000);
    window.getFrigateEventsInterval = setInterval(vm.getFrigateEvents, 1000);
    window.initAudioInterval = setInterval(vm.initAudio, 1000);
  },
  unmounted() {
    // console.log("unmounted！");
    clearInterval(window.getRoadListInterval);
    clearInterval(window.getFrigateStatsInterval);
    clearInterval(window.getFrigateEventsInterval);
    clearInterval(window.initAudioInterval);
  },
};
</script>

<template>
  <div>
    <!-- 警報音效 -->
    <div class="d-none">
      <audio ref="audioElement" autoplay muted loop>
        <source :src="alertsound" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
    <div class="row g-0">
      <!-- 選單列表 -->
      <div class="col-12 col-md-3">
        <!-- 搜尋 -->
        <div class="position-relative">
          <i
            class="icon-search position-absolute"
            style="top: 20px; left: 24px; color: #222222; font-size: 24px"
          ></i>
          <div class="p-2">
            <input
              type="text"
              v-model="searchText"
              placeholder="請輸入關鍵字"
              class="ps-5 py-2 rounded-3 w-100"
              style="padding-top: 12px !important"
            />
          </div>
        </div>

        <!-- 選擇置頂 -->
        <div>
          <div class="row g-0 p-2 border-bottom">
            <div
              class="col text-center cursor-pointer"
              @click="filterProject = 'all'"
            >
              <i
                class="icons"
                :class="[
                  filterProject === 'all'
                    ? 'icon-sort-all-active'
                    : 'icon-sort-all unactive',
                ]"
              >
                <i class="path1"></i>
                <i class="path2"></i>
                <i class="path3"></i>
              </i>
            </div>
            <div
              class="col text-center cursor-pointer"
              @click="filterProject = 'fire'"
            >
              <i
                class="icons"
                :class="[
                  filterProject === 'fire'
                    ? 'icon-sort-fire-active'
                    : 'icon-sort-fire unactive',
                ]"
              >
                <i class="path1"></i>
                <i class="path2"></i>
                <i class="path3"></i>
              </i>
            </div>
            <div
              class="col text-center cursor-pointer"
              @click="filterProject = 'water'"
            >
              <i
                class="icons"
                :class="[
                  filterProject === 'water'
                    ? 'icon-sort-water-active'
                    : 'icon-sort-water unactive',
                ]"
              >
                <i class="path1"></i>
                <i class="path2"></i>
                <i class="path3"></i>
              </i>
            </div>
            <div
              class="col text-center cursor-pointer"
              @click="filterProject = 'people'"
            >
              <i
                class="icons"
                :class="[
                  filterProject === 'people'
                    ? 'icon-sort-people-active'
                    : 'icon-sort-people unactive',
                ]"
              >
                <i class="path1"></i>
                <i class="path2"></i>
                <i class="path3"></i>
              </i>
            </div>
          </div>
        </div>

        <!-- 攝影機列表 -->
        <div>
          <div style="height: calc(100vh - 269px); overflow: auto">
            <table class="w-100 camListTable">
              <thead>
                <tr>
                  <th class="p-2 text-center"></th>
                  <th class="p-2 text-center">序號</th>
                  <th class="p-2 text-center">攝影機名稱</th>
                  <th class="p-2 text-center">辨識狀態</th>
                  <th class="p-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                <template v-if="filterList.length !== 0">
                  <template v-for="(road, i) in filterList" :key="i">
                    <tr
                      class="cursor-pointer"
                      :class="[
                        road.status === '無異常' && road.isClick
                          ? 'normalClick fw-bold'
                          : road.status === '無異常' && !road.isClick
                          ? 'normalUnclick'
                          : road.status !== '無異常' && road.isClick
                          ? 'abnormalClick fw-bold'
                          : 'abnormalUnclick',
                      ]"
                      style="user-select: none"
                      @click="switchActiveCam(road.id)"
                    >
                      <td
                        class="text-center"
                        style="padding: 0.75rem 0.5rem"
                      ></td>
                      <td class="text-center" style="padding: 0.75rem 0.5rem">
                        {{ i + 1 }}
                      </td>
                      <td style="padding: 0.75rem 0.5rem">
                        {{ road.cameraName }}
                      </td>
                      <td style="width: 80px; padding: 0.75rem 0.5rem">
                        {{ road.status }}
                      </td>
                      <td class="text-center" style="padding: 0.75rem 0.5rem">
                        <img
                          src="@/assets/img/triangle.svg"
                          class="mb-1"
                          :class="{ invisible: !road.isClick }"
                        />
                        <!-- <div
                        :class="[road.isClick ? 'activeIcon bg-warning' : '']"
                        style="width: 12px; height: 12px"
                      ></div> -->
                      </td>
                    </tr>
                  </template>
                </template>

                <template v-else>
                  <tr>
                    <td colspan="5" class="text-center pt-5">
                      沒有符合的資料，<span style="white-space: nowrap"
                        >請試試其它篩選項目或其他關鍵字！</span
                      >
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 畫面 -->
      <div class="col-12 col-md-9">
        <div class="d-none">
          <video>
            <source :src="video1" type="video/mp4" />
          </video>
          <video>
            <source :src="video2" type="video/mp4" />
          </video>
          <video>
            <source :src="video3" type="video/mp4" />
          </video>
          <video>
            <source :src="video4" type="video/mp4" />
          </video>
          <video>
            <source :src="video5" type="video/mp4" />
          </video>
        </div>
        <div class="row g-0" style="height: calc(100vh - 280px)">
          <!-- :class="{ 'd-none': loadingCam }" -->
          <video
            autoplay
            muted
            loop
            v-show="activeCam.id == 1"
            class="h-100 w-auto"
            style="object-fit: contain"
          >
            <source :src="video1" type="video/mp4" />
          </video>

          <video
            autoplay
            muted
            loop
            v-show="activeCam.id == 2"
            class="h-100 w-auto"
            style="object-fit: contain"
          >
            <source :src="video2" type="video/mp4" />
          </video>

          <video
            autoplay
            muted
            loop
            v-show="activeCam.id == 3"
            class="h-100 w-auto"
            style="object-fit: contain"
          >
            <source :src="video3" type="video/mp4" />
          </video>

          <video
            autoplay
            muted
            loop
            v-show="activeCam.id == 4"
            class="h-100 w-auto"
            style="object-fit: contain"
          >
            <source :src="video4" type="video/mp4" />
          </video>

          <video
            autoplay
            muted
            loop
            v-show="activeCam.id == 5"
            class="h-100 w-auto"
            style="object-fit: contain"
          >
            <source :src="video5" type="video/mp4" />
          </video>
          <img
            v-show="activeCam.id > 5"
            :src="activeCam.rtsp"
            alt=""
            class="h-100 w-auto"
            style="object-fit: contain"
          />
          <!-- :class="{ 'd-none': !loadingCam }" -->
          <div class="d-none">
            <div
              class="d-flex flex-column justify-content-center align-items-center w-100 h-100"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div class="pt-3 fs-5">正在讀取畫面</div>
            </div>
          </div>
        </div>

        <div class="row g-0">
          <!-- 正常狀態 -->
          <div class="col d-flex p-2" v-if="activeCam.status != '無異常'">
            <div class="mx-2 w-100 d-flex">
              <div
                class="accepted cursor-pointer w-100 text-center me-2 fs-3 d-flex align-items-center justify-content-center rounded-3"
                @click="statusToNormal"
              >
                回報<br />已受理
              </div>
              <div
                class="ignore cursor-pointer w-100 text-center me-2 fs-3 d-flex align-items-center justify-content-center rounded-3"
                @click="statusToNormal"
              >
                忽略<br />該通報
              </div>
              <div
                class="respond cursor-pointer w-100 text-center fs-3 d-flex align-items-center justify-content-center rounded-3"
                @click="statusToNormal"
              >
                回報<br />AI誤判
              </div>
            </div>
          </div>

          <!-- 異常狀態 -->
          <div class="col d-flex p-2" v-else>
            <div class="mx-2 w-100 d-flex flex-nowrap">
              <div
                class="d-flex flex-column justify-content-center align-items-center px-3"
              >
                <div class="text-center" style="font-size: 12px">
                  今日累計<span style="white-space: nowrap">通報數</span>
                </div>
                <div class="fs-1 fw-bold en">10</div>
              </div>
              <div
                class="d-flex flex-column justify-content-center align-items-center px-3"
              >
                <div class="text-center" style="font-size: 12px">
                  今日異常<span style="white-space: nowrap">受理數</span>
                </div>
                <div class="fs-1 fw-bold en">4</div>
              </div>
              <div
                class="d-flex flex-column justify-content-center align-items-center px-3"
              >
                <div class="text-center" style="font-size: 12px">
                  今日忽略<span style="white-space: nowrap">通報數</span>
                </div>
                <div class="fs-1 fw-bold en">6</div>
              </div>
              <div
                class="d-flex flex-column justify-content-center align-items-center px-3"
              >
                <div class="text-center" style="font-size: 12px">
                  今日回報<span style="white-space: nowrap">誤判數</span>
                </div>
                <div class="fs-1 fw-bold en">0</div>
              </div>
            </div>
          </div>

          <!-- 正常狀態 -->
          <div class="col" v-if="activeCam.status === '無異常'">
            <div class="p-2">
              <div class="d-flex p-2 text-black aiNotifyTitleNormal">
                <i class="icon-cctv-info fs-2" style="margin-left: -6px"></i>
              </div>
              <div class="aiNotifyContent py-2 px-3">
                <div>
                  影像時間：<span id="nowTime">{{ currentTime }}</span>
                </div>
                <div>
                  影像來源：<span>{{ activeCam.cameraName }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 異常狀態 -->
          <div class="col" v-else>
            <div class="p-2">
              <div class="d-flex p-2 text-black aiNotifyTitle">
                <i class="icon-cctv-ai fs-2" style="margin-left: -6px"></i>
              </div>
              <div class="aiNotifyContent py-2 px-3">
                <div class="d-flex justify-content-between">
                  <div>辨識事件：<span>火焰煙霧</span></div>
                  <div class="text-warning"><b>25</b>sec</div>
                </div>
                <div>辨識時間：<span>2023-12-29 15:03:56</span></div>
                <div>
                  影像來源：<span>{{ activeCam.cameraName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

.icons {
  font-size: 64px;
}

.unactive {
  opacity: 0.3;
}

// table 樣式
table.camListTable {
  thead {
    position: sticky;
    top: 0px;
    background: $gray-900;
    z-index: 1;
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: $gray-600;
    }
  }
}

// 四種狀態
// 異常通報未回報
.abnormalUnclick {
  background: #3d020d;
}

// 正常運作or異常通報已回報
.normalUnclick {
  background: $gray-900;
}

// 正常運作被選取
.normalClick {
  background: $success;
}

// 異常通報被選取
.abnormalClick {
  background: linear-gradient(346deg, #f1022d, $gray-900);
}

// AI影像辨識通報 - 異常
.aiNotifyTitle {
  border-radius: 8px 8px 0 0;
  background: linear-gradient(0deg, #ffea00, #bfaf01);
}
// AI影像辨識通報 - 正常
.aiNotifyTitleNormal {
  border-radius: 8px 8px 0 0;
  background: linear-gradient(0deg, #999999, #757575);
}

.aiNotifyContent {
  border-radius: 0 0 8px 8px;
  background: $gray-800;
}

// 使用者點擊的按鈕
// 回報已受理
.accepted {
  color: $success;
  border: 2px solid $success;
  &:hover {
    color: $white;
    background: $success;
  }
}
// 忽略此通報
.ignore {
  color: $warning;
  border: 2px solid $warning;
  &:hover {
    color: $black;
    background: $warning;
  }
}
// 回報AI誤判
.respond {
  color: $danger;
  border: 2px solid $danger;
  &:hover {
    color: $white;
    background: $danger;
  }
}
</style>
