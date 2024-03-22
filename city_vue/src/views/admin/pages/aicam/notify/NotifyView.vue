<!-- <script>
export default {
  data() {
    return {
      iframeUrl:
        document.querySelector("#FRIGATEIPWEB").getAttribute("data-url") +
        "events",
    };
  },
};
</script>

<template>
  <div>
    <iframe
      :src="iframeUrl"
      frameborder="0"
      class="w-100"
      style="height: calc(100vh - 128px)"
    ></iframe>
  </div>
</template> -->

<!-- 通報紀錄頁 -->
<script>
import { verifyToken } from "@/utils/verify";
import NotifyPagination from "@/components/pagination/NotifyPagination.vue";
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
    };
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
          vm.isDateInRange(item.alert_time, item.type)
        );

        // 重讀 tooltips
        vm.$refs.refNotifyPagination.initTooltips();
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
    isDateInRange(date, type) {
      return (
        (!this.startDate || date >= this.startDateFormatted) &&
        (!this.endDate || date <= this.endDateFormatted) &&
        (this.insertType === undefined ||
          this.insertType === "" ||
          type === this.insertType)
      );
    },

    // 計算
    filteredDates() {
      this.notifyDataFilter = this.notifyDataMerged.filter((item) =>
        this.isDateInRange(item.alert_time, item.type)
      );

      // 切回第1頁
      this.$refs.refNotifyPagination.gotoPage(1);
    },

    // 重設
    resetDatas() {
      // 深層拷貝
      this.notifyDataFilter = JSON.parse(JSON.stringify(this.notifyDataMerged));
      this.startDate = "";
      this.endDate = "";
      this.startDateFormatted = "";
      this.endDateFormatted = "";
      this.insertType = "";

      // 切回第1頁
      this.$refs.refNotifyPagination.gotoPage(1);
    },
  },
  components: { NotifyPagination },
  async mounted() {
    const vm = this;
    // // token測試
    // const hasToken = await verifyToken();
    // if (!hasToken) {
    //   alert("請重新登入！");
    //   vm.logout();
    // }

    await vm.getNotifyDataPinia();

    // 取得通知log資料
    await vm.getNotifyDatasComp();

    // 深層拷貝
    vm.resetDatas();

    window.getNotifyValInterval = setInterval(vm.getNotifyDatasComp, 3000);
  },
  unmounted() {
    clearInterval(window.getNotifyValInterval);
  },
};
</script>

<template>
  <div class="content">
    <!-- <h4 class="fw-bold">通報紀錄</h4> -->
    <!-- 篩選 -->
    <div class="d-flex align-items-end mx-4 mt-3">
      <div class="me-2" style="width: 220px">
        <div>通報類型</div>
        <div>
          <select name="" id="" class="form-select" v-model="insertType">
            <option value="" selected>請選擇</option>
            <option value="火焰煙霧">火焰煙霧</option>
            <option value="淹水偵測">淹水偵測</option>
            <option value="民眾路倒">民眾路倒</option>
          </select>
        </div>
      </div>

      <div class="me-2" style="width: 220px">
        <div>開始日期/時間</div>
        <div>
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

      <button
        type="button"
        class="btn btn-primary d-flex align-items-center me-2"
        :class="{
          disabled: !(startDate && endDate) && !insertType,
        }"
        @click="filteredDates"
      >
        <i class="icon-search fs-4"></i>
        查詢
      </button>

      <button
        type="button"
        class="btn btn-light d-flex align-items-center"
        @click="resetDatas"
      >
        重設
      </button>
    </div>

    <div class="content-area rounded-3 bg-white text-black p-4 mx-4 my-3">
      <div>
        <!-- 列表+分頁 -->
        <NotifyPagination
          ref="refNotifyPagination"
          :notifyDataMerged="notifyDataMerged"
          :notifyDataFilter="notifyDataFilter"
        ></NotifyPagination>
      </div>
    </div>
  </div>
</template>
