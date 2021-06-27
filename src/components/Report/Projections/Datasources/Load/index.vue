<template>
  <div
    v-if="datasource"
  >
    <b-row>
      <b-col>
        <b-form-group
          label="Name"
          label-class="text-primary"
        >
          <b-form-input
            v-model="datasource.load.name"
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
            v-model="datasource.load.source"
            :options="supportedSources"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <hr v-if="datasource.load.source">

    <component
      :is="loader(datasource.load.source)"
      v-if="datasource.load.source"
      :definition.sync="datasource.load.definition"
    />
  </div>
</template>

<script>
import loader from './loader'

export default {
  props: {
    datasource: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

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

  methods: {
    loader: loader,
  },
}
</script>
