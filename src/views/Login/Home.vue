<script setup lang="ts">
</script>

<template>
  <div bg z--9999 />
  <div
    h-100vh
    w-full
    flex
    justify-center
    items-center
    relative
  >
    <a absolute left-4 top-4 text-gray-400 hover:text-blue-300 text-sm href="#">帮助</a>
    <div
      w-600px
      h-350px
      border-2
      rounded-xl
      backdrop-blur-xl
      shadow-xl
    >
      <RouterView />
    </div>
  </div>
</template>
