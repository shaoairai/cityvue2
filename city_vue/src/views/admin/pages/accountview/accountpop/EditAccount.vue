<script>
// import { Form } from 'vee-validate';
import axios from "axios";
import { verifyToken } from "@/utils/verify";

import { Modal } from "bootstrap";
import EditFinishpop from "@/components/pops/adminview/general/EditFinishpop.vue";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  props: ["camList"],
  data() {
    return {
      token: "",
      refresh: "",
      // 此帳號 id
      thisId: "",
      // 姓名
      name: "",
      // 電話
      phone: "",
      // 信箱
      email: "",
      // 送出按鈕
      editCheck: true,
      // 重設按鈕
      resetCheck: true,
      // pop
      editAccountPopModal: "",
      agreePopModal: "",
      // 身分
      type: "admin",
      // 頁面權限
      allCheckboxChecked: false,
      checkboxes: [
        { id: "overviewPage", label: "總覽", checked: false },
        { id: "mapviewPage", label: "即時定位地圖", checked: false },
        { id: "livePage", label: "即時影像", checked: false },
        { id: "aireportsviewPage", label: "AI 統計報表", checked: false },
        { id: "notifyviewPage", label: "通報紀錄", checked: false },
        { id: "cameraviewPage", label: "攝影機設定", checked: false },
        { id: "accountviewPage", label: "帳號權限設定", checked: false },
      ],
      // 最終選擇
      selectedItems: [],
      // 攝影機接收通知
      allCheckboxChecked_cam: false,
      checkboxes_cam: [],
      // 攝影機通知最終選擇
      selectedItems_cam: [],
    };
  },
  watch: {
    type() {
      this.switchType();
    },
    camList() {
      const vm = this;
      // 先清空
      vm.checkboxes_cam = [];
      // 重新放入
      vm.camList.forEach((item) => {
        const obj = {
          id: item.id,
          label: item.camera_name,
          checked: false,
        };
        vm.checkboxes_cam.push(obj);
      });
    },
  },
  methods: {
    // 修改
    async formSubmit() {
      const vm = this;
      const apiserver = document
        .querySelector("#apiserver")
        .getAttribute("data-api");

      // 驗證
      const hasToken = await verifyToken();
      if (!hasToken) {
        alert("請重新登入！");
        vm.logout();
      }

      // 按鈕不可按
      vm.editCheck = false;
      const data = new FormData();
      data.append("account", vm.email);
      data.append("name", vm.name);
      data.append("phone", vm.phone);
      data.append("type", vm.type);
      data.append(
        "permissions",
        vm.selectedItems.length != 0
          ? vm.selectedItems.join(",")
          : vm.selectedItems
      );
      data.append(
        "notify",
        vm.selectedItems_cam.length != 0
          ? vm.selectedItems_cam.join(",")
          : vm.selectedItems_cam
      );
      const config = {
        method: "PATCH",
        url: `${apiserver}/member/account`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      axios(config)
        .then((res) => {
          console.log(res);
          // 隱藏 Modal
          vm.editAccountPopModal.hide();
          // 恢復按鈕
          vm.editCheck = true;
          // 重設表單
          vm.$refs.createAccountForm.resetForm();
          // 勾選框初始化
          vm.allCheckboxChecked = false;
          vm.allCheckboxChecked_cam = false;
          vm.toggleAllCheckboxes();
          vm.toggleAllCheckboxes_cam();
          // 重讀資料
          vm.$emit("getAccountData");

          // 如果是修改自己的權限，要重新整理
          if (vm.email == localStorage.getItem("account")) {
            vm.$router.go(0);
          } else {
            // 修改成功
            vm.$refs.refEditFinishpop.showModal();
          }
        })
        .catch((err) => {
          // 修改失敗
          console.log(err.response);
          alert("修改失敗，請稍後再試");
          // 恢復按鈕
          vm.editCheck = true;
        });
    },
    showModal(thisData) {
      const vm = this;
      // 該帳號參數放入表格
      vm.thisId = thisData.id;
      vm.email = thisData.account;
      vm.name = thisData.name;
      vm.phone = thisData.phone;
      vm.type = thisData.type;
      vm.selectedItems_cam = thisData.notify;
      vm.selectedItems = thisData.permissions;
      // 該帳號勾選框
      vm.settingCheckboxes();
      vm.settingCheckboxes_cam();
      // 是否能勾帳號權限
      vm.switchType();
      this.editAccountPopModal = new Modal("#editAccountPop");
      this.editAccountPopModal.show();
    },
    hideModal() {
      this.editAccountPopModal.hide();
    },
    showAgreeModal() {
      this.hideModal();
      this.agreePopModal = new Modal("#agreePop");
      this.agreePopModal.show();
    },
    hideAgreeModal() {
      this.agree = "";
      this.agreePopModal.hide();
      this.showModal();
    },
    hideAgreeModalAgree() {
      this.agree = "agree";
      this.agreePopModal.hide();
      this.showModal();
    },
    // 電話號碼驗證
    phoneRequired(value) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!value || value === "") {
        return "必填";
      } else {
        return phoneRegex.test(value) ? true : "請輸入有效的電話號碼";
      }
    },
    // 頁面權限
    // 切換"全部"按鈕
    toggleAllCheckboxes() {
      this.checkboxes.forEach((checkbox) => {
        checkbox.checked = this.allCheckboxChecked;
      });
      // 更新最終選擇
      this.getSelectedItems();
    },
    // 切換"全部"以外的按鈕
    updateChecked(clickedCheckbox) {
      if (clickedCheckbox.id === "all") {
        // 如果點擊的是「全部」，則勾選/取消所有其他選項
        this.checkboxes.forEach((checkbox) => {
          checkbox.checked = this.allCheckboxChecked;
        });
      } else {
        // 如果是其他選項打勾 or 不勾
        this.allCheckboxChecked = this.checkboxes.every(
          (checkbox) => checkbox.checked
        );
      }
      // 更新最終選擇
      this.getSelectedItems();
    },
    // 取得最終使用者選的項目陣列
    getSelectedItems() {
      const selectedItems = this.checkboxes
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.label);
      console.log("使用者選中的項目:", selectedItems);
      this.selectedItems = selectedItems;
    },
    // 攝影機接收
    // 切換"全部"按鈕
    toggleAllCheckboxes_cam() {
      this.checkboxes_cam.forEach((checkbox) => {
        checkbox.checked = this.allCheckboxChecked_cam;
      });
      // 更新最終選擇
      this.getSelectedItems_cam();
    },
    // 切換"全部"以外的按鈕
    updateChecked_cam(clickedCheckbox) {
      if (clickedCheckbox.id === "all_cam") {
        // 如果點擊的是「全部」，則勾選/取消所有其他選項
        this.checkboxes_cam.forEach((checkbox) => {
          checkbox.checked = this.allCheckboxChecked_cam;
        });
      } else {
        // 如果是其他選項打勾 or 不勾
        this.allCheckboxChecked_cam = this.checkboxes_cam.every(
          (checkbox) => checkbox.checked
        );
      }
      // 更新最終選擇
      this.getSelectedItems_cam();
    },
    // 取得最終使用者選的項目陣列
    getSelectedItems_cam() {
      const selectedItems_cam = this.checkboxes_cam
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.label);
      // console.log("使用者選中的項目:", selectedItems_cam);
      this.selectedItems_cam = selectedItems_cam;
    },
    // 該帳號內容設定回 checkboxes
    settingCheckboxes() {
      const vm = this;
      if (vm.selectedItems) {
        vm.checkboxes.forEach((checkbox) => {
          checkbox.checked = vm.selectedItems.includes(checkbox.label);
        });
        // 如果全勾，則"全部"要勾選
        const allChecked = vm.checkboxes.every((checkbox) => checkbox.checked);
        vm.allCheckboxChecked = allChecked;
      }
    },
    settingCheckboxes_cam() {
      const vm = this;
      if (vm.selectedItems_cam) {
        vm.checkboxes_cam.forEach((checkbox_cam) => {
          checkbox_cam.checked = vm.selectedItems_cam.includes(
            checkbox_cam.label
          );
        });
        // 如果全勾，則"全部"要勾選
        const allChecked_cam = vm.checkboxes_cam.every(
          (checkbox_cam) => checkbox_cam.checked
        );
        vm.allCheckboxChecked_cam = allChecked_cam;
      }
    },
    // 切換權限，對應 checkbox
    switchType() {
      const vm = this;
      const targetId = "accountviewPage";
      const targetIndex = vm.checkboxes.findIndex(
        (item) => item.id === targetId
      );
      if (vm.type !== "admin" && targetIndex !== -1) {
        vm.checkboxes.splice(targetIndex, 1);
      } else if (vm.type === "admin" && targetIndex === -1) {
        vm.checkboxes.push({
          id: targetId,
          label: "帳號權限設定",
          checked: true,
        });
      }
      // 勾回
      vm.settingCheckboxes();
      // 最終項目調整
      vm.getSelectedItems();
    },
    // 解除帳號鎖定
    async resetLock() {
      const vm = this;

      // 驗證
      const hasToken = await verifyToken();
      if (!hasToken) {
        alert("請重新登入！");
        vm.logout();
      }

      // 按鈕不可按
      vm.resetCheck = false;

      const apiserver = document
        .querySelector("#apiserver")
        .getAttribute("data-api");

      const data = new FormData();
      data.append("account", vm.email);

      const config = {
        method: "POST",
        url: `${apiserver}/member/reset`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      axios(config)
        .then((res) => {
          console.log(res);
          // 恢復按鈕
          vm.resetCheck = true;
          // 重設成功pop
          alert("成功解除鎖定！");
        })
        .catch((err) => {
          // 重設失敗
          console.log(err.response);
          alert("重設失敗，請稍後再試");
          // 恢復按鈕
          vm.resetCheck = true;
        });
    },
  },
  components: { EditFinishpop },
  mounted() {},
};
</script>

