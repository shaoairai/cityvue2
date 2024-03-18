<script>
// import { Form } from 'vee-validate';
import axios from "axios";
import { verifyToken } from "@/utils/verify";
import logoutMixin from "@/utils/logoutMixin";

import { Modal } from "bootstrap";

export default {
  mixins: [logoutMixin],
  props: ["finishChangePwPop"],
  data() {
    return {
      // 舊密碼
      oldpw: "",
      // 新密碼
      newpw: "",
      // 確認新密碼
      confirmpw: "",
      // 送出修改按鈕
      changePwCheck: true,
      // 修改密碼pop
      changePwPopModal: "",
    };
  },
  methods: {
    // 修改密碼
    async formSubmit(value) {
      const vm = this;

      // token測試
      // const hasToken = await verifyToken();
      // if (!hasToken) {
      //   alert("請重新登入！");
      //   vm.logout();
      // }

      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");

      // 按鈕不可按
      vm.changePwCheck = false;

      const data = new FormData();
      data.append("old_pw", value.oldpassword);
      data.append("new_pw", value.password);

      const config = {
        method: "PATCH",
        url: `${apiserver}/member/password`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          console.log(res);

          // 隱藏 Modal
          vm.changePwPopModal.hide();
          // 修改成功 Modal
          vm.finishChangePwPop();

          // 恢復按鈕
          vm.changePwCheck = true;
          // 重設表單
          vm.$refs.changePwForm.resetForm();
        })
        .catch((err) => {
          // 修改失敗
          console.log(err.response);
          alert(err.response.data.msg);
          // 恢復按鈕
          vm.changePwCheck = true;
        });
    },
    // 密碼驗證
    pwRequired(value) {
      // console.log(value);
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
    showModal() {
      this.changePwPopModal = new Modal("#changePwPop");
      this.changePwPopModal.show();
    },
  },
};
</script>

<template>
  <div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="changePwPop"
      tabindex="-1"
      aria-labelledby="changePwPopLabel"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="changePwPopLabel">修改密碼</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <VForm ref="changePwForm" @submit="formSubmit">
              <div class="d-flex align-items-center">
                <label
                  for="oldpassword"
                  class="form-label mb-0 px-2 gray-600"
                  style="white-space: nowrap"
                >
                  原先密碼
                </label>
                <VField
                  class="form-control"
                  id="oldpassword"
                  name="oldpassword"
                  type="password"
                  :rules="pwRequired"
                  placeholder="請輸入"
                  v-model="oldpw"
                />
              </div>
              <div class="text-end mb-3">
                <ErrorMessage name="oldpassword" class="text-danger" />
              </div>
              <div class="d-flex align-items-center">
                <label
                  for="pw"
                  class="form-label mb-0 px-2 gray-600"
                  style="white-space: nowrap"
                >
                  修改密碼
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

              <div class="d-flex align-items-center">
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

              <div class="d-flex">
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
                    v-show="changePwCheck"
                  >
                    <span>確定修改</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary w-100"
                    disabled
                    v-show="!changePwCheck"
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
