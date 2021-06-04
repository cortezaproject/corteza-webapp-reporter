<template>
  <b-table
    v-if="options"
    :items="items"
    :fields="fields"
    :striped="options.striped"
    :bordered="options.bordered"
    :borderless="options.borderless"
    :outlined="options.outlined"
    :small="options.small"
    :hover="options.hover"
    :dark="options.dark"
    :fixed="options.fixed"
    :foot-clone="options.footClone"
    :no-border-collapse="options.noCollapse"
    :head-variant="options.headVariant"
    :table-variant="options.tableVariant"
    class="h-100 mb-0"
  />
</template>

<script>
import base from './base'

export default {
  extends: base,

  computed: {
    fields () {
      return ['first_name', 'last_name', 'age']
    },

    items () {
      return [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
      ]
    },
  },
}
</script>
