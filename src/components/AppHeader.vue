<template>
  <div class="header__left">
    <h1 class="header__logo">
      <a href="">やさしいタイマー</a>
    </h1>
  </div>
  <!-- /.header__left -->
  <div class="header__right">
    <nav class="header__nav">
      <ul class="header__menu">
        <li class="header__menu-item"><a href="">TOP</a></li>
        <li class="header__menu-item"><a href="">CONTACT</a></li>
      </ul>
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

.header__nav {
  display: none;
}

.header__menu {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
