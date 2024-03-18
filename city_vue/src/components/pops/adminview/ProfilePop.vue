<script>
import logoutMixin from "@/utils/logoutMixin";

export default {
  mixins: [logoutMixin],
  props: ["clickChangePwPop", "accDisplay"],
  data() {
    return {};
  },
};
</script>

<template>
  <div
    class="profilepop position-absolute d-inline-block p-3 bg-white rounded-2"
  >
    <ul class="p-0 m-0 text-center">
      <li>{{ accDisplay }}</li>
      <li class="canClick" @click="clickChangePwPop">修改密碼</li>
      <li class="canClick" @click="logout">登出</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

.profilepop {
  top: 114px;
  right: 32px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

li {
  list-style: none;
  padding: 4px 8px;
  border-radius: 4px;
  &.canClick {
    cursor: pointer;
    &:hover {
      background: $gray-100;
    }
  }
}

@media screen and (min-width: 430px) {
  .profilepop {
    top: 74px;
  }
}
</style>
