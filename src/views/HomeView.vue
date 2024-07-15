<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <img alt="Vue logo" src="../assets/logo.png" class="w-32 h-32 mb-8">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" class="text-center"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/Header.vue'; // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {}
</script>