<script setup lang="ts">
import { computed, watch } from 'vue';

interface Props {
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  timeout?: number;
  showCloseBtn?: boolean;
  modelValue: boolean;
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  position: 'bottom',
  timeout: 3000,
  showCloseBtn: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const notificationClass = computed(() => {
  return {
    [`notification--${props.type}`]: true,
    [`notification--${props.position}`]: true,
  };
});

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const close = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  isVisible.value = false;
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (newValue && props.timeout > 0) {
      timeoutId = setTimeout(() => {
        close();
      }, props.timeout);
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <div v-if="isVisible" :class="['notification', notificationClass]">
      <div class="notification__content">
        <q-icon v-if="icon" :name="icon" class="notification__icon" />
        <span class="basic-text">{{ message }}</span>
        <q-btn
          v-if="showCloseBtn"
          flat
          dense
          round
          size="sm"
          icon="close"
          class="notification__close"
          @click="close"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.notification {
  position: fixed;
  z-index: 9999;
  max-width: 300px;
  padding: 15px;
  border-radius: 8px;

  &--bottom {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  &--top {
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  &--bottom-left {
    bottom: 20px;
    left: 20px;
  }

  &--bottom-right {
    bottom: 20px;
    right: 20px;
  }

  &--top-left {
    top: 20px;
    left: 20px;
  }

  &--top-right {
    top: 20px;
    right: 20px;
  }

  &--error {
    background: $negative;
    color: white;
  }

  &--success {
    background: $positive;
    color: white;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  &__close {
    flex-shrink: 0;
    color: white;
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}
</style>

