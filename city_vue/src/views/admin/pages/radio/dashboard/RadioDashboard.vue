<script>
import { verifyToken } from "@/utils/verify";
import { storeToRefs, mapActions } from "pinia";
import notifyStore from "@/stores/notifyStore";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  data() {
    return {
      chineseLocale: {
        months: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月",
        ],
      },

      startDate: "",
      endDate: "",
      startDateFormatted: "",
      endDateFormatted: "",

      // 通報類型輸入框
      insertType: "",

      // 通報資料取自pinia
      notifyData: [],
      // 批次人名合併
      notifyDataMerged: [],
      // 暫存比對，若有改變表示有新的通知
      maxBatch: null,

      // filter 資料
      notifyDataFilter: [],

      // 救災 / 救護頻道 disaster / rescue
      channel: "disaster",

      // 取得所有資料
      radioData: [
        {
          time: "2023-12-16 15:30:47",
          text: "171 收到",
        },
        {
          time: "2023-12-17 12:05:39",
          text: "186 186 007呼叫",
        },
        {
          time: "2023-12-17 12:05:47",
          text: "186 請支援，中山路三段自由路口有一民宅火苗竄出",
        },
        {
          time: "2023-12-17 12:05:47",
          text: "186 聽到請說",
        },
        {
          time: "2023-12-18 10:30:50",
          text: "443 443 007呼叫",
        },
        {
          time: "2023-12-18 10:30:56",
          text: "443 聽到請說",
        },
        {
          time: "2023-12-18 10:31:07",
          text: "443 請支援，中山路一段45號民宅火災",
        },
        {
          time: "2023-12-18 10:32:58",
          text: "443 正前往火災現場",
        },
        {
          time: "2023-12-18 10:33:08",
          text: "128 請將消防車開至中山路與自由路口待命",
        },
        { time: "2023-12-18 10:33:18", text: "128 收到" },
        {
          time: "2023-12-19 15:30:47",
          text: "171 收到",
        },
        {
          time: "2023-12-20 12:05:39",
          text: "186 186 007呼叫",
        },
        {
          time: "2023-12-20 12:05:47",
          text: "186 請支援，中山路三段自由路口有一民宅火苗竄出",
        },
        {
          time: "2023-12-20 12:05:47",
          text: "186 聽到請說",
        },
        {
          time: "2023-12-25 10:30:50",
          text: "443 443 007呼叫",
        },
        {
          time: "2023-12-25 10:30:56",
          text: "443 聽到請說",
        },
        {
          time: "2023-12-25 10:31:07",
          text: "443 請支援，中山路一段45號民宅火災",
        },
        {
          time: "2023-12-25 10:32:58",
          text: "443 正前往火災現場",
        },
        {
          time: "2023-12-27 10:33:08",
          text: "128 請將消防車開至中山路與自由路口待命",
        },
        { time: "2023-12-27 10:33:18", text: "128 收到" },
      ],
      radioDataFilter: [],
      // 關鍵字輸入框
      insertKeyword: "",
      // 前次輸入的暫存
      insertKeywordTmp: "",
      // 有幾個搜尋到的關鍵字
      matchesCount: 0,
      // 目前所在的關鍵字
      currentMatch: 0,
      // 是否正在搜尋中
      isKwSearching: false,
    };
  },
  watch: {
    // 監聽確定表格渲染完成，才能初始化捲動的關鍵字函式
    radioDataFilter(newData, oldData) {
      const vm = this;
      vm.$nextTick(() => {
        console.log("表格已經渲染完成且數據已經發生變化");
        console.log(newData);
        console.log(oldData);
        // 初始化
        vm.initScrollKeyword();
      });
    },
  },
  methods: {
    ...mapActions(notifyStore, ["getNotifyDataPinia"]),
    // 定時取得資料
    async getNotifyDatasComp() {
      const vm = this;

      const store = notifyStore();
      const { notifyData } = storeToRefs(store);
      vm.notifyData = notifyData;
      // console.log("vm.notifyData");
      // console.log(vm.notifyData);

      const mergedData = {};
      // 將數據按照批次合併
      vm.notifyData.forEach((item) => {
        if (!mergedData[item.batch]) {
          mergedData[item.batch] = { ...item }; // 複製當前項目
        } else {
          mergedData[item.batch].person += `, ${item.person}`; // 多人時
          // 人名排序
          mergedData[item.batch].person = mergedData[item.batch].person
            .split(", ")
            .sort((a, b) => a.localeCompare(b))
            .join(", ");
        }
      });

      // 數據轉換成數組，再重新反序
      const mergedArray = Object.values(mergedData).sort(
        (a, b) => new Date(b.alert_time) - new Date(a.alert_time)
      );

      vm.notifyDataMerged = [...mergedArray];

      // console.log(vm.maxBatch);
      // console.log(vm.notifyDataMerged);

      // 若資料有改變、有filter，重新拷貝一次
      if (
        vm.maxBatch != null &&
        vm.maxBatch !=
          Math.max(...vm.notifyDataMerged.map((item) => item.batch))
      ) {
        // 有多通知，重取並filter
        // 深層拷貝
        vm.notifyDataFilter = JSON.parse(JSON.stringify(this.notifyDataMerged));
        vm.notifyDataFilter = vm.notifyDataMerged.filter((item) =>
          vm.isDateInRange(item.alert_time, item.text)
        );

        // 重讀 tooltips
        // vm.$refs.refNotifyPagination.initTooltips();
      }

      // 暫存最大數值
      vm.maxBatch = Math.max(...vm.notifyDataMerged.map((item) => item.batch));
    },
    startDateInput() {
      // 時區關係，要加8
      const areaDate = new Date(this.startDate);
      areaDate.setHours(areaDate.getHours() + 8);

      try {
        const startDateFormatted = areaDate
          .toISOString()
          .slice(0, 16)
          .replace("T", " ");
        this.startDateFormatted = startDateFormatted;
      } catch {
        // 清空
        this.startDateFormatted = "";
      }
    },
    endDateInput() {
      // 時區關係，要加8
      const areaDate = new Date(this.endDate);
      areaDate.setHours(areaDate.getHours() + 8);

      try {
        const endDateFormatted = areaDate
          .toISOString()
          .slice(0, 16)
          .replace("T", " ");
        this.endDateFormatted = endDateFormatted;
      } catch {
        // 清空
        this.endDateFormatted = "";
      }
    },

    // 判斷日期是否在這之間、篩選通報類型
    isDateInRange(date) {
      return (
        (!this.startDate || date >= this.startDateFormatted) &&
        (!this.endDate || date <= this.endDateFormatted)
      );
    },

    // 計算
    filteredDates() {
      const vm = this;
      vm.radioDataFilter = vm.radioData.filter((item) =>
        vm.isDateInRange(item.time)
      );

      // 關鍵字
      vm.kwFilter();
    },

    // 數據初始化
    initResetDatas() {
      // 深層拷貝
      this.radioDataFilter = JSON.parse(JSON.stringify(this.radioData));
      this.startDate = "";
      this.endDate = "";
      this.startDateFormatted = "";
      this.endDateFormatted = "";
      this.insertKeyword = "";
      this.insertKeywordTmp = "";
      // 滾到最下面
      this.scrollToBottom();
    },
    // 只有關鍵字重設
    resetKeyword() {
      // 深層拷貝
      this.radioDataFilter = JSON.parse(JSON.stringify(this.radioData));
      this.insertKeyword = "";
      this.insertKeywordTmp = "";
      // 如果還有日期搜尋
      this.filteredDates();
      // 滾到最下面
      this.scrollToBottom();
    },
    kwFilter() {
      const vm = this;
      vm.insertKeywordTmp = vm.insertKeyword;
    },
    highlightText(text) {
      if (!this.insertKeywordTmp) return text;

      return text.replace(
        new RegExp(this.insertKeywordTmp, "gi"),
        (match) => `<span class="highlight">${match}</span>`
      );
    },
    initScrollKeyword() {
      const vm = this;
      const table = this.$refs.table;
      const highlighted = table.querySelectorAll("span.highlight");
      console.log(highlighted);
      if (highlighted.length) {
        vm.matchesCount = highlighted.length;
        vm.currentMatch = vm.matchesCount;
        const targetElement = highlighted[vm.currentMatch - 1];
        // 最後一個先加上highlight
        targetElement.classList.add("highlight-current");
        targetElement.scrollIntoView({ behavior: "auto", block: "center" });
      } else {
        vm.matchesCount = 0;
        vm.currentMatch = 0;
      }
      // 滾到最下面
      vm.scrollToBottom();
    },
    scrollToKeyword(direction) {
      const vm = this;
      const table = this.$refs.table;
      const highlighted = table.querySelectorAll("span.highlight");
      console.log(highlighted);
      if (highlighted.length) {
        // 移除原本當前關鍵字的樣式
        const oldTargetElement = highlighted[vm.currentMatch - 1];
        oldTargetElement.classList.remove("highlight-current");

        // 上下一個關鍵字
        if (direction === "up") {
          if (vm.currentMatch > 1) {
            vm.currentMatch -= 1;
          }
        } else if (direction === "down") {
          if (vm.currentMatch < vm.matchesCount) {
            vm.currentMatch += 1;
          }
        }
        // 當前關鍵字
        const targetElement = highlighted[vm.currentMatch - 1];
        targetElement.classList.add("highlight-current");
        targetElement.scrollIntoView({ behavior: "auto", block: "center" });
      } else {
        vm.matchesCount = 0;
        vm.currentMatch = 0;
      }
    },
    // 捲動到最底
    scrollToBottom() {
      const tableScroller = this.$refs.tableScroller;
      tableScroller.scrollTo(0, tableScroller.scrollHeight);
    },
  },
  async mounted() {
    const vm = this;
    // // token測試
    // const hasToken = await verifyToken();
    // if (!hasToken) {
    //   alert("請重新登入！");
    //   vm.logout();
    // }
    // await vm.getNotifyDataPinia();
    // 取得通知log資料
    // await vm.getNotifyDatasComp();
    vm.$nextTick(() => {
      // 深層拷貝
      vm.initResetDatas();
    });
    // window.getNotifyValInterval = setInterval(vm.getNotifyDatasComp, 3000);
  },
  // unmounted() {
  //   clearInterval(window.getNotifyValInterval);
  // },
};
</script>

