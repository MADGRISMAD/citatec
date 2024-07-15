<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
      <div>
        <img class="mx-auto h-20 w-auto" src="@/assets/logo.png" alt="TNM Logo">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-[#1B396A]">
          Registro en CITATEC
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ingresa tus datos para comenzar
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo Institucional</label>
            <input id="email" name="email" type="email" required 
                   v-model="form.email"
                   class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] focus:z-10 sm:text-sm"
                   placeholder="ejemplo@tecnm.mx">
          </div>
          <div class="mb-4">
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input id="fullName" name="fullName" type="text" required 
                   v-model="form.fullName"
                   class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] focus:z-10 sm:text-sm"
                   placeholder="Juan Pérez González">
          </div>
          <div class="mb-4">
            <label for="semester" class="block text-sm font-medium text-gray-700 mb-1">Semestre Actual</label>
            <select id="semester" name="semester" required 
                    v-model="form.semester"
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] focus:z-10 sm:text-sm">
              <option value="" disabled selected>Selecciona tu semestre</option>
              <option v-for="n in 12" :key="n" :value="n">{{ n }}º Semestre</option>
            </select>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Número de Celular</label>
            <input id="phone" name="phone" type="tel" required 
                   v-model="form.phone"
                   @input="parsePhoneNumber"
                   class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] focus:z-10 sm:text-sm"
                   placeholder="1234567890">
          </div>
        </div>

        <div>
          <button type="submit"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A] transition duration-150 ease-in-out transform hover:scale-105">
            Registrarse
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'SignUp',
  setup() {
    const form = reactive({
      email: '',
      fullName: '',
      semester: '',
      phone: ''
    });

    const parsePhoneNumber = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const parsed = input.value.replace(/\D/g, '');
      form.phone = parsed.slice(0, 10);
    };

    const handleSubmit = () => {
      console.log('Formulario enviado:', form);
      // Aquí puedes agregar la lógica para enviar los datos al servidor
    };

    return {
      form,
      parsePhoneNumber,
      handleSubmit
    };
  }
});
</script>