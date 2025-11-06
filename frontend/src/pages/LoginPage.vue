<script setup lang="ts">
import LoginForm from '../features/auth/UI/LoginForm.vue';
</script>

<template>
  <div class="login-page">
    <LoginForm />
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  background: -webkit-linear-gradient(90deg, #054c76, #0c192a, #471c3a);
  background: linear-gradient(90deg, #054c76, #0c192a, #471c3a);

  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
