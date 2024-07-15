<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <img class="mx-auto h-20 w-auto" src="@/assets/logo.png" alt="TNM Logo">
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Tu Ticket
          </h2>
        </div>
        
        <div class="border-4 border-indigo-500 rounded-lg p-6 text-center">
          <p class="text-5xl font-bold text-indigo-600 mb-4">{{ ticketId }}</p>
          <p class="text-xl font-semibold">Número de ticket</p>
        </div>
  
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Posición en la fila:</span>
            <span class="font-semibold text-lg">{{ queuePosition }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Total de tickets generados:</span>
            <span class="font-semibold text-lg">{{ totalTickets }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Tiempo de espera aproximado:</span>
            <span class="font-semibold text-lg">{{ estimatedWaitTime }} minutos</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Personas esperando:</span>
            <span class="font-semibold text-lg">{{ peopleWaiting }}</span>
          </div>
        </div>
  
        <div class="mt-6 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p class="font-bold">Importante</p>
          <p>Guarda este número de ticket: <span class="font-mono font-bold">{{ ticketId }}</span></p>
        </div>
  
        <div class="mt-6">
          <button @click="closeTicket" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
        // Aquí simularemos la obtención de datos
        // En una implementación real, estos datos vendrían de tu backend
        ticketId.value = generateTicketId();
        queuePosition.value = Math.floor(Math.random() * 10) + 1;
        totalTickets.value = Math.floor(Math.random() * 50) + 20;
        estimatedWaitTime.value = queuePosition.value * 5; // 5 minutos por persona
        peopleWaiting.value = queuePosition.value - 1;
      });
  
      const closeTicket = () => {
        // Aquí puedes agregar la lógica para cerrar el ticket o redirigir al usuario
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