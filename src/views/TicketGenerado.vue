<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <img class="mx-auto h-24 w-auto" src="@/assets/logo.png" alt="TNM Logo">
        <h2 class="mt-6 text-3xl font-extrabold text-[#1B396A]">
          Tu Ticket
        </h2>
      </div>
      
      <div class="border-4 border-[#1B396A] rounded-lg p-6 text-center bg-[#E6EBF4]">
        <p class="text-6xl font-bold text-[#1B396A] mb-2">{{ ticketId }}</p>
        <p class="text-xl font-semibold text-[#1B396A]">Número de ticket</p>
      </div>

      <div class="space-y-4 bg-gray-50 p-6 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Posición en la fila:</span>
          <span class="font-semibold text-lg text-[#1B396A]">{{ queuePosition }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Total de tickets:</span>
          <span class="font-semibold text-lg text-[#1B396A]">{{ totalTickets }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Tiempo de espera:</span>
          <span class="font-semibold text-lg text-[#1B396A]">{{ estimatedWaitTime }} min</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Personas esperando:</span>
          <span class="font-semibold text-lg text-[#1B396A]">{{ peopleWaiting }}</span>
        </div>
      </div>

      <div class="mt-6 bg-[#E6EBF4] border-l-4 border-[#1B396A] text-[#1B396A] p-4 rounded-r-lg" role="alert">
        <p class="font-bold mb-1">Importante</p>
        <p>Guarda este número de ticket: <span class="font-mono font-bold text-[#294d8e]">{{ ticketId }}</span></p>
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
    const ticketId = ref('');
    const queuePosition = ref(0);
    const totalTickets = ref(0);
    const estimatedWaitTime = ref(0);
    const peopleWaiting = ref(0);

    const generateTicketId = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    onMounted(() => {
      // Simular la obtención de datos
      ticketId.value = generateTicketId();
      queuePosition.value = Math.floor(Math.random() * 10) + 1;
      totalTickets.value = Math.floor(Math.random() * 50) + 20;
      estimatedWaitTime.value = queuePosition.value * 5; // 5 minutos por persona
      peopleWaiting.value = queuePosition.value - 1;
    });

    const closeTicket = () => {
      // Lógica para cerrar el ticket o redirigir al usuario
      console.log('Cerrando ticket');
    };

    return {
      ticketId,
      queuePosition,
      totalTickets,
      estimatedWaitTime,
      peopleWaiting,
      closeTicket
    };
  }
});
</script>