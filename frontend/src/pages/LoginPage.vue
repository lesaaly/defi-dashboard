<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '../features/auth/UI/LoginForm.vue';
import Notification from 'components/NotificationComponent.vue';
import { login, type LoginPayload } from '../features/auth/api/auth';

const router = useRouter();

const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref<'error' | 'success' | 'warning' | 'info'>('error');

const showError = (message: string) => {
  notificationMessage.value = message;
  notificationType.value = 'error';
  showNotification.value = true;
};

const handleLogin = async (payload: { email: string; password: string }) => {
  showNotification.value = false;
  try {
    const loginPayload: LoginPayload = { email: payload.email, password: payload.password };
    const res = await login(loginPayload);
    localStorage.setItem('token', res.access_token);
    // Редирект на главную страницу после успешного логина
    void router.push({ name: 'Main' });
  } catch (err: unknown) {
    let errorMessage = 'Неизвестная ошибка';
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      errorMessage = axiosError.response?.data?.message || 'Ошибка при входе';
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    showError(errorMessage);
  }
};
</script>

<template>
  <div class="login-page">
    <LoginForm @submit="handleLogin" />
    <Notification 
      v-model="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      position="bottom"
      :timeout="5000"
      :show-close-btn="true"
    />
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  background: linear-gradient(120deg, $primary, $accent-secondary);

  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
