<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div class="flex items-center">
            <img class="h-10 w-auto mr-4" src="@/assets/logo.png" alt="TNM Logo">
            <h1 class="text-3xl font-bold text-gray-900">Perfil De Usuario</h1>
          </div>
          <button class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cerrar Sesión
          </button>
        </div>
      </header>
  
      <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
          <div class="p-8 space-y-8">
            <div class="text-center">
              <img class="mx-auto h-24 w-24 rounded-full object-cover" :src="user.avatar" alt="User avatar">
              <h2 class="mt-4 text-3xl font-extrabold text-gray-900">
                {{ user.name }}
              </h2>
              <p class="mt-1 text-sm text-gray-600">{{ user.email }}</p>
            </div>
            
            <div class="border-t border-gray-200 pt-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Información Personal</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-500">Matrícula</p>
                  <p class="mt-1 text-lg font-semibold text-indigo-600">{{ user.studentId }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Carrera</p>
                  <p class="mt-1 text-lg font-semibold text-indigo-600">{{ user.major }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Semestre</p>
                  <p class="mt-1 text-lg font-semibold text-indigo-600">{{ user.semester }}º</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Teléfono</p>
                  <p class="mt-1 text-lg font-semibold text-indigo-600">{{ user.phone }}</p>
                </div>
              </div>
            </div>
  
            <div class="space-y-4">
              <button @click="editProfile" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105">
                Editar Perfil
              </button>
              <button @click="viewAppointments" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105">
                Ver Citas
              </button>
              <button @click="requestDocument" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105">
                Solicitar Documento
              </button>
            </div>
  
            <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r-lg" role="alert">
              <p class="font-bold mb-1">Recordatorio</p>
              <p>Mantén tu información actualizada para un mejor servicio.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  interface User {
    name: string;
    email: string;
    avatar: string;
    studentId: string;
    major: string;
    semester: number;
    phone: string;
  }
  
  export default defineComponent({
    name: 'UserProfile',
    setup() {
      const user = ref<User>({
        name: 'Juan Pérez',
        email: 'juan.perez@ejemplo.com',
        avatar: 'https://via.placeholder.com/150',
        studentId: '2021030123',
        major: 'Ing. en Sistemas Computacionales',
        semester: 5,
        phone: '555-123-4567'
      });
  
      const editProfile = () => {
        console.log('Editar perfil');
        // Implementar lógica para editar perfil
      };
  
      const viewAppointments = () => {
        console.log('Ver citas');
        // Implementar lógica para ver citas
      };
  
      const requestDocument = () => {
        console.log('Solicitar documento');
        // Implementar lógica para solicitar documento
      };
  
      return {
        user,
        editProfile,
        viewAppointments,
        requestDocument
      };
    }
  });
  </script>