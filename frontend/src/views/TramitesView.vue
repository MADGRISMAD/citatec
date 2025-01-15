<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <nav class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 justify-between">
        <!-- Logo -->
        <LogoComponent />

        <!-- Desktop Links -->
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <FingerprintString />
          <a
            href="/dashboard"
            class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
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
            class="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
            aria-current="page"
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
          class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
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
          class="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
          aria-current="page"
        >
          Trámites
        </a>
      </div>
    </div>
  </nav>
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
      <IpModal />
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
import FingerprintString from '@/components/fingerprintString.vue';
import LogoComponent from '@/components/LogoComponent.vue';
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
  components: {
    FingerprintString, LogoComponent
  },
};
</script>
