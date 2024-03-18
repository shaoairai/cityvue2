<script>
import { RouterLink, RouterView } from "vue-router";
export default {
  data() {
    return {
      // 目前頁面
      navActive: "",
    };
  },
  components: {
    RouterLink,
    RouterView,
  },
  mounted() {
    const vm = this;
    // 網址路徑
    const fullPath = vm.$route.fullPath;
    // 拆解
    const pathSegments = fullPath.split("/");
    // 獲取第二個路由；pathSegments範例：['', 'admin', 'aicam', 'dashboard']
    vm.navActive = pathSegments[3];
    console.log(vm.navActive);
  },
};
</script>

<template>
  <div>
    <nav
      class="navbar bg-dark navbar-expand-lg bg-body-tertiary border-bottom py-0"
      data-bs-theme="dark"
    >
      <div class="container-fluid px-3">
        <button
          class="navbar-toggler"
          style="margin: 6px 0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <RouterLink to="/admin/aicam/dashboard" class="tabs">
              <li
                class="nav-item position-relative me-3 cursor-pointer"
                :class="{ active: navActive === 'dashboard' }"
                style="padding: 14px 8px"
                @click="navActive = 'dashboard'"
              >
                監控儀表板
              </li>
            </RouterLink>
            <RouterLink to="/admin/aicam/report" class="tabs">
              <li
                class="nav-item position-relative me-3 cursor-pointer"
                :class="{ active: navActive === 'report' }"
                style="padding: 14px 8px"
                @click="navActive = 'report'"
              >
                AI 統計報表
              </li>
            </RouterLink>
            <RouterLink to="/admin/aicam/cctv" class="tabs">
              <li
                class="nav-item position-relative me-3 cursor-pointer"
                :class="{ active: navActive === 'cctv' }"
                style="padding: 14px 8px"
                @click="navActive = 'cctv'"
              >
                攝影機設定
              </li>
            </RouterLink>
            <RouterLink to="/admin/aicam/notify" class="tabs">
              <li
                class="nav-item position-relative me-3 cursor-pointer"
                :class="{ active: navActive === 'notify' }"
                style="padding: 14px 8px"
                @click="navActive = 'notify'"
              >
                通報紀錄
              </li>
            </RouterLink>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <RouterView></RouterView>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

.tabs {
  color: $white;
  text-decoration: none;
}

li.nav-item {
  &.active {
    color: $warning;
    &::after {
      content: "";
      background: $warning;
      width: 100%;
      height: 5px;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
</style>
