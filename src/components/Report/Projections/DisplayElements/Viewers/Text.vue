<template>
  <div
    v-if="options"
    class="p-2"
    v-html="options.value"
  />
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
