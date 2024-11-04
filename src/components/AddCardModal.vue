<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["cancel-button", "submit-button"]);
const target = ref(null);
const closeModal = () => emit("cancel-button");
onClickOutside(target, () => closeModal());
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-mask" data-testid="modal">
      <div class="modal-wrapper">
        <div class="modal-container flex flex-col gap-2" ref="target">
          <div class="modal-header">
            <slot name="header"> Default Header </slot>
          </div>
          <div class="modal-body">
            <slot name="body"> Body </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer" :close="closeModal">
              <button
                data-testid="cancel-button"
                @click="emit('cancel-button')"
              >
                Close
              </button>
              <button
                data-testid="submit-button"
                @click="emit('submit-button')"
              >
                Submit
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-container {
  width: 400px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  & > input {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #000;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  & > button {
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid #000;
    cursor: pointer;
    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
}
</style>
