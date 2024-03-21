<script>
import axios from "axios";
import { mapActions } from "pinia";
import cameraStore from "@/stores/cameraStore";

export default {
  props: ["camList", "camListFilter", "recognitionIcon", "isDelPop"],
  data() {
    return {
      pageSize: 10, // 每頁顯示的項目數量
      paginationCnt: 5, // 最大顯示分頁數量
      currentPage: 1, // 當前頁碼

      batteryList: null, // 所有鏡頭電力列表
    };
  },
  computed: {
    // 計算總頁數
    totalPages() {
      return Math.ceil(this.camListFilter.length / this.pageSize);
    },
    // 根據當前頁碼和每頁顯示數量計算出當前頁的資料
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.camListFilter.slice(startIndex, endIndex);
    },
    // 計算顯示的分頁數字範圍
    displayedPages() {
      // 限制最大顯示分頁數，不超過5個
      const totalDisplayedPages = Math.min(this.paginationCnt, this.totalPages);
      const middlePage = Math.min(
        Math.max(1, this.currentPage - Math.floor(totalDisplayedPages / 2)),
        Math.max(1, this.totalPages - totalDisplayedPages + 1)
      );

      return Array.from(
        { length: totalDisplayedPages },
        (_, i) => middlePage + i
      );
    },
  },
  methods: {
    ...mapActions(cameraStore, ["splitRtsp"]),
    // 跳轉到指定頁碼
    gotoPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    // 取得電力資訊
    getBattery() {
      const vm = this;
      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const config = {
        method: "GET",
        url: `${apiserver}/tpefunction/receive_data`,
      };

      axios(config)
        .then((res) => {
          console.log("getBattery");
          console.log(res);
          vm.batteryList = res.data.data;
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    // 回傳電量
    camBattery(camera_name) {
      let batteryRtn;

      // 是否已取得電量
      if (this.batteryList) {
        this.batteryList.forEach((item) => {
          if (item.uuid === camera_name) {
            batteryRtn = item.battery;
          }
        });
      }
      // 如果沒有此攝影機電量，則回傳100
      if (batteryRtn) {
        return batteryRtn;
      } else {
        return 100;
      }
    },
  },
  created() {
    this.getBattery();
  },
  async mounted() {
    window.getBatteryInterval = setInterval(this.getBattery, 5000);
  },
  unmounted() {
    clearInterval(window.getBatteryInterval);
  },
};
</script>

<template>
  <div>
    <div>
      <!-- 列表 -->
      <table class="w-100 mt-4">
        <thead>
          <tr class="fw-bold">
            <td>所在區域</td>
            <td>攝影機名稱</td>
            <td>辨識項目</td>
            <td>IP位址</td>
            <td>連線帳號</td>
            <td>連線密碼</td>
            <td>備註</td>
            <td>管理</td>
          </tr>
        </thead>
        <tbody>
          <tr v-if="camList.length == 0">
            <td colspan="9">尚未建立攝影機</td>
          </tr>
          <tr v-else-if="camListFilter.length == 0">
            <td colspan="9">查無攝影機資料</td>
          </tr>
          <template v-else>
            <tr v-for="(item, i) in paginatedItems" :key="i">
              <td>{{ item.camera_place }}</td>
              <td>{{ item.camera_name }}</td>
              <td>
                <div class="pt-1">
                  <i
                    class="text-info fs-4"
                    :class="recognitionIcon(item.recognition)"
                    :title="item.recognition"
                  ></i>
                </div>
              </td>
              <td>
                {{ splitRtsp(item.rtsp_url, 3) }}
              </td>
              <td>
                {{
                  splitRtsp(item.rtsp_url, 1)
                    ? splitRtsp(item.rtsp_url, 1)
                    : "---"
                }}
              </td>
              <td>
                {{
                  splitRtsp(item.rtsp_url, 2)
                    ? splitRtsp(item.rtsp_url, 2)
                    : "---"
                }}
              </td>
              <td>{{ item.note }}</td>
              <td>
                <RouterLink
                  :to="`create?id=${item.id}`"
                  style="text-decoration: none"
                >
                  <i
                    class="icon-edit-square fs-3 text-primary cursor-pointer me-1"
                  >
                    <i class="path1"></i>
                    <i class="path2"></i>
                  </i>
                </RouterLink>

                <RouterLink
                  :to="`frigatearea?id=${item.id}`"
                  style="text-decoration: none"
                >
                  <i
                    class="icon-area-square fs-3 text-primary cursor-pointer me-1"
                  >
                    <i class="path1"></i>
                    <i class="path2"></i>
                  </i>
                </RouterLink>

                <i
                  class="icon-video-square fs-3 text-primary cursor-pointer me-1"
                >
                  <i class="path1"></i>
                  <i class="path2"></i>
                </i>

                <i
                  class="icon-trash-square fs-3 text-primary cursor-pointer"
                  @click="isDelPop(item.id, item.camera_name)"
                >
                  <i class="path1"></i>
                  <i class="path2"></i>
                </i>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="text-end my-3">
      <!-- <div class="text-center" v-if="camList.length == 0">尚未建立攝影機</div> -->

      <div style="display: inline-block" v-if="camListFilter.length != 0">
        <!-- 分頁組件 -->
        <nav aria-label="Page navigation example" class="user-select-none">
          <ul class="pagination">
            <!-- 最前頁 -->
            <li
              class="page-item"
              :class="{
                disabled: currentPage === 1,
                'cursor-pointer': currentPage !== 1,
              }"
            >
              <a class="page-link" @click="gotoPage(1)" aria-label="First">
                <span class="arrow-ll1" aria-hidden="true">
                  <span class="arrow-ll2" aria-hidden="true">««</span>
                </span>
              </a>
            </li>

            <!-- 上一頁 -->
            <li
              class="page-item"
              :class="{
                disabled: currentPage === 1,
                'cursor-pointer': currentPage !== 1,
              }"
            >
              <a
                class="page-link"
                @click="gotoPage(currentPage - 1)"
                aria-label="Previous"
              >
                <span class="arrow-l" aria-hidden="true">‹</span>
              </a>
            </li>

            <!-- 顯示實際的分頁數字 -->
            <li
              v-for="pageNumber in displayedPages"
              :key="pageNumber"
              :class="{ active: currentPage === pageNumber }"
              class="page-item cursor-pointer"
            >
              <a class="page-link" @click="gotoPage(pageNumber)">{{
                pageNumber
              }}</a>
            </li>

            <!-- 下一頁 -->
            <li
              class="page-item"
              :class="{
                disabled: currentPage === totalPages,
                'cursor-pointer': currentPage !== totalPages,
              }"
            >
              <a
                class="page-link"
                @click="gotoPage(currentPage + 1)"
                aria-label="Next"
              >
                <span class="arrow-r" aria-hidden="true">›</span>
              </a>
            </li>

            <!-- 最後頁 -->
            <li
              class="page-item"
              :class="{
                disabled: currentPage === totalPages,
                'cursor-pointer': currentPage !== totalPages,
              }"
            >
              <a
                class="page-link"
                @click="gotoPage(totalPages)"
                aria-label="Last"
              >
                <span class="arrow-rr1" aria-hidden="true">
                  <span class="arrow-rr2" aria-hidden="true">»»</span>
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- <div class="text-center" v-else-if="camListFilter.length == 0">
        查無攝影機資料
      </div> -->
    </div>
  </div>
  <!-- {{ camListFilter }} -->
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";
tr {
  border-bottom: 1px solid $gray-100;
}
td {
  padding: 16px 0;
  text-align: center;
}

