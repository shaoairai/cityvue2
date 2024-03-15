<script>
import axios from "axios";

import LogoIcon from "@/components/icons/LogoIcon.vue";
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  data() {
    return {
      // 是否顯示密碼
      showpw: false,
      // 登入失敗訊息
      loginErrText: "",
    };
  },
  components: {
    LogoIcon,
  },
  methods: {
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
    // 登入
    formSubmit(value) {
      const vm = this;

      // 前往下一頁
      this.$router.push("/admin");

      // const data = JSON.stringify({
      //   account: value.email,
      //   password: value.password,
      // });

      // const config = {
      //   method: "POST",
      //   // url: `http://tpeplane.intemotech.com/member/userlogin`,
      //   url: `./userlogin`,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   data: data,
      // };

      // axios(config)
      //   .then(async (res) => {
      //     // console.log(res);
      //     await vm.resetLock(value.email);

      //     // 移除 localStorage 參數
      //     localStorage.clear();
      //     // 該帳號 email
      //     localStorage.setItem("account", res.data.account);
      //     localStorage.setItem("first", "true");

      //     // 前往下一頁
      //     this.$router.push("/admin");
      //   })
      //   .catch((err) => {
      //     // 登入失敗
      //     console.log(err.response.data.msg);
      //     vm.loginErrText = err.response.data.msg;
      //   });
    },
    // 解除帳號鎖定
    async resetLock(email) {
      const apiserver = document
        .querySelector("#apiserver")
        .getAttribute("data-api");

      const data = new FormData();
      data.append("account", email);

      const config = {
        method: "POST",
        url: `${apiserver}/member/reset`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };
      await axios(config)
        .then(() => {
          // console.log(res);
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
};
</script>

<template>
  <div>
    <table class="login-bg w-100">
      <tr class="d-flex vh-100">
        <td class="w-100 d-none d-md-block"></td>
        <td class="text-center w-100 d-flex align-items-center">
          <div class="p-5 mx-auto" style="max-width: 430px">
            <div class="d-flex align-items-center justify-content-center">
              <LogoIcon style="font-size: 64px"></LogoIcon>
              <h2 class="fw-bold text-white mb-0 ms-3">AI 精準消防平台</h2>
            </div>
            <h3 class="pt-4 pb-3 text-white">登入</h3>
            <VForm @submit="formSubmit">
              <div class="text-warning text-end" v-show="loginErrText != ''">
                {{ loginErrText }}
              </div>
              <div class="d-flex align-items-center">
                <VField
                  class="form-control"
                  id="account"
                  name="email"
                  type="email"
                  rules="required|email"
                  placeholder="請輸入E-mail"
                />
              </div>
              <div class="text-end mb-3">
                <ErrorMessage
                  name="email"
                  class="text-warning"
                  v-slot="{ message }"
                >
                  <div class="text-warning">
                    {{ message === "email 為必填" ? "必填" : "Email 格式錯誤" }}
                  </div>
                </ErrorMessage>
              </div>
              <div class="d-flex align-items-center">
                <VField
                  class="form-control"
                  id="pw"
                  name="password"
                  :type="showpw ? 'text' : 'password'"
                  :rules="pwRequired"
                  placeholder="請輸入密碼"
                />
              </div>
              <div class="text-end mb-3">
                <ErrorMessage name="password" class="text-warning" />
              </div>
              <div class="d-flex justify-content-between">
                <div class="mb-3">
                  <input
                    type="checkbox"
                    name="showpw"
                    id="showpw"
                    class="form-check-input"
                    :checked="showpw"
                    @change="showpw = !showpw"
                  />
                  <label for="showpw" class="ms-1 gray-500">顯示密碼</label>
                </div>
                <div class="mb-3 text-primary">
                  <div>忘記密碼</div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100">登入</button>
            </VForm>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

.login-bg {
  height: 100vh;
  background-image: url("@/assets/img/bg.jpg");
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

.gray-700 {
  color: $gray-700;
}

.gray-600 {
  color: $gray-600;
}

.gray-500 {
  color: $gray-500;
}
</style>