<template>
  <div class="content">
    <!-- 篩選 -->
    <div class="d-flex flex-wrap justify-content-between">
      <div class="d-flex flex-wrap align-items-end mx-4 mt-3">
        <!-- 救災 救護 -->
        <div
          class="rounded-3 me-3"
          style="
            display: inline-block;
            background: linear-gradient(
              to bottom,
              #555555,
              #333333,
              #333333,
              #555555
            );
          "
        >
          <button
            type="button"
            class="btn text-white rounded-3 fw-bold fs-4 px-3 py-0"
            @click="channel = 'disaster'"
            :style="{
              background:
                channel === 'disaster'
                  ? 'linear-gradient(350deg, #3e9d41, #6eb953 33%, #29852c)'
                  : '',
            }"
          >
            救災
          </button>
          <button
            type="button"
            class="btn text-white rounded-3 fw-bold fs-4 px-3 py-0"
            @click="channel = 'rescue'"
            :style="{
              background:
                channel === 'rescue'
                  ? 'linear-gradient(350deg, #3e9d41, #6eb953 33%, #29852c)'
                  : '',
            }"
          >
            救護
          </button>
        </div>

        <div class="me-2" style="width: 220px">
          <div>開始日期/時間</div>
          <div>
            <!--  @update:model-value="startDateInput()" -->
            <input
              type="datetime-local"
              class="form-control"
              v-model="startDate"
              @update:model-value="startDateInput()"
              placeholder="請選擇"
            />
          </div>
        </div>

        <div class="me-2" style="width: 220px">
          <div>結束日期/時間</div>
          <!-- @update:model-value="endDateInput()" -->
          <div>
            <input
              type="datetime-local"
              class="form-control"
              v-model="endDate"
              @update:model-value="endDateInput()"
              placeholder="請選擇"
            />
          </div>
        </div>

        <div class="me-2" style="width: 240px">
          <div>關鍵字</div>
          <div class="position-relative">
            <input
              type="text"
              class="form-control"
              style="padding-right: 120px"
              v-model="insertKeyword"
              placeholder="搜尋語音內容"
            />

            <!-- 重設 -->
            <div
              class="position-absolute cursor-pointer"
              style="top: 8px; right: 4px"
              @click="resetKeyword(), (isKwSearching = false)"
            >
              <i class="icon-close-circle" style="font-size: 24px"></i>
            </div>

            <!-- 下一個關鍵字 -->
            <div
              v-show="isKwSearching"
              class="position-absolute cursor-pointer"
              :class="[
                currentMatch === matchesCount
                  ? 'input-gray-disabled'
                  : 'input-gray',
              ]"
              style="top: 8px; right: 28px"
              @click="scrollToKeyword('down')"
            >
              <i class="icon-chevron-down" style="font-size: 24px"></i>
            </div>

            <!-- 上一個關鍵字 -->
            <div
              v-show="isKwSearching"
              class="position-absolute cursor-pointer"
              :class="[
                currentMatch === 1 || currentMatch === 0
                  ? 'input-gray-disabled'
                  : 'input-gray',
              ]"
              style="top: 8px; right: 52px"
              @click="scrollToKeyword('up')"
            >
              <i class="icon-chevron-up" style="font-size: 24px"></i>
            </div>

            <!-- 搜尋數量 -->
            <div
              v-show="isKwSearching"
              class="position-absolute input-gray user-select-none"
              style="top: 6px; right: 76px"
            >
              <span>{{ currentMatch }}/{{ matchesCount }}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-primary d-flex align-items-center me-2 mt-3"
          :class="{
            disabled: !(startDate && endDate) && !insertKeyword,
          }"
          @click="
            filteredDates(),
              insertKeyword ? (isKwSearching = true) : (isKwSearching = false)
          "
        >
          <i class="icon-search fs-4"></i>
          查詢
        </button>

        <!-- 重設 -->
        <div>
          <button
            type="button"
            class="btn btn-light"
            @click="initResetDatas(), (isKwSearching = false)"
          >
            重設
          </button>
        </div>
      </div>

      <div class="d-flex align-items-end mx-4">
        <div class="d-flex flex-row align-items-center mt-3">
          <div class="pe-2">
            <span>救護</span>&nbsp;<span class="text-danger">無訊號</span>
          </div>
          <div class="px-2">
            <span>救災</span>&nbsp;<span class="text-success">辨識中</span>
          </div>

          <button type="button" class="btn btn-primary">匯出文字報告</button>
        </div>
      </div>
    </div>

    <div class="content-area rounded-3 bg-white text-black p-4 mx-4 my-3">
      <div
        style="height: calc(100vh - 336px); overflow: auto"
        ref="tableScroller"
      >
        <table class="w-100" ref="table">
          <thead>
            <tr class="fw-bold">
              <td class="text-center py-2">接收時間</td>
              <td class="text-center py-2">語音回放</td>
              <td class="text-center py-2">語音內容</td>
            </tr>
          </thead>
          <tbody>
            <template
              v-if="
                !radioDataFilter.length &&
                !startDateFormatted &&
                !endDateFormatted &&
                !insertKeyword
              "
            >
              <tr>
                <td class="text-center py-2" colspan="3">尚無資料</td>
              </tr>
            </template>
            <template v-else-if="!radioDataFilter.length">
              <tr>
                <td class="text-center py-2" colspan="3">查無資料</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(item, i) in radioDataFilter" :key="i">
                <td class="text-center py-2">{{ item.time }}</td>
                <td class="text-center py-2">
                  <i class="icon-video-square fs-3 cursor-pointer">
                    <i class="path1"></i>
                    <i class="path2"></i>
                  </i>
                </td>
                <td
                  class="py-2"
                  v-html="highlightText(item.text)"
                  :id="'match-' + i"
                ></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

thead {
  position: sticky;
  top: 0;
  background: $white;
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: $gray-100;
  }
}

tr {
  border-bottom: 1px solid $gray-100;
}

.input-gray-disabled {
  color: $gray-400;
}
.input-gray {
  color: $gray-600;
}
</style>