.arrow-r,
.arrow-rr1,
.arrow-rr2 {
  color: rgba(0, 0, 0, 0);
  &::before,
  &::after {
    content: "";
    width: 9px;
    height: 2px;
    background: $gray-600;
    position: absolute;
    border-radius: 8px;
  }
  &::before {
    transform: rotate(45deg);
    top: 15px;
  }
  &::after {
    transform: rotate(-45deg);
    top: 20px;
  }
}

.arrow-r,
.arrow-rr1 {
  &::before,
  &::after {
    left: 10px;
  }
}
.arrow-rr2 {
  &::before,
  &::after {
    left: 19px;
  }
}

.arrow-l,
.arrow-ll1,
.arrow-ll2 {
  color: rgba(0, 0, 0, 0);
  &::before,
  &::after {
    content: "";
    width: 9px;
    height: 2px;
    background: $gray-600;
    position: absolute;
    left: 9px;
    border-radius: 8px;
  }
  &::before {
    transform: rotate(-45deg);
    top: 15px;
  }
  &::after {
    transform: rotate(45deg);
    top: 20px;
  }
}

.arrow-ll1 {
  &::before,
  &::after {
    left: 10px;
  }
}

.arrow-ll2 {
  &::before,
  &::after {
    left: 19px;
  }
}
</style>
