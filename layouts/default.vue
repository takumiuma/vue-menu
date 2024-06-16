<script>
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>
<template>
  <div>
    <TheHeader />
    <slot />
    <TheFooter />
  </div>
</template>
