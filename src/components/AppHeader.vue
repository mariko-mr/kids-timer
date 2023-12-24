<script setup>
// import ModalContact from "./ModalContact.vue";
import { ref } from "vue";

// const showModalContact = ref(false);
</script>

<template>
  <div class="header__left">
    <h1 class="header__logo">
      <a href="">やさしいタイマー</a>
    </h1>
  </div>
  <!-- /.header__left -->
  <div class="header__right">
    <nav class="header__nav">
      <!-- <button
        class="modal-contact"
        id="show-modal-contact"
        @click="showModalContact = true"
      >
        おといあわせ
      </button>
      <Teleport to="body">
        <ModalContact
          :show="showModalContact"
          @close="showModalContact = false"
        ></ModalContact>
      </Teleport> -->
    </nav>
  </div>
  <!-- /.header__right -->
</template>

<style lang="scss" scoped>
.header__left {
  display: flex;
  align-items: center;
}

.header__logo {
  display: none;
}

.header__right {
  display: flex;
  align-items: center;
}

// .modal-contact {
//   color: $color-black;
//   font-size: 1.15rem;
//   letter-spacing: $letter-spacing;
// }
</style>
