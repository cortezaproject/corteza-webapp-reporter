<template>
  <div
    v-if="options"
  >
    <b-form-group
      label="Type"
      label-class="text-primary"
    >
      <b-form-select
        v-model="options.chartType"
        :options="chartTypes"
      />
    </b-form-group>

    <div
      v-if="options.source"
    >
      <b-form-group
        label="Label column"
        label-class="text-primary"
      >
        <b-form-select
          v-model="options.labelColumn"
          :options="labelColumns"
          text-field="label"
          value-field="name"
        >
          <template #first>
            <b-form-select-option
              value=""
            >
              None
            </b-form-select-option>
          </template>
        </b-form-select>
      </b-form-group>

      <b-form-group
        label="Data columns"
        label-class="text-primary"
      >
        <column-picker
          :all-columns="dataColumns"
          :columns.sync="options.dataColumns"
        />
      </b-form-group>
    </div>
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

  computed: {
    mergedColumns () {
      return [].concat.apply([], this.columns)
    },

    chartTypes () {
      return [
        { value: 'pie', text: 'Pie' },
        { value: 'bar', text: 'Bar' },
        { value: 'line', text: 'Line' },
      ]
    },

    labelColumns () {
      const columns = this.columns.length ? this.columns[0] : []
      return [
        ...columns.filter(({ kind }) => kind === 'String'),
      ].sort((a, b) => a.label.localeCompare(b.label))
    },

    dataColumns () {
      return [
        ...this.mergedColumns.filter(({ kind }) => kind === 'Number'),
      ].sort((a, b) => a.label.localeCompare(b.label))
    },
  },
}
</script>
