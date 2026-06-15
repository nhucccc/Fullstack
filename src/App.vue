<template>
  <a-config-provider :locale="viVN" :theme="{ token: { colorPrimary: '#1890ff' } }">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import viVN from 'ant-design-vue/lib/locale/vi_VN'
</script>
