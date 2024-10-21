vueCopy
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-4xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <img
          class="mx-auto h-24 w-auto"
          src="@/assets/logo.png"
          alt="TNM Logo"
        />
        <h2 class="mt-6 text-3xl font-extrabold text-[#1B396A]">
          Solicitar Cita
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Selecciona el servicio que necesitas en coordinación
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <button
          v-for="service in services"
          :key="service.tramite"
          @click="selectService(service)"
          class="flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 ease-in-out"
          :class="[
            selectedService?.tramite === service.tramite
              ? 'border-[#1B396A] bg-[#E6EBF4] shadow-md'
              : 'border-gray-200 hover:border-[#1B396A] hover:bg-[#E6EBF4]',
          ]"
        >
          <i
            :class="[
              'text-4xl mb-2',
              selectedService?.tramite === service.tramite
                ? 'text-[#1B396A]'
                : 'text-gray-600',
            ]"
          ></i>
          <span class="text-sm font-medium text-center">{{
            service.tramite
          }}</span>
        </button>
      </div>

      <transition name="fade">
        <div
          v-if="selectedService"
          class="mt-6 p-4 bg-[#E6EBF4] rounded-md border border-[#1B396A]"
        >
          <input
            v-model="numeroDeControl"
            type="number"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#1B396A] focus:ring-opacity-50"
            placeholder="Número de control"
          />
          <h3 class="text-lg font-semibold text-[#1B396A] mb-2">
            Detalles del servicio
          </h3>
          <p class="text-sm text-[#1B396A]">
            Servicio seleccionado:
            <strong>{{ selectedService.tramite }}</strong>
          </p>
          <p class="text-sm text-[#1B396A] mt-1">
            Tiempo estimado:
            <strong>{{ selectedService.duration }} minutos</strong>
          </p>
        </div>
      </transition>

      <div class="mt-8">
        <button
          @click="requestAppointment"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A] transition duration-150 ease-in-out transform hover:scale-105"
          :disabled="!selectedService"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedService }"
        >
          {{ selectedService ? "Solicitar Cita" : "Selecciona un servicio" }}
        </button>
      </div>

      <transition name="fade">
        <div
          v-if="appointmentAssigned"
          class="mt-6 p-6 bg-green-50 border border-green-200 text-green-700 rounded-lg shadow-md"
        >
          <h3 class="text-xl font-bold mb-2">¡Cita Asignada!</h3>
          <p class="text-sm mb-2">Tu cita ha sido programada para:</p>
          <p class="text-lg font-semibold">
            {{ ticket?.fechaProgramada.toLocaleDateString("es-MX") }} a las {{ ticket?.fechaProgramada.toLocaleTimeString("es-MX") }}
          </p>
          <div class="mt-4 pt-4 border-t border-green-200">
            <p class="text-sm">
              <strong>Servicio:</strong> {{ ticket?.tipoTramite }}
            </p>
          </div>
          <button @click="deleteTicket()" class="mt-4 text-sm text-red-500 hover:text-red-700 focus:outline-none">
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
    const numeroDeControl = ref(0);
    const ticket = ref<Ticket | null>(null);

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
      if (!selectedService.value) return;
      if (!numeroDeControl.value) {
        console.error("Número de control no válido");
        return;
      }
      try {
        // Llamada a la api
        ticket.value = (await crearTicket(
          selectedService.value.tramite,
          numeroDeControl.value
        )) as unknown as Ticket;

        if (ticket.value) {
          ticket.value.fechaProgramada = new Date(ticket.value.fechaProgramada);
          appointmentAssigned.value = true;
          localStorage.setItem("ticket", JSON.stringify(ticket.value));
        } else {
          console.error("No se pudo asignar la cita");
        }
      } catch (error) {
        console.error("Error al solicitar la cita:", error);
      }
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
      numeroDeControl.value = 0;
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
</style>
