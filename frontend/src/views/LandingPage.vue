<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 overflow-hidden px-4">
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
        class="h-40 sm:h-48 lg:h-56 mb-6"
      >

      <!-- Texto principal -->
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-[#1B396A]">
        Bienvenido a <span class="text-[#1B396A]">CITATEC</span>
      </h1>

      <!-- Descripción -->
      <p class="text-sm sm:text-base lg:text-lg text-gray-700 mb-8 leading-relaxed">
        Control de Inscripciones y Turnos Asignados para Tecnología en Sistemas Computacionales
      </p>

      <!-- Botones principales -->
      <div class="space-y-4">
        <button 
          @click="nuevaCita" 
          class="px-8 py-3 bg-[#1B396A] text-white font-semibold rounded-lg shadow-lg hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-[#1B396A] focus:ring-opacity-75 transition-transform duration-200 transform hover:scale-105"
        >
          Nueva Cita
        </button>
        <button 
          @click="enviarNotificacion" 
          class="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-transform duration-200 transform hover:scale-105"
        >
          Probar Notificación
        </button>
      </div>
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
    const router = useRouter(); // Agregar router para redirección

    onMounted(() => {
      setTimeout(() => {
        animationStarted.value = true;
        setTimeout(() => {
          animationComplete.value = true;
        }, 1000);
      }, 500);
    });

    const nuevaCita = () => {
      router.push({ path: '/nueva-cita' }); // Redirige a la ruta deseada
    };

    const enviarNotificacion = async () => {
      if (!('Notification' in window)) {
        alert('Tu navegador no soporta notificaciones.');
        return;
      }

      if (Notification.permission === 'granted') {
        mostrarNotificacion();
      } else if (Notification.permission !== 'denied') {
        const permiso = await Notification.requestPermission();
        if (permiso === 'granted') {
          mostrarNotificacion();
        } else {
          alert('Permiso denegado para notificaciones.');
        }
      }
    };

    const mostrarNotificacion = () => {
      new Notification('Notificación de prueba', {
        body: 'Esta es una notificación de prueba para tu PWA.',
        icon: '@/assets/logo.png',
      });
    };

    return {
      animationStarted,
      animationComplete,
      nuevaCita,
      enviarNotificacion,
    };
  },
});
</script>
