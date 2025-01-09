<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between"
      >
        <div class="flex items-center">
          <img
            class="h-10 w-auto mr-4"
            src="@/assets/logo.png"
            alt="TNM Logo"
          />
          <h1 class="text-3xl font-bold text-[#1B396A]">Reportes de tickets</h1>
        </div>
        <button
          class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Rango de fechas -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">
          Filtrar por Fecha
        </h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              for="start-date"
              class="block text-sm font-medium text-gray-600"
              >Fecha de Inicio</label
            >
            <input
              type="datetime-local"
              id="start-date"
              name="start-date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] sm:text-sm"
              v-model="fechaInicio"
            />
          </div>
          <div>
            <label
              for="end-date"
              class="block text-sm font-medium text-gray-600"
              >Fecha de Fin</label
            >
            <input
              type="datetime-local"
              id="end-date"
              name="end-date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] sm:text-sm"
              v-model="fechaFin"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- Numero de control -->
          <div>
            <label
              for="numero-control"
              class="block text-sm font-medium text-gray-600"
              >Número de Control</label
            >
            <input
              type="number"
              id="numero-control"
              name="numero-control"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] sm:text-sm"
              v-model="numeroDeControl"
            />
          </div>
          <!-- Tipo de trámite -->
          <div>
            <label
              for="tipo-tramite"
              class="block text-sm font-medium text-gray-600"
              >Tipo de Trámite</label
            >
            <select
              id="tipo-tramite"
              name="tipo-tramite"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] sm:text-sm"
              v-model="tipoTramite"
              
            >
              <option
                v-for="tramite in tramitesSelect"
                :key="tramite"
                :value="tramite"
                
              >
                {{ tramite }}
              </option>
            </select>
          </div>
        </div>
        <button
          @click="
            hacerBusqueda({
              fechaInicio: new Date(fechaInicio).getTime() - 1000 * 60 * 60 * new Date(fechaInicio).getTimezoneOffset() / 60,
              fechaFin: new Date(fechaFin).getTime() - 1000 * 60 * 60 * new Date(fechaFin).getTimezoneOffset() / 60,
              numeroDeControl,
              tipoTramite,
            } as unknown as Partial<StatsFilter>)
          "
          class="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]"
        >
          Filtrar
        </button>
      </div>

      <!-- Resumen General -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">
          Resumen General
        </h2>
        <dl class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
          >
            <dt class="text-sm font-medium text-gray-500 truncate">
              Total de tickets
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-[#1B396A]">
              {{ totaltickets }}
            </dd>
          </div>
          <div
            class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
          >
            <dt class="text-sm font-medium text-gray-500 truncate">
              Atendidos
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-[#1B396A]">
              {{ atendidos }}
            </dd>
          </div>
          <div
            class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
          >
            <dt class="text-sm font-medium text-gray-500 truncate">
              No Atendidos
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-[#1B396A]">
              {{ cancelados + expirados }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- Gráficos -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">
          Distribución de tickets por Servicio
        </h2>
        <div class="h-64">
          <BarChart :chartData="chartData" :chartOptions="chartOptions" />
        </div>
      </div>

      <!-- Tabla de tickets -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-6 py-4">
          <h2 class="text-2xl font-semibold text-[#1B396A]">
            Detalles de tickets
          </h2>
        </div>
        <div class="border-t border-gray-200 overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Num. Control
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fecha
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Servicio
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duración
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="ticket in tickets" :key="ticket.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ ticket.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ ticket.numeroDeControl }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(ticket.fechaProgramada).toLocaleString()}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ ticket.tipoTramite.nombre }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    ticket.estado === ticketAtendido
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                  ]"
                  >
                  {{ ticket.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ ticket.tipoTramite.duration }} min
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ ticket. }} min</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref, reactive, onMounted } from "vue";
import BarChart from "./BarChart.vue";
import {
  Stats,
  StatsFilter,
  TicketEstado,
  TicketHistorial,
  TramiteConfig,
} from "shared-types";
import { obtenerEstadisticas } from "@/services/stats";
import { useRoute, useRouter } from "vue-router";
import { obtenerTramites } from "@/services/tramite";
import router from "@/router";
import { toIsoStringInLocalTZ } from "@/utils/date";
export default defineComponent({
  name: "ReportesTickets",
  components: { BarChart },
  methods: {

  },
  setup() {
    const route = useRoute();
    const totaltickets: Ref<number> = ref(0);
    const atendidos: Ref<number> = ref(0);
    const cancelados: Ref<number> = ref(0);
    const expirados: Ref<number> = ref(0);
    const tickets: Ref<TicketHistorial[]> = ref<TicketHistorial[]>([]);
    const ticketAtendido: Ref<TicketEstado> = ref(TicketEstado.ATENDIDO);

    let tramitesSelect = ["Todos"];
    obtenerTramites().then((tramites) => {
      tramites.forEach((tramite) => {
        tramitesSelect.push(tramite.nombre);
      });
    });






    
    const fechaInicio: Ref<string> = route.query.fechaInicio
      ? ref(toIsoStringInLocalTZ(new Date(route.query.fechaInicio as string)))
      : ref(
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
            .toISOString()
            .slice(0, 16)
        );

    const fechaFin: Ref<string> = route.query.fechaFin
      ? ref(toIsoStringInLocalTZ(new Date(route.query.fechaFin as string)))
      : ref(new Date(Date.now()).toISOString().slice(0, 16));







    const numeroDeControl: Ref<number | undefined> = ref<number | undefined>(
      route.query.numeroDeControl as unknown as number | undefined
    );
    const tipoTramite: Ref<string | undefined> = ref<
      string | undefined
    >(route.query.tipoTramite as string | undefined);
    obtenerTramites().then((tramites) => {
      tramites.forEach((tramite) => {
        tramites.push(tramite);
      });
    });


    const ticketsPorTipoTramite = ref<Record<string, number>>({});

    // Función para cargar los datos
    const loadData = async () => {
      const filtro: Partial<StatsFilter> = {
        
      fechaInicio: new Date(fechaInicio.value).getTime(),
      fechaFin: new Date(fechaFin.value).getTime(),
      numeroDeControl: numeroDeControl.value,
      tipoTramite: tipoTramite.value,
    };
      try {
        const data: Stats = await obtenerEstadisticas(filtro);
        const {
          total,
          atendidos: atendidosData,
          tickets: ticketsData,
          expirados: expiradosData,
          cancelados: canceladosData,
          porTipoTramite,
        } = data;

        totaltickets.value = total;
        atendidos.value = atendidosData;
        tickets.value = ticketsData;
        expirados.value = expiradosData;
        cancelados.value = canceladosData;
        ticketsPorTipoTramite.value = porTipoTramite;
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    

    const hacerBusqueda= async (filtros:Partial<StatsFilter>) => {
      const queryFechaInicio = !Number.isNaN(filtros.fechaInicio) ? new Date(filtros.fechaInicio as number).toISOString().slice(0, 16): undefined;
      const queryFechaFin =  !Number.isNaN(filtros.fechaFin) ? new Date(filtros.fechaFin as number).toISOString().slice(0, 16): undefined  ;
      await router.replace({
        query: {
          fechaInicio: queryFechaInicio,
          fechaFin: queryFechaFin,
          numeroDeControl: filtros.numeroDeControl?.toString().length as number > 0 ? filtros.numeroDeControl : undefined,
          tipoTramite: filtros.tipoTramite != "Todos" ? filtros.tipoTramite : undefined,
        },
      });
      await loadData();
    }
    // Llama a loadData cuando el componente se monta
    onMounted(loadData);
    const chartData = computed(() => ({
      labels: Object.keys(ticketsPorTipoTramite.value),
      datasets: [
        {
          label: "Número de tickets",
          data: Object.values(ticketsPorTipoTramite.value),
          backgroundColor: "rgba(79, 70, 229, 0.6)",
          borderColor: "rgba(79, 70, 229, 1)",
          borderWidth: 1,
        },
      ],
    }));

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Número de tickets",
          },
        },
        x: {
          title: {
            display: true,
            text: "Servicios",
          },
        },
      },
    };

    return {
      fechaInicio,
      fechaFin,
      totaltickets,
      tickets,
      chartData,
      chartOptions,
      ticketAtendido,
      atendidos,
      tramitesSelect,
      numeroDeControl,
      tipoTramite,
      cancelados,
      expirados,
      hacerBusqueda,
    };
  },
});
</script>

<style scoped>
.overflow-x-auto {
  max-height: 400px;
  overflow-y: auto;
}
</style>
