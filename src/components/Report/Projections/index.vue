<template>
  <wrap
    v-if="projection"
    v-bind="$props"
    v-on="$listeners"
  >
    <template
      #header
    >
      <div
        v-if="projection.title || projection.description"
        class="px-3"
        style="padding-top: 0.75rem; padding-bottom: 0.75rem;"
      >
        <h5
          v-if="projection.title"
          class="text-primary text-truncate mb-0"
        >
          {{ projection.title }}
        </h5>

        <b-card-text
          v-if="projection.description"
          class="text-dark text-truncate"
          :class="{ 'mt-1': projection.title }"
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
          :class="{
            'overflow-hidden h-100': element.kind !== 'Text',
            'w-100': projection.elements.length === 1
          }"
        >
          <display-element
            :display-element="element"
            :dataframes="getFrames(element.name)"
            @update="updateDataframes({ displayElementIndex, definition: $event })"
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
import { reporter } from '@cortezaproject/corteza-js'

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

    updateDataframes ({ displayElementIndex, definition }) {
      const element = reporter.DisplayElementMaker(this.projection.elements[displayElementIndex])
      const frames = []

      if (element && element.kind !== 'Text') {
        const { dataframes = [] } = element.reportDefinitions(definition)

        frames.push(...dataframes.filter(({ source }) => source).map(df => {
          df.name = `${this.index}-${df.name}`
          return df
        }))

        if (frames.length) {
          const steps = this.$attrs.datasources.map(({ step }) => step)

          this.$SystemAPI.reportRunFresh({ steps, frames })
            .then(({ frames = [] }) => {
              this.dataframes = frames
            }).catch((e) => {
              this.toastErrorHandler('Failed to run report')(e)
            })
        }
      }
    },
  },
}
</script>

<style lang="scss">
.split .gutter {
  background-color: transparent;
}
</style>
