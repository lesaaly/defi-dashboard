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
    localStorage.setItem('token', res.access_token);
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
  <div class="form-box">
    <q-card>
      <div class="text-large text-center q-mb-md">Sign Up</div>
      <div class="basic-text text-center q-mb-md">Already a member? Login In</div>
      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <q-input
            type="email"
            id="email"
            v-model="email"
            label="Email"
            class="q-mb-md"
            color="indigo-3"
            input-class="basic-text"
            outlined
          />
          <q-input
            type="password"
            id="password"
            v-model="password"
            label="Password"
            outlined
            color="indigo-3"
            input-class="basic-text"
          />
          <q-btn type="submit" label="Login" class="form-button text-primary" />
          <p v-if="error" class="text-red">{{ error }}</p>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.text-red {
  color: red;
}

.form-box {
  width: 500px;
  border-radius: 15px;
  border-top: 5px solid #ffffff75;
  border-left: 5px solid #ffffff75;
  box-shadow: 5px 5px 12px #00000035;
  background: #ffffff25;
  overflow: hidden;
  backdrop-filter: blur(4px);
  padding: 50px;
}

.q-card,
.q-btn:before {
  background: none;
  box-shadow: none;
}

.form-button {
  box-shadow: none;
  margin-top: 30px;
  width: 100%;
}
</style>
