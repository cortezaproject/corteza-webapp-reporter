<template>
  <div class="d-flex align-items-center">
    <font-awesome-icon
      :icon="['fas', 'grip-vertical']"
      class="handle align-baseline mr-3 text-primary"
    />

    <b class="cursor-default text-dark text-truncate">
      {{ itemLabel }}
    </b>

    <font-awesome-icon
      v-if="selected"
      :icon="['fas', 'eye']"
      class="align-baseline ml-auto text-muted pointer"
      @click="$emit('unselect-item', item)"
    />

    <font-awesome-icon
      v-else
      :icon="['fas', 'eye-slash']"
      class="align-baseline ml-auto text-muted pointer"
      @click="$emit('select-item', item)"
    />
  </div>
</template>

<script>
export default {
  name: 'Item',

  props: {
    item: {
      type: Object,
      required: true,
    },

    selected: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    itemLabel () {
      let itemLabel = this.item.name || ''

      if (this.item.label) {
        itemLabel = `${this.item.label} (${this.item.name})`
      }

      return itemLabel
    },
  },
}
</script>
<style scoped>
.handle {
  cursor: grab;
}

.cursor-default {
  cursor: default;
}
</style>
