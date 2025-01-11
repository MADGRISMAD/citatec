<template>
<!-- Contenedor principal con flex -->
<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <!-- Contenedor para ticket y PDF -->
  <div class="max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
    
    <!-- Ticket Section -->
    <div class="w-full lg:w-1/2">
      <div class="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <!-- Header -->
        <div class="text-center">
          <img class="mx-auto h-20 w-auto" src="@/assets/logo.png" alt="TNM Logo" />
          <h2 class="mt-4 text-2xl font-bold text-[#1B396A]">Detalles de tu Ticket</h2>
        </div>

        <!-- Ticket Details -->
        <div class="mt-8 bg-gray-50 p-6 rounded-lg space-y-4">
          <div class="flex justify-between items-center border-b pb-2">
            <span class="text-sm text-gray-600">Tipo de Trámite:</span>
            <span class="font-medium text-base text-[#1B396A]">{{ tipoTramite?.nombre }}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-2">
            <span class="text-sm text-gray-600">Fecha Programada:</span>
            <span class="font-medium text-base text-[#1B396A]">{{ fechaProgramada?.toLocaleDateString('es-MX') }}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-2">
            <span class="text-sm text-gray-600">Hora:</span>
            <span class="font-medium text-base text-[#1B396A]">{{ fechaProgramada?.toLocaleTimeString('es-MX') }}</span>
          </div>
        </div>

        <!-- Alert Section -->
        <div class="mt-6 bg-[#F0F5FF] border-l-4 border-[#1B396A] text-[#1B396A] p-4 rounded-r-lg shadow-sm">
          <h3 class="font-semibold text-sm mb-1">Nota Importante</h3>
          <p class="text-sm">Asegúrate de tener todos los documentos necesarios para tu trámite.</p>
        </div>

        <!-- Add to Calendar Buttons -->
        <div class="mt-8 flex flex-col space-y-4">
          <button
            @click="addToGoogleCalendar"
            class="w-full py-3 px-4 bg-[#1B396A] text-white text-sm font-medium rounded-lg shadow-md hover:bg-[#294d8e] transition-transform transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7v-5z" />
            </svg>
            <span>Agregar a Google Calendar</span>
          </button>

          <button
            @click="downloadICSFile"
            class="w-full py-3 px-4 bg-gray-100 text-[#1B396A] text-sm font-medium rounded-lg shadow-md hover:bg-gray-200 transition-transform transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h11M9 21V3m0 18h3" />
            </svg>
            <span>Agregar a Calendario iOS</span>
          </button>
        </div>
      </div>
    </div>

    <!-- PDF Section -->
    <div class="w-full lg:w-1/2">
      <div class="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <!-- Aquí va tu componente PDF -->
        <h2 class="text-2xl font-bold text-[#1B396A] text-center mb-4">PDF del Ticket</h2>
        <!-- Contenido del PDF -->
        <div v-if="pdfUrl" class="w-full h-[600px]">
            <iframe :src="pdfUrl" class="w-full h-full border-0"></iframe>
          </div>
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

    return {
      tipoTramite,
      fechaProgramada,
      addToGoogleCalendar,
      downloadICSFile,
      pdfUrl,
    };
  },
});
</script>
