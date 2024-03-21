<!-- 步驟2選擇攝影機名稱的辨識項目 -->
<script>
import axios from "axios";
import { verifyToken } from "@/utils/verify";
import { frigateStats } from "@/utils/frigateStats";
import { mapState } from "pinia";
import cameraStore from "@/stores/cameraStore";

import FlowPeople from "./FlowPeople.vue";
import AgeSex from "./AgeSex.vue";
import RemnantsStuff from "./RemnantsStuff.vue";
import ConstructionSafety from "./ConstructionSafety.vue";
import NoneCondition from "./NoneCondition.vue";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  props: ["stepAdd", "step1DataTmp", "camIdSet", "camId"],
  data() {
    return {
      // 攝影機方案選項
      camPlan: "",
      // 攝影機該方案辨識項目
      camPlanSelectedItems: [],
      // Frigate 讀取的項目中英對照
      // objectsTrack: {
      //   手機: "cell phone",
      //   小型手冊: "book",
      //   行李箱: "backpack",
      //   後背包: "backpack",
      //   側背包: "bag",
      //   手拿包: "handbag",
      //   公事包: "suitcase",
      //   箱子: "box",
      //   雨傘: "umbrella",
      //   煙霧: "smoke",
      //   火: "fire",
      //   安全帽: "Hardhat",
      //   反光背心: "Safety Vest",
      // },

      // 送出內容，各項目數字選項
      alertMinute: "",
      dangerMinute: "",
      carPlate: "",
      remnantsMinute: "",

      // 步驟1組合的資料
      rtspfull: "",

      // 是否有參數，有的話是編輯
      paramValue: "",

      // 建立 Frigate 攝影機時，Frigate 重啟中
      reinsert: false,

      // 繼續按鈕 spinner
      nextBool: true,

      // 編輯時暫存
      // 人流分鐘數
      edit_crowdedset_attention_minutes: "",
      edit_crowdedset_warn_minutes: "",
      // 民眾路倒分鐘數
      edit_remnantsset_warn_minutes: "",
      // 愛心車號
      edit_carnumberset_car_numbers: "",
      // 工地安全勾選項目
      edit_construction_safety: [],
      // 民眾路倒勾選項目
      edit_remnants_stuff: [],
    };
  },
  computed: {
    ...mapState(cameraStore, ["camList"]),
  },
  methods: {
    // 建立攝影機到資料表
    async insertCamData() {
      console.log("建立攝影機到資料表");
      const vm = this;

      // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      const data = new FormData();

      data.append("camera_place", vm.step1DataTmp.cctvPlace);
      data.append("camera_name", vm.step1DataTmp.cctvName);
      data.append("rtsp_url", vm.rtspfull);
      data.append("note", vm.step1DataTmp.cctvNote);
      data.append("recognition", vm.camPlan);
      // 只有 民眾路倒/工地安全 兩種有勾選框
      if (vm.camPlan === "民眾路倒" || vm.camPlan === "工地安全") {
        data.append("is_checked", JSON.stringify(vm.camPlanSelectedItems));
      } else if (vm.camPlan === "火焰煙霧") {
        data.append("is_checked", JSON.stringify(["安全帽"]));
      } else {
        vm.camPlanSelectedItems = [];
        data.append("is_checked", JSON.stringify(vm.camPlanSelectedItems));
      }

      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      // console.log(vm.step1DataTmp.cctvPlace);
      // console.log(vm.step1DataTmp.cctvName);
      // console.log(vm.rtspfull);
      // console.log(vm.step1DataTmp.cctvNote);
      // console.log(apiserver);

      const config = {
        method: "POST",
        url: `${apiserver}/tpefunction/camera`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      return await axios(config)
        .then((res) => {
          // console.log(res);
          // 回給我攝影機的id，送到外層公用
          vm.camIdSet(res.data.data);

          return true;
        })
        .catch((err) => {
          console.log(err.response);
          return false;
        });
    },
    // 修改攝影機到資料表
    async editCamData() {
      // console.log("修改攝影機到資料表");
      const vm = this;

      // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      const data = new FormData();

      data.append("id", vm.paramValue);
      data.append("camera_place", vm.step1DataTmp.cctvPlace);
      data.append("camera_name", vm.step1DataTmp.cctvName);
      data.append("rtsp_url", vm.rtspfull);
      data.append("note", vm.step1DataTmp.cctvNote);
      data.append("recognition", vm.camPlan);
      // 只有 民眾路倒/工地安全 兩種有勾選框
      if (vm.camPlan === "民眾路倒" || vm.camPlan === "工地安全") {
        data.append("is_checked", JSON.stringify(vm.camPlanSelectedItems));
      } else if (vm.camPlan === "火焰煙霧") {
        data.append("is_checked", JSON.stringify(["安全帽"]));
      } else {
        vm.camPlanSelectedItems = [];
        data.append("is_checked", JSON.stringify(vm.camPlanSelectedItems));
      }

      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const config = {
        method: "PATCH",
        url: `${apiserver}/tpefunction/camera`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      return await axios(config)
        .then((res) => {
          console.log(res);
          // 回給我攝影機的id，送到外層公用
          vm.camIdSet(res.data.data);

          return true;
        })
        .catch((err) => {
          console.log(err.response);
          return false;
        });
    },
    // 設定 Frigate config 檔
    async setFrigateConf() {
      const vm = this;

      // 驗證
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      const data = new FormData();
      data.append("cameraName", vm.camId);
      data.append("inputsPath", vm.rtspfull);
      data.append("inputArgs", "preset-rtsp-restream");
      // 轉換成英文再放入 Frigate

      data.append("objectsTrack", JSON.stringify(vm.camPlanSelectedItems));
      // data.append("objectsTrack", JSON.stringify(vm.translatedObjects()));

      const config = {
        method: "POST",
        url: "./editCamConf",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      return await axios(config)
        .then((res) => {
          console.log(res);
          return true;
        })
        .catch((err) => {
          console.log(err.response);
          alert("Frigate 執行失敗，請稍後再試！");
          return false;
        });
    },
    // // 辨識項目轉換成英文
    // translatedObjects() {
    //   const vm = this;
    //   const translatedArray = vm.camPlanSelectedItems.map(
    //     (item) => vm.objectsTrack[item]
    //   );
    //   return translatedArray;
    // },
    // 按下繼續，送出的是使用者選取的辨識項目API
    async formSubmit(value) {
      const vm = this;
      vm.nextBool = false;
      console.log("value", value);

      // 這裡先判斷若undefined要改成空值
      if (vm.step1DataTmp.cctvConnectAccount == undefined) {
        vm.$emit("setTmp", "account");
      }
      if (vm.step1DataTmp.cctvConnectPw == undefined) {
        vm.$emit("setTmp", "pw");
      }

      // 選取內容設到變數
      if (value.camPlan === "火焰煙霧") {
        // 分鐘數
        vm.alertMinute = vm.$refs.refFlowPeople.alertNumber;
        vm.dangerMinute = vm.$refs.refFlowPeople.dangerNumber;
      } else if (value.camPlan === "淹水偵測") {
        // 愛心車號
        vm.carPlate = vm.$refs.refAgeSex.carNumber;
      } else if (value.camPlan === "民眾路倒") {
        // 分鐘數
        vm.remnantsMinute = vm.$refs.refRemnantsStuff.remnantsNumber;

        vm.$refs.refRemnantsStuff.getSelectedItems();
        vm.camPlanSelectedItems = vm.$refs.refRemnantsStuff.selectedItems;
      } else if (value.camPlan === "工地安全") {
        vm.$refs.refConstructionSafety.getSelectedItems();
        vm.camPlanSelectedItems = vm.$refs.refConstructionSafety.selectedItems;
      }

      // 重組資料
      // rtsp://admin:ms123456@192.168.50.129:554/ch_103
      vm.rtspfull = `rtsp://${
        vm.step1DataTmp.cctvConnectAccount != ""
          ? vm.step1DataTmp.cctvConnectAccount + ":"
          : ""
      }${
        vm.step1DataTmp.cctvConnectPw != ""
          ? vm.step1DataTmp.cctvConnectPw + "@"
          : ""
      }${vm.step1DataTmp.cctvIp}:${vm.step1DataTmp.cctvPort}${
        vm.step1DataTmp.cctvChannel
      }`;
      console.log(vm.step1DataTmp.cctvConnectAccount);
      console.log(vm.step1DataTmp.cctvConnectPw);
      console.log(vm.rtspfull);

      // 確認 Frigate 有無正常運作
      const isFrigateRunning = await frigateStats();

      if (isFrigateRunning) {
        let sendCamData;
        if (vm.paramValue || vm.reinsert) {
          // 修改攝影機
          sendCamData = await vm.editCamData();
        } else {
          // 新增攝影機
          // 先送到資料表，取得的資料表 id 再當作 cameraName
          sendCamData = await vm.insertCamData();
        }

        // 如果傳送值發現攝影機重複，要擋掉
        if (sendCamData) {
          // 檢查目前選項，有需要輸入數值參數的，放到各別資料表
          if (value.camPlan === "火焰煙霧") {
            await vm.flowPeopleAjax();
          } else if (value.camPlan === "淹水偵測") {
            await vm.ageSexAjax();
          } else if (value.camPlan === "民眾路倒") {
            await vm.remnantsAjax();
          }

          // 還原按鈕
          vm.nextBool = true;
          vm.$router.push("setting");

          // 以下改以後端傳送
          // // 送資料到 Frigate
          // let settingFrigateBool = await vm.setFrigateConf();

          // if (settingFrigateBool) {
          //   vm.reinsert = false;

          //   // 還原按鈕
          //   vm.nextBool = true;
          //   // 下一步驟
          //   vm.stepAdd(3);
          // } else if (!vm.paramValue) {
          //   // Frigate 打 API 失敗，因為已新增至資料表，下次直接走修改流程
          //   vm.reinsert = true;
          // }
        } else {
          alert("攝影機名稱不可重複！");
          // 還原按鈕
          vm.nextBool = true;
        }
      } else {
        alert("其他攝影機正在重啟中，請稍後再試！");
        // 還原按鈕
        vm.nextBool = true;
      }
    },
    // 火焰煙霧資料表
    async flowPeopleAjax() {
      const vm = this;
      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      console.log("vm.camId");
      console.log(vm.camId);
      console.log(typeof vm.camId);
      console.log("vm.alertMinute");
      console.log(vm.alertMinute);
      console.log(typeof vm.alertMinute);
      console.log("vm.dangerMinute");
      console.log(vm.dangerMinute);
      console.log(typeof vm.dangerMinute);

      const data = new FormData();
      data.append("camera_id", vm.camId);
      data.append("attention_minutes", vm.alertMinute);
      data.append("warn_minutes", vm.dangerMinute);

      const config = {
        method: "POST",
        url: `${apiserver}/tpefunction/crowdedset`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      return await axios(config)
        .then((res) => {
          console.log(res);
          return true;
        })
        .catch((err) => {
          console.log(err.response);
          return false;
        });
    },
    // 愛心車號資料表
    async ageSexAjax() {
      const vm = this;
      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const data = new FormData();
      data.append("camera_id", vm.camId);
      data.append("car_number", vm.carPlate);

      const config = {
        method: "POST",
        url: `${apiserver}/tpefunction/carnumberset`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      return await axios(config)
        .then((res) => {
          console.log(res);
          return true;
        })
        .catch((err) => {
          console.log(err.response);
          return false;
        });
    },
    // 民眾路倒資料表
    async remnantsAjax() {
      const vm = this;
      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      const data = new FormData();
      data.append("camera_id", vm.camId);
      data.append("warn_minutes", vm.remnantsMinute);

      const config = {
        method: "POST",
        url: `${apiserver}/tpefunction/remnantset`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      return await axios(config)
        .then((res) => {
          console.log(res);
          return true;
        })
        .catch((err) => {
          console.log(err.response);
          return false;
        });
    },
  },
  components: {
    FlowPeople,
    AgeSex,
    RemnantsStuff,
    ConstructionSafety,
    NoneCondition,
  },
  mounted() {
    // 匯入原本內容
    const vm = this;
    // 所有網址參數
    const queryParams = this.$route.query;
    const paramValue = queryParams.id;
    vm.paramValue = paramValue;
    if (paramValue) {
      // 該筆資料修改
      vm.camList.forEach((item) => {
        if (Number(item.id) == Number(paramValue)) {
          console.log("該筆資料修改");
          console.log(item);
          console.log(item.recognition);

          vm.camPlan = item.recognition;
          vm.camPlanSelectedItems = item.is_checked;
          if (vm.camPlan == "工地安全") {
            vm.edit_construction_safety = vm.camPlanSelectedItems;
          } else if (vm.camPlan == "民眾路倒") {
            vm.edit_remnants_stuff = vm.camPlanSelectedItems;
          }

          // 各細項修改
          vm.edit_crowdedset_attention_minutes =
            item.crowdedset_attention_minutes;
          vm.edit_crowdedset_warn_minutes = item.crowdedset_warn_minutes;
          vm.edit_remnantsset_warn_minutes = item.remnantsset_warn_minutes;
          vm.edit_carnumberset_car_numbers = item.carnumberset_car_numbers;
        }
      });
    }
  },
};
</script>

<template>
  <div id="cctvIdentifyItem" class="p-4">
    <VForm @submit="formSubmit">
      <div class="mb-3">
        <span class="fs-5 pe-2">
          選擇
          <span class="customCamName text-primary">攝影機名稱</span>
          的辨識項目
        </span>
        <span class="text-gray-600">(步驟2/2)</span><br />
      </div>

      <!-- 方案選擇 -->
      <div>
        <VField
          type="radio"
          name="camPlan"
          id="personPlan"
          class="personPlan d-none"
          value="火焰煙霧"
          rules="required"
          v-model="camPlan"
        />
        <label for="personPlan" class="d-inline-block m-1 cursor-pointer">
          <i
            id="identification1"
            :class="
              camPlan == '火焰煙霧'
                ? 'icon-identification1-check'
                : 'icon-identification1-deauflt'
            "
            style="font-size: 148px"
          >
            <i class="path1"></i>
            <i class="path2"></i>
            <i class="path3"></i>
          </i>
        </label>

        <VField
          type="radio"
          name="camPlan"
          id="agePlan"
          class="agePlan d-none"
          value="淹水偵測"
          rules="required"
          v-model="camPlan"
        />
        <label for="agePlan" class="d-inline-block m-1 cursor-pointer">
          <i
            id="identification2"
            :class="
              camPlan == '淹水偵測'
                ? 'icon-identification2-check'
                : 'icon-identification2-deauflt'
            "
            style="font-size: 148px"
          >
            <i class="path1"></i>
            <i class="path2"></i>
            <i class="path3"></i>
          </i>
        </label>

        <VField
          type="radio"
          name="camPlan"
          id="remnantsPlan"
          class="remnantsPlan d-none"
          value="民眾路倒"
          rules="required"
          v-model="camPlan"
        />
        <label for="remnantsPlan" class="d-inline-block m-1 cursor-pointer">
          <i
            id="identification3"
            :class="
              camPlan == '民眾路倒'
                ? 'icon-identification3-check'
                : 'icon-identification3-deauflt'
            "
            style="font-size: 148px"
          >
            <i class="path1"></i>
            <i class="path2"></i>
            <i class="path3"></i>
          </i>
        </label>

        <!-- <VField
          type="radio"
          name="camPlan"
          id="constructionPlan"
          class="constructionPlan d-none"
          value="工地安全"
          rules="required"
          v-model="camPlan"
        />
        <label for="constructionPlan" class="d-inline-block m-1 cursor-pointer">
          <i
            id="identification4-deauflt"
            :class="
              camPlan == '工地安全'
                ? 'icon-identification4-check'
                : 'icon-identification4-deauflt'
            "
            style="font-size: 148px"
          >
            <i class="path1"></i>
            <i class="path2"></i>
            <i class="path3"></i>
            <i class="path4"></i>
          </i>
        </label>

        <VField
          type="radio"
          name="camPlan"
          id="nonePlan"
          class="nonePlan d-none"
          value="無"
          rules="required"
          v-model="camPlan"
        />
        <label for="nonePlan" class="d-inline-block m-1 cursor-pointer">
          <i
            id="identification5-deauflt"
            :class="
              camPlan == '無'
                ? 'icon-identification5-check'
                : 'icon-identification5-deauflt'
            "
            style="font-size: 148px"
          >
            <i class="path1"></i>
            <i class="path2"></i>
            <i class="path3"></i>
            <i class="path4"></i>
          </i>
        </label> -->

        <ErrorMessage name="camPlan" class="text-danger">
          <div class="text-danger">必填</div>
        </ErrorMessage>

        <!-- 條件：火焰煙霧 -->
        <div
          class="condition-area p-3 mt-2 rounded-1"
          v-if="camPlan == '火焰煙霧'"
        >
          <FlowPeople
            ref="refFlowPeople"
            :edit_crowdedset_attention_minutes="
              edit_crowdedset_attention_minutes
            "
            :edit_crowdedset_warn_minutes="edit_crowdedset_warn_minutes"
          ></FlowPeople>
        </div>

        <!-- 條件：淹水偵測 -->
        <div
          class="condition-area p-3 mt-2 rounded-1"
          v-if="camPlan == '淹水偵測'"
        >
          <AgeSex
            ref="refAgeSex"
            :edit_carnumberset_car_numbers="edit_carnumberset_car_numbers"
          ></AgeSex>
        </div>

        <!-- 條件：民眾路倒 -->
        <div
          class="condition-area p-3 mt-2 rounded-1"
          v-if="camPlan == '民眾路倒'"
        >
          <RemnantsStuff
            ref="refRemnantsStuff"
            :edit_remnantsset_warn_minutes="edit_remnantsset_warn_minutes"
            :edit_remnants_stuff="edit_remnants_stuff"
          ></RemnantsStuff>
        </div>

        <!-- 條件：工地安全 -->
        <div
          class="condition-area p-3 mt-2 rounded-1"
          v-if="camPlan == '工地安全'"
        >
          <ConstructionSafety
            ref="refConstructionSafety"
            :edit_construction_safety="edit_construction_safety"
          ></ConstructionSafety>
        </div>

        <!-- 條件：無 -->
        <div class="condition-area p-3 mt-2 rounded-1" v-if="camPlan == '無'">
          <NoneCondition></NoneCondition>
        </div>
      </div>

      <div class="d-flex flex-wrap py-3">
        <!-- 上一頁按鈕 -->
        <div
          id="backCctvData"
          class="text-primary text-center d-inline-block cursor-pointer"
          style="padding: 6px 12px; width: 110px"
          @click="stepAdd(1)"
        >
          上一步驟
        </div>
        <!-- 繼續按鈕 -->
        <button
          type="submit"
          id="finIdentifyItem"
          class="btn btn-primary"
          v-show="nextBool"
          style="width: 110px"
        >
          繼續
        </button>
        <button
          type="button"
          class="btn btn-primary"
          disabled
          v-show="!nextBool"
          style="width: 110px"
        >
          <div class="spinner-border text-white" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </button>
      </div>
    </VForm>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

.text-gray-600 {
  color: $gray-600;
}

.condition-area {
  background: tint-color($gray-100, 70%);
}
</style>
