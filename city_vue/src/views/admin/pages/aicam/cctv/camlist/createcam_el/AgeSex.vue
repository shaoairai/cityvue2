<script>
export default {
  props: ["edit_carnumberset_car_numbers"],
  data() {
    return {
      carNumber: this.edit_carnumberset_car_numbers
        ? this.edit_carnumberset_car_numbers
        : "",
      keepSeconds: "",
    };
  },
};
</script>

<template>
  <div class="d-flex flex-row align-items-center">
    <div>AI偵測到路面積水超過辨識區域達</div>

    <VField
      type="text"
      name="carNumber"
      class="form-control mx-1"
      style="width: 160px"
      rules="required"
      placeholder="請輸入"
      v-model="carNumber"
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

    <ErrorMessage name="carNumber">
      <div class="text-danger ps-2">必填</div>
    </ErrorMessage>
  </div>
</template>
