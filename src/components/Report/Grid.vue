<template>
  <div
    v-if="layout.length"
    class="w-100"
  >
    <grid-layout
      :layout.sync="layout"
      :col-num="48"
      :row-height="10"
      vertical-compact
      :is-resizable="editable"
      :is-draggable="editable"
      :cols="{ lg: 48, md: 48, sm: 1, xs: 1, xxs: 1 }"
      :margin="[0, 0]"
      :responsive="!editable"
      use-css-transforms
    >
      <grid-item
        v-for="(item, index) in grid"
        :key="item.i"
        ref="items"
        :min-w="3"
        :min-h="3"
        v-bind="{ ...item }"
        :class="{ 'editable-grid-item': editable }"
        drag-ignore-from=".gutter"
      >
        <slot
          :block="blocks[item.i]"
          :index="index"
          :block-index="item.i"
          :bounding-rect="boundingRects[index]"
          v-on="$listeners"
        />
      </grid-item>
    </grid-layout>
  </div>
  <div
    v-else
    class="d-flex align-items-center justify-content-center h-50 w-100"
  >
    <h4>
      No blocks added yet
    </h4>
  </div>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'

export default {
  name: 'Grid',

  components: {
    GridLayout,
    GridItem,
  },

  props: {
    blocks: {
      type: Array,
      default: () => [],
    },

    editable: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      // All blocks in vue-grid friendly structure
      grid: [],

      // Grid items bounding rect info
      boundingRects: [],
    }
  },

  computed: {
    layout: {
      get () {
        return this.grid
      },

      set (layout) {
        this.grid = layout
      },
    },

    sortedGrid () {
      return Array.from(this.grid).sort((a, b) => Math.sqrt(a.x * a.x + a.y * a.y) - Math.sqrt(b.x * b.x + b.y * b.y))
    },
  },

  watch: {
    blocks: {
      immediate: true,
      deep: true,
      handler (blocks) {
        this.grid = blocks
      },
    },
  },

  mounted () {
    window.addEventListener('resize', this.windowResizeThrottledHandler)
  },

  destroyed () {
    window.removeEventListener('resize', this.windowResizeThrottledHandler)
  },
}
</script>

<style lang="scss">
.vue-grid-item.vue-grid-placeholder {
  background: $primary !important;
}
</style>

<style lang="scss" scoped>
.editable-grid-item {
  touch-action: none;
  background-image: linear-gradient(45deg, #f3f3f5 25%, #ffffff 25%, #ffffff 50%, #f3f3f5 50%, #f3f3f5 75%, #ffffff 75%, #ffffff 100%);
  background-size: 28.28px 28.28px;
}
</style>
