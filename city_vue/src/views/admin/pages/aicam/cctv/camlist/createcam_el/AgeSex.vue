<script>
export default {
  props: ["edit_carnumberset_car_numbers"],
  data() {
    return {
      carNumber: this.edit_carnumberset_car_numbers
        ? this.edit_carnumberset_car_numbers
        : "",
    };
  },
};
</script>

<template>
  <div class="d-flex flex-row align-items-center">
    <div>愛心車編號</div>

    <VField
      type="text"
      name="carNumber"
      class="form-control mx-1"
      style="width: 160px"
      rules="required"
      placeholder="請輸入"
      v-model="carNumber"
    />
    <ErrorMessage name="carNumber">
      <div class="text-danger ps-2">必填</div>
    </ErrorMessage>
  </div>
</template>
