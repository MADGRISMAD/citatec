<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 py-12 px-6">
    <div class="max-w-3xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <header class="text-center py-8 px-6 bg-gray-100">
        <img class="mx-auto h-20 w-auto" src="@/assets/logo.png" alt="TNM Logo" />
        <h2 class="mt-4 text-3xl font-extrabold text-[#1B396A]">Solicitar Cita</h2>
        <p class="mt-2 text-lg text-gray-700">Selecciona el servicio que necesitas en coordinación</p>
      </header>

      <!-- Form Content -->
      <div class="p-6 space-y-6">
        <!-- Dropdown for Service Selection -->
        <div>
          <label for="service-dropdown" class="block text-lg font-medium text-gray-700 mb-2">
            Tipo de Cita
          </label>
          <select
            id="service-dropdown"
            v-model="selectedService"
            @change="selectedService && selectService(selectedService)"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B396A] transition"
          >
            <option disabled selected value="">Selecciona un servicio</option>
            <option v-for="service in services" :key="service.tramite" :value="service">
              {{ service.tramite }} - {{ service.duration }} minutos
            </option>
          </select>
        </div>

        <!-- Input for Control Number -->
        <div>
          <label for="control-number" class="block text-lg font-medium text-gray-700 mb-2">
            Número de Control
          </label>
          <input
            id="control-number"
            v-model="numeroDeControl"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B396A] transition"
            placeholder="Ingresa tu número de control"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="text-center text-red-600 font-medium">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <div>
          <button
            @click="requestAppointment"
            :disabled="!selectedService"
            class="w-full py-3 bg-[#1B396A] text-white font-bold rounded-md shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ selectedService ? "Solicitar Cita" : "Selecciona un servicio" }}
          </button>
        </div>
      </div>

      <!-- Appointment Confirmation -->
      <transition name="fade">
        <div v-if="appointmentAssigned" class="mt-6 p-6 bg-green-100 rounded-md shadow border border-green-300 text-center">
          <h3 class="text-xl font-bold text-green-700">¡Cita Asignada!</h3>
          <p class="text-lg text-gray-700 mt-2">
            Tu cita ha sido programada para el <strong>{{ ticket?.fechaProgramada.toLocaleDateString("es-MX") }}</strong>
            a las <strong>{{ ticket?.fechaProgramada.toLocaleTimeString("es-MX") }}</strong>.
          </p>
          <button @click="deleteTicket" class="mt-4 text-sm text-red-600 hover:underline">
            Cancelar cita
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>




<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {SetTramiteDuration, Ticket, outputLog} from "shared-types";
import { obtenerTramites } from "@/services/tramite";
import { crearTicket, eliminarTicket } from "@/services/ticket";

export default defineComponent({
  name: "RequestAppointment",
  setup() {
    const services = ref<SetTramiteDuration[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const selectedService = ref<SetTramiteDuration | null>(null);
    const appointmentAssigned = ref(false);
    const numeroDeControl = ref('');
    const ticket = ref<Ticket | null>(null);
    const controlNumber = ref('');
    const errorMessage = ref('');

    const ticketFromLS = localStorage.getItem("ticket");
    if(ticketFromLS) {
      const tempTicket = JSON.parse(ticketFromLS as string);
      tempTicket.fechaProgramada = new Date(tempTicket.fechaProgramada);
      ticket.value = tempTicket;
      appointmentAssigned.value = true;
    }

    onMounted(async () => {
      try {
        services.value = await obtenerTramites();
      } catch (e) {
        console.error("Error al obtener los trámites:", e);
        error.value = "No se pudieron obtener los trámites";
      } finally {
        loading.value = false;
      }
    });

    const selectService = (service: SetTramiteDuration) => {
      selectedService.value = service;
    };

    const requestAppointment = async () => {
      errorMessage.value = ''; // Reset error message
      if (!selectedService.value) return;
      if (!validateControlNumber(numeroDeControl.value)) {
        errorMessage.value = 'Número de control no válido. Debe comenzar con una letra seguida de 8 números o solo 8 números.';
        return;
      }
      try {
        // Llamada a la api
        ticket.value = (await crearTicket(
          selectedService.value.tramite,
          Number(numeroDeControl.value)
        )) as unknown as Ticket;

        if (ticket.value) {
          ticket.value.fechaProgramada = new Date(ticket.value.fechaProgramada);
          appointmentAssigned.value = true;
          localStorage.setItem("ticket", JSON.stringify(ticket.value));
        } else {
          errorMessage.value = 'No se pudo asignar la cita';
        }
      } catch (error) {
        errorMessage.value = 'Error al solicitar la cita: ' + (error as Error).message;
      }
    };

    const validateControlNumber = (number: string) => {
      const regex = /^[A-Za-z]\d{8}$|^\d{8}$/;
      return regex.test(number);
    };

    const createCita = () => {
      if (!validateControlNumber(controlNumber.value)) {
        alert('Número de control inválido. Debe comenzar con una letra seguida de 8 números o solo 8 números.');
        return;
      }
      // Lógica para crear la cita
    };

    const deleteTicket = async () => {
      try {
        if(!ticket.value) return;
        await eliminarTicket(ticket.value.tipoTramite, ticket.value.id);
      } catch (error) {
        console.error("Error al eliminar el ticket:", error);
      }
      appointmentAssigned.value = false;
      ticket.value = null;
      selectedService.value = null;
      numeroDeControl.value = '';
      localStorage.removeItem("ticket");
      outputLog("Ticket eliminado");
    };

    // const formatDate = (dateString: string) => {
    //   const options: Intl.DateTimeFormatOptions = {
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    //   };
    //   return new Date(dateString).toLocaleDateString("es-ES", options);
    // };

    return {
      services,
      selectedService,
      selectService,
      requestAppointment,
      appointmentAssigned,
      // formatDate,
      numeroDeControl,
      ticket,
      deleteTicket,
      controlNumber,
      validateControlNumber,
      createCita,
      errorMessage,
    };
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
