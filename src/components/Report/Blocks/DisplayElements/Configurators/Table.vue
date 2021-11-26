<template>
  <div
    v-if="options"
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
      />
    </b-form-group>

    <b-form-group
      v-if="currentConfigurableDatasourceName && currentColumns.length"
      label="Columns"
      label-class="text-primary"
    >
      <column-picker
        :all-columns="currentColumns"
        :columns.sync="currentSelectedColumns"
      />
    </b-form-group>

    <b-row no-gutters>
      <b-col class="pr-3">
        <b-form-group
          label="Table Variant"
          label-class="text-primary"
        >
          <b-form-select
            v-model="options.tableVariant"
            :options="tableVariants"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          label="Head Variant"
          label-class="text-primary"
        >
          <b-form-radio-group
            v-model="options.headVariant"
            class="mt-lg-2"
          >
            <b-form-radio
              :value="null"
              inline
            >
              None
            </b-form-radio>
            <b-form-radio
              value="light"
              inline
            >
              Light
            </b-form-radio>
            <b-form-radio
              value="dark"
              inline
            >
              Dark
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>

    <b-form-group
      label="Table Options"
      label-class="text-primary"
    >
      <b-form-checkbox
        v-model="options.striped"
        inline
      >
        Striped
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.bordered"
        inline
      >
        Bordered
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.borderless"
        inline
      >
        Borderless
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.small"
        inline
      >
        Small
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.hover"
        inline
      >
        Hover
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.dark"
        inline
      >
        Dark
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.responsive"
        inline
      >
        Responsive
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.fixed"
        inline
      >
        Fixed
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.noCollapse"
        inline
      >
        No border collapse
      </b-form-checkbox>
    </b-form-group>
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
      currentConfigurableDatasourceName: undefined,
    }
  },

  computed: {
    tableVariants () {
      return [
        { value: '', text: 'None' },
        { value: 'primary', text: 'Primary' },
        { value: 'secondary', text: 'Secondary' },
        { value: 'info', text: 'Info' },
        { value: 'danger', text: 'Danger' },
        { value: 'warning', text: 'Warning' },
        { value: 'success', text: 'Success' },
        { value: 'light', text: 'Light' },
        { value: 'dark', text: 'Dark' },
      ]
    },

    currentColumns () {
      if (this.currentConfigurableDatasourceName && this.columns) {
        const datasourceIndex = this.options.datasources.findIndex(ds => ds.name === this.currentConfigurableDatasourceName)
        if (datasourceIndex >= 0) {
          return this.columns[datasourceIndex] || []
        }
      }

      return []
    },

    currentSelectedColumns: {
      get () {
        return this.currentConfigurableDatasourceName ? this.options.columns[this.currentConfigurableDatasourceName] : []
      },

      set (columns) {
        if (this.currentConfigurableDatasourceName) {
          this.$set(this.options.columns, this.currentConfigurableDatasourceName, columns || [])
        }
      },
    },
  },

  watch: {
    'options.datasources': {
      immediate: true,
      handler (datasources) {
        datasources.forEach(({ name }) => {
          this.$set(this.options.columns, name, this.options.columns[name] || [])
        })

        this.currentConfigurableDatasourceName = (datasources[0] || {}).name
      },
    },
  },
}
</script>
