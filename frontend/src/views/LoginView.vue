<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <main class="w-full max-w-md px-4 transition-all duration-1000 ease-in-out" :class="{ 'opacity-100': showContent, 'opacity-0': !showContent }">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-center mb-6">
            <img class="h-16 w-auto" src="@/assets/logo.png" alt="TNM Logo">
          </div>
          <h2 class="text-center text-3xl font-bold text-[#1B396A] mb-8">
            Iniciar Sesión en CITATEC
          </h2>
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input id="email" name="email" type="email" required v-model="email"
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] sm:text-sm"
                     placeholder="tu@ejemplo.com">
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
              <input id="password" name="password" type="password" required v-model="password"
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1B396A] focus:border-[#1B396A] sm:text-sm"
                     placeholder="••••••••">
            </div>
            <div>
              <button type="submit"
                      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B396A] hover:bg-[#294d8e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B396A]">
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { outputLog } from 'shared-types';
export default defineComponent({
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const showContent = ref(false);

    const handleLogin = () => {
      outputLog('Iniciando sesión con:', email.value, password.value);
      // Aquí iría la lógica de autenticación
    };

    onMounted(() => {
      setTimeout(() => {
        showContent.value = true;
      }, 100);
    });

    return {
      email,
      password,
      handleLogin,
      showContent
    };
  }
});
</script>