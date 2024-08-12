<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div class="flex items-center">
          <img class="h-10 w-auto mr-4" src="@/assets/logo.png" alt="TNM Logo">
          <h1 class="text-3xl font-bold text-[#1B396A]">Reportes de Citas</h1>
        </div>
        <button class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
          Cerrar Sesión
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Resumen General -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">Resumen General</h2>
        <dl class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Total de Citas</dt>
            <dd class="mt-1 text-3xl font-semibold text-[#1B396A]">{{ totalCitas }}</dd>
          </div>
          <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Promedio Diario</dt>
            <dd class="mt-1 text-3xl font-semibold text-[#1B396A]">{{ promedioDiario }}</dd>
          </div>
          <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Satisfacción</dt>
            <dd class="mt-1 text-3xl font-semibold text-[#1B396A]">{{ satisfaccion }}%</dd>
          </div>
        </dl>
      </div>

      <!-- Gráficos -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-[#1B396A]">Distribución de Citas por Servicio</h2>
        <div class="h-64">
          <BarChart :chartData="chartData" :chartOptions="chartOptions" />
        </div>
      </div>

      <!-- Tabla de Citas -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-6 py-4">
          <h2 class="text-2xl font-semibold text-[#1B396A]">Detalles de Citas</h2>
        </div>
        <div class="border-t border-gray-200 overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="cita in citas" :key="cita.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cita.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cita.fecha }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ cita.servicio }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    cita.estado === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ cita.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cita.duracion }} min</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import BarChart from './BarChart.vue';
  
  interface Cita {
    id: number;
    fecha: string;
    servicio: string;
    estado: 'Completada' | 'Cancelada';
    duracion: number;
  }
  
  export default defineComponent({
    name: 'ReportesCitas',
    components: { BarChart },
    setup() {
      const totalCitas = ref(150);
      const promedioDiario = ref(15);
      const satisfaccion = ref(92);
  
      const citas = ref<Cita[]>([
        { id: 1, fecha: '2024-05-29', servicio: 'Reinscripción', estado: 'Completada', duracion: 20 },
        { id: 2, fecha: '2024-05-29', servicio: 'Baja de materias', estado: 'Completada', duracion: 15 },
        { id: 3, fecha: '2024-05-29', servicio: 'Solicitud de constancia', estado: 'Cancelada', duracion: 0 },
        { id: 4, fecha: '2024-05-30', servicio: 'Reinscripción', estado: 'Completada', duracion: 25 },
        { id: 5, fecha: '2024-05-30', servicio: 'Asesoría académica', estado: 'Completada', duracion: 30 },
      ]);
  
      const contarCitasPorServicio = computed(() => {
        const conteo: { [key: string]: number } = {};
        citas.value.forEach(cita => {
          conteo[cita.servicio] = (conteo[cita.servicio] || 0) + 1;
        });
        return conteo;
      });
  
      const chartData = computed(() => ({
        labels: Object.keys(contarCitasPorServicio.value),
        datasets: [
          {
            label: 'Número de Citas',
            data: Object.values(contarCitasPorServicio.value),
            backgroundColor: 'rgba(79, 70, 229, 0.6)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1
          }
        ]
      }));
  
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Citas'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Servicios'
            }
          }
        }
      };
  
      return {
        totalCitas,
        promedioDiario,
        satisfaccion,
        citas,
        chartData,
        chartOptions
      };
    }
  });
  </script>
  
  <style scoped>
  .overflow-x-auto {
    max-height: 400px;
    overflow-y: auto;
  }
  </style>