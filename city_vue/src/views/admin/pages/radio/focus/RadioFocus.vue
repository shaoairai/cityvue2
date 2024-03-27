<script>
export default {
  data() {
    return {
      // 使用者輸入
      textareaText: "",
      // 格式驗證轉換暫存
      textTmp: "",
    };
  },
  methods: {
    combinedText() {
      const vm = this;
      const halfWidthCommaRegex = /[，]/g; // 把使用者全形逗號改半形
      // 去除斷行、去除前後空白、轉全形為半形、以逗號分割字串、每個字串去除前後空白
      const keywords = vm.textareaText
        .replace(/\n/g, "")
        .trim()
        .replace(halfWidthCommaRegex, ",")
        .split(",")
        .map((keyword) => keyword.trim());
      // 轉回成真正可接受的格式
      vm.textTmp = keywords.join(",");

      // 放回輸入框
      vm.textareaText = vm.textTmp;
    },
  },
};
</script>

<template>
  <div>
    <div class="content">
      <div class="content-area rounded-3 p-4 m-4 bg-white text-black">
        <div class="text-success">
          建立任務重點關鍵字，幫助現場指揮官與隊員們快速掌握重要訊息。<br />
          當現場人員查找無線電語音時，能快速建構共識，幫助順利完成任務。
        </div>
        <div class="pt-3 w-50">
          <textarea
            class="form-control"
            rows="4"
            placeholder="請輸入關鍵字"
            v-model="textareaText"
          ></textarea>
          <div class="note pt-2">
            每個關鍵字之間，請以半形逗號「,」分隔 (例：火災,濃煙,易燃物...)
          </div>
        </div>
        <div class="pt-3">
          <button
            type="button"
            class="btn btn-primary px-4"
            @click="combinedText"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";

.content-area {
  min-height: calc(100vh - 174px);
}

.note {
  color: $gray-500;
}
</style>
