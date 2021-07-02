<template>
  <div
    v-if="options"
  >
    <b-form-group
      label="Datasource"
      label-class="text-primary"
    >
      <b-form-select
        v-model="options.source"
        :options="sources"
        @input="sourceChanged"
      />
    </b-form-group>

    <b-form-group
      label="Type"
      label-class="text-primary"
    >
      <b-form-select
        v-model="options.chartType"
        :options="chartTypes"
      />
    </b-form-group>

    <hr v-if="options.source">

    <div
      v-if="options.source"
    >
      <b-form-group
        label="Label column"
        label-class="text-primary"
      >
        <b-form-select
          v-model="options.labelColumn"
          :options="labelColumns"
          text-field="label"
          value-field="name"
        >
          <template #first>
            <b-form-select-option
              value=""
            >
              None
            </b-form-select-option>
          </template>
        </b-form-select>
      </b-form-group>

      <b-form-group
        label="Data columns"
        label-class="text-primary"
      >
        <column-picker
          :all-columns="dataColumns"
          :columns.sync="options.dataColumns"
        />
      </b-form-group>
    </div>
  </div>
</template>

<script>
import base from './base'
import ColumnPicker from 'corteza-webapp-reporter/src/components/Common/ColumnPicker'

export default {

  components: {
    ColumnPicker,
  },
  extends: base,

  data () {
    return {
      columns: [],
    }
  },

  computed: {
    chartTypes () {
      return [
        { value: 'pie', text: 'Pie' },
        { value: 'bar', text: 'Bar' },
        { value: 'line', text: 'Line' },
      ]
    },

    labelColumns () {
      return [
        ...this.columns.filter(({ kind }) => kind === 'String'),
      ].sort((a, b) => a.label.localeCompare(b.label))
    },

    dataColumns () {
      return [
        ...this.columns.filter(({ kind }) => kind === 'Number'),
      ].sort((a, b) => a.label.localeCompare(b.label))
    },
  },

  watch: {
    'options.source': {
      immediate: true,
      handler (source) {
        this.columns = []

        if (source) {
          // @todo support different step variants
          const step = this.projection.sources.find(({ load }) => load.name === source)
          const { frames = [] } = this.displayElement.reportDefinitions('', this.projection.sources)

          this.$SystemAPI.reportRunFresh({ steps: [step], frames })
            .then(({ frames = [] }) => {
              const { columns = [] } = frames.find(({ name }) => name === this.displayElement.name) || {}
              this.columns = columns.sort((a, b) => a.label.localeCompare(b.label))
            })
        }
      },
    },
  },

  methods: {
    sourceChanged () {
      // Reset columns on user change of source
      this.options.dataColumns = []
      this.options.labelColumn = ''
    },
  },
}
</script>
