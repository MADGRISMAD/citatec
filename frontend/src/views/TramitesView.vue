<template>
    <!-- Table tramites -->
    <div class="container mx-auto p-4">
        <div class="flex flex-col">
            <div class="mb-4">
                <h1 class="text-2xl font-bold">Trámites</h1>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 border-b">Nombre</th>
                            <th class="px-4 py-2 border-b">Duración</th>
                            <th class="px-4 py-2 border-b">Activo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tramite in tramites" :key="tramite.nombre" class="hover:bg-gray-100">
                            <td class="px-4 py-2 border-b">{{ tramite.nombre }}</td>
                            <td class="px-4 py-2 border-b">
                                <input type="number" step="5" v-model="tramite.duration" @change="changeTramiteDuration(tramite)" class="w-full p-2 border rounded" /> min
                            </td>
                            <td class="px-4 py-2 border-b text-center">
                                <input type="checkbox" v-model="tramite.active" @change="toggleTramite(tramite)" class="form-checkbox" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mt-4">
                <button class="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" >
import { cambiarTramiteActivo, obtenerTramites, cambiarDuracionTramite } from '@/services/tramite';
import { TramiteConfig } from 'shared-types';
import { ref, Ref } from 'vue';


    export default {
  name: 'TramitesView',
  components: {
  },
  data() {
    return {
    };
  },
  methods: {
    toggleTramite(tramite: TramiteConfig) {
        console.log("toggleTramite", tramite);
      cambiarTramiteActivo(tramite.nombre, tramite.active).then((res) => {
        // tramite.active = !tramite.active;
        console.log(res);
      });
    },
    changeTramiteDuration (tramite: TramiteConfig) {
        console.log("changeTramiteDuration", tramite);
        cambiarDuracionTramite(tramite.nombre, tramite.duration).then((res) => {
        console.log(res);
        });
    }
  },
  setup(){
    const tramites: Ref<TramiteConfig[]> = ref([]);
    const loading = ref(true);

    obtenerTramites().then((data) => {
      tramites.value = data;
      loading.value = false;
    });
    return {
      tramites,
      loading,
    };
  }
};

</script>