<template>
  <div class="d-flex">
    <canvas
      ref="chart"
    />
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

  watch: {
    dataset: {
      immediate: true,
      deep: true,
      handler (dataset = {}) {
        if (dataset.columns.length) {
          this.$nextTick(() => {
            this.renderChart(dataset)
          })
        }
      },
    },
  },

  methods: {
    renderChart (dataset) {
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
          labels: this.getLabels(labelColumn, dataset),
          datasets: this.getChartDatasets(dataColumns, dataset),
        },
      }

      this.chart = new Chart(ctx, this.chartConfig)
    },

    getLabels (labelColumn, dataset) {
      const labels = []

      if (labelColumn && dataset) {
        const columnIndex = this.getColIndex(dataset, labelColumn)
        if (columnIndex < 0) {
          throw new Error(`Column ${labelColumn} not found`)
        }

        for (const row of dataset.rows) {
          labels.push(row[columnIndex])
        }
      }

      return labels
    },

    getChartDatasets (dataColumns, dataset) {
      const chartDataset = []

      if (dataColumns.length && dataset) {
        // Find indexes for all columns we wish to have
        const columnIndexes = []
        for (const column of dataColumns) {
          const columnIndex = this.getColIndex(dataset, column.name)
          if (columnIndex < 0) {
            throw new Error(`Column ${column} not found`)
          }
          columnIndexes.push(columnIndex)
        }

        // Now make all of the datasets
        for (const columnIndex of columnIndexes) {
          const d = {
            label: dataset.columns[columnIndex].name,
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

          for (const row of dataset.rows) {
            d.data.push(row[columnIndex])
          }

          chartDataset.push(d)
        }
      }

      return chartDataset
    },

    getColIndex (dataset, col) {
      if (!dataset || !dataset.columns) return -1

      return dataset.columns.findIndex(({ name }) => name === col)
    },
  },
}
</script>

<style>

</style>
