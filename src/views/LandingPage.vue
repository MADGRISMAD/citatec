<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <transition
      enter-active-class="transition-all duration-1000 ease-out"
      enter-from-class="opacity-0 scale-150"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-500 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <img 
        v-if="showLogo" 
        alt="Vue logo" 
        src="../assets/logo.png" 
        class="w-64 h-64 mb-8"
      >
    </transition>

    <transition
      enter-active-class="transition-all duration-500 ease-out delay-1000"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div v-if="showButton" class="text-center">
        <h1 class="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Bienvenido a Tu App Vue.js + TypeScript
        </h1>
        <button 
          @click="startApp" 
          class="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          Comenzar
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'LandingPage',
  setup() {
    const showLogo = ref(true);
    const showButton = ref(false);

    onMounted(() => {
      setTimeout(() => {
        showLogo.value = false;
        setTimeout(() => {
          showButton.value = true;
        }, 500);
      }, 2000);
    });

    const startApp = () => {
      // Aquí puedes agregar la lógica para iniciar tu aplicación
      console.log('Iniciando la aplicación...');
    };

    return {
      showLogo,
      showButton,
      startApp,
    };
  },
});
</script>