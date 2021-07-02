<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group
          label="Namespace"
          class="text-primary"
        >
          <b-form-select
            v-model="namespace"
            :options="namespaces"
            text-field="name"
            value-field="namespaceID"
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
      <b-col>
        <b-form-group
          v-if="namespace"
          label="Module"
          class="text-primary"
        >
          <b-form-select
            v-model="module"
            :options="modules"
            text-field="name"
            value-field="moduleID"
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
    definition: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data () {
    return {
      processing: false,

      namespaces: [],
      modules: [],
    }
  },

  computed: {
    namespace: {
      get () {
        return this.definition.namespaceID
      },

      set (namespaceID) {
        this.$emit('update:definition', { ...this.definition, namespaceID })
      },
    },

    module: {
      get () {
        return this.definition.moduleID
      },

      set (moduleID) {
        this.$emit('update:definition', { ...this.definition, moduleID })
      },
    },

    filter: {
      get () {
        return this.definition.filter
      },

      set (filter) {
        this.$emit('update:definition', { ...this.definition, filter })
      },
    },
  },

  watch: {
    namespace: {
      handler (namespaceID) {
        this.module = undefined

        if (namespaceID) {
          this.processing = true

          this.fetchModules(namespaceID)
            .then(modules => {
              this.modules = modules
            }).finally(() => {
              this.processing = false
            })
        }
      },
    },
  },

  created () {
    this.processing = true

    this.fetchNamespaces()
      .then(namespaces => {
        this.namespaces = namespaces

        if (this.namespace) {
          this.fetchModules(this.namespace)
            .then(modules => {
              this.modules = modules
            }).finally(() => {
              this.processing = false
            })
        }
      }).finally(() => {
        this.processing = false
      })
  },

  methods: {
    fetchNamespaces () {
      return this.$ComposeAPI.namespaceList({ sort: 'name' }).then(({ set = [] }) => {
        return set
      })
    },

    fetchModules (namespaceID) {
      return this.$ComposeAPI.moduleList({ namespaceID, sort: 'name' }).then(({ set = [] }) => {
        return set
      })
    },
  },
}
</script>
