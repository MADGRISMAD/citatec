<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <nav class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <img class="h-8 w-auto" src="@/assets/logo.png" alt="TNM Logo" />
        </div>

        <!-- Desktop Links -->
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a
            href="/dashboard"
            class="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
            aria-current="page"
          >
            Dashboard
          </a>
          <a
            href="/materias"
            class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Materias
          </a>
          <a
            href="/reporte"
            class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Reportes
          </a>
          <a
            href="/tramites"
            class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Trámites
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="absolute inset-y-0 right-0 flex items-center sm:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="sm:hidden" id="mobile-menu">
      <div class="space-y-1 pb-4 pt-2">
        <a
          href="/dashboard"
          class="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
          aria-current="page"
        >
          Dashboard
        </a>
        <a
          href="/materias"
          class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
        >
          Materias
        </a>
        <a
          href="/reporte"
          class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
        >
          Reportes
        </a>
        <a
          href="/tramites"
          class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
        >
          Trámites
        </a>
      </div>
    </div>
  </nav>
</header>



    <!-- Dashboard Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Stats -->
      <!-- <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
        <div
    :class="`p-6 rounded-lg shadow transition cursor-pointer ${workloadButtonClass}`"
    @click="showModal = true"
  >
    <p class="text-sm">📊 Porcentaje de carga de trabajo</p>
    <p class="text-2xl font-bold">{{ workloadPercentage }}%</p>
  </div>
      </section> -->

      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <!-- Modal Content -->
  <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
    <!-- Botón de Cierre -->
    <button
      @click="showModal = false"
      class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      &times;
    </button>
    <!-- Título -->
    <h2 class="text-2xl font-semibold text-[#1B396A] mb-6 text-center">
      Cambiar Capacidad Disponible
    </h2>
    <!-- Formulario -->
    <div class="space-y-4">
      <!-- Horas -->
      <div>
        <label for="hours" class="block text-sm font-medium text-gray-700">Horas:</label>
        <input
          v-model.number="newCapacityHours"
          type="number"
          min="0"
          id="hours"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#1B396A] focus:border-[#1B396A]"
        />
      </div>
      <!-- Minutos -->
      <div>
        <label for="minutes" class="block text-sm font-medium text-gray-700">Minutos:</label>
        <input
          v-model.number="newCapacityMinutes"
          type="number"
          min="0"
          max="59"
          id="minutes"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#1B396A] focus:border-[#1B396A]"
        />
      </div>
    </div>
    <!-- Botones -->
    <div class="mt-6 flex justify-end space-x-4">
      <button
        @click="showModal = false"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
      >
        Cancelar
      </button>
      <button
        @click="updateCapacity"
        class="px-4 py-2 text-sm font-medium text-white bg-[#1B396A] hover:bg-[#294d8e] rounded-lg focus:outline-none"
      >
        Actualizar
      </button>
    </div>
  </div>
