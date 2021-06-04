<template>
  <wrap
    v-bind="$props"
    v-on="$listeners"
  >
    <template #header>
      <div
        v-if="projection.title || projection.description"
        class="py-2 px-3"
      >
        <h5
          v-if="projection.title"
          class="text-primary mb-0"
        >
          {{ projection.title }}
        </h5>

        <b-card-text
          v-if="projection.description"
          class="text-dark text-truncate mb-1"
        >
          {{ projection.description }}
        </b-card-text>
      </div>
    </template>

    <template #default>
      <b-container
        fluid
        class="h-100 py-2"
      >
        <b-row
          no-gutters
          class="h-100"
        >
          <b-col
            v-for="(element, i) in projection.elements"
            :key="i"
          >
            <display-element
              :display-element="element"
            />
          </b-col>
        </b-row>
      </b-container>
    </template>
  </wrap>
</template>

<script>
import Wrap from './Wrap'
import DisplayElement from './DisplayElements/Viewers'

export default {
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

  computed: {
    displayElements () {
      return this.projection.elements || []
    },
  },
}
</script>
