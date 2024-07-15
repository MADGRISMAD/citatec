<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <img class="h-10 w-auto" src="@/assets/logo.png" alt="TNM Logo">
          <h1 class="text-3xl font-bold text-gray-900">Plan de Estudios</h1>
        </div>
      </header>
  
      <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <div class="p-8 space-y-8">
            <!-- Sección de carga de PDF (solo visible para profesores) -->
            <div v-if="isTeacher" class="mb-8">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Cargar Plan de Estudios</h2>
              <div class="flex items-center space-x-4">
                <input 
                  type="file" 
                  @change="handleFileUpload" 
                  accept=".pdf"
                  class="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <button 
                  @click="uploadPDF" 
                  class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'PlanDeEstudios',
    setup() {
      const isTeacher = ref(true); // Esto debería venir de tu sistema de autenticación
      const selectedFile = ref<File | null>(null);
      const pdfUrl = ref<string | null>(null);
  
      const handleFileUpload = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          selectedFile.value = target.files[0];
        }
      };
  
      const uploadPDF = () => {
        if (selectedFile.value) {
          // En una aplicación real, aquí subirías el archivo a un servidor
          // y obtendrías la URL del archivo subido
          const fakeUploadedUrl = URL.createObjectURL(selectedFile.value);
          pdfUrl.value = fakeUploadedUrl;
          console.log('PDF subido:', selectedFile.value.name);
        }
      };
  
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