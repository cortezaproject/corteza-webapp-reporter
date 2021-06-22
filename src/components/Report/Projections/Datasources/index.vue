<template>
  <div
    v-if="currentDatasource"
  >
    <b-row>
      <b-col>
        <b-form-group
          label="Name"
          label-class="text-primary"
        >
          <b-form-input
            v-model="currentDatasource.load.name"
            placeholder="Datasource Name..."
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          label="Source"
          label-class="text-primary"
        >
          <b-form-select
            v-model="currentDatasource.load.source"
            :options="supportedSources"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <hr v-if="currentDatasource.load.source">

    <component
      :is="loader(currentDatasource.load.source)"
      v-if="currentDatasource.load.source"
      :definition.sync="currentDatasource.load.definition"
    />
  </div>
</template>

<script>
import loader from './loader'

export default {
  props: {
    sources: {
      type: Array,
      required: true,
      default: () => [],
    },

    currentSourceIndex: {
      type: Number,
      required: true,
    },
  },

  data () {
    return {
      currentDatasource: undefined,

      // @todo get this from the API
      supportedSources: [
        {
          text: 'Compose records',
          value: 'composeRecords',
          definition: [{
            label: 'namespace',
            key: 'namespace',
          }, {
            label: 'module',
            key: 'module',
          }],
        },
      ],
    }
  },

  watch: {
    currentSourceIndex: {
      immediate: true,
      handler (index) {
        this.currentDatasource = index >= 0 ? this.sources[index] : undefined
      },
    },
  },

  methods: {
    loader: loader,

    deleteDatasource () {
      this.sources.splice(this.currentSourceIndex, 1)

      this.$emit('update:sources', this.sources)
    },
  },
}
</script>