<template>
  <div>
    <!-- Modal -->
    <div
      class="modal fade text-dark"
      id="editAccountPop"
      tabindex="-1"
      aria-labelledby="editAccountPopLabel"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
      style="--bs-modal-width: 700px"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editAccountPopLabel">編輯帳號</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <VForm ref="createAccountForm" @submit="formSubmit">
              <div class="d-flex justify-content-between align-items-end">
                <div class="d-flex flex-column me-3">
                  <div class="d-flex flex-column">
                    <label
                      for="edit_email"
                      class="form-label mb-0 px-2 gray-600"
                      style="white-space: nowrap"
                    >
                      E-mail 帳號
                    </label>
                    <VField
                      class="form-control"
                      id="edit_email"
                      name="edit_email"
                      type="email"
                      rules="email|required"
                      placeholder="請輸入"
                      v-model="email"
                      disabled
                    />
                  </div>
                  <div class="text-end mb-3">
                    <ErrorMessage name="edit_email" class="text-danger" />
                  </div>
                </div>

                <div class="mb-3">
                  <button
                    type="button"
                    class="btn btn-alert"
                    @click="resetLock"
                    v-show="resetCheck"
                  >
                    <i class="icon-x-circle"></i> 解除帳號鎖定
                  </button>
                  <button
                    type="button"
                    class="btn btn-alert w-100"
                    style="width: 141px !important"
                    disabled
                    v-show="!resetCheck"
                  >
                    <div class="spinner-border text-white" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </button>
                </div>
              </div>

              <div class="d-flex">
                <div class="d-flex flex-column me-3">
                  <div class="d-flex flex-column">
                    <label
                      for="edit_name"
                      class="form-label mb-0 px-2 gray-600"
                      style="white-space: nowrap"
                    >
                      姓名
                    </label>
                    <VField
                      class="form-control"
                      id="edit_name"
                      name="edit_name"
                      type="text"
                      rules="required"
                      placeholder="請輸入"
                      v-model="name"
                    />
                  </div>
                  <div class="text-end mb-3">
                    <ErrorMessage name="edit_name" class="text-danger">
                      <div class="text-danger">必填</div>
                    </ErrorMessage>
                  </div>
                </div>

                <div class="d-flex flex-column me-3">
                  <div class="d-flex flex-column">
                    <label
                      for="edit_phone"
                      class="form-label mb-0 px-2 gray-600"
                      style="white-space: nowrap"
                    >
                      電話
                    </label>
                    <VField
                      class="form-control"
                      id="edit_phone"
                      name="edit_phone"
                      type="text"
                      :rules="phoneRequired"
                      placeholder="請輸入"
                      v-model="phone"
                    />
                  </div>
                  <div class="text-end mb-3">
                    <ErrorMessage name="edit_phone" class="text-danger">
                      <div class="text-danger">必填</div>
                    </ErrorMessage>
                  </div>
                </div>

                <div class="d-flex flex-column opacity-0">
                  <div class="d-flex flex-column">
                    <label
                      class="form-label mb-0 px-2 gray-600"
                      style="white-space: nowrap"
                    >
                      隱藏
                    </label>
                    <input
                      class="form-control"
                      type="text"
                      placeholder="請輸入"
                    />
                  </div>
                </div>
              </div>

              <!-- 身分 -->
              <div class="py-2 d-flex flex-column">
                <h6 class="fw-bold">請勾選身份及可使用權限功能</h6>
                <div class="d-flex">
                  <div
                    class="d-flex align-items-center"
                    style="min-width: 100px"
                  >
                    <VField
                      type="radio"
                      name="edit_type"
                      id="edit_manager"
                      class="manager form-check-input"
                      value="admin"
                      rules="required"
                      v-model="type"
                    />
                    <label
                      for="edit_manager"
                      class="d-inline-block m-1 cursor-pointer"
                    >
                      管理者
                    </label>
                  </div>

                  <div
                    class="d-flex align-items-center"
                    style="min-width: 100px"
                  >
                    <VField
                      type="radio"
                      name="edit_type"
                      id="edit_user"
                      class="user form-check-input"
                      value="user"
                      rules="required"
                      v-model="type"
                    />
                    <label
                      for="edit_user"
                      class="d-inline-block m-1 cursor-pointer"
                    >
                      使用者
                    </label>
                  </div>

                  <div
                    class="d-flex align-items-center"
                    style="min-width: 100px"
                  >
                    <VField
                      type="radio"
                      name="edit_type"
                      id="edit_obuuser"
                      class="obuuser form-check-input"
                      value="obu"
                      rules="required"
                      v-model="type"
                    />
                    <label
                      for="edit_obuuser"
                      class="d-inline-block m-1 cursor-pointer"
                    >
                      OBU 使用者
                    </label>
                  </div>
                </div>
              </div>

              <!-- 頁面權限 -->
              <div class="d-flex flex-wrap">
                <div class="py-1" style="width: 160px">
                  <input
                    type="checkbox"
                    id="edit_all"
                    class="form-check-input"
                    v-model="allCheckboxChecked"
                    @change="toggleAllCheckboxes"
                  />
                  <label for="edit_all" class="ms-1">全部</label>
                </div>

                <div
                  v-for="(checkbox, index) in checkboxes"
                  :key="index"
                  class="py-1"
                  style="width: 160px"
                >
                  <input
                    type="checkbox"
                    :id="'edit_' + checkbox.id"
                    class="form-check-input"
                    name="edit_pagePermissions"
                    v-model="checkbox.checked"
                    @change="updateChecked(checkbox)"
                  />
                  <label :for="'edit_' + checkbox.id" class="ms-1">{{
                    checkbox.label
                  }}</label>
                </div>
              </div>

              <!-- 攝影機接收 -->
              <h6 class="pt-3 fw-bold">
                請勾選該人員需
                <span class="text-primary">接收即時通知</span>
                的攝影機名稱
              </h6>
              <div class="d-flex flex-wrap py-2">
                <div class="py-1" style="width: 160px">
                  <input
                    type="checkbox"
                    id="edit_all_cam"
                    class="form-check-input py-1"
                    v-model="allCheckboxChecked_cam"
                    @change="toggleAllCheckboxes_cam"
                  />
                  <label for="edit_all_cam" class="ms-1">全部</label>
                </div>

                <div
                  v-for="(checkbox, index) in checkboxes_cam"
                  :key="index"
                  style="width: 160px"
                  class="py-1"
                >
                  <input
                    type="checkbox"
                    :id="'edit_' + checkbox.id"
                    class="form-check-input"
                    name="edit_camNotify"
                    v-model="checkbox.checked"
                    @change="updateChecked_cam(checkbox)"
                  />
                  <label :for="'edit_' + checkbox.id" class="ms-1">{{
                    checkbox.label
                  }}</label>
                </div>
              </div>

              <div class="d-flex mt-3">
                <div class="w-50 pe-1">
                  <button
                    type="button"
                    class="btn btn-light w-100"
                    data-bs-dismiss="modal"
                  >
                    取消
                  </button>
                </div>
                <div class="w-50 ps-1">
                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    v-show="editCheck"
                  >
                    <span>修改</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary w-100"
                    disabled
                    v-show="!editCheck"
                  >
                    <div class="spinner-border text-white" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </button>
                </div>
              </div>
            </VForm>
          </div>
        </div>
      </div>
    </div>

    <!-- 個資 Modal -->
    <div
      class="modal fade"
      id="agreePop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="agreePopLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="agreePopLabel">
              「個人資料保護法」公開聲明內容
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              @click="hideAgreeModal"
            ></button>
          </div>
          <div class="modal-body">
            歡迎使用5G CCTV AI
            安全、營運、旅運心服務戰情室相關服務，依據個人資料保護法
            (以下稱個資法)
            第八條第一項規定，為了確保使用者之個人資料、隱私及權益之保護，當您已閱讀並同意「單位個人資料保護法告知內容」時，即表示您願意以電子文件之方式行使法律所賦予同意之權利，並具有書面同意之效果，若不同意請
            (以下為本單位依「個人資料保護法」規定，必須向您告知的各項聲明，請您務必詳閱。)
            <br /><br />
            一、 個人資料蒐集目的
            &nbsp;&nbsp;&nbsp;&nbsp;（一）系統申請時審核身份用。
            &nbsp;&nbsp;&nbsp;&nbsp;（二）上述之相關業務或其他符合營業項目所定義之工作範圍。
            <br /><br />
            二、 個人資料蒐集類別
            &nbsp;&nbsp;&nbsp;&nbsp;（一）識別類（中、英文姓名、聯絡電話號碼、電子郵遞地址、帳戶號碼與戶名。
            <br /><br />
            三、 個人資料利用之期間、地區、對象及方式
            &nbsp;&nbsp;&nbsp;&nbsp;（一）期間：利用期間為本單位或業務所必須之保存期間。
            &nbsp;&nbsp;&nbsp;&nbsp;（二）地區：您的個人資料將用於本單位提供服務之地區。
            &nbsp;&nbsp;&nbsp;&nbsp;（三）對象：本單位之共同行銷、交互運用客戶資料公司、合作推廣單位、業務往
            來機構、依法有調查權機關或監理機關。
            &nbsp;&nbsp;&nbsp;&nbsp;（四）方式：電子文件、紙本，或以自動化機器或其他非自動化之利用方式。
            <br /><br />
            四、 依據個資法第三條規定，您就本單位保有您的個人資料得行使下列權利
            &nbsp;&nbsp;&nbsp;&nbsp;（一）查詢、閱覽、複本、補充、更正、請求停止蒐集、請求停止處理、請求停止
            利用、請求刪除等權利。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="hideAgreeModal"
            >
              不同意
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="hideAgreeModalAgree"
            >
              我已詳閱並同意
            </button>
          </div>
        </div>
      </div>
    </div>

    <EditFinishpop ref="refEditFinishpop"></EditFinishpop>
  </div>
</template>

<style scoped>
.profilepop {
  top: 114px;
  right: 32px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

li {
  list-style: none;
  padding: 4px 0;
}

@media screen and (min-width: 430px) {
  .profilepop {
    top: 74px;
  }
}
</style>
