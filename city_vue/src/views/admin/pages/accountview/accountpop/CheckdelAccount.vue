<script>
import { Modal } from "bootstrap";

export default {
  props: ["delFunc"],
  data() {
    return {
      CheckDelAccountPopModal: "",
      showCheckBtn: true,
      itemText: "",
    };
  },
  methods: {
    showModal() {
      this.CheckDelAccountPopModal = new Modal("#CheckDelAccountPop");
      this.CheckDelAccountPopModal.show();
    },
    hideModal() {
      this.CheckDelAccountPopModal.hide();
    },
  },
};
</script>

<template>
  <div>
    <!-- Modal -->
    <div
      class="modal fade text-dark"
      id="CheckDelAccountPop"
      tabindex="-1"
      aria-labelledby="CheckDelAccountPopLabel"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="CheckDelAccountPopLabel">
              刪除帳號
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            確定要刪除 {{ itemText }} 嗎？
            <div class="d-flex pt-4">
              <div class="w-50 pe-1">
                <button
                  type="button"
                  class="btn btn-light w-100"
                  data-bs-dismiss="modal"
                >
                  取消
                </button>
              </div>
              <div class="w-50 ps-1">
                <button
                  type="submit"
                  class="btn btn-danger w-100"
                  v-show="showCheckBtn"
                  @click="delFunc(itemText)"
                >
                  <span>刪除</span>
                </button>
                <button
                  type="button"
                  class="btn btn-danger w-100"
                  disabled
                  v-show="!showCheckBtn"
                >
                  <div class="spinner-border text-white" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
