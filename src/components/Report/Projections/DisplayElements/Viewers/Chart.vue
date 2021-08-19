<template>
  <canvas
    ref="chart"
    class="h-100 w-100"
  />
</template>
<script>
import base from './base'
import Chart from 'chart.js'
import colorschemes from 'chartjs-plugin-colorschemes'

export default {
  extends: base,

  data () {
    return {
      chartConfig: {
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              },
            }],
          },
        },
        plugins: [
          colorschemes,
        ],
      },
      chart: undefined,
    }
  },

  computed: {
    hasMultipleDataframes () {
      return this.dataframes.length > 1
    },

    localDataframe () {
      return this.dataframes[0]
    },
  },

  watch: {
    dataframes: {
      immediate: true,
      deep: true,
      handler (dataframes = []) {
        if (dataframes.length) {
          this.$nextTick(() => {
            this.renderChart()
          })
        }
      },
    },
  },

  methods: {
    renderChart () {
      if (this.chart) {
        this.chart.destroy()
      }

      const ctx = this.$refs.chart.getContext('2d')
      const { chartType = 'bar', colorScheme = '', labelColumn = '', dataColumns = [] } = this.options

      this.chartConfig = {
        ...this.chartConfig,
        type: chartType,
        data: {
          labels: this.getLabels(labelColumn),
          datasets: this.getChartDatasets(dataColumns),
        },
      }

      // Set plugin options
      this.chartConfig.options.plugins = {
        colorschemes: {
          scheme: colorScheme,
          reverse: true,
        },
      }

      this.chart = new Chart(ctx, this.chartConfig)
    },

    getLabels (labelColumn) {
      const labels = []

      if (labelColumn && this.localDataframe) {
        const columnIndex = this.getColIndex(this.localDataframe, labelColumn)
        if (columnIndex < 0) {
          throw new Error(`Column ${labelColumn} not found`)
        }

        for (const row of this.localDataframe.rows) {
          labels.push(row[columnIndex])
        }
      }

      return labels
    },

    getChartDatasets (dataColumns) {
      const chartDataset = []

      if (dataColumns.length) {
        // Create dataset for each dataColumn
        for (const { name } of dataColumns) {
          // Assume localDataframe has the dataColumn
          let columnIndex = this.getColIndex(this.localDataframe, name)

          // If dataColumn is in localDataframe, then set that value
          const data = this.localDataframe.rows.map(r => {
            return columnIndex < 0 ? undefined : r[columnIndex]
          })

          // Otherwise check other dataframes for that columnn
          if (columnIndex < 0) {
            this.dataframes.slice(1).forEach(df => {
              const { relColumn, refValue } = df

              // Get column that is referenced by relColumn
              const relColumnIndex = this.getColIndex(this.localDataframe, relColumn)
              if (relColumnIndex < 0) {
                throw new Error(`Column ${relColumn} not found`)
              }

              // Get row index that matches refValue
              const refRowIndex = this.localDataframe.rows.findIndex(row => row[relColumnIndex] === refValue)
              if (refRowIndex < 0) {
                throw new Error(`Row that matches refRowIndex ${refValue} not found`)
              }

              columnIndex = this.getColIndex(df, name)
              if (columnIndex < 0) {
                throw new Error(`Column ${name} not found`)
              } else {
                data[refRowIndex] = df.rows[0][columnIndex]
              }
            })
          }

          chartDataset.push({
            label: name,
            data,
          })
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
