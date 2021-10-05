<template>
  <div
    v-if="step.join"
  >
    <b-row>
      <b-col>
        <b-form-group
          label="Name"
          label-class="text-primary"
        >
          <b-form-input
            v-model="step.join.name"
            placeholder="Datasource Name..."
          />
        </b-form-group>
      </b-col>
    </b-row>

    <hr>

    <b-row>
      <b-col cols="6">
        <b-form-group
          label="Primary Source"
          label-class="text-primary"
        >
          <b-form-select
            v-model="step.join.localSource"
            :options="supportedSources"
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
      </b-col>
      <b-col cols="6">
        <b-form-group
          label="Secondary Source"
          label-class="text-primary"
        >
          <b-form-select
            v-model="step.join.foreignSource"
            :options="supportedSources"
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
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="6">
        <b-form-group
          v-if="step.join.localSource"
          label="Primary Column"
          label-class="text-primary"
        >
          <b-form-select
            v-model="step.join.localColumn"
            :options="localColumns"
            value-field="name"
            text-field="label"
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
      </b-col>
      <b-col cols="6">
        <b-form-group
          v-if="step.join.foreignSource"
          label="Secondary Column"
          label-class="text-primary"
        >
          <b-form-select
            v-model="step.join.foreignColumn"
            :options="foreignColumns"
            value-field="name"
            text-field="label"
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
      </b-col>
    </b-row>
  </div>
</template>

<script>
import base from './base.vue'

export default {
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
      localColumns: [],
      foreignColumns: [],
    }
  },

  computed: {
    supportedSources () {
      const options = []

      this.datasources.forEach(({ step }, index) => {
        Object.entries(step).forEach(([kind, { name }]) => {
          if (['load', 'group'].includes(kind)) {
            options.push({ value: name || `${index}`, text: name || `${index}` })
          }
        })
      })

      return options
    },
  },

  watch: {
    'step.join.name': {
      immediate: true,
      handler (newStep, oldStep) {
        if (!oldStep && newStep) {
          this.getSourceColumns(['local', 'foreign'])
        }
      },
    },

    'step.join.localSource': {
      handler () {
        this.step.join.localColumn = undefined
        this.getSourceColumns(['local'])
      },
    },

    'step.join.foreignSource': {
      handler () {
        this.step.join.foreignColumn = undefined
        this.getSourceColumns(['foreign'])
      },
    },
  },

  methods: {
    async getSourceColumns (sources = []) {
      sources.forEach(source => {
        this[`${source}Columns`] = []

        const sourceType = this.step.join[`${source}Source`]

        if (sourceType) {
          const steps = this.datasources.filter(({ step }) => step.load || step.group).map(({ step }) => step)
          const describe = [sourceType]

          if (steps.length && describe.length) {
            this.$SystemAPI.reportDescribe({ steps, describe })
              .then((frames = []) => {
                const { columns = [] } = frames.find(({ source }) => describe.includes(source)) || {}
                this[`${source}Columns`] = columns
              }).catch((e) => {
                e.message += ' ""'
                this.toastErrorHandler('Failed to describe datasource')(e)
              })
          }
        }
      })
    },
  },
}
</script>
