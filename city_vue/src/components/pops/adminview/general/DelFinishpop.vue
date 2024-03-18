<script>
import { Modal } from "bootstrap";

export default {
  data() {
    return {
      DelFinishPopModal: "",
    };
  },
  methods: {
    showModal() {
      this.DelFinishPopModal = new Modal("#DelFinishPop");
      this.DelFinishPopModal.show();
    },
    hideModal() {
      this.DelFinishPopModal.hide();
    },
  },
};
</script>

<template>
  <div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="DelFinishPop"
      tabindex="-1"
      aria-labelledby="DelFinishPopLabel"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="DelFinishPopLabel">刪除成功</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            刪除成功
            <button
              type="button"
              class="btn btn-primary w-100 mt-4"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
