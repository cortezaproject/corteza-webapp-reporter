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
  </div>
</template>

<script>
import base from '../base.vue'
import loader from './loader'

export default {
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

  methods: {
    sourceTypeComponent: loader,
  },
}
</script>
