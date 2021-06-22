<template>
  <div
    class="p-2"
    v-html="displayElement.value"
  />
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
