<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 overflow-hidden px-4">
    <!-- Contenedor principal -->
    <div 
      :class="[ 
        'transition-all duration-1000 ease-in-out transform text-center', 
        animationStarted ? (animationComplete ? 'translate-y-[-5vh] scale-100' : 'translate-y-0 scale-110') : 'opacity-0 scale-150'
      ]"
    >
      <!-- Logo -->
      <img 
        alt="TNM Logo" 
        src="@/assets/logo.png" 
        class="h-40 sm:h-48 lg:h-56 mb-6 animate-fade-in"
      >

      <!-- Texto principal -->
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-[#1B396A]">
        Bienvenido a <span class="text-blue-600">CITATEC</span>
      </h1>

      <!-- Descripción -->
      <p class="text-base sm:text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl">
        Control de Inscripciones y Turnos Asignados para Tecnología en Sistemas Computacionales
      </p>

      <!-- Botón principal -->
      <button 
        @click="generarCita" 
        class="px-8 py-3 bg-[#1B396A] text-white font-semibold rounded-full shadow-lg hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-[#1B396A] focus:ring-opacity-75 transition-transform duration-200 transform hover:scale-105"
      >
        Generar Cita
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LandingPage',
  setup() {
    const animationStarted = ref(false);
    const animationComplete = ref(false);
    const router = useRouter();

    onMounted(() => {
      setTimeout(() => {
        animationStarted.value = true;
        setTimeout(() => {
          animationComplete.value = true;
        }, 1000);
      }, 500);
    });

    const generarCita = () => {
      router.push({ path: '/nueva-cita' });
    };

    return {
      animationStarted,
      animationComplete,
      generarCita,
    };
  },
});
</script>
