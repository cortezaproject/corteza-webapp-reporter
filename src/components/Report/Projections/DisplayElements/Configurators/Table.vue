<template>
  <div>
    <b-form-group
      label="Datasource"
      label-class="text-primary"
    >
      <b-form-select
        v-model="options.source"
        :options="sources"
        @input="sourceChanged"
      />
    </b-form-group>

    <b-form-group
      v-if="options.source && columns.length"
      label="Columns"
      label-class="text-primary"
    >
      <column-picker
        :all-columns="columns"
        :columns.sync="options.columns"
      />
    </b-form-group>

    <b-form-group
      v-if="options.source && columns.length"
      label="Presort order"
      label-class="text-primary"
    >
      <presort
        :presort="options.sort"
        :columns="columns"
        @update="options.sort = $event"
      />
    </b-form-group>

    <b-row no-gutters>
      <b-col class="pr-3">
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
      <b-col>
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
import Presort from 'corteza-webapp-reporter/src/components/Common/Presort'
import ColumnPicker from 'corteza-webapp-reporter/src/components/Common/ColumnPicker'

export default {

  components: {
    Presort,
    ColumnPicker,
  },
  extends: base,

  data () {
    return {
      columns: [],
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
  },

  methods: {
    sourceChanged () {
      // Reset columns on user change of source
      this.options.columns = []
    },
  },
}
</script>
