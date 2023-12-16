<script setup>
const props = defineProps({
  show: Boolean,
});
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header mb-20">
          <slot name="header">じかんになりました </slot>
        </div>

        <div class="modal-body mb-30">
          <slot name="body">できたよボタンをおしてね !</slot>
        </div>

        <div class="modal-btn">
          <button class="btn btn-modal-finish" @click="$emit('close')">
            できたよ !
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
.btn-modal-finish {
  width: 140px;
  padding: 15px 10px;
  background-color: $color-main;
  color: $color-white;
  font-size: 1.25rem;
  border: 1px solid $color-main;
  border-radius: 40px;
}
</style>
