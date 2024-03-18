<template>
  <div class="p-3 rounded-1 bg-alert-before">
    <span class="position-relative">
      即時通報內容為「<b>攝影機名稱</b>使用人員點擊SOS按鈕，請留意！」
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";
.bg-alert-before {
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $alert;
    opacity: 0.3;
  }
}
</style>
