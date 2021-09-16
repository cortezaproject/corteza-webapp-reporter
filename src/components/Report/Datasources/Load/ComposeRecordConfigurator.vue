<template>
  <div>
    <b-row>
      <b-col>
        <b-form-group
          label="Namespace"
          class="text-primary"
        >
          <b-form-select
            :value="namespace"
            :options="namespaces"
            text-field="name"
            value-field="namespaceID"
            @change="selectNamespace"
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
            :value="module"
            :options="modules"
            text-field="name"
            value-field="moduleID"
            @change="module = $event"
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
    <!-- <b-row>
      <b-col>
        <b-form-group
          label="Presort"
          label-class="text-primary"
        >
          <b-form-input
            v-model="sort"
          />
        </b-form-group>
      </b-col>
    </b-row> -->
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

    sort: {
      get () {
        return this.definition.sort
      },

      set (sort) {
        this.$emit('update:definition', { ...this.definition, sort })
      },
    },
  },

  watch: {
    namespace: {
      handler (namespaceID) {
        if (namespaceID) {
          this.processing = true

          this.fetchModules(namespaceID)
            .finally(() => {
              this.processing = false
            })
        }
      },
    },
  },

  created () {
    this.processing = true

    this.fetchNamespaces()
      .then(() => {
        if (this.namespace) {
          this.fetchModules(this.namespace)
            .finally(() => {
              this.processing = false
            })
        }
      }).finally(() => {
        this.processing = false
      })
  },

  methods: {
    selectNamespace (namespace) {
      this.namespace = namespace
      this.module = undefined
    },

    fetchNamespaces () {
      return this.$ComposeAPI.namespaceList({ sort: 'name' }).then(({ set = [] }) => {
        this.namespaces = set
      }).catch((e) => {
        this.toastErrorHandler('Failed to fetch namespaces')(e)
      })
    },

    fetchModules (namespaceID) {
      return this.$ComposeAPI.moduleList({ namespaceID, sort: 'name' }).then(({ set = [] }) => {
        this.modules = set
      }).catch((e) => {
        this.toastErrorHandler('Failed to fetch modules')(e)
      })
    },
  },
}
</script>
