<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 overflow-hidden">
    <div 
      :class="[
        'transition-all duration-1000 ease-in-out transform',
        animationStarted ? (animationComplete ? 'translate-y-[-20vh] scale-75' : 'translate-y-0 scale-100') : 'opacity-0 scale-150'
      ]"
    >
      <img 
        alt="TNM Logo" 
        src="@/assets/logo.png" 
        class=" h-64 mb-8"
      >
    </div>

    <div 
      :class="[
        'text-center px-4 transition-all duration-1000 ease-out transform',
        animationComplete ? 'opacity-100 translate-y-0 mt-16' : 'opacity-0 translate-y-10 mt-0'
      ]"
    >
      <h1 class="text-4xl font-bold mb-6 text-[#1B396A]">
        Bienvenido a CITATEC
      </h1>
      <p class="text-xl mb-8 text-gray-700">
        Control de Inscripciones y Turnos Asignados para Tecnología en Sistemas Computacionales
      </p>
      <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button 
          @click="register" 
          class="px-6 py-3 bg-[#1B396A] text-white font-semibold rounded-lg shadow-md hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-[#1B396A] focus:ring-opacity-75 transition-colors duration-200"
        >
          Registrarse
        </button>
        <button 
          @click="login" 
          class="px-6 py-3 bg-white text-[#1B396A] font-semibold rounded-lg shadow-md border border-[#1B396A] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1B396A] focus:ring-opacity-75 transition-colors duration-200"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { outputLog } from 'shared-types';
export default defineComponent({
  name: 'LandingPage',
  setup() {
    const animationStarted = ref(false);
    const animationComplete = ref(false);

    onMounted(() => {
      // Iniciar la animación después de un breve retraso
      setTimeout(() => {
        animationStarted.value = true;
        
        // Mover el logo hacia arriba después de que aparezca
        setTimeout(() => {
          animationComplete.value = true;
        }, 1000);
      }, 500);
    });

    const register = () => {
      outputLog('Redirigiendo a la página de registro...');
      // Aquí puedes agregar la lógica para redirigir a la página de registro
    };

    const login = () => {
      outputLog('Redirigiendo a la página de inicio de sesión...');
      // Aquí puedes agregar la lógica para redirigir a la página de inicio de sesión
    };

    return {
      animationStarted,
      animationComplete,
      register,
      login,
    };
  },
});
</script>