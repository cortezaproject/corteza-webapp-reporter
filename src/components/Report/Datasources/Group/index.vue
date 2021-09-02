<template>
  <div
    v-if="step.group"
  >
    <b-form-group
      label="Name"
      label-class="text-primary"
    >
      <b-form-input
        v-model="step.group.name"
        placeholder="Datasource Name..."
      />
    </b-form-group>

    <hr>

    <b-form-group
      label="Source"
      label-class="text-primary"
    >
      <b-form-select
        v-model="step.group.source"
        :options="supportedSources"
        @change="reset"
      >
        <template #first>
          <b-form-select-option
            :value="undefined"
          >
            None
          </b-form-select-option>
        </template>
      </b-form-select>
    </b-form-group>

    <div
      v-if="step.group.source"
    >
      <b-form-group
        label="Group by"
        label-class="text-primary"
      >
        <group-by
          :group-by.sync="step.group.keys"
        />
      </b-form-group>

      <b-form-group
        label="Aggregate"
        label-class="text-primary"
      >
        <aggregate
          :aggregate.sync="step.group.columns"
        />
      </b-form-group>

      <b-form-group
        v-if="columns.length"
        label="Prefilter"
        label-class="text-primary"
      >
        <prefilter
          :filter.sync="step.group.filter"
          :columns="columns"
        />
      </b-form-group>

      <b-form-group
        v-if="columns.length"
        label="Presort order"
        label-class="text-primary"
      >
        <presort
          :presort.sync="step.group.sort"
          :columns="columns"
        />
      </b-form-group>
    </div>
  </div>
</template>

<script>
import base from '../base.vue'
import GroupBy from './GroupBy'
import Aggregate from './Aggregate'
import Prefilter from 'corteza-webapp-reporter/src/components/Common/Prefilter'
import Presort from 'corteza-webapp-reporter/src/components/Common/Presort'

export default {
  components: {
    GroupBy,
    Aggregate,
    Prefilter,
    Presort,
  },

  extends: base,

  props: {
    datasources: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data () {
    return {
      columns: [],
    }
  },

  computed: {
    supportedSources () {
      const options = []

      this.datasources.forEach(({ step }, index) => {
        Object.entries(step).forEach(([kind, { name }]) => {
          if (kind === 'load') {
            options.push({ value: name || `${index}`, text: name || `${index}` })
          }
        })
      })

      return options
    },
  },

  watch: {
    'step.group.source': {
      immediate: true,
      handler () {
        this.getSourceColumns()
      },
    },

    'step.group.keys': {
      deep: true,
      handler () {
        this.getSourceColumns()
      },
    },

    'step.group.columns': {
      deep: true,
      handler () {
        this.getSourceColumns()
      },
    },
  },

  methods: {
    async getSourceColumns () {
      const steps = this.datasources.filter(({ step }) => step.load).map(({ step }) => step)
      steps.push(this.step)
      const describe = [this.step.group.name]

      if (steps.length && describe.length) {
        this.$SystemAPI.reportDescribe({ steps, describe })
          .then((frames = []) => {
            const { columns = [] } = frames.find(({ source }) => describe.includes(source)) || {}
            this.columns = columns
          })
      }
    },

    reset () {
      this.step.group.filter = {}
      this.step.group.sort = ''
      this.step.group.keys = []
      this.step.group.columns = []
    },
  },
}
</script>
