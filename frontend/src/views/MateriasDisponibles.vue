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
            class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Dashboard
          </a>
          <a
            href="/materias"
            class="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
            aria-current="page"
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
          class="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
        >
          Dashboard
        </a>
        <a
          href="/materias"
          class="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
          aria-current="page"
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

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <IpModal />
      <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
        <div class="p-8 space-y-8">
          <!-- Sección de carga de PDF (solo visible para profesores) -->
          <div v-if="isTeacher" class="mb-8">
            <h2 class="text-2xl font-semibold text-[#1B396A] mb-4">Cargar Plan de Estudios</h2>
            <div class="flex items-center space-x-4">
              <input 
                type="file" 
                @change="handleFileUpload" 
                accept=".pdf"
                class="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E6EBF4] file:text-[#1B396A] hover:file:bg-[#D1D9E6]"
              />
              <button 
                @click="uploadPDF" 
                class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]"
                :disabled="!selectedFile"
              >
                Subir PDF
              </button>
            </div>
          </div>

          <!-- Visualizador de PDF -->
          <div v-if="pdfUrl" class="w-full h-[600px]">
            <iframe :src="pdfUrl" class="w-full h-full border-0"></iframe>
          </div>

          <!-- Mensaje cuando no hay PDF -->
          <div v-else class="text-center text-gray-600">
            No hay un plan de estudios disponible en este momento.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as materiasService from '@/services/materias';
export default defineComponent({
  name: 'PlanDeEstudios',
  setup() {
    const isTeacher = ref(true);
    const selectedFile = ref<File | null>(null);
    const pdfUrl = ref<string | undefined>(undefined);

    // Función para cargar el PDF al montar el componente

    const uploadPDF = async () => {
      if (!selectedFile.value) return;
      try {
        await materiasService.uploadPDF(selectedFile.value);
        const url = await materiasService.loadPDF();
        pdfUrl.value = url
      } catch (error) {
        console.error('Error al subir el PDF:', error);
      }
    };
    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
      }
    };

    

    // Cargar el PDF cuando se monta el componente
    onMounted(async () => {
      pdfUrl.value = await materiasService.loadPDF();
    });

    return {
      isTeacher,
      selectedFile,
      pdfUrl,
      handleFileUpload,
      uploadPDF,
    };
  },
});
</script>