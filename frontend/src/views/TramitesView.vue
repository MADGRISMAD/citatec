<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div class="flex items-center">
          <img class="h-10 w-auto mr-4" src="@/assets/logo.png" alt="TNM Logo" />
          <h1 class="text-3xl font-bold text-[#1B396A]">Trámites</h1>
        </div>

        <button
          @click="$router.push('/dashboard')"
          class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]"
        >
          Dashboard
        </button>
      </div>
    </header>

    <!-- Alertas -->
    <div class="fixed top-4 right-4 space-y-2 z-50">
      <div
        v-for="(alert, index) in alerts"
        :key="index"
        :class="`flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg transition-transform ${
          alert.type === 'success'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`"
      >
        <svg
          aria-hidden="true"
          class="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0ZM8.93 8.21a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4-4a.75.75 0 1 0-1.06-1.06L10 9.44 8.93 8.21ZM10 18.75a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75Z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ alert.message }}</span>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-6 py-8">
      <div class="overflow-x-auto bg-white shadow-md rounded-md">
        <table class="min-w-full border-collapse rounded-md">
          <thead class="bg-[#1B396A] text-white">
            <tr>
              <th class="px-6 py-3 text-left font-medium text-sm uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left font-medium text-sm uppercase tracking-wider">Duración</th>
              <th class="px-6 py-3 text-center font-medium text-sm uppercase tracking-wider">Activo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="tramite in tramites" :key="tramite.nombre" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-700">{{ tramite.nombre }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">
                <div class="flex items-center">
                  <select
                    v-model="tramite.duration"
                    @change="() => changeTramiteDuration(tramite)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B396A] focus:border-[#1B396A] text-sm"
                  >
                    <option v-for="option in durationOptions" :key="option" :value="option">
                      {{ option }} min
                    </option>
                  </select>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <div
                  class="relative inline-block w-12 h-6 cursor-pointer rounded-full border-2 border-gray-300"
                  :class="tramite.active ? 'bg-green-500' : 'bg-red-500'"
                  @click="() => toggleTramite(tramite)"
                >
                  <div
                    class="absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transform transition-transform"
                    :class="tramite.active ? 'translate-x-6' : ''"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { cambiarTramiteActivo, obtenerTramites, cambiarDuracionTramite } from '@/services/tramite';
import { TramiteConfig } from 'shared-types';
import { ref, Ref, computed } from 'vue';

export default {
  name: 'TramitesView',
  setup() {
    const tramites: Ref<TramiteConfig[]> = ref([]);
    const alerts = ref<{ type: string; message: string }[]>([]);

    const durationOptions = computed(() => {
      const options = [];
      for (let i = 5; i <= 60; i += i < 30 ? 5 : 10) {
        options.push(i);
      }
      return options;
    });

    const addAlert = (type: string, message: string) => {
      alerts.value.push({ type, message });
      setTimeout(() => {
        alerts.value.shift(); // Elimina la alerta después de 3 segundos
      }, 3000);
    };

    const toggleTramite = (tramite: TramiteConfig) => {
      tramite.active = !tramite.active;
      cambiarTramiteActivo(tramite.nombre, tramite.active)
        .then(() => {
          addAlert(
            'success',
            `El trámite "${tramite.nombre}" ahora está ${
              tramite.active ? 'activo' : 'inactivo'
            }.`
          );
        })
        .catch(() => {
          addAlert(
            'error',
            `Error al cambiar el estado del trámite "${tramite.nombre}".`
          );
        });
    };

    const changeTramiteDuration = (tramite: TramiteConfig) => {
      cambiarDuracionTramite(tramite.nombre, tramite.duration)
        .then(() => {
          addAlert(
            'success',
            `Duración del trámite "${tramite.nombre}" actualizada a ${tramite.duration} minutos.`
          );
        })
        .catch(() => {
          addAlert(
            'error',
            `Error al cambiar la duración del trámite "${tramite.nombre}".`
          );
        });
    };

    obtenerTramites().then((data) => {
      tramites.value = data;
    });

    return {
      tramites,
      alerts,
      durationOptions,
      toggleTramite,
      changeTramiteDuration,
    };
  },
};
</script>
