<script>
// import { Form } from 'vee-validate';
import axios from "axios";
import { verifyToken } from "@/utils/verify";

import { Modal } from "bootstrap";
import AddFinishpop from "@/components/pops/adminview/general/AddFinishpop.vue";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  props: ["camList"],
  data() {
    return {
      token: "",
      refresh: "",
      // 姓名
      name: "",
      // 電話
      phone: "",
      // 信箱
      email: "",
      // 新密碼
      newpw: "",
      // 確認新密碼
      confirmpw: "",
      // 送出按鈕
      createCheck: true,
      // // pop
      // createAccountPopModal: "",
      // agreePopModal: "",
      // // 同意書
      // agree: "",
      // 身分
      type: "admin",
      // 頁面權限
      allCheckboxChecked: true,
      checkboxes: [
        { id: "overviewPage", label: "總覽", checked: true },
        { id: "mapviewPage", label: "即時定位地圖", checked: true },
        { id: "livePage", label: "即時影像", checked: true },
        { id: "aireportsviewPage", label: "AI 統計報表", checked: true },
        { id: "notifyviewPage", label: "通報紀錄", checked: true },
        { id: "cameraviewPage", label: "攝影機設定", checked: true },
        { id: "accountviewPage", label: "帳號權限設定", checked: true },
      ],
      // 最終選擇
      selectedItems: [],
      // 攝影機接收
      allCheckboxChecked_cam: false,
      checkboxes_cam: [],
      // 最終選擇
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
  computed: {
    // ...mapState(tokenStore, ["token", "refresh"]),
  },
  methods: {
    // 建立帳號
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
      vm.createCheck = false;
      const data = new FormData();
      data.append("account", vm.email);
      data.append("password", vm.newpw);
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
        method: "POST",
        url: `${apiserver}/member/account`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      axios(config)
        .then((res) => {
          console.log(res);
          // 恢復按鈕
          vm.createCheck = true;
          // 重設表單
          vm.$refs.createAccountForm.resetForm();
          // 勾選框初始化
          vm.allCheckboxChecked = true; // 建立帳號後的初始化是全勾選
          vm.allCheckboxChecked_cam = false;
          vm.toggleAllCheckboxes();
          vm.toggleAllCheckboxes_cam();
          // 重讀資料
          vm.$emit("getAccountData");
          // 成功彈出視窗
          vm.$refs.refAddFinishpop.showModal();
        })
        .catch((err) => {
          // 修改失敗
          console.log(err.response);
          if (err.response.data.data == "account already exists") {
            alert("帳號不可重複！");
          } else if (err.response.data.data == "name already exists") {
            alert("姓名不可重複！");
          } else {
            alert(err.response.data.data);
          }
          // 恢復按鈕
          vm.createCheck = true;
        });
    },
    // 密碼驗證
    pwRequired(value) {
      if (value === undefined || value === "") {
        return "必填";
      } else {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^=+\-_])[A-Za-z\d@$!%*?&#^=+\-_]{8,}$/;
        return passwordRegex.test(value)
          ? true
          : "需含有英文大小寫、數字與特殊符號至少8碼";
      }
    },
    confirmPw(value) {
      return value === undefined || value === ""
        ? "必填"
        : this.newpw === this.confirmpw
        ? true
        : "輸入的密碼不相符";
    },
    // showModal() {
    //   this.createAccountPopModal = new Modal("#createAccountPop");
    //   this.createAccountPopModal.show();
    // },
    // hideModal() {
    //   this.createAccountPopModal.hide();
    // },
    // showAgreeModal() {
    //   this.hideModal();
    //   this.agreePopModal = new Modal("#agreePop");
    //   this.agreePopModal.show();
    // },
    // hideAgreeModal() {
    //   this.agree = "";
    //   this.agreePopModal.hide();
    //   this.showModal();
    // },
    // hideAgreeModalAgree() {
    //   this.agree = "agree";
    //   this.agreePopModal.hide();
    //   this.showModal();
    // },
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
      console.log("使用者選中的項目:", selectedItems_cam);
      this.selectedItems_cam = selectedItems_cam;
    },
    // 切換權限，對應 checkbox
    switchType() {
      const vm = this;
      const targetId = "accountviewPage";
      const targetIndex = vm.checkboxes.findIndex(
        (item) => item.id === targetId
      );
      if (vm.type !== "admin" && targetIndex !== -1) {
        // 切到 其他 權限
        vm.checkboxes.splice(targetIndex, 1);
      } else if (vm.type === "admin" && targetIndex === -1) {
        // 別的選項切到 管理者 權限
        vm.checkboxes.push({
          id: targetId,
          label: "帳號權限設定",
          checked: true,
        });
      }
      // 最終項目調整
      vm.getSelectedItems();
    },
  },
  components: { AddFinishpop },
  mounted() {},
};
</script>

<template>
  <div>
    <!-- Modal -->
    <div
      class="modal fade text-dark"
      id="createAccountPop"
      tabindex="-1"
      aria-labelledby="createAccountPopLabel"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
      style="--bs-modal-width: 700px"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createAccountPopLabel">
              建立帳號
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <VForm ref="createAccountForm" @submit="formSubmit">
              <div class="d-flex">
                <div class="d-flex flex-column me-3">
                  <div class="d-flex flex-column">
                    <label
                      for="name"
                      class="form-label mb-0 px-2 gray-600"
                      style="white-space: nowrap"
                    >
                      姓名
                    </label>
                    <VField
                      class="form-control"
                      id="name"
                      name="name"
                      type="text"
                      rules="required"
                      placeholder="請輸入"
                      v-model="name"
                    />
                  </div>
                  <div class="text-end mb-3">
                    <ErrorMessage name="name" class="text-danger">
                      <div class="text-danger">必填</div>
                    </ErrorMessage>
                  </div>
                </div>

                <div class="d-flex flex-column me-3">
                  <div class="d-flex flex-column">
                    <label
                      for="phone"
                      class="form-label mb-0 px-2 gray-600"
                      style="white-space: nowrap"
                    >
                      電話
                    </label>
                    <VField
                      class="form-control"
                      id="phone"
                      name="phone"
                      type="text"
                      :rules="phoneRequired"
                      placeholder="請輸入"
                      v-model="phone"
                    />
                  </div>
                  <div class="text-end mb-3">
                    <ErrorMessage name="phone" class="text-danger">
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

              <div class="d-flex">
                <div class="d-flex flex-column me-3">
                  <div class="d-flex flex-column">
                    <label
                      for="email"
                      class="form-label mb-0 px-2 gray-600"
                      style="white-space: nowrap"
                    >
                      E-mail 帳號
                    </label>
                    <VField
                      class="form-control"
                      id="email"
                      name="email"
                      type="email"
                      rules="email|required"
                      placeholder="請輸入"
                      v-model="email"
                    />
                  </div>
                  <div class="text-end mb-3">
                    <ErrorMessage name="email" class="text-danger" />
                  </div>
                </div>

                <div class="d-flex flex-column me-3">
                  <div class="d-flex flex-column">
                    <label
                      for="pw"
                      class="form-label mb-0 px-2 gray-600"
                      style="white-space: nowrap"
                    >
                      密碼
                    </label>
                    <VField
                      class="form-control"
                      id="pw"
                      name="password"
                      type="password"
                      :rules="pwRequired"
                      placeholder="請輸入"
                      v-model="newpw"
                    />
                  </div>
                  <div class="text-end mb-3">
                    <ErrorMessage name="password" class="text-danger" />
                  </div>
                </div>

                <div class="d-flex flex-column">
                  <div class="d-flex flex-column">
                    <label
                      for="confirmpw"
                      class="form-label mb-0 px-2 gray-600"
                      style="white-space: nowrap"
                    >
                      確認密碼
                    </label>
                    <VField
                      class="form-control"
                      id="confirmpw"
                      name="confirmpassword"
                      type="password"
                      :rules="confirmPw"
                      placeholder="請輸入"
                      v-model="confirmpw"
                    />
                  </div>
                  <div class="text-end mb-3">
                    <ErrorMessage name="confirmpassword" class="text-danger" />
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
                      name="type"
                      id="manager"
                      class="manager form-check-input"
                      value="admin"
                      rules="required"
                      v-model="type"
                    />
                    <label
                      for="manager"
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
                      name="type"
                      id="user"
                      class="user form-check-input"
                      value="user"
                      rules="required"
                      v-model="type"
                    />
                    <label for="user" class="d-inline-block m-1 cursor-pointer">
                      使用者
                    </label>
                  </div>

                  <div
                    class="d-flex align-items-center"
                    style="min-width: 100px"
                  >
                    <VField
                      type="radio"
                      name="type"
                      id="obuuser"
                      class="obuuser form-check-input"
                      value="obu"
                      rules="required"
                      v-model="type"
                    />
                    <label
                      for="obuuser"
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
                    id="all"
                    class="form-check-input"
                    v-model="allCheckboxChecked"
                    @change="toggleAllCheckboxes"
                  />
                  <label for="all" class="ms-1">全部</label>
                </div>

                <div
                  v-for="(checkbox, index) in checkboxes"
                  :key="index"
                  class="py-1"
                  style="width: 160px"
                >
                  <input
                    type="checkbox"
                    :id="checkbox.id"
                    class="form-check-input"
                    name="pagePermissions"
                    v-model="checkbox.checked"
                    @change="updateChecked(checkbox)"
                  />
                  <label :for="checkbox.id" class="ms-1">{{
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
                    id="all_cam"
                    class="form-check-input py-1"
                    v-model="allCheckboxChecked_cam"
                    @change="toggleAllCheckboxes_cam"
                  />
                  <label for="all_cam" class="ms-1">全部</label>
                </div>

                <div
                  v-for="(checkbox, index) in checkboxes_cam"
                  :key="index"
                  style="width: 160px"
                  class="py-1"
                >
                  <input
                    type="checkbox"
                    :id="checkbox.id"
                    class="form-check-input"
                    name="camNotify"
                    v-model="checkbox.checked"
                    @change="updateChecked_cam(checkbox)"
                  />
                  <label :for="checkbox.id" class="ms-1">{{
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
                    v-show="createCheck"
                  >
                    <span>建立</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary w-100"
                    disabled
                    v-show="!createCheck"
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

    <AddFinishpop ref="refAddFinishpop"></AddFinishpop>
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
