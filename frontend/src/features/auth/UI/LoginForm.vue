<script setup lang="ts">
import { ref } from 'vue';
import { login, type LoginPayload } from '../api/auth';

const email = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  try {
    const payload: LoginPayload = { email: email.value, password: password.value };
    const res = await login(payload);
    console.log('Token:', res.access_token);
    localStorage.setItem('token', res.access_token);
    alert('Login successful!');
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      error.value = axiosError.response?.data?.message || 'Ошибка при входе';
    } else if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'Неизвестная ошибка';
    }
  }
};
</script>

<template>
  <div class="full-width full-height">
    <div class="flex flex-center">
      <q-card>
        <q-card-section>
          <q-form @submit.prevent="handleSubmit">
            <q-input type="email" id="email" v-model="email" label="Email" />
            <q-input type="password" id="password" v-model="password" label="Password" />
            <q-btn type="submit" label="Login" />
            <p v-if="error" class="text-red">{{ error }}</p>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-red {
  color: red;
}
</style>