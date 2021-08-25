<template>
  <div
    v-if="options"
  >
    <b-row>
      <b-col>
        <b-form-group
          label="Type"
          label-class="text-primary"
        >
          <b-form-select
            v-model="options.chartType"
            :options="chartTypes"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          label="Color scheme"
          label-class="text-primary"
        >
          <vue-select
            :value="options.colorScheme"
            :options="colorSchemes"
            class="h-100 w-100"
            @input="options.colorScheme = $event.value"
          >
            <template #option="option">
              <div
                v-for="(color, index) in option.colors"
                :key="`${option.value}-${index}`"
                :style="`background: ${color};`"
                class="d-inline-block color-box mr-1"
              />
            </template>
          </vue-select>
        </b-form-group>
      </b-col>
    </b-row>

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
import colorschemes from 'chartjs-plugin-colorschemes/src/colorschemes'
import VueSelect from 'vue-select'

export default {
  components: {
    VueSelect,
    ColumnPicker,
  },

  extends: base,

  data () {
    return {
      colorSchemes: [],

      allowedLabelKinds: [
        'Date',
        'DateTime',
        'Select',
        'Number',
        'Bool',
        'String',
      ],
    }
  },

  computed: {
    mergedColumns () {
      return [].concat.apply([], this.columns)
    },

    chartTypes () {
      return [
        { value: 'bar', text: 'Bar' },
        { value: 'line', text: 'Line' },
        { value: 'pie', text: 'Pie' },
        { value: 'doughnut', text: 'Doughnut' },
        { value: 'funnel', text: 'Funnel' },
      ]
    },

    labelColumns () {
      const columns = this.columns.length ? this.columns[0] : []
      return [
        ...columns.filter(({ kind }) => this.allowedLabelKinds.includes(kind)),
      ].sort((a, b) => a.label.localeCompare(b.label))
    },

    dataColumns () {
      return [
        ...this.mergedColumns.filter(({ kind }) => kind === 'Number'),
      ].sort((a, b) => a.label.localeCompare(b.label))
    },
  },

  created () {
    const capitalize = w => `${w[0].toUpperCase()}${w.slice(1)}`
    const splicer = sc => {
      const rr = (/(\D+)(\d+)$/gi).exec(sc)
      return {
        label: rr[1],
        count: rr[2],
      }
    }

    const rr = []
    for (const g in colorschemes) {
      for (const sc in colorschemes[g]) {
        const gn = splicer(sc)

        rr.push({
          label: `${capitalize(g)}: ${capitalize(gn.label)}`,
          colors: [...colorschemes[g][sc]].reverse(),
          value: `${g}.${sc}`,
        })
      }
    }

    this.colorSchemes = rr
  },
}
</script>

<style lang="scss" scoped>
.color-box {
  width: 28px;
  height: 12px;
}
</style>
