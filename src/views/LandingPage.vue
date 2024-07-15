<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <div 
      :class="[
        'transition-all duration-1000 ease-in-out transform',
        animationComplete ? 'translate-y-[-20vh] scale-75' : 'translate-y-0 scale-100'
      ]"
    >
      <img 
        alt="TNM Logo" 
        src="@/assets/logo.png" 
        class="w-64 h-64 mb-8"
      >
    </div>

    <div 
      :class="[
        'text-center px-4 transition-all duration-1000 ease-out transform',
        animationComplete ? 'opacity-100 translate-y-0 mt-16' : 'opacity-0 translate-y-10 mt-0'
      ]"
    >
      <h1 class="text-4xl font-bold mb-6 text-[#1B396A] dark:text-[#807E82]">
        Bienvenido a CITATEC
      </h1>
      <p class="text-xl mb-8 text-gray-700 dark:text-gray-300">
        Control de Inscripciones y Turnos Asignados para Tecnología en Sistemas Computacionales
      </p>
      <button 
        @click="startApp" 
        class="px-6 py-3 bg-[#1B396A] text-white font-semibold rounded-lg shadow-md hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-[#1B396A] focus:ring-opacity-75 transition-colors duration-200"
      >
        Comenzar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'LandingPage',
  setup() {
    const animationComplete = ref(false);

    onMounted(() => {
      setTimeout(() => {
        animationComplete.value = true;
      }, 2000);
    });

    const startApp = () => {
      console.log('Iniciando CITATEC...');
      // Aquí puedes agregar la lógica para iniciar la aplicación CITATEC
    };

    return {
      animationComplete,
      startApp,
    };
  },
});
</script>