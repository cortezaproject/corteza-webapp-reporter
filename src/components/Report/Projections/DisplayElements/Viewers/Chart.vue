<template>
  <div class="h-100 w-auto p-1">
    <canvas ref="chart" />
  </div>
</template>
<script>
import base from './base'
import Chart from 'chart.js'

export default {
  extends: base,

  data () {
    return {
      chartConfig: undefined,
      chart: undefined,
    }
  },

  computed: {
    // @todo temporary solution; dataframes can have multiple entries, not just one
    //       you get multiple dataframes when you join data.
    dataframe () {
      if (!this.dataframes || !this.dataframes.length) {
        return undefined
      }

      return this.dataframes[0]
    },
  },

  watch: {
    dataframe: {
      immediate: true,
      deep: true,
      handler (dataframe = {}) {
        if (dataframe.columns.length) {
          this.$nextTick(() => {
            this.renderChart(dataframe)
          })
        }
      },
    },
  },

  methods: {
    renderChart (dataframe) {
      if (this.chart) {
        if (this.chart) {
          this.chart.destroy()
        }
      }

      const ctx = this.$refs.chart.getContext('2d')
      const { chartType = 'bar', labelColumn = '', dataColumns = [] } = this.options

      this.chartConfig = {
        type: chartType,
        data: {
          labels: this.getLabels(labelColumn, dataframe),
          datasets: this.getChartDatasets(dataColumns, dataframe),
        },
      }

      this.chart = new Chart(ctx, this.chartConfig)
    },

    getLabels (labelColumn, dataframe) {
      const labels = []

      if (labelColumn && dataframe) {
        const columnIndex = this.getColIndex(dataframe, labelColumn)
        if (columnIndex < 0) {
          throw new Error(`Column ${labelColumn} not found`)
        }

        for (const row of dataframe.rows) {
          labels.push(row[columnIndex])
        }
      }

      return labels
    },

    getChartDatasets (dataColumns, dataframe) {
      const chartDataset = []

      if (dataColumns.length && dataframe) {
        // Find indexes for all columns we wish to have
        const columnIndexes = []
        for (const column of dataColumns) {
          const columnIndex = this.getColIndex(dataframe, column.name)
          if (columnIndex < 0) {
            throw new Error(`Column ${column} not found`)
          }
          columnIndexes.push(columnIndex)
        }

        // Now make all of the datasets
        for (const columnIndex of columnIndexes) {
          const d = {
            label: dataframe.columns[columnIndex].name,
            backgroundColor: [
              '#48639C',
              '#4C4C9D',
              '#712F79',
              '#976391',
              '#F7996E',
              '#DC0073',
            ],
            data: [],
          }

          for (const row of dataframe.rows) {
            d.data.push(row[columnIndex])
          }

          chartDataset.push(d)
        }
      }

      return chartDataset
    },

    getColIndex (dataframe, col) {
      if (!dataframe || !dataframe.columns) return -1

      return dataframe.columns.findIndex(({ name }) => name === col)
    },
  },
}
</script>
