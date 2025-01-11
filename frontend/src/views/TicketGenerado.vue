<template>
  <!-- Contenedor principal -->
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
    <div class="bg-white p-10 rounded-2xl shadow-lg max-w-3xl w-full space-y-6">
      <!-- Encabezado -->
      <div class="text-center">
        <img class="mx-auto h-20 w-auto" src="@/assets/logo.png" alt="TNM Logo" />
        <h2 class="mt-6 text-2xl lg:text-3xl font-extrabold text-[#1B396A]">Detalles de tu Ticket</h2>
        <p class="text-gray-500 text-sm mt-2">Verifica la información de tu trámite</p>
      </div>

      <!-- Detalles del Ticket -->
      <div class="bg-gray-100 p-6 rounded-lg shadow-inner space-y-4">
        <div class="flex justify-between items-center border-b pb-2">
          <span class="text-sm text-gray-600 font-medium">Tipo de Trámite:</span>
          <span class="text-base font-semibold text-[#1B396A]">{{ tipoTramite?.nombre }}</span>
        </div>
        <div class="flex justify-between items-center border-b pb-2">
          <span class="text-sm text-gray-600 font-medium">Fecha Programada:</span>
          <span class="text-base font-semibold text-[#1B396A]">{{ fechaProgramada?.toLocaleDateString('es-MX') }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600 font-medium">Hora:</span>
          <span class="text-base font-semibold text-[#1B396A]">{{ fechaProgramada?.toLocaleTimeString('es-MX') }}</span>
        </div>
      </div>

      <!-- Nota Importante -->
      <div class="bg-[#EAF3FF] border-l-4 border-[#1B396A] text-[#1B396A] p-4 rounded-lg shadow-sm">
        <h3 class="font-semibold text-sm mb-2">Nota Importante</h3>
        <p class="text-sm leading-relaxed">Asegúrate de tener todos los documentos necesarios para tu trámite.</p>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-col gap-4">
        <button
          @click="addToGoogleCalendar"
          class="w-full py-3 px-4 bg-[#1B396A] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#294d8e] transition-transform transform hover:scale-105"
        >
          Agregar a Google Calendar
        </button>

        <button
          @click="downloadICSFile"
          class="w-full py-3 px-4 bg-gray-200 text-[#1B396A] text-sm font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105"
        >
          Agregar a Calendario iOS
        </button>

        <button
          @click="openModal"
          class="w-full py-3 px-4 bg-[#1B396A] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#294d8e] transition-transform transform hover:scale-105"
        >
          Ver lista de Materias
        </button>
      </div>
    </div>

    <!-- Modal para el PDF -->
    <div v-if="isModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 relative">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        <div v-if="pdfUrl" class="w-full h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
          <iframe :src="pdfUrl" class="w-full h-full border-0"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>




<script lang="ts">
import { TramiteConfig } from 'shared-types';
import { defineComponent, ref, onMounted } from 'vue';
import {loadPDF} from '@/services/materias';
export default defineComponent({
  name: 'TicketInfo',
  setup() {
    const tipoTramite = ref<TramiteConfig>();
    const fechaProgramada = ref<Date | null>(null);
    const pdfUrl = ref<string | undefined>(undefined);
    const isModalVisible = ref(false);
    onMounted(() => {
       loadPDF().then((res) => pdfUrl.value = res);
      try {
        const savedTicket = localStorage.getItem('ticket');
        if (savedTicket) {
          const ticket = JSON.parse(savedTicket);
          tipoTramite.value = ticket.tipoTramite;
          fechaProgramada.value = new Date(ticket.fechaProgramada);
        }
      } catch (error) {
        console.error('Error al recuperar el ticket:', error);
      }
    });

    // Agregar a Google Calendar
    const addToGoogleCalendar = () => {
      if (!fechaProgramada.value || !tipoTramite.value) return;

      const startDate = fechaProgramada.value.toISOString().replace(/[-:]/g, '').split('.')[0];
      const endDate = new Date(fechaProgramada.value.getTime() + 30 * 60000) // Duración: +30 min
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0];

      const baseUrl = 'https://calendar.google.com/calendar/render';
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: tipoTramite.value.nombre,
        dates: `${startDate}/${endDate}`,
        details: 'Recuerda llevar todos tus documentos necesarios.',
        location: 'Oficina de Trámites',
      });

      window.open(`${baseUrl}?${params}`, '_blank');
    };

    // Descargar archivo ICS para iOS
    const downloadICSFile = () => {
      if (!fechaProgramada.value || !tipoTramite.value) return;

      const startDate = fechaProgramada.value.toISOString().replace(/[-:]/g, '').split('.')[0];
      const endDate = new Date(fechaProgramada.value.getTime() + 30 * 60000) // Duración: +30 min
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0];

      const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${tipoTramite.value}
DESCRIPTION:Recuerda llevar todos tus documentos necesarios.
LOCATION:Oficina de Trámites
END:VEVENT
END:VCALENDAR
      `.trim();

      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'evento.ics';
      a.click();
      URL.revokeObjectURL(url);
    };

    const openModal = () => {
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    return {
      tipoTramite,
      fechaProgramada,
      addToGoogleCalendar,
      downloadICSFile,
      pdfUrl,
      isModalVisible,
      openModal,
      closeModal,
    };
  },
});
</script>
