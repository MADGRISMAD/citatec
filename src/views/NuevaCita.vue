<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <img class="mx-auto h-24 w-auto" src="@/assets/logo.png" alt="TNM Logo">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Solicitar Cita
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Selecciona el servicio que necesitas en coordinación
        </p>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <button
          v-for="service in services"
          :key="service.id"
          @click="selectService(service)"
          class="flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 ease-in-out"
          :class="[
            selectedService?.id === service.id 
              ? 'border-indigo-500 bg-indigo-50 shadow-md' 
              : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
          ]"
        >
          <i :class="['text-4xl mb-2', service.icon, selectedService?.id === service.id ? 'text-indigo-600' : 'text-gray-600']"></i>
          <span class="text-sm font-medium text-center">{{ service.name }}</span>
        </button>
      </div>

      <transition name="fade">
        <div v-if="selectedService" class="mt-6 p-4 bg-indigo-50 rounded-md border border-indigo-200">
          <h3 class="text-lg font-semibold text-indigo-800 mb-2">Detalles del servicio</h3>
          <p class="text-sm text-indigo-700">
            Servicio seleccionado: <strong>{{ selectedService.name }}</strong>
          </p>
          <p class="text-sm text-indigo-700 mt-1">
            Tiempo estimado: <strong>{{ selectedService.time }} minutos</strong>
          </p>
        </div>
      </transition>

      <div class="mt-8">
        <button
          @click="requestAppointment"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
          :disabled="!selectedService"
          :class="{'opacity-50 cursor-not-allowed': !selectedService}"
        >
          {{ selectedService ? 'Solicitar Cita' : 'Selecciona un servicio' }}
        </button>
      </div>

      <transition name="fade">
        <div v-if="appointmentAssigned" class="mt-6 p-6 bg-green-50 border border-green-200 text-green-700 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-2">¡Cita Asignada!</h3>
          <p class="text-sm mb-2">Tu cita ha sido programada para:</p>
          <p class="text-lg font-semibold">{{ formatDate(appointmentDate) }} a las {{ appointmentTime }}</p>
          <div class="mt-4 pt-4 border-t border-green-200">
            <p class="text-sm"><strong>Servicio:</strong> {{ selectedService?.name }}</p>
            <p class="text-sm"><strong>Duración estimada:</strong> {{ selectedService?.time }} minutos</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

interface Service {
  id: number;
  name: string;
  time: number;
  icon: string;
}

const services: Service[] = [
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
    const selectedService = ref<Service | null>(null);
    const appointmentAssigned = ref(false);
    const appointmentDate = ref('');
    const appointmentTime = ref('');

    const selectService = (service: Service) => {
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

    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return {
      services,
      selectedService,
      selectService,
      requestAppointment,
      appointmentAssigned,
      appointmentDate,
      appointmentTime,
      formatDate
    };
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>