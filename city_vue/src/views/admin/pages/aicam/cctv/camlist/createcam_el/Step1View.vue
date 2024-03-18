<!-- 步驟1建立攝影機資料 -->
<script>
// import axios from "axios";
import { mapState, mapActions } from "pinia";
import cameraStore from "@/stores/cameraStore";

export default {
  props: ["stepAdd"],
  data() {
    return {
      // editDataTmp2: {},
      // 編輯時匯入的該筆資料
      editDataTmp: {
        cctvPlace: "",
        cctvName: "",
        cctvIp: "",
        cctvPort: "",
        cctvChannel: "",
        cctvConnectAccount: "",
        cctvConnectPw: "",
        cctvNote: "",
      },
    };
  },
  computed: {
    ...mapState(cameraStore, ["camList"]),
  },
  methods: {
    ...mapActions(cameraStore, ["getCamList", "splitRtsp"]),
    // 自訂驗證
    startsRules(value) {
      if (!value) {
        return "必填";
      } else if (value.charAt(0) !== "/") {
        return "開頭必須要是半形 / 符號";
      }
      return true;
    },
    ipRules(value) {
      // 必填
      if (!value || value.length === 0) {
        return "必填";
      }
      // 第一個字元必須是數字
      if (!/^\d/.test(value)) {
        return "格式錯誤，請填寫 IP 位址";
      }
      return true;
    },
    // 送出表單
    formSubmit(value) {
      // console.log("value", value);

      if (value.cctvNote === undefined) {
        value.cctvNote = "";
      }

      // 資料往外層送
      this.$emit("step1DataTmpSave", value);

      this.stepAdd(2);
    },
  },
  mounted() {
    // 匯入原本內容
    const vm = this;
    // 所有網址參數
    const queryParams = this.$route.query;
    const paramValue = queryParams.id;
    if (paramValue) {
      // 該筆資料修改
      vm.camList.forEach((item) => {
        if (Number(item.id) == Number(paramValue)) {
          vm.editDataTmp.cctvPlace = item.camera_place;
          vm.editDataTmp.cctvName = item.camera_name;
          vm.editDataTmp.cctvIp = vm.splitRtsp(item.rtsp_url, 3);
          vm.editDataTmp.cctvPort = vm.splitRtsp(item.rtsp_url, 4);
          vm.editDataTmp.cctvChannel = "/" + vm.splitRtsp(item.rtsp_url, 5);
          vm.editDataTmp.cctvConnectAccount = vm.splitRtsp(item.rtsp_url, 1);
          vm.editDataTmp.cctvConnectPw = vm.splitRtsp(item.rtsp_url, 2);
          vm.editDataTmp.cctvNote = item.note;
        }
      });
    }
  },
};
</script>

