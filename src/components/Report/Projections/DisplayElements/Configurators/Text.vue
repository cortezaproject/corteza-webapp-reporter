<template>
  <b-form-group>
    <rich-text-input
      v-model="displayElement.value"
    />
  </b-form-group>
</template>

<script>
import base from './base'
import RichTextInput from 'corteza-webapp-reporter/src/components/RichTextInput'

export default {

  components: {
    RichTextInput,
  },
  extends: base,
}
</script>