</div>


      <!-- Current Ticket -->
      <section v-if="ticketEnAtencion" class="mb-10">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="bg-[#1B396A] text-white p-6">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-xl font-bold">Número de Control: {{ ticketEnAtencion.numeroDeControl }}</p>
                <p class="text-sm opacity-90">Alumno en atención actualmente</p>
              </div>
              <button @click="cerrarTicket(ticketEnAtencion.tipoTramite.nombre, ticketEnAtencion.id)"
                class="bg-white text-[#1B396A] px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                Cerrar Ticket
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <p class="text-sm text-gray-600">📅 Hora de inicio</p>
              <p class="text-lg font-semibold text-[#1B396A]">{{ new
                Date(ticketEnAtencion.fechaProgramada).toLocaleTimeString("es-MX") }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <p class="text-sm text-gray-600">⏳ Duración</p>
              <p class="text-lg font-semibold text-[#1B396A]">{{ ticketEnAtencion.tipoTramite.duration }} min</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <p class="text-sm text-gray-600">📝 Trámite</p>
              <p class="text-lg font-semibold text-[#1B396A]">{{ ticketEnAtencion.tipoTramite.nombre }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <p class="text-sm text-gray-600">💬 Descripción</p>
              <p class="text-lg font-semibold text-[#1B396A]">{{ ticketEnAtencion.descripcion }}</p>
            </div>
          </div>
        </div>
      </section>
      <div v-else class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">No hay tickets en atención</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <p class="text-lg text-[#1B396A]">¡Excelente trabajo!</p>
          <p class="text-sm text-gray-500">No hay tickets en atención en este momento.</p>
          <p class="text-sm text-gray-500">Reintentando en {{ timer }} segundos
          </p>
        </div>
      </div>

      <div v-if="tickets.length" class="px-4 py-6 sm:px-0">
  <h2 class="text-2xl font-semibold mb-6 text-[#1B396A]">Tickets Entrantes</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="ticket in tickets"
      :key="ticket.id"
      class="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-xl transition relative"
    >
      <!-- Badge de categoría -->
      <span
        class="absolute top-4 right-4 inline-block px-3 py-1 rounded-full text-sm font-medium"
        :class="getBadgeClass(ticket.tipoTramite.nombre)"
      >
        {{ ticket.tipoTramite.nombre }}
      </span>
      <!-- Número de Control -->
      <div>
        <p class="text-sm text-gray-500 mb-2">Número de Control:</p>
        <p class="text-lg font-bold text-[#1B396A]">{{ ticket.numeroDeControl }}</p>
      </div>
      <!-- Duración -->
      <div class="mt-4">
        <p class="text-sm text-gray-500 mb-2">Duración Estimada:</p>
        <p class="text-base font-medium text-gray-700">{{ ticket.tipoTramite.duration }} min</p>
      </div>
      <!-- Botón de acción -->
      
    </div>
  </div>
</div>
<div v-else class="px-4 py-6 sm:px-0 text-center">
  <h2 class="text-xl font-semibold text-gray-500">No hay tickets en cola</h2>
</div>


    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { outputLog, Ticket, TicketEstado } from 'shared-types';
import { eliminarTicket, obtenerTicketsDelDia } from '@/services/ticket';
import { obtenerTramites } from '@/services/tramite';
import { REFRESH_RATE } from '@/constants/refresh';

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
    const timer = ref<number>(REFRESH_RATE);
    const tickets = ref<Ticket[]>([]);
    const ticketEnAtencion = ref<Ticket | null>(null);
    const showModal = ref(false);
    const newCapacityHours = ref(5); // Capacidad inicial en horas
    const newCapacityMinutes = ref(0); // Capacidad inicial en minutos
    // Estadísticas iniciales
    const stats = ref<Stats>({
      avgWaitTime: 15,
      waitingPeople: 8,
      totalPeople: 100,
      ticketsAttendedToday: 0,
      attendanceEfficiency: 85,
    });

    // Calcular duración promedio de los trámites
    const avgTicketDuration = computed(() => {
      const totalDuration = tickets.value.reduce((sum, ticket) => sum + ticket.tipoTramite.duration, 0);
      return tickets.value.length > 0 ? Math.round(totalDuration / tickets.value.length) : 0;
    });
    const newCapacity = computed(() => {
      return (newCapacityHours.value * 60) + newCapacityMinutes.value;
    });
    const workloadPercentage = computed(() => {
      const totalTimeNeeded = tickets.value.length * avgTicketDuration.value; // Tiempo requerido para atender la cola
      return Math.round((totalTimeNeeded / newCapacity.value) * 100); // Porcentaje de carga
    });
    const workloadButtonClass = computed(() => {
      if (workloadPercentage.value <= 50) {
        return 'bg-green-500 text-white hover:shadow-lg'; // Verde (carga baja)
      } else if (workloadPercentage.value <= 100) {
        return 'bg-yellow-500 text-white hover:shadow-lg'; // Amarillo (carga media)
      } else {
        return 'bg-red-500 text-white hover:shadow-lg'; // Rojo (carga alta)
      }
    });

    const updateCapacity = () => {
      showModal.value = false;

    };

    // Calcular el porcentaje de tickets completados
    const completedPercentage = computed(() => {
      const totalTickets = stats.value.ticketsAttendedToday + tickets.value.length;
      return totalTickets > 0 ? Math.round((stats.value.ticketsAttendedToday / totalTickets) * 100) : 0;
    });

    

    // Obtener clase de badge
    const getBadgeClass = (tipoTramiteNombre: string) => {
  switch (tipoTramiteNombre) {
    case 'Beca':
      return 'bg-blue-500 text-white';
    case 'Constancia':
      return 'bg-green-500 text-white';
    case 'Certificado':
      return 'bg-yellow-500 text-black';
    case 'Inscripción':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};


    // Cerrar ticket
    const cerrarTicket = async (tramite: string, id: string) => {
      await eliminarTicket(tramite, id, true, TicketEstado.ATENDIDO);
      ticketEnAtencion.value = tickets.value.splice(0, 1)[0];
      stats.value.ticketsAttendedToday++;
      stats.value.waitingPeople--;
    };

    // Cargar tickets del día
    const cargarTickets = async () => {
      const data = await obtenerTicketsDelDia();
      tickets.value = data;
      ticketEnAtencion.value = tickets.value.splice(0, 1)[0];
      stats.value.waitingPeople = tickets.value.length; // Actualizar personas en espera
    };

    // Temporizador para recargar datos
    const startTimer = () => {
      setInterval(() => {
        if (timer.value > 0) {
          timer.value--;
        } else {
          timer.value = REFRESH_RATE;
          outputLog('Obteniendo siguiente ticket...');
          cargarTickets();
        }
      }, 1000);
    };

    onMounted(() => {
      cargarTickets();
      startTimer()

    });

    return {
      timer,
      tickets,
      ticketEnAtencion,
      stats,
      avgTicketDuration,
      completedPercentage,
      cerrarTicket,
      workloadPercentage,
      workloadButtonClass,
      getBadgeClass,
      showModal,
      newCapacityHours,
      newCapacityMinutes,
      newCapacity,
      updateCapacity
    };
  },
});
</script>

<style>
/* Estilos para el modal */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
