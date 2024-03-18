<script>
import { Modal } from "bootstrap";

export default {
  data() {
    return {
      EditFinishPopModal: "",
    };
  },
  methods: {
    showModal() {
      this.EditFinishPopModal = new Modal("#EditFinishPop");
      this.EditFinishPopModal.show();
    },
    hideModal() {
      this.EditFinishPopModal.hide();
    },
  },
};
</script>

<template>
  <div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="EditFinishPop"
      tabindex="-1"
      aria-labelledby="EditFinishPopLabel"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="EditFinishPopLabel">修改成功</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            修改成功
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
