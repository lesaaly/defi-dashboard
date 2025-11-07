<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, type RouteLocationRaw } from 'vue-router';

const router = useRouter();

interface MenuItem {
  title: string;
  caption?: string;
  icon: string;
  to: RouteLocationRaw;
}

const menuItems: MenuItem[] = [
  {
    title: 'Home',
    icon: 'home',
    to: { name: 'Main' },
  },
  {
    title: 'Wallets',
    icon: 'wallet',
    to: { name: 'Wallets' },
  },
  {
    title: 'Transactions',
    icon: 'history',
    to: { name: 'Transactions' },
  },
  {
    title: 'NFTs',
    icon: 'diamond',
    to: { name: 'NFTs' },
  },
];

const leftDrawerOpen = ref(true);
const miniState = ref(false);

function toggleLeftDrawer() {
  miniState.value = !miniState.value;
}

function handleLogout() {
  localStorage.removeItem('token');
  void router.push({ name: 'Login' });
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> DeFi Dashboard </q-toolbar-title>

        <q-space />

        <q-btn flat dense round icon="logout" aria-label="Logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      :width="290"
      :mini-width="90"
      :breakpoint="1024"
      class="bg-primary q-pa-lg"
    >
      <q-list>
        <q-item-label header v-if="!miniState"> LOGO </q-item-label>

        <q-item clickable class="drawer_item q-mb-sm" @click="toggleLeftDrawer">
          <q-item-section avatar>
            <q-icon name="menu" size="24px" />
          </q-item-section>
          <q-item-section v-if="!miniState">
            <q-item-label class="text-menu"> Menu </q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-for="item in menuItems"
          :key="item.title"
          clickable
          v-ripple
          :to="item.to"
          active-class="drawer_item_active"
          class="drawer_item q-mb-sm"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" size="24px" />
          </q-item-section>

          <q-item-section v-if="!miniState">
            <q-item-label class="text-menu">{{ item.title }}</q-item-label>
            <q-item-label caption v-if="item.caption">{{ item.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.q-layout {
  background: $primary;
}

.drawer_item {
  color: $light;
  border-radius: 12px;

  &_active {
    background: $light;
    color: $primary;

    .q-icon {
      color: $primary;
    }
  }
}

.q-item {
  min-height: fit-content;
}
</style>
