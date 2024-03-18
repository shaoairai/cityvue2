<script>
export default {
  props: ["edit_crowdedset_attention_minutes", "edit_crowdedset_warn_minutes"],
  data() {
    return {
      alertNumber: this.edit_crowdedset_attention_minutes
        ? this.edit_crowdedset_attention_minutes
        : "",
      dangerNumber: this.edit_crowdedset_warn_minutes
        ? this.edit_crowdedset_warn_minutes
        : "",
    };
  },
};
</script>

<template>
  <div class="d-flex flex-row align-items-center pb-3">
    <div>AI偵測到火焰煙霧超過辨識區域達</div>

    <VField
      type="number"
      name="alertNumber"
      class="form-control mx-1"
      style="width: 160px"
      rules="required"
      placeholder="請輸入數字"
      v-model="alertNumber"
    />
    <div class="pe-1">% 以上，且持續超過</div>
    <VField
      type="number"
      name="keepSeconds"
      class="form-control mx-1"
      style="width: 160px"
      rules="required"
      placeholder="請輸入數字"
      v-model="keepSeconds"
    />秒鐘，即發出通報。

    <ErrorMessage name="alertNumber">
      <div class="text-danger ps-2">必填</div>
    </ErrorMessage>
  </div>
  <div class="d-flex flex-row align-items-center pb-3">
    <div>攝影機辨識區域偵測服務水平呈現留意狀態持續</div>
    <VField
      type="number"
      name="dangerNumber"
      class="form-control mx-1"
      style="width: 160px"
      rules="required"
      placeholder="請輸入數字"
      v-model="dangerNumber"
    />
    <div class="pe-1">分鐘以上，判斷為擁擠，顯示</div>
    <div class="bg-danger text-white px-3 py-1 rounded-1 user-select-none">
      擁擠
    </div>
    <ErrorMessage name="dangerNumber">
      <div class="text-danger ps-2">必填</div>
    </ErrorMessage>
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
