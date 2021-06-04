<template>
  <b-form-group>
    <b-form-textarea
      v-model="displayElement.value"
      placeholder="Input text..."
      rows="5"
    />
  </b-form-group>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
