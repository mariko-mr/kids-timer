<script setup>
const props = defineProps({
  show: Boolean,
});
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">じかんになりました
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">できたよボタンをおしてね !</slot>
        </div>

        <div class="modal-btn">
          <button class="btn modal-default-button" @click="$emit('close')">
            できたよ !
          </button>
        </div>

        <!-- <div class="modal-footer">
          <slot name="footer">
            default footer
          </slot>
        </div> -->
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 500px;
  margin: auto;
  padding: 60px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  @include mq(md) {
    width: 340px;
    padding: 50px;
  }

  @include mq(ls) {
    width: 350px;
  }
}

.modal-header {
  font-size: 1.25rem;
  margin-bottom: 20px;
}

.modal-body {
  margin-bottom: 30px;
}

.modal-btn {
  align-self: center;
}

.modal-default-button {
  width: 140px;
  padding: 15px 10px;
  background-color: $color-main;
  color: $color-white;
  font-size: 1.25rem;
  border: 1px solid $color-main;
  border-radius: 40px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
