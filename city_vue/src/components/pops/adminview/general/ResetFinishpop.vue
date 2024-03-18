<script>
import { Modal } from "bootstrap";

export default {
  data() {
    return {
      ResetFinishPopModal: "",
    };
  },
  methods: {
    showModal() {
      this.ResetFinishPopModal = new Modal("#ResetFinishPop");
      this.ResetFinishPopModal.show();
    },
    hideModal() {
      this.ResetFinishPopModal.hide();
    },
  },
};
</script>

<template>
  <div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="ResetFinishPop"
      tabindex="-1"
      aria-labelledby="ResetFinishPopLabel"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="ResetFinishPopLabel">重設成功</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            重設成功
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
