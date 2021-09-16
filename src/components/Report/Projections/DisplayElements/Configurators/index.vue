<template>
  <div
    v-if="displayElement"
  >
    <b-button
      v-b-toggle.datasources
      block
      :disabled="!usesDatasources"
      variant="primary"
      class="mb-2"
    >
      Datasources
    </b-button>
    <b-collapse
      v-if="usesDatasources"
      id="datasources"
      :visible="usesDatasources"
      accordion
    >
      <b-form-group
        label="Datasource"
        label-class="text-primary"
      >
        <b-form-select
          v-model="options.source"
          :options="sources"
          @change="setConfigurableSources"
        />
      </b-form-group>

      <div
        v-if="currentConfigurableDatasourceName"
      >
        <b-form-group
          v-if="options.datasources.length > 1"
          label="Joined datasource handling"
          label-class="text-primary"
        >
          <b-form-select
            v-model="currentConfigurableDatasourceName"
            :options="options.datasources"
            text-field="name"
            value-field="name"
            @change="configurableDatasourceChanged"
          />
        </b-form-group>

        <div
          v-if="currentConfigurableDatasourceIndex >= 0"
        >
          <b-form-group
            v-if="columns.length"
            label="Prefilter"
            label-class="text-primary"
          >
            <prefilter
              :filter.sync="options.datasources[currentConfigurableDatasourceIndex].filter"
              :columns="columns[currentConfigurableDatasourceIndex]"
            />
          </b-form-group>

          <b-form-group
            v-if="columns.length"
            label="Presort order"
            label-class="text-primary"
          >
            <presort
              :presort.sync="options.datasources[currentConfigurableDatasourceIndex].sort"
              :columns="columns[currentConfigurableDatasourceIndex]"
            />
          </b-form-group>

          <b-form-group
            v-if="displayElement.kind === 'Table'"
            label="Limit"
            label-class="text-primary"
          >
            <b-form-input
              v-model="pagingLimit"
              type="number"
            />
          </b-form-group>
        </div>
      </div>
    </b-collapse>

    <b-button
      v-b-toggle.display
      block
      :disabled="!showDisplayElementConfigurator"
      variant="primary"
      class="mb-2"
    >
      Element
    </b-button>
    <b-collapse
      id="display"
      :visible="showDisplayElementConfigurator"
      accordion
    >
      <component
        :is="displayElementConfigurator"
        :display-element="displayElement"
        :options.sync="options"
        :columns="columns"
        :datasource="currentDatasource"
      />
    </b-collapse>
  </div>
</template>

<script>
import getDisplayElementConfigurator from './loader'
import Prefilter from 'corteza-webapp-reporter/src/components/Common/Prefilter'
import Presort from 'corteza-webapp-reporter/src/components/Common/Presort'

export default {
  components: {
    Prefilter,
    Presort,
  },

  props: {
    displayElement: {
      type: Object,
      required: true,
    },

    projection: {
      type: Object,
      required: true,
    },

    datasources: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      columns: [],

      currentConfigurableDatasourceName: undefined,
      currentConfigurableDatasourceIndex: undefined,
    }
  },

  computed: {
    usesDatasources () {
      return !['Text'].includes(this.displayElement.kind)
    },

    displayElementConfigurator () {
      return getDisplayElementConfigurator(this.displayElement.kind)
    },

    showDisplayElementConfigurator () {
      return this.usesDatasources ? !!this.currentDatasource : true
    },

    sources () {
      const options = [{ value: '', text: 'None' }]

      this.datasources.forEach(({ step }, index) => {
        Object.values(step).forEach(({ name }) => {
          options.push({ value: name || `${index}`, text: name || `${index}` })
        })
      })

      return options
    },

    options () {
      return this.displayElement.options || undefined
    },

    currentDatasource () {
      if (this.options.source) {
        return this.datasources.find(({ step: { load = {}, join = {}, group = {} } }) => [load.name, join.name, group.name].includes(this.options.source))
      }

      return undefined
    },

    pagingLimit: {
      get () {
        return this.options.datasources[this.currentConfigurableDatasourceIndex].paging?.limit || 0
      },
      set (v) {
        if (!this.options.datasources[this.currentConfigurableDatasourceIndex].paging) {
          this.options.datasources[this.currentConfigurableDatasourceIndex].paging = {}
        }
        this.options.datasources[this.currentConfigurableDatasourceIndex].paging.limit = v
      },
    },
  },

  watch: {
    'options.source': {
      immediate: true,
      handler (source) {
        this.describeReport(source)
      },
    },
  },

  created () {
    this.currentConfigurableDatasourceIndex = 0

    if (this.usesDatasources) {
      this.currentConfigurableDatasourceName = (this.options.datasources[0] || {}).name
    }
  },

  methods: {
    describeReport (source) {
      this.columns = []

      if (source) {
        const steps = this.datasources.map(({ step }) => step)
        this.$SystemAPI.reportDescribe({ steps, describe: [this.options.source] })
          .then((frames = []) => {
            this.columns = frames.filter(({ source }) => source === this.options.source).map(({ columns = [] }) => columns.sort((a, b) => a.label.localeCompare(b.label))) || []
          }).catch((e) => {
            this.toastErrorHandler('Failed to describe datasource')(e)
          })
      }
    },

    setConfigurableSources (source) {
      this.options.datasources = []
      this.currentConfigurableDatasourceName = undefined

      let configurableDatasources = []
      if (source) {
        configurableDatasources = [source]

        const { join } = this.currentDatasource.step
        if (join) {
          configurableDatasources = [join.localSource, join.foreignSource]
        }
      }

      this.currentConfigurableDatasourceName = configurableDatasources[0]
      this.options.datasources = configurableDatasources.map(s => {
        return {
          name: s,
          sort: '',
          filter: {},
        }
      })
    },

    configurableDatasourceChanged (source) {
      if (source) {
        this.currentConfigurableDatasourceIndex = this.options.datasources.findIndex(({ name }) => source === name)
      }
    },
  },
}
</script>

<style>

</style>
