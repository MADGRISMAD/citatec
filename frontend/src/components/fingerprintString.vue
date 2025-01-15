<template>
    <p class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">Fingerprint: {{ fingerprint }}</p>
</template>

<script lang="ts">

import { getFingerprint } from "@/utils/fingerprint";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "FingerprintString",
  setup() {
    const fingerprint = ref("");
    getFingerprint().then((data) => {
      fingerprint.value = data;
    });
    return { fingerprint };
  },
});

</script>