<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <img class="mx-auto h-20 w-auto" src="@/assets/logo.png" alt="TNM Logo">
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Solicitar Cita
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Selecciona el servicio que necesitas en coordinación
          </p>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <button
            v-for="service in services"
            :key="service.id"
            @click="selectService(service)"
            class="flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 ease-in-out"
            :class="[
              selectedService?.id === service.id 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
            ]"
          >
            <i :class="['text-4xl mb-2', service.icon]"></i>
            <span class="text-sm font-medium text-center">{{ service.name }}</span>
          </button>
        </div>
  
        <div v-if="selectedService" class="mt-6 p-4 bg-blue-50 rounded-md">
          <p class="text-sm text-blue-800">
            Servicio seleccionado: <strong>{{ selectedService.name }}</strong>
          </p>
          <p class="text-sm text-blue-800 mt-2">
            Tiempo estimado de servicio: <strong>{{ selectedService.time }} minutos</strong>
          </p>
        </div>
  
        <div>
          <button
            @click="requestAppointment"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="!selectedService"
          >
            Solicitar Cita
          </button>
        </div>
  
        <div v-if="appointmentAssigned" class="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong class="font-bold">¡Cita Asignada!</strong>
          <p class="block sm:inline">Tu cita ha sido programada para el {{ appointmentDate }} a las {{ appointmentTime }}.</p>
          <p class="mt-2">Servicio: {{ selectedService?.name }}</p>
          <p>Duración estimada: {{ selectedService?.time }} minutos</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  const services = [
    { id: 1, name: "Reinscripción", time: 15, icon: "fas fa-user-graduate" },
    { id: 2, name: "Baja de materias", time: 10, icon: "fas fa-book" },
    { id: 3, name: "Solicitud de constancia", time: 5, icon: "fas fa-file-alt" },
    { id: 4, name: "Revisión de expediente", time: 20, icon: "fas fa-folder-open" },
    { id: 5, name: "Cambio de carrera", time: 30, icon: "fas fa-exchange-alt" },
    { id: 6, name: "Trámite de titulación", time: 25, icon: "fas fa-graduation-cap" },
  ];
  
  export default defineComponent({
    name: 'RequestAppointment',
    setup() {
      const selectedService = ref(null);
      const appointmentAssigned = ref(false);
      const appointmentDate = ref('');
      const appointmentTime = ref('');
  
      const selectService = (service) => {
        selectedService.value = service;
      };
  
      const requestAppointment = async () => {
        if (!selectedService.value) return;
  
        try {
          // Simular una llamada a la API
          await new Promise(resolve => setTimeout(resolve, 1000));
  
          // Simular una respuesta del servidor
          const response = {
            success: true,
            date: '2024-06-15',
            time: '14:30'
          };
  
          if (response.success) {
            appointmentDate.value = response.date;
            appointmentTime.value = response.time;
            appointmentAssigned.value = true;
          } else {
            console.error('No se pudo asignar la cita');
          }
        } catch (error) {
          console.error('Error al solicitar la cita:', error);
        }
      };
  
      return {
        services,
        selectedService,
        selectService,
        requestAppointment,
        appointmentAssigned,
        appointmentDate,
        appointmentTime,
      };
    }
  });
  </script>