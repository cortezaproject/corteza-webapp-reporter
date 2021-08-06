<template>
  <wrap
    v-if="projection"
    v-bind="$props"
    v-on="$listeners"
  >
    <template #header>
      <div
        v-if="projection.title || projection.description"
        class="p-2"
      >
        <h4
          v-if="projection.title"
          class="text-primary mb-0"
        >
          {{ projection.title }}
        </h4>

        <b-card-text
          v-if="projection.description"
          class="text-dark text-truncate mb-1"
        >
          {{ projection.description }}
        </b-card-text>
      </div>
    </template>

    <template #default>
      <div
        class="d-flex"
        :class="{ 'flex-column': isVertical }"
      >
        <display-element
          v-for="(element, displayElementIndex) in projection.elements"
          :key="displayElementIndex"
          :display-element="element"
          :dataframes="getFrames(element.name)"
          class="flex-even"
          @update="$emit('update', { displayElementIndex, definition: $event })"
        />
      </div>
    </template>
  </wrap>
</template>

<script>
import Wrap from './Wrap'
import DisplayElement from './DisplayElements/Viewers'

export default {
  name: 'Projection',

  components: {
    Wrap,
    DisplayElement,
  },

  props: {
    index: {
      type: Number,
      default: () => -1,
    },

    projection: {
      type: Object,
      required: true,
    },

    dataframes: {
      type: Array,
      required: true,
    },
  },

  computed: {
    displayElements () {
      return this.projection.elements || []
    },

    isVertical () {
      return this.projection.layout === 'vertical'
    },
  },

  methods: {
    getFrames (displayElementName) {
      if (this.dataframes) {
        return this.dataframes.filter(({ name }) => name === displayElementName) || {}
      }

      return []
    },
  },
}
</script>

<style lang="scss" scoped>
.flex-even {
  flex: 1;
}
</style>
