<template>
  <div
    v-if="step.load"
  >
    <b-form-group
      label="Name"
      label-class="text-primary"
    >
      <b-form-input
        v-model="step.load.name"
        placeholder="Datasource Name..."
      />
    </b-form-group>

    <hr>

    <b-form-group
      label="Source"
      label-class="text-primary"
    >
      <b-form-select
        v-model="step.load.source"
        :options="supportedSources"
      />
    </b-form-group>

    <component
      :is="sourceTypeComponent(step.load.source)"
      v-if="step.load.source"
      :definition.sync="stepDefinition"
    />

    <b-form-group
      label="Prefilter"
      label-class="text-primary"
    >
      <prefilter
        :filter.sync="step.load.filter"
        :columns="columns"
      />
    </b-form-group>
  </div>
</template>

<script>
import Prefilter from 'corteza-webapp-reporter/src/components/Common/Prefilter'
import base from '../base.vue'
import loader from './loader'

export default {
  components: {
    Prefilter,
  },

  extends: base,

  data () {
    return {
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

      columns: [],
    }
  },

  computed: {
    stepDefinition: {
      get () {
        return this.step.load ? this.step.load.definition : undefined
      },

      set (definition) {
        this.step.load.definition = definition
      },
    },
  },

  watch: {
    stepDefinition: {
      immediate: true,
      deep: true,
      handler (def, oldDef) {
        this.getSourceColumns()

        // Reset if not immediate
        if (def && oldDef) {
          this.step.load.filter = {}
        }
      },
    },
  },

  methods: {
    sourceTypeComponent: loader,

    async getSourceColumns (step) {
      const steps = [this.step]
      const describe = [this.step.load.name]

      if (steps.length && describe.length) {
        this.$SystemAPI.reportDescribe({ steps, describe })
          .then((frames = []) => {
            const { columns = [] } = frames.find(({ source }) => describe.includes(source)) || {}
            this.columns = columns
          })
      }
    },
  },
}
</script>
