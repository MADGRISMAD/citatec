<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <img class="mx-auto h-24 w-auto" src="@/assets/logo.png" alt="TNM Logo">
        <h2 class="mt-6 text-3xl font-extrabold text-[#1B396A]">
          Tu Ticket
        </h2>
      </div>

      <div class="space-y-4 bg-gray-50 p-6 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Tipo de Trámite:</span>
          <span class="font-semibold text-lg text-[#1B396A]">{{ tipoTramite }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Fecha Programada:</span>
          <span class="font-semibold text-lg text-[#1B396A]">{{ fechaProgramada?.toLocaleDateString('es-MX') }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Hora:</span>
          <span class="font-semibold text-lg text-[#1B396A]">{{ fechaProgramada?.toLocaleTimeString('es-MX') }}</span>
        </div>
        <div v-if="estimatedWaitTime !== null" class="flex justify-between items-center">
          <span class="text-gray-600">Tiempo estimado de espera:</span>
          <span class="font-semibold text-lg text-[#1B396A]">{{ estimatedWaitTime }} min</span>
        </div>
      </div>

      <div class="mt-6 bg-[#E6EBF4] border-l-4 border-[#1B396A] text-[#1B396A] p-4 rounded-r-lg" role="alert">
        <p class="font-bold mb-1">Importante</p>
        <p>Por favor, asegúrate de estar preparado para tu trámite.</p>
      </div>

      <div class="mt-8">
        <button @click="closeTicket" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A] transition duration-150 ease-in-out transform hover:scale-105">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'TicketInfo',
  setup() {
    const tipoTramite = ref<string | null>(null);
    const fechaProgramada = ref<Date | null>(null);
    const estimatedWaitTime = ref<number | null>(null); // Calculado manualmente si es necesario

    onMounted(() => {
      try {
        const savedTicket = localStorage.getItem('ticket');
        if (savedTicket) {
          const ticket = JSON.parse(savedTicket);
          tipoTramite.value = ticket.tipoTramite;
          fechaProgramada.value = new Date(ticket.fechaProgramada);

          // Si necesitas tiempo de espera simulado, lo puedes calcular aquí
          estimatedWaitTime.value = 5; // Ejemplo: espera de 5 minutos por defecto
        } else {
          console.error('No se encontró información del ticket en el almacenamiento local.');
        }
      } catch (error) {
        console.error('Error al parsear el ticket desde localStorage:', error);
      }
    });

    const closeTicket = () => {
      localStorage.removeItem('ticket'); // Elimina el ticket del almacenamiento local
      alert('Ticket cerrado.'); // O redirige a otra página si es necesario
    };

    return {
      tipoTramite,
      fechaProgramada,
      estimatedWaitTime,
      closeTicket
    };
  }
});
</script>
