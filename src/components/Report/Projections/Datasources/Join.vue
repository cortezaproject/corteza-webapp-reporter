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
            v-model="datasource.join.name"
            placeholder="Datasource Name..."
          />
        </b-form-group>
      </b-col>
    </b-row>

    <hr>

    <b-row>
      <b-col cols="6">
        <b-form-group
          label="Local Source"
          label-class="text-primary"
        >
          <b-form-select
            v-model="datasource.join.localSource"
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
          v-if="datasource.join.localSource"
          label="Local Column"
          label-class="text-primary"
        >
          <b-form-select
            v-model="datasource.join.localColumn"
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
    </b-row>

    <b-row>
      <b-col cols="6">
        <b-form-group
          label="Foreign Source"
          label-class="text-primary"
        >
          <b-form-select
            v-model="datasource.join.foreignSource"
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
          v-if="datasource.join.foreignSource"
          label="Foreign Column"
          label-class="text-primary"
        >
          <b-form-select
            v-model="datasource.join.foreignColumn"
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
export default {
  props: {
    sources: {
      type: Array,
      required: false,
      default: () => [],
    },

    datasource: {
      type: Object,
      required: true,
      default: () => ({}),
    },

    index: {
      type: Number,
      required: false,
      default: 0,
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
      const o = []

      for (let i = 0; i < this.sources.length; i++) {
        if (i === this.index) {
          continue
        }

        for (const [k, v] of Object.entries(this.sources[i])) {
          // @todo for now nested joins are not supported
          if (k === 'join') {
            break
          }

          o.push({ text: v.name, value: v.name })
        }
      }

      return o
    },
  },

  watch: {
    datasource: {
      immediate: true,
      handler (newDatasource, oldDatasource) {
        if (!oldDatasource && newDatasource) {
          this.getSourceColumns(['local', 'foreign'])
        }
      },
    },

    'datasource.join.localSource': {
      handler () {
        this.datasource.join.localColumn = undefined
        this.getSourceColumns(['local'])
      },
    },

    'datasource.join.foreignSource': {
      handler () {
        this.datasource.join.foreignColumn = undefined
        this.getSourceColumns(['foreign'])
      },
    },
  },

  methods: {
    async getSourceColumns (sources = []) {
      const frames = []
      const steps = []

      sources.forEach(source => {
        this[`${source}Columns`] = []

        const name = `${source}Source`
        const sourceName = this.datasource.join[name]

        if (sourceName) {
          const frame = { name, source: sourceName }
          const step = this.sources.find(({ load }) => load.name === sourceName)

          if (step && frame) {
            frames.push(frame)
            steps.push(step)
          }
        }
      })

      if (frames.length && steps.length) {
        await this.$SystemAPI.reportRunFresh({ steps, frames })
          .then(({ frames = [] }) => {
            sources.forEach(source => {
              const { columns = [] } = frames.find(({ name }) => name === `${source}Source`) || {}
              this[`${source}Columns`] = columns
            })
          })
      }
    },
  },
}
</script>
