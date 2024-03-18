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
  <div class="d-flex flex-column pb-3">
    <div class="d-flex flex-row align-items-center">
      <div class="fw-bold" style="font-size: 14px">請勾選需判斷的物件</div>
      <ErrorMessage name="ConstructionCheckbox">
        <div class="text-danger ps-2">請至少勾選一項</div>
      </ErrorMessage>
    </div>

    <div class="d-flex mt-2">
      <div class="me-3">
        <input
          type="checkbox"
          id="constructionAll"
          class="form-check-input me-1"
          v-model="allCheckboxChecked"
          @change="toggleAllCheckboxes"
        />
        <label for="constructionAll">全部</label>
      </div>

      <div
        v-for="(checkbox, index) in ConstructionCheckbox"
        :key="index"
        class="me-3"
      >
        <div>
          <input
            type="checkbox"
            :id="checkbox.id"
            class="form-check-input me-1"
            name="ConstructionCheckbox"
            v-model="checkbox.checked"
            @change="updateChecked(checkbox)"
          />
          <label :for="checkbox.id">{{ checkbox.label }}</label>
        </div>
      </div>
    </div>
  </div>

  <div class="p-3 rounded-1 bg-alert-before">
    <span class="position-relative">
      即時通報內容為「<b>攝影機名稱</b>偵測到判斷物件異常狀態，請留意！」
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
