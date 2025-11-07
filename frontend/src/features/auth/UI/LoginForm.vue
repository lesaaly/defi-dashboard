<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const emit = defineEmits<{
  submit: [payload: { email: string; password: string }];
}>();

const handleSubmit = () => {
  emit('submit', {
    email: email.value,
    password: password.value,
  });
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
            autocomplete="email"
            class="q-mb-md"
            color="primary"
            input-class="basic-text"
            outlined
          />
          <q-input
            type="password"
            id="password"
            v-model="password"
            label="Password"
            autocomplete="current-password"
            outlined
            color="primary"
            input-class="basic-text"
          />
          <q-btn type="submit" label="Login" class="form-button text-primary" text-color="white" />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
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
  background: $accent;
  height: 46px;
  border-radius: 4px;
}
</style>
