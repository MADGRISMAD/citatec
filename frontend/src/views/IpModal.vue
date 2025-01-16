<!-- <template>
  <div class="relative">
    
    <button
      @click="openModal"
      class="p-2 hover:bg-gray-200 rounded-full transition-colors"
      title="Configuración de IP"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.75 3a1.5 1.5 0 012.5 0l.31.56a2.25 2.25 0 002.4 1.13l.62-.16a1.5 1.5 0 011.74 1.74l-.16.62a2.25 2.25 0 001.13 2.4l.56.31a1.5 1.5 0 010 2.5l-.56.31a2.25 2.25 0 00-1.13 2.4l.16.62a1.5 1.5 0 01-1.74 1.74l-.62-.16a2.25 2.25 0 00-2.4 1.13l-.31.56a1.5 1.5 0 01-2.5 0l-.31-.56a2.25 2.25 0 00-2.4-1.13l-.62.16a1.5 1.5 0 01-1.74-1.74l.16-.62a2.25 2.25 0 00-1.13-2.4l-.56-.31a1.5 1.5 0 010-2.5l.56-.31a2.25 2.25 0 001.13-2.4l-.16-.62a1.5 1.5 0 011.74-1.74l.62.16a2.25 2.25 0 002.4-1.13L9.75 3zm2.25 12a3 3 0 100-6 3 3 0 000 6z"
        />
      </svg>
    </button>

    
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <div class="relative bg-white p-8 rounded shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">Cambiar IP y Puerto</h2>
        <p class="text-sm text-gray-500 mb-4">Introduce la IP y el puerto del backend.</p>

        <div class="flex items-center space-x-1">
          
          <input
            v-for="(value, index) in ipSegments"
            :key="index"
            type="text"
            maxlength="3"
            v-model="ipSegments[index]"
            class="border border-gray-300 p-2 rounded w-12 text-center"
            @keydown="handleKeyDown(index, $event)"
          />
          <span>:</span>
          
          <input
            ref="portInput"
            type="text"
            maxlength="5"
            v-model="port"
            class="border border-gray-300 p-2 rounded w-20 text-center"
            @input="handlePortInput"
          />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

        <div class="flex justify-end mt-4">
          <button
            class="bg-gray-300 text-black px-3 py-1 rounded mr-2"
            @click="closeModal"
          >
            Cancelar
          </button>
          <button
            class="bg-blue-600 text-white px-3 py-1 rounded"
            @click="saveIp"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 

<script lang="ts">
import { defineComponent, ref, nextTick } from "vue";

export default defineComponent({
  name: "IpModal",
  setup() {
    const showModal = ref(false);
    const ipSegments = ref(["", "", "", ""]); // Almacena los cuatro octetos
    const port = ref(""); // Almacena el puerto
    const errorMessage = ref("");
    const portInput = ref<HTMLInputElement | null>(null);

    const openModal = () => {
      showModal.value = true;
      errorMessage.value = "";
    };

    const closeModal = () => {
      showModal.value = false;
      errorMessage.value = "";
    };

    const handleKeyDown = (index: number, event: KeyboardEvent) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;

      // Detectar si la tecla presionada es un punto "."
      if (event.key === "." && index < 3) {
        ipSegments.value[index] = value;
        const nextInput = target.nextElementSibling as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
        return;
      }

      // Detectar si la tecla presionada es dos puntos ":" y estamos en el último campo
      if (event.key === ":" && index === 3) {
        ipSegments.value[index] = value;
        nextTick(() => portInput.value?.focus());
        return;
      }

      // Permitir solo números
      if (!/^\d*$/.test(value)) {
        target.value = value.replace(/\D/g, "");
        ipSegments.value[index] = target.value;
      }
    };

    const handlePortInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;

      if (!/^\d*$/.test(value)) {
        target.value = value.replace(/\D/g, "");
        port.value = target.value;
        return;
      }
    };

    const saveIp = () => {
      const isValidIp = ipSegments.value.every(
        (segment) => segment !== "" && Number(segment) >= 0 && Number(segment) <= 255
      );
      const isValidPort = port.value !== "" && Number(port.value) > 0 && Number(port.value) <= 65535;

      if (!isValidIp || !isValidPort) {
        errorMessage.value =
          "Por favor, introduce una IP válida (0-255 en cada octeto) y un puerto válido (1-65535).";
        return;
      }

      const ipAddress = `${ipSegments.value.join(".")}:${port.value}`;
      console.log("IP y puerto guardados (ejemplo):", ipAddress);

      closeModal();
    };

    return {
      showModal,
      ipSegments,
      port,
      errorMessage,
      portInput,
      openModal,
      closeModal,
      handleKeyDown,
      handlePortInput,
      saveIp,
    };
  },
});
</script>

<style scoped>
/* Estilos adicionales */
</style>
