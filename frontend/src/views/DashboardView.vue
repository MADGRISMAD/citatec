<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div class="flex items-center">
          <img class="h-10 w-auto mr-4" src="@/assets/logo.png" alt="TNM Logo">
          <h1 class="text-3xl font-bold text-[#1B396A]">Dashboard del Coordinador</h1>
        </div>
        
        <!-- <button v-if="view==='main'" @click="toggleView()" class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#808080] hover:bg-[#808080] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
          Todos los tickets
        </button>
        <button v-else @click="toggleView()" class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#808080] hover:bg-[#808080] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
          Vista centralizada
        </button> -->

        <button class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
          Cerrar Sesión
        </button>
      </div>
    </header>
    
    <!-- Estadísticas -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-3 text-sm">
          <div class="text-center">
            <span class="text-gray-500">Tiempo espera:</span>
            <span class="font-semibold text-[#1B396A] ml-1">{{ stats.avgWaitTime }} min</span>
          </div>
          <div class="text-center">
            <span class="text-gray-500">En espera:</span>
            <span class="font-semibold text-[#1B396A] ml-1">{{ stats.waitingPeople }} / {{ stats.totalPeople }}</span>
          </div>
          <div class="text-center">
            <span class="text-gray-500">Atendidos hoy:</span>
            <span class="font-semibold text-[#1B396A] ml-1">{{ stats.ticketsAttendedToday }}</span>
          </div>
          <div class="text-center">
            <span class="text-gray-500">Eficiencia:</span>
            <span class="font-semibold text-[#1B396A] ml-1">{{ stats.attendanceEfficiency }}%</span>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Ticket en atención -->
      <div v-if="ticketEnAtencion" class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">Ticket en Atención</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-lg font-medium text-[#1B396A]">Ticket Num. Control {{ ticketEnAtencion.numeroDeControl }}</p>
              <p class="text-lg font-medium text-[#1B396A]">Hora de inicio: {{ new Date(ticketEnAtencion.fechaProgramada).toLocaleTimeString("es-MX") }}</p>
              <!-- <p class="text-lg font-medium text-[#1B396A]">Duracion: {{ tramites.filter(t => t.tramite === ticketEnAtencion?.tipoTramite)[0].duration }} min</p> -->
              <p class="text-sm text-gray-500">{{ ticketEnAtencion.tipoTramite }}</p>
            </div>
            <button @click="cerrarTicket(ticketEnAtencion.tipoTramite.nombre, ticketEnAtencion.id)" 
                    class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
              Cerrar Ticket
            </button>
          </div>
        </div>
      </div>

      <div v-else class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">No hay tickets en atención</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <p class="text-lg text-[#1B396A]">¡Excelente trabajo!</p>
          <p class="text-sm text-gray-500">No hay tickets en atención en este momento.</p>
          <p class="text-sm text-gray-500">Reintentando en {{ timer }} segundos
          </p>
        </div>
      </div>

      <!-- Lista de Tickets -->
      <div v-if="tickets" class="px-4 py-6 sm:px-0">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">Tickets Entrantes</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul class="divide-y divide-gray-200">
<<<<<<< HEAD
            <li v-for="ticket in tickets" :key="ticket.id" class="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition">
              <div>
                <p class="text-lg font-medium text-[#1B396A]">Número de Control: {{ ticket.numeroDeControl }}</p>
                <p class="text-sm text-gray-500">{{ ticket.tipoTramite }}</p>
=======
            <li v-for="ticket in tickets" :key="ticket.id" class="px-6 py-4 hover:bg-gray-50">
              <div class="mb-8">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-lg font-medium text-[#1B396A]">Ticket Num. Control {{ ticket.numeroDeControl }}</p>
              <p class="text-lg font-medium text-[#1B396A]">Hora de inicio: {{ new Date(ticket.fechaProgramada).toLocaleTimeString("es-MX") }}</p>
              <!-- <p class="text-lg font-medium text-[#1B396A]">Duracion: {{ tramites.filter(t => t.tramite === ticket.tipoTramite)[0].duration }} min</p> -->
              <p class="text-sm text-gray-500">{{ ticket.tipoTramite }}</p>
            </div>
            <!-- <button @click="focusTicket(ticket.id)" 
                    class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
              Centrarse en este Ticket
            </button> -->
          </div>
           
                 <!-- Detalles del usuario (expandible) -->
                <!-- <div v-if="ticket.showDetails" class="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 class="text-lg font-semibold mb-2 text-[#1B396A]">Detalles del Usuario</h4>
                  <p><strong>Nombre:</strong> {{ ticket.userData.name }}</p>
                  <p><strong>Matrícula:</strong> {{ ticket.userData.studentId }}</p>
                  <p><strong>Correo:</strong> {{ ticket.userData.email }}</p>
                  <p><strong>Carrera:</strong> {{ ticket.userData.major }}</p>
                  <p><strong>Semestre:</strong> {{ ticket.userData.semester }}</p>
                </div> -->
              </div>
>>>>>>> ddeea792ba0ad18e89981e9d4c4c9bf7bce86bf9
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { outputLog, Ticket, TicketEstado } from 'shared-types';
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

      const view = ref<"main"|"all">("main");
      const ticketEnAtencion = ref<Ticket | null>(null);
      const tickets = ref<Ticket[]>([]);

      obtenerTramites().then(array => {
        // tramites.value = array;
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

      const cerrarTicket = async (tramite: string, id: string) => {
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
        // tramites,
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