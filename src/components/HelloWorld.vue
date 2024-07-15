<template>
  <div class="bg-gray-900 text-gray-100 p-6 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-purple-400">{{ msg }}</h1>
    <p class="mb-6 text-gray-300">
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener" class="text-pink-400 hover:text-pink-300 underline">vue-cli documentation</a>.
    </p>
    <h3 class="text-2xl font-semibold mt-10 mb-4 text-yellow-300">Installed CLI Plugins</h3>
    <ul class="space-y-3">
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener" class="text-blue-400 hover:text-blue-300">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa" target="_blank" rel="noopener" class="text-green-400 hover:text-green-300">pwa</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router" target="_blank" rel="noopener" class="text-red-400 hover:text-red-300">router</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener" class="text-orange-400 hover:text-orange-300">eslint</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript" target="_blank" rel="noopener" class="text-teal-400 hover:text-teal-300">typescript</a></li>
    </ul>
    <h3 class="text-2xl font-semibold mt-10 mb-4 text-indigo-300">Essential Links</h3>
    <ul class="flex flex-wrap gap-6">
      <li><a href="https://vuejs.org" target="_blank" rel="noopener" class="text-cyan-400 hover:text-cyan-300">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener" class="text-lime-400 hover:text-lime-300">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener" class="text-fuchsia-400 hover:text-fuchsia-300">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener" class="text-sky-400 hover:text-sky-300">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener" class="text-amber-400 hover:text-amber-300">News</a></li>
    </ul>
    <h3 class="text-2xl font-semibold mt-10 mb-4 text-rose-300">Ecosystem</h3>
    <ul class="flex flex-wrap gap-6">
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener" class="text-emerald-400 hover:text-emerald-300">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener" class="text-violet-400 hover:text-violet-300">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener" class="text-pink-400 hover:text-pink-300">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener" class="text-blue-400 hover:text-blue-300">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener" class="text-green-400 hover:text-green-300">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String
  }
})
export default class HelloWorld extends Vue {
  msg!: string
}
</script>