import axios from "axios";

// 驗證
export async function verifyToken() {
  const apiserver = document
    .querySelector("#APISERVERWEB")
    .getAttribute("data-url");

  // console.log("1. 準備驗證token，進入verifyToken");

  // 取 cookie token
  const { rtnToken, rtnRefresh } = await getToken();
  // console.log("4. 取 cookie token");
  if (rtnToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${rtnToken}`;

    const config = {
      method: "GET",
      url: `${apiserver}/member/protected`,
    };

    return await axios(config)
      .then(() => {
        // console.log("8. 驗證成功verifyToken");
        // console.log(res);
        return true;
      })
      .catch(async (err) => {
        // console.log("8. 驗證失敗verifyToken，token已失效");
        // 已失效
        // console.log(err.response);
        // console.log("換發 token");

        // 這裡要進行換發
        const newAccessToken = await refreshToken(rtnRefresh);
        return newAccessToken ? true : false;
      });
  } else {
    // 取得失敗，即將登出
    console.log("取得失敗，即將登出");
    return false;
  }
}

// 取得 cookie 的 token
export async function getToken() {
  const config = {
    method: "GET",
    url: "./getCookieToken",
  };

  return await axios(config)
    .then(async (res) => {
      // console.log("2. 取得 token");

      // 如果兩者皆存在
      if (res.data.access_token && res.data.refresh_token) {
        // console.log("3. token、refresh 都存在，回傳兩者");
        return {
          rtnToken: res.data.access_token,
          rtnRefresh: res.data.refresh_token,
        };
      } else {
        // console.log("3. token 不存在，但有 refresh，則換發");
        const newAccessToken = await refreshToken(res.data.refresh_token);
        if (newAccessToken) {
          return {
            rtnToken: newAccessToken,
            rtnRefresh: res.data.refresh_token,
          };
        } else {
          return false;
        }
      }
    })
    .catch((err) => {
      console.log(err.response);
      return false;
    });
}

// refreshToken
export async function refreshToken(rtnRefresh) {
  const apiserver = document
    .querySelector("#APISERVERWEB")
    .getAttribute("data-url");

  // console.log("5. 進入refreshToken");
  const config = {
    method: "POST",
    url: `${apiserver}/member/refresh`,
    headers: {
      Authorization: `Bearer ${rtnRefresh}`,
    },
  };

  return await axios(config)
    .then(async (res) => {
      // console.log("6. 換好refreshToken");
      // console.log(res);
      await setCookieToken(res.data.access_token);

      // 重設預設值
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.access_token}`;

      return res.data.access_token;
    })
    .catch((err) => {
      // console.log("6. refreshToken失敗");
      // 已失效
      console.log(err.response);
      return false;
    });
}

// 存入cookie
export async function setCookieToken(token) {
  const data = new FormData();
  data.append("access_token", token);

  const config = {
    method: "POST",
    url: "./setCookieToken",
    data: data,
  };

  return await axios(config)
    .then(async () => {
      // console.log("7. 重設cookie完成");
      // console.log(res);
    })
    .catch((err) => {
      // console.log("7. 重設cookie失敗");
      console.log(err.response);
    });
}

// 刪除 cookie
export async function delCookieToken() {
  const config = {
    method: "DELETE",
    url: "./delCookieToken",
  };

  return await axios(config)
    .then(async (res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response);
    });
}
