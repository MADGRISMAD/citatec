<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div class="flex items-center">
          <img class="h-10 w-auto mr-4" src="@/assets/logo.png" alt="TNM Logo">
          <h1 class="text-3xl font-bold text-[#1B396A]">Dashboard del Coordinador</h1>
        </div>
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
              <p class="text-lg font-medium text-[#1B396A]">Ticket #{{ ticketEnAtencion.id }}</p>
              <p class="text-sm text-gray-500">{{ ticketEnAtencion.service }}</p>
              <p class="text-sm text-gray-500">{{ ticketEnAtencion.userData.name }}</p>
            </div>
            <button @click="cerrarTicket(ticketEnAtencion.id)" 
                    class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
              Cerrar Ticket
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de Tickets -->
      <div class="px-4 py-6 sm:px-0">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">Tickets Entrantes</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul class="divide-y divide-gray-200">
            <li v-for="ticket in ticketsActivos" :key="ticket.id" class="px-6 py-4 hover:bg-gray-50">
              <div @click="toggleTicketDetails(ticket.id)" class="cursor-pointer">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-lg font-medium text-[#1B396A] truncate">
                        Ticket #{{ ticket.id }}
                      </p>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {{ ticket.status }}
                        </p>
                      </div>
                    </div>
                    <p class="mt-2 flex items-center text-sm text-gray-500">
                      <span class="truncate">{{ ticket.service }}</span>
                    </p>
                    <p class="mt-1 flex items-center text-xs text-gray-500">
                      <span>{{ ticket.timestamp }}</span>
                    </p>
                  </div>
                  <div class="ml-4">
                    <button @click.stop="atenderTicket(ticket.id)" 
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
                      Atender
                    </button>
                  </div>
                </div>
                
                <!-- Detalles del usuario (expandible) -->
                <div v-if="ticket.showDetails" class="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 class="text-lg font-semibold mb-2 text-[#1B396A]">Detalles del Usuario</h4>
                  <p><strong>Nombre:</strong> {{ ticket.userData.name }}</p>
                  <p><strong>Matrícula:</strong> {{ ticket.userData.studentId }}</p>
                  <p><strong>Correo:</strong> {{ ticket.userData.email }}</p>
                  <p><strong>Carrera:</strong> {{ ticket.userData.major }}</p>
                  <p><strong>Semestre:</strong> {{ ticket.userData.semester }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  
  interface UserData {
    name: string;
    studentId: string;
    email: string;
    major: string;
    semester: number;
  }
  
  interface Ticket {
    id: number;
    service: string;
    status: 'Activo' | 'Atendiendo' | 'Atendido';
    timestamp: string;
    userData: UserData;
    showDetails: boolean;
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
      const tickets = ref<Ticket[]>([
        {
          id: 1,
          service: 'Reinscripción',
          status: 'Activo',
          timestamp: '2024-05-29 10:30:00',
          userData: {
            name: 'Juan Pérez',
            studentId: 'A12345678',
            email: 'juan.perez@estudiante.tecnm.mx',
            major: 'Ingeniería en Sistemas Computacionales',
            semester: 6
          },
          showDetails: false
        },
        {
          id: 2,
          service: 'Baja de materias',
          status: 'Activo',
          timestamp: '2024-05-29 10:35:00',
          userData: {
            name: 'María González',
            studentId: 'A87654321',
            email: 'maria.gonzalez@estudiante.tecnm.mx',
            major: 'Ingeniería Industrial',
            semester: 4
          },
          showDetails: false
        },
        {
          id: 3,
          service: 'Solicitud de constancia',
          status: 'Activo',
          timestamp: '2024-05-29 10:40:00',
          userData: {
            name: 'Carlos Rodríguez',
            studentId: 'A23456789',
            email: 'carlos.rodriguez@estudiante.tecnm.mx',
            major: 'Ingeniería Mecánica',
            semester: 8
          },
          showDetails: false
        },
      ]);
  
      const stats = ref<Stats>({
        avgWaitTime: 15,
        waitingPeople: 8,
        totalPeople: 20,
        ticketsAttendedToday: 12,
        attendanceEfficiency: 85
      });
  
      const ticketEnAtencion = ref<Ticket | null>(null);
  
      const ticketsActivos = computed(() => {
        return tickets.value.filter(t => t.status === 'Activo');
      });
  
      const toggleTicketDetails = (id: number) => {
        const ticket = tickets.value.find(t => t.id === id);
        if (ticket) {
          ticket.showDetails = !ticket.showDetails;
        }
      };
  
      const atenderTicket = (id: number) => {
        const ticket = tickets.value.find(t => t.id === id);
        if (ticket && ticket.status === 'Activo') {
          ticket.status = 'Atendiendo';
          ticketEnAtencion.value = ticket;
          // Actualizar estadísticas
          stats.value.waitingPeople--;
        }
      };
  
      const cerrarTicket = (id: number) => {
        const ticket = tickets.value.find(t => t.id === id);
        if (ticket && ticket.status === 'Atendiendo') {
          ticket.status = 'Atendido';
          ticketEnAtencion.value = null;
          // Actualizar estadísticas
          stats.value.ticketsAttendedToday++;
          stats.value.attendanceEfficiency = Math.round((stats.value.ticketsAttendedToday / stats.value.totalPeople) * 100);
        }
      };
  
      return {
        tickets,
        stats,
        ticketEnAtencion,
        ticketsActivos,
        toggleTicketDetails,
        atenderTicket,
        cerrarTicket
      };
    }
  });
  </script>