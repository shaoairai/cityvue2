<script>
export default {
  props: ["edit_remnantsset_warn_minutes", "edit_remnants_stuff"],
  data() {
    return {
      // 輸入框
      remnantsNumber: this.edit_remnantsset_warn_minutes
        ? this.edit_remnantsset_warn_minutes
        : "",
      allCheckboxChecked: false,
      RemnantsCheckbox: [
        { id: "phone", label: "手機", checked: false },
        { id: "smlbook", label: "小型手冊", checked: false },
        { id: "suitcase", label: "行李箱", checked: false },
        { id: "backpack", label: "後背包", checked: false },
        { id: "sidebackpack", label: "側背包", checked: false },
        { id: "clutchbag", label: "手拿包", checked: false },
        { id: "briefcase", label: "公事包", checked: false },
        { id: "box", label: "箱子", checked: false },
        { id: "umbrella", label: "雨傘", checked: false },
      ],
      // 使用者選的項目
      selectedItems: [],
    };
  },
  methods: {
    // 切換"全部"按鈕
    toggleAllCheckboxes() {
      this.RemnantsCheckbox.forEach((checkbox) => {
        checkbox.checked = this.allCheckboxChecked;
      });
    },
    // 切換"全部"以外的按鈕
    updateChecked(clickedCheckbox) {
      if (clickedCheckbox && clickedCheckbox.id === "all") {
        // 如果點擊的是「全部」，則勾選/取消所有其他選項
        this.RemnantsCheckbox.forEach((checkbox) => {
          checkbox.checked = this.allCheckboxChecked;
        });
      } else {
        // 如果是其他選項打勾 or 不勾
        this.allCheckboxChecked = this.RemnantsCheckbox.every(
          (checkbox) => checkbox.checked
        );
        console.warn(this.allCheckboxChecked);
      }
    },
    // 如果是編輯攝影機，要先恢復原本的勾選
    checkSelectedItems() {
      this.selectedItems.forEach((item) => {
        const foundItem = this.RemnantsCheckbox.find(
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
      const selectedItems = this.RemnantsCheckbox.filter(
        (checkbox) => checkbox.checked
      ).map((checkbox) => checkbox.label);

      console.log("使用者選中的項目:", selectedItems);
      this.selectedItems = selectedItems;
    },
  },
  mounted() {
    const vm = this;
    // 恢復編輯
    vm.selectedItems = vm.edit_remnants_stuff;
    vm.checkSelectedItems();
  },
};
</script>

<template>
  <div class="d-flex flex-row align-items-center pb-3">
    <div>攝影機辨識區域偵測民眾路倒持續</div>

    <VField
      type="number"
      name="remnantsNumber"
      class="form-control mx-1"
      style="width: 160px"
      rules="required"
      placeholder="請輸入數字"
      v-model="remnantsNumber"
    />
    <div class="pe-1">秒鐘以上，即需發出即時通報。</div>
    <ErrorMessage name="remnantsNumber">
      <div class="text-danger ps-2">必填</div>
    </ErrorMessage>
  </div>

  <!-- <div class="d-flex flex-column pb-3">
    <div class="d-flex flex-row align-items-center">
      <div class="fw-bold" style="font-size: 14px">請勾選需判斷的物件</div>
      <ErrorMessage name="remnantsCheckbox">
        <div class="text-danger ps-2">請至少勾選一項</div>
      </ErrorMessage>
    </div>

    <div class="d-flex mt-2">
      <div class="me-3">
        <input
          type="checkbox"
          id="remnantsAll"
          class="form-check-input me-1"
          v-model="allCheckboxChecked"
          @change="toggleAllCheckboxes"
        />
        <label for="remnantsAll">全部</label>
      </div>

      <div
        v-for="(checkbox, index) in RemnantsCheckbox"
        :key="index"
        class="me-3"
      >
        <div>
          <input
            type="checkbox"
            :id="checkbox.id"
            class="form-check-input me-1"
            name="remnantsCheckbox"
            v-model="checkbox.checked"
            @change="updateChecked(checkbox)"
          />
          <label :for="checkbox.id">{{ checkbox.label }}</label>
        </div>
      </div>
    </div>
  </div> -->
</template>
