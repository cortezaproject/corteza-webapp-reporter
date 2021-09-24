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
          <div
            v-if="processing"
            class="d-flex align-items-center justify-content-center h-100"
          >
            <b-spinner />
          </div>

          <display-element
            v-else
            :display-element="element"
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

    reportID: {
      type: String,
      required: false,
      default: '0',
    },
  },

  data () {
    return {
      processing: false,

      dataframes: {},

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

          this.runReport()

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
    setDisplayElementSizes (sizes = []) {
      sizes.forEach((size, index) => {
        this.projection.elements[index].meta.size = size
      })
    },

    runReport () {
      this.processing = true
      this.dataframes = {}
      const frames = []

      this.projection.elements.forEach((element) => {
        element = reporter.DisplayElementMaker(element)

        if (element && element.kind !== 'Text') {
          const { dataframes = [] } = element.reportDefinitions()

          frames.push(...dataframes.filter(({ source }) => source).map(df => {
            df.name = `${this.index}-${df.name}`
            return df
          }))
        }
      })

      if (frames.length) {
        this.$SystemAPI.reportRun({ frames, reportID: this.reportID })
          .then(({ frames = [] }) => {
            this.projection.elements = this.projection.elements.map(element => {
              const dataframes = frames.filter(({ name }) => name.split('-')[1] === element.name)
              return { ...element, dataframes }
            })
          }).catch((e) => {
            this.toastErrorHandler('Failed to run report')(e)
          }).finally(() => {
            this.processing = false
          })
      } else {
        this.processing = false
      }
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
          this.$SystemAPI.reportRun({ frames, reportID: this.reportID })
            .then(({ frames = [] }) => {
              this.projection.elements.find(({ name }) => name === element.name).dataframes = frames

              // this.projection.elements = this.projection.elements.map(element => {
              //   const dataframes = frames.filter(({ name }) => name.split('-')[1] === element.name)
              //   return { ...element, dataframes }
              // })
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
