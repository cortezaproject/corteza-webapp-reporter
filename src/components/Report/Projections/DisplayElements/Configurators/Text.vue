<template>
  <b-form-group>
    <c-rich-text-input
      v-if="options"
      v-model="options.value"
    />
  </b-form-group>
</template>

<script>
import base from './base'
import { components } from '@cortezaproject/corteza-vue'
const { CRichTextInput } = components

export default {
  components: {
    CRichTextInput,
  },

  extends: base,
}
</script>
