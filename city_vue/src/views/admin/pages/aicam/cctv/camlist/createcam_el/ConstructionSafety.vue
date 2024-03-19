<script>
export default {
  props: ["edit_construction_safety"],
  data() {
    return {
      allCheckboxChecked: false,
      ConstructionCheckbox: [
        { id: "smoke", label: "煙霧", checked: false },
        { id: "fire", label: "火", checked: false },
        { id: "helmet", label: "安全帽", checked: false },
        { id: "vest", label: "反光背心", checked: false },
      ],
      // 使用者選的項目
      selectedItems: [],
    };
  },
  methods: {
    // 切換"全部"按鈕
    toggleAllCheckboxes() {
      this.ConstructionCheckbox.forEach((checkbox) => {
        checkbox.checked = this.allCheckboxChecked;
      });
    },
    // 切換"全部"以外的按鈕
    updateChecked(clickedCheckbox) {
      if (clickedCheckbox && clickedCheckbox.id === "all") {
        // 如果點擊的是「全部」，則勾選/取消所有其他選項
        this.ConstructionCheckbox.forEach((checkbox) => {
          checkbox.checked = this.allCheckboxChecked;
        });
      } else {
        // 如果是其他選項打勾 or 不勾
        this.allCheckboxChecked = this.ConstructionCheckbox.every(
          (checkbox) => checkbox.checked
        );
        console.warn(this.allCheckboxChecked);
      }
    },
    // 如果是編輯攝影機，要先恢復原本的勾選
    checkSelectedItems() {
      this.selectedItems.forEach((item) => {
        const foundItem = this.ConstructionCheckbox.find(
          (checkbox) => checkbox.label === item
        );
        if (foundItem) {
          foundItem.checked = true;
        }
      });
      this.updateChecked();
    },
    // 取得最終使用者選的項目陣列
    getSelectedItems() {
      const selectedItems = this.ConstructionCheckbox.filter(
        (checkbox) => checkbox.checked
      ).map((checkbox) => checkbox.label);

      console.log("使用者選中的項目:", selectedItems);
      this.selectedItems = selectedItems;
    },
  },
  mounted() {
    const vm = this;
    // 恢復編輯
    vm.selectedItems = vm.edit_construction_safety;
    vm.checkSelectedItems();
  },
};
</script>

<template>
  <div class="d-flex flex-row flex-wrap align-items-center pb-3">
    <div>AI偵測到火焰煙霧超過辨識區域達</div>

    <VField
      type="number"
      name="remnantsNumber"
      class="form-control mx-1"
      style="width: 160px"
      rules="required"
      placeholder="請輸入數字"
      v-model="remnantsNumber"
    />
    <div class="pe-1">% 以上，且持續超過</div>
    <VField
      type="number"
      name="remnantsNumber"
      class="form-control mx-1"
      style="width: 160px"
      rules="required"
      placeholder="請輸入數字"
      v-model="remnantsNumber"
    />秒鐘，即發出通報。

    <ErrorMessage name="remnantsNumber">
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
