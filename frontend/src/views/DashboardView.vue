<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <img class="h-12 w-auto" src="@/assets/logo.png" alt="TNM Logo">
          <h1 class="text-4xl font-bold text-[#1B396A]">Dashboard del Coordinador</h1>
        </div>
        <button 
          @click="$router.push('/reporte')" 
          class="bg-[#1B396A] text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl hover:bg-[#294d8e] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
          Generar Reporte
        </button>
      </div>
    </header>

    <!-- Dashboard Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Stats -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <p class="text-sm text-gray-600">⏳ Tiempo de espera promedio</p>
          <p class="text-2xl font-bold text-[#1B396A]">{{ stats.avgWaitTime }} min</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <p class="text-sm text-gray-600">👥 Personas en espera</p>
          <p class="text-2xl font-bold text-[#1B396A]">{{ stats.waitingPeople }} / {{ stats.totalPeople }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <p class="text-sm text-gray-600">✅ Atendidos hoy</p>
          <p class="text-2xl font-bold text-[#1B396A]">{{ stats.ticketsAttendedToday }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <p class="text-sm text-gray-600">📈 Eficiencia</p>
          <p class="text-2xl font-bold text-[#1B396A]">{{ stats.attendanceEfficiency }}%</p>
        </div>
      </section>

      <!-- Current Ticket -->
      <section v-if="ticketEnAtencion" class="mb-10">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="bg-[#1B396A] text-white p-6">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-xl font-bold">Número de Control: {{ ticketEnAtencion.numeroDeControl }}</p>
                <p class="text-sm opacity-90">Alumno en atención actualmente</p>
              </div>
              <button 
                @click="cerrarTicket(ticketEnAtencion.tipoTramite, ticketEnAtencion.id)" 
                class="bg-white text-[#1B396A] px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                Cerrar Ticket
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <p class="text-sm text-gray-600">📅 Hora de inicio</p>
              <p class="text-lg font-semibold text-[#1B396A]">{{ new Date(ticketEnAtencion.fechaProgramada).toLocaleTimeString("es-MX") }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <p class="text-sm text-gray-600">⏳ Duración</p>
              <p class="text-lg font-semibold text-[#1B396A]">{{ tramites.filter(t => t.tramite === ticketEnAtencion?.tipoTramite)[0].duration }} min</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <p class="text-sm text-gray-600">📝 Trámite</p>
              <p class="text-lg font-semibold text-[#1B396A]">{{ ticketEnAtencion.tipoTramite }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <p class="text-sm text-gray-600">💬 Descripción</p>
              <p class="text-lg font-semibold text-[#1B396A]">{{ ticketEnAtencion.descripcion }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- No Tickets -->
      <section v-else class="mb-10">
        <div class="bg-white shadow-lg rounded-lg p-8 text-center">
          <h2 class="text-2xl font-bold text-[#1B396A] mb-4">No hay alumnos en atención</h2>
          <p class="text-gray-600">No hay trámites pendientes en este momento.</p>
          <p class="text-sm text-gray-500 mt-2">Reintentando en <span class="text-[#1B396A] font-bold">{{ timer }}</span> segundos...</p>
        </div>
      </section>

      <!-- Tickets List -->
      <section v-if="tickets">
        <h2 class="text-3xl font-bold text-[#1B396A] mb-8">📋 Tickets Entrantes</h2>
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <ul class="divide-y divide-gray-200">
            <li v-for="ticket in tickets" :key="ticket.id" class="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition">
              <div>
                <p class="text-lg font-medium text-[#1B396A]">Número de Control: {{ ticket.numeroDeControl }}</p>
                <p class="text-sm text-gray-500">{{ ticket.tipoTramite }}</p>
              </div>
              <p class="text-sm text-gray-500">{{ new Date(ticket.fechaProgramada).toLocaleTimeString("es-MX") }}</p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>






  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { outputLog, SetTramiteDuration, Ticket, TicketEstado, TramiteType } from 'shared-types';
import { eliminarTicket, obtenerSiguienteTicket, obtenerTicketsDelDia } from '@/services/ticket';
import { obtenerTramites } from '@/services/tramite';
import { REFRESH_RATE } from '@/constants/refresh';
  interface UserData {
    name: string;
    studentId: string;
    email: string;
    major: string;
    semester: number;
  }

  
  interface Stats {
    avgWaitTime: number;
    waitingPeople: number;
    totalPeople: number;
    ticketsAttendedToday: number;
    attendanceEfficiency: number;
  }
  
  export default defineComponent({
    name: 'DashboardView',
    setup() {  
      let timer = ref<number>(REFRESH_RATE);
      const tramites = ref<SetTramiteDuration[]>([]);

      const view = ref<"main"|"all">("main");
      const ticketEnAtencion = ref<Ticket | null>(null);
      const tickets = ref<Ticket[]>([]);

      obtenerTramites().then(array => {
        tramites.value = array;
      });

      obtenerTicketsDelDia().then(array => {
        tickets.value = array;
        ticketEnAtencion.value = tickets.value.splice(0, 1)[0];
      });
  
      // const ticketsActivos = computed(() => {
      //   return tickets.value.filter(t => t.status === 'Activo');
      // });
  
      const stats = ref<Stats>({
        avgWaitTime: 15,
        waitingPeople: 8,
        totalPeople: 20,
        ticketsAttendedToday: 12,
        attendanceEfficiency: 85
      });

  
      // const atenderTicket = (id: number) => {
      //   const ticket = tickets.value.find(t => t.id === id);
      //   if (ticket && ticket.status === 'Activo') {
      //     ticket.status = 'Atendiendo';
      //     ticketEnAtencion.value = ticket;
      //     // Actualizar estadísticas
      //     stats.value.waitingPeople--;
      //   }
      // };
  
      // const focusTicket = (id: string) => {
      //   const ticket = tickets.value.find(t => t.id === id);
      //   if (ticket) {
      //     let i = 0;
      //     // Encontrar la posición correcta
      //     while (i < tickets.value.length && new Date(tickets.value[i].fechaProgramada).getTime() < new Date(ticketEnAtencion.value.fechaProgramada).getTime()) {
      //         i++;
      //     }
      //     // Insertar el elemento moviendo los demás
      //     tickets.value.splice(i, 0, ticketEnAtencion.value as Ticket);
      //     ticketEnAtencion.value = ticket;
      //     tickets.value = tickets.value.filter(t => t.id !== ticket.id);
      //   }
      // };

      const cerrarTicket = async (tramite: TramiteType, id: string) => {
        await eliminarTicket(tramite, id, true, TicketEstado.ATENDIDO);
        ticketEnAtencion.value = tickets.value.splice(0, 1)[0];
        // Actualizar estadísticas
        stats.value.ticketsAttendedToday++;
      };
      
      const startTimer = () => {
        setInterval(() => {
          if (timer.value > 0) {
            timer.value--;
          } else {
            timer.value = REFRESH_RATE;
            outputLog('Obteniendo siguiente ticket...');
            obtenerTicketsDelDia().then(ticket => {
              tickets.value = ticket;
              ticketEnAtencion.value = tickets.value.splice(0, 1)[0];
            });
          }
        }, 1000);
      };

      onMounted(() => {
        startTimer()
      })

      const toggleView = () => {
        view.value = view.value === 'main' ? 'all' : 'main';
      };

      return {
        // focusTicket,
        tramites,
        timer,
        view,
        tickets,
        stats,
        ticketEnAtencion,
        // ticketsActivos,
        // atenderTicket,
        cerrarTicket,
        toggleView
      };
      
    }
  });
  </script>