<template>
  <wrap
    v-if="projection"
    v-bind="$props"
    v-on="$listeners"
  >
    <template
      v-if="projection.title || projection.description"
      #header
    >
      <div
        class="px-3"
      >
        <h5
          v-if="projection.title"
          class="text-primary text-truncate mb-0"
        >
          {{ projection.title }}
        </h5>

        <b-card-text
          v-if="projection.description"
          class="text-dark text-truncate mt-1"
        >
          {{ projection.description }}
        </b-card-text>
      </div>
    </template>

    <template #default>
      <split
        v-if="showDisplayElements"
        ref="split"
        :direction="projection.layout"
        :gutter-size="12"
        class="h-100"
        @onDragEnd="setDisplayElementSizes"
      >
        <split-area
          v-for="(element, displayElementIndex) in projection.elements"
          :key="displayElementIndex"
          :size="element.meta.size"
          :min-size="0"
          class="overflow-auto"
        >
          <display-element
            :display-element="element"
            :dataframes="getFrames(element.name)"
            @update="$emit('update', { displayElementIndex, definition: $event })"
          />
        </split-area>
      </split>
    </template>
  </wrap>
</template>

<script>
import Wrap from './Wrap'
import { Split, SplitArea } from 'vue-split-panel'
import DisplayElement from './DisplayElements/Viewers'

export default {
  name: 'Projection',

  components: {
    Split,
    SplitArea,
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

  data () {
    return {
      showDisplayElements: false,
    }
  },

  watch: {
    'projection.elements.length': {
      immediate: true,
      handler (length, oldLength) {
        if (length) {
          const defaultSize = Math.floor(100 / length)

          // Reset sizes to default if element was added or removed
          const addedOrRemoved = length !== oldLength && oldLength !== undefined

          this.projection.elements = this.projection.elements.map(e => {
            e.meta.size = !addedOrRemoved && e.meta.size ? e.meta.size : defaultSize
            return e
          })

          // Hack around split not rerendering
          this.showDisplayElements = false
          this.$nextTick().then(() => {
            this.showDisplayElements = true
          })
        }
      },
    },
  },

  methods: {
    getFrames (displayElementName) {
      if (this.dataframes) {
        return this.dataframes.filter(({ name }) => name.split('-')[1] === displayElementName) || {}
      }

      return []
    },

    setDisplayElementSizes (sizes = []) {
      sizes.forEach((size, index) => {
        this.projection.elements[index].meta.size = size
      })
    },
  },
}
</script>

<style lang="scss">
.split .gutter {
  background-color: transparent;
}
</style>