<template>
  <div id="cctvData" class="p-4 bg-white text-black rounded-3 mx-4">
    <div class="mb-3">
      <span id="setCctvSubtitle" class="fs-5 pe-2">請輸入攝影機資料</span>
      <span class="text-gray-600">(步驟1/3)</span>
    </div>
    <div class="d-flex flex-column flex-lg-row">
      <div class="w-100">
        <VForm @submit="formSubmit">
          <div class="d-flex flex-wrap row">
            <div class="pe-md-1 col-12 col-md-6">
              <label for="cctvPlace" class="form-label mb-0"
                >攝影機所在區域</label
              >
              <VField
                name="cctvPlace"
                class="form-select doubleFormWidth"
                rules="required"
                as="select"
                v-model="editDataTmp.cctvPlace"
              >
                <option disabled selected value="">請選擇</option>
                <option value="出境大廳">出境大廳</option>
                <option value="安檢管制區">安檢管制區</option>
                <option value="移動巡檢">移動巡檢</option>
                <option value="施工區">施工區</option>
                <option value="AMR機器人">AMR機器人</option>
              </VField>

              <div class="text-end">
                <ErrorMessage name="cctvPlace" class="text-danger">
                  <div class="text-danger">必填</div>
                </ErrorMessage>
              </div>
            </div>

            <div class="ps-md-1 col-12 col-md-6">
              <label for="cctvName" class="form-label mb-0">攝影機名稱</label>
              <VField
                class="form-control form-control-setting"
                id="cctvName"
                name="cctvName"
                type="text"
                rules="required"
                placeholder="請輸入(最多輸入20個字)"
                maxlength="20"
                v-model="editDataTmp.cctvName"
              />
              <div class="text-end">
                <ErrorMessage name="cctvName" class="text-danger">
                  <div class="text-danger">必填</div>
                </ErrorMessage>
              </div>
            </div>
          </div>

          <div class="text-danger mb-3">
            提醒您~同區域攝影機人流量，系統將綜合判斷!!
          </div>

          <div class="d-flex flex-wrap row">
            <div class="pe-md-1 mb-3 col-12 col-md-6">
              <label for="cctvIp" class="form-label mb-0">RTSP IP位址</label>
              <VField
                class="form-control form-control-setting"
                id="cctvIp"
                name="cctvIp"
                type="text"
                :rules="ipRules"
                placeholder="請輸入"
                v-model="editDataTmp.cctvIp"
              />
              <div class="text-end">
                <ErrorMessage name="cctvIp" class="text-danger" />
              </div>
            </div>

            <div class="ps-md-1 mb-3 col-12 col-md-6">
              <label for="cctvPort" class="form-label mb-0">通訊埠(Port)</label>
              <VField
                class="form-control form-control-setting"
                id="cctvPort"
                name="cctvPort"
                type="number"
                min="0"
                rules="required"
                placeholder="請輸入"
                v-model="editDataTmp.cctvPort"
              />
              <div class="text-end">
                <ErrorMessage name="cctvPort" class="text-danger">
                  <div class="text-danger">必填</div>
                </ErrorMessage>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="cctvChannel" class="form-label mb-0"
              >RTSP 頻道或參數</label
            >
            <VField
              class="form-control form-control-setting doubleFormWidth"
              id="cctvChannel"
              name="cctvChannel"
              type="text"
              :rules="startsRules"
              placeholder="請輸入"
              v-model="editDataTmp.cctvChannel"
            />
            <div class="text-end">
              <ErrorMessage name="cctvChannel" class="text-danger" />
            </div>
          </div>

          <div class="d-flex flex-wrap row">
            <div class="pe-md-1 mb-3 col-12 col-md-6">
              <label for="cctvConnectAccount" class="form-label mb-0"
                >連線帳號</label
              >
              <VField
                class="form-control form-control-setting"
                id="cctvConnectAccount"
                name="cctvConnectAccount"
                type="text"
                placeholder="請輸入(若無可不填)"
                v-model="editDataTmp.cctvConnectAccount"
              />
              <div class="text-end">
                <ErrorMessage name="cctvConnectAccount" class="text-danger">
                  <div class="text-danger">必填</div>
                </ErrorMessage>
              </div>
            </div>

            <div class="ps-md-1 mb-3 col-12 col-md-6">
              <label for="cctvConnectPw" class="form-label mb-0"
                >連線密碼</label
              >
              <VField
                class="form-control form-control-setting"
                id="cctvConnectPw"
                name="cctvConnectPw"
                type="text"
                placeholder="請輸入(若無可不填)"
                v-model="editDataTmp.cctvConnectPw"
              />
              <div class="text-end">
                <ErrorMessage name="cctvConnectPw" class="text-danger">
                  <div class="text-danger">必填</div>
                </ErrorMessage>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="cctvNote" class="form-label mb-0">備註說明</label>
            <VField
              class="form-control form-control-setting doubleFormWidth"
              id="cctvNote"
              name="cctvNote"
              type="text"
              placeholder="請輸入(非必填)"
              v-model="editDataTmp.cctvNote"
            />
            <div class="text-end">
              <ErrorMessage name="cctvNote" class="text-danger">
                <div class="text-danger">必填</div>
              </ErrorMessage>
            </div>
          </div>

          <!-- 上一頁按鈕 -->
          <RouterLink to="setting">
            <div
              id="backCctvData"
              class="text-primary text-center d-inline-block cursor-pointer"
              style="padding: 6px 12px; width: 110px"
            >
              取消
            </div>
          </RouterLink>
          <!-- 繼續按鈕 -->
          <button
            type="submit"
            id="finCctvData"
            class="btn btn-primary"
            style="width: 110px"
          >
            繼續
          </button>
        </VForm>
      </div>
      <div class="w-100">
        <img src="@/assets/img/rtsp.svg" alt="rtsp說明" class="m-2" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";
.text-gray-600 {
  color: $gray-600;
}
</style>
