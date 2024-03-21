<!-- 建立攝影機 -->
<script>
import Step1View from "./createcam_el/Step1View.vue";
import Step2View from "./createcam_el/Step2View.vue";

export default {
  data() {
    return {
      step: 1,
      // 步驟1的資料暫存
      step1DataTmp: "",
      // 攝影機id
      camId: "",
      // 新增或編輯的 title 文字
      action: "",
      // 修改的攝影機id
      editId: "",
    };
  },
  components: {
    Step1View,
    Step2View,
  },
  methods: {
    stepAdd(param) {
      this.step = param;
    },
    step1DataTmpSave(data) {
      this.step1DataTmp = data;
      // this.camName = data.cctvName;
      console.log("資料暫存：");
      console.log(this.step1DataTmp);
    },
    // 攝影機id
    camIdSet(camid) {
      // console.log("設定攝影機id：");
      // console.log(camid);
      this.camId = camid;
    },
    // 避免修改時變成 undefined
    setTmp(val) {
      if (val === "account") {
        this.step1DataTmp.cctvConnectAccount = "";
      } else {
        this.step1DataTmp.cctvConnectPw = "";
      }
    },
  },
  mounted() {
    const vm = this;
    // 所有網址參數
    const queryParams = this.$route.query;
    const paramValue = queryParams.id;
    // console.log(paramValue);

    vm.editId = paramValue;

    if (paramValue) {
      // 修改
      vm.action = "編輯攝影機";

      // 取得該筆所有資料暫存
    } else {
      // 新增
      vm.action = "建立攝影機";
    }
  },
};
</script>

<template>
  <div class="content">
    <h4 class="fw-bold d-none">{{ action }}</h4>
    <div class="content-area rounded-3 p-4 m-4 bg-white text-black">
      <Step1View
        :stepAdd="stepAdd"
        v-show="step === 1"
        @step1DataTmpSave="step1DataTmpSave"
      ></Step1View>
      <Step2View
        :stepAdd="stepAdd"
        :step1DataTmp="step1DataTmp"
        :camIdSet="camIdSet"
        :camId="camId"
        @setTmp="setTmp"
        v-show="step === 2"
      ></Step2View>
    </div>
  </div>
</template>

<style scoped>
.content-area {
  min-height: calc(100vh - 150px);
}
</style>
