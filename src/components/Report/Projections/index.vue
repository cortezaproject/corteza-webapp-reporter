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
        v-if="!processing"
        class="d-flex"
        :class="{ 'flex-column': isVertical }"
      >
        <display-element
          v-for="(element, i) in projection.elements"
          :key="i"
          :display-element="element"
          :dataframes="getFrames(element.name)"
          class="flex-even"
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
  },

  data () {
    return {
      processing: false,

      reportDataframes: {},
    }
  },

  computed: {
    displayElements () {
      return this.projection.elements || []
    },

    isVertical () {
      return this.projection.layout === 'vertical'
    },
  },

  watch: {
    'projection.elements': {
      immediate: true,
      deep: true,
      handler (elements = []) {
        if (elements.length) {
          this.runReport()
        }
      },
    },
  },

  methods: {
    async runReport () {
      const frames = []

      this.projection.elements.filter(({ kind }) => kind !== 'Text').forEach((element, i) => {
        const { frames: ff } = element.reportDefinitions('', this.projection.sources)
        frames.push(...ff)
      })

      if (frames.length) {
        this.processing = true

        this.$SystemAPI.reportRunFresh({ steps: this.projection.sources, frames })
          .then(dataFrames => {
            this.reportDataframes = dataFrames
          })
          .finally(() => {
            this.processing = false
          })
      }
    },

    getFrames (displayElementName) {
      if (this.reportDataframes.frames) {
        return this.reportDataframes.frames.filter(({ name }) => name === displayElementName) || {}
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
