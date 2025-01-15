<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      <!-- Left Section -->
      <div class="flex flex-col justify-center items-center p-12 bg-gray-100 space-y-6 border-r border-gray-200">
        <img class="h-16 w-auto" src="@/assets/logo.png" alt="TNM Logo" />
        <h1 class="text-3xl font-bold text-[#1B396A]">Solicitar Cita</h1>
        <p class="text-gray-700 text-center">
          Administra tus citas de forma rápida y eficiente con nuestro sistema.
        </p>
        <ul class="space-y-4 text-left w-full">
          <li class="flex items-start space-x-4">
            <span class="h-10 w-10 flex items-center justify-center bg-[#1B396A] text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <p class="text-lg text-gray-800">Selecciona el servicio que necesitas.</p>
          </li>
          <li class="flex items-start space-x-4">
            <span class="h-10 w-10 flex items-center justify-center bg-[#1B396A] text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.24 4.76L19.45 8m-7.31 7.31l4.24-4.24m-6.83.88L4.75 9.75m7.42 1.92l.88 6.83m-.88-6.83L4.76 4.76m6.83.88l4.24 4.24" />
              </svg>
            </span>
            <p class="text-lg text-gray-800">Ingresa tu número de control.</p>
          </li>
          <li class="flex items-start space-x-4">
            <span class="h-10 w-10 flex items-center justify-center bg-[#1B396A] text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c2.28 0 4-1.5 4-4s-1.72-4-4-4-4 1.5-4 4 1.72 4 4 4zm6 8H6a3 3 0 00-3 3v5h18v-5a3 3 0 00-3-3z" />
              </svg>
            </span>
            <p class="text-lg text-gray-800">Confirma tu cita y obtén tu ticket.</p>
          </li>
        </ul>
      </div>

      <!-- Right Section -->
      <div class="p-12 space-y-8">
        <h2 class="text-2xl font-semibold text-gray-800">Gestiona tu Cita</h2>

        <!-- Dropdown for Service Selection -->
        <div>
          <label for="service-dropdown" class="block text-sm font-medium text-gray-600 mb-2">
            Tipo de Cita
          </label>
          <select
            id="service-dropdown"
            v-model="selectedService"
            @change="selectedService && selectService(selectedService)"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B396A]"
          >
            <option disabled selected value="">Selecciona un servicio</option>
            <option v-for="service in services" :key="service.nombre" :value="service">
              {{ service.nombre }} - {{ service.duration }} minutos
            </option>
          </select>
        </div>

        <!-- Input for Control Number -->
        <div>
          <label for="control-number" class="block text-sm font-medium text-gray-600 mb-2">
            Número de Control
          </label>
          <input
            id="control-number"
            v-model="numeroDeControl"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B396A]"
            placeholder="Ingresa tu número de control"
          />
        </div>

        <!-- Input for Descripcion -->
        <div>
          <label for="descripcion" class="block text-sm font-medium text-gray-600 mb-2">
            Descripción
          </label>
          <input
            id="descripcion"
            v-model="descripcion"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B396A]"
            placeholder="Ingresa una descripción"
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
            class="w-full py-3 bg-[#1B396A] text-white font-semibold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ selectedService ? "Solicitar Cita" : "Selecciona un servicio" }}
          </button>
        </div>

        <!-- Appointment Confirmation -->
        <transition name="fade">
          <div v-if="appointmentAssigned" class="mt-6 p-6 bg-gray-100 rounded-lg border border-gray-300 text-center">
            <h4 class="text-xl font-bold text-[#1B396A]">¡Cita Asignada!</h4>
            <p class="text-sm text-gray-700 mt-2">
              Tu cita ha sido programada para el <strong>{{ ticket?.fechaProgramada.toLocaleDateString("es-MX") }}</strong>
              a las <strong>{{ ticket?.fechaProgramada.toLocaleTimeString("es-MX") }}</strong>.
            </p>
            <div class="mt-4 flex justify-center space-x-4">
              <button
                @click="deleteTicket"
                class="py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
              >
                Cancelar Cita
              </button>
              <button
                @click="goToTicket"
                class="py-2 px-4 bg-[#1B396A] text-white font-medium rounded-lg hover:bg-opacity-90 transition"
              >
                Ver Ticket
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Componente IpModal -->
    <IpModal />
  </div>
</template>






<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import {Ticket, TicketEstado, TramiteConfig, outputLog} from "shared-types";
import { obtenerTramites, obtenerTramitesActivos } from "@/services/tramite";
import { crearTicket, eliminarTicket } from "@/services/ticket";
import { loadPDF } from "@/services/materias";

export default defineComponent({
  name: "RequestAppointment",
  setup() {
    const services = reactive<TramiteConfig[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const selectedService = ref<TramiteConfig | null>(null);
    const appointmentAssigned = ref(false);
    const numeroDeControl = ref('');
    const ticket = ref<Ticket | null>(null);
    const controlNumber = ref('');
    const errorMessage = ref('');
    const descripcion = ref('');
    const ticketFromLS = localStorage.getItem("ticket");
    if(ticketFromLS) {
      const tempTicket = JSON.parse(ticketFromLS as string);
      tempTicket.fechaProgramada = new Date(tempTicket.fechaProgramada);
      ticket.value = tempTicket;
      appointmentAssigned.value = true;
    }
    const goToTicket = () => {
  window.location.href = '/ticket';
};


    onMounted(async () => {
      console.log("Entra");

      try {
        Object.assign(services, await obtenerTramitesActivos());
      } catch (e) {
        console.error("Error al obtener los trámites:", e);
        error.value = "No se pudieron obtener los trámites";
      } finally {
        loading.value = false;
        console.log(services);
      }
    });
    const selectService = (service: TramiteConfig) => {
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
          ticket.value = (await crearTicket( {descripcion: descripcion.value},
            selectedService.value.nombre,
            numeroDeControl.value
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
        await eliminarTicket(ticket.value.tipoTramite.nombre, ticket.value.id, false, TicketEstado.CANCELADO);
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
      goToTicket,
      descripcion
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
