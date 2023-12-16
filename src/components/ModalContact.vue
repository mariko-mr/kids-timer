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
          <slot name="header">おといあわせ </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            <div class="modal-body-list mb-20">
              <ul>
                <li>- できたこと</li>
                <li>- がんばったこと</li>
                <li>- きづいたこと</li>
              </ul>
            </div>
            <!-- /.modal-body-list -->

            <div class="modal-body-textarea mb-20">
              <textarea
                v-model="message"
                placeholder="なんでもいいよ。ここにかいてね。"
              ></textarea>
            </div>
            <!-- /.modal-body-textarea -->
          </slot>
        </div>

        <div class="modal-btn modal-btn-contact">
          <button class="btn btn-contact btn-submit" type="submit">
            そうしん
          </button>
          <button class="btn btn-contact btn-close" @click="$emit('close')">
            とじる
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
textarea {
  width: 100%;
  height: 160px;
  resize: none;
  font-size: 1.15rem;
  letter-spacing: 0.12rem;
  font-family: $font-family;
  color: $color-black;
  padding: 10px 14px;
  border: 1px solid $color-main;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.16);
  border-radius: 10px;
  transition: outline, border, box-shadow 0.3s ease;

  &:focus-visible {
    border: 1px solid $color-main;
    box-shadow: 0px 0px 10px $color-main;
    outline: solid 2px $color-main;
    outline-offset: 3px;
  }
}

.modal-btn-contact {
  display: flex;
  gap: 20px;
}

.btn-contact {
  width: 140px;
  // color: $color-white;
  font-size: 1.25rem;
  border: 1px solid transparent;
}

.btn-submit {
  background-color: $color-main;
  color: $color-white;
}

.btn-close {
  background-color: $color-black;
  color: $color-white;
  opacity: 0.5;

  &:hover {
    background-color: $color-black;
    opacity: $opacity;
  }
}
</style>
