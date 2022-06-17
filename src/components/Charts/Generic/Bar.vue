<template>
  <v-chart
    class="position-relative h-100 w-100 p-2 bg-white"
    :option="option"
  />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

export default {
  name: 'BarChart',
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'light',
    // [THEME_KEY]: 'dark',
  },
  data () {
    return {
      option: {
        title: {
          text: 'World Population',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '9%',
          bottom: '3%',
          containLabel: true,
        },
        dataset: [
          {
            dimensions: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'],
          },
          {
            transform: {
              type: 'sort',
              config: { dimension: 'USA', order: 'desc' },
            },
          },
        ],
        xAxis: {
          type: 'category',

        },
        yAxis: {
          type: 'value',
          data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'],
          boundaryGap: [0, 0.01],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            markLine: {
              lineStyle: {
                type: 'dashed',
              },
              data: [[{ type: 'min' }, { type: 'max' }]],
            },
          },
          {
            name: '2012',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807],
            barWidth: 25,
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' },
              ],
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
            },
          },
          {
            name: '2013',
            type: 'line',
            data: [20325, 21438, 41000, 161594, 144141, 751807],
            barWidth: 15,
          },
        ],
      },
    }
  },
}
</script>
