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
          <div class="modal-body-list mb-20">
            <ul>
              <li>- できたこと</li>
              <li>- がんばったこと</li>
              <li>- きづいたこと</li>
            </ul>
          </div>
          <!-- /.modal-body-list -->

          <form action="https://ssl.form-mailer.jp/fm/service/Forms/confirm" method="post" name="form1" ENCTYPE="multipart/form-data" accept-charset="UTF-8">
            <input type="hidden" name="key" value="ebdc097d807682">
            <div class="modal-body-textarea mb-20">
              <textarea
              name="field_7049864"
                placeholder="なんでもいいよ。ここにかいてね。"
              ></textarea>
            </div>
            <!-- /.modal-body-textarea -->

            <div class="modal-btn modal-btn-contact">
              <button class="btn btn-contact btn-submit" name="submit" type="submit">
                そうしん
              </button>
              <button class="btn btn-contact btn-close" name="close" type="button" @click="$emit('close')">
                とじる
              </button>
            </div>
            <!-- /.modal-btn modal-btn-contact -->
            <input type="hidden" name="code" value="utf8">
          </form>

          <p class="powered-by-formmailer">
            <a href="https://www.form-mailer.jp/?utm_source=https://ssl.form-mailer.jp/fms/ebdc097d807682&utm_medium=ownedmedia&utm_campaign=powered-by-formmailer" target="_blank" id="powered">Powered by FormMailer.</a>
          </p>
        </div>
        <!-- /.modal-body -->
      </div>
      <!-- /.modal-container -->
    </div>
    <!-- /.modal-mask -->
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
  justify-content: center;
  margin-bottom: 30px;
}

.btn-contact {
  width: 140px;
  color: $color-white;
  font-size: 1.25rem;
  border: 1px solid transparent;

   @include mq(md) {
    font-size: 1rem;
    padding: 15px 10px;
    }
}

.btn-submit {
  background-color: $color-main;
}

.btn-close {
  background-color: $color-black;
  opacity: 0.5;

  &:hover {
    background-color: $color-black;
    opacity: $opacity;
  }
}

.powered-by-formmailer{
  text-align: center;
  font-size: 0.7rem;
}
</style>
