<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div class="flex items-center">
          <img class="h-10 w-auto mr-4" src="@/assets/logo.png" alt="TNM Logo">
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
                    @change="changeTramiteDuration(tramite)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1B396A] focus:border-[#1B396A] text-sm"
                  >
                    <option
                      v-for="option in durationOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }} min
                    </option>
                  </select>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <div
                  class="relative inline-block w-12 h-6 cursor-pointer rounded-full border-2 border-gray-300"
                  :class="tramite.active ? 'bg-green-500' : 'bg-red-500'"
                  @click="toggleTramite(tramite)"
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
  methods: {
    toggleTramite(tramite: TramiteConfig) {
      tramite.active = !tramite.active;
      cambiarTramiteActivo(tramite.nombre, tramite.active).then((res) => {
        console.log(res);
      });
    },
    changeTramiteDuration(tramite: TramiteConfig) {
      cambiarDuracionTramite(tramite.nombre, tramite.duration).then((res) => {
        console.log(res);
      });
    },
  },
  setup() {
    const tramites: Ref<TramiteConfig[]> = ref([]);
    const loading = ref(true);

    const durationOptions = computed(() => {
      const options = [];
      for (let i = 5; i <= 60; i += i < 30 ? 5 : 10) {
        options.push(i);
      }
      return options;
    });

    obtenerTramites().then((data) => {
      tramites.value = data;
      loading.value = false;
    });

    return {
      tramites,
      loading,
      durationOptions,
    };
  },
};
</script>
