<template>
  <v-chart
    class="position-relative h-100 w-100 p-2 bg-white"
    :option="option"
  />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

export default {
  name: 'DoughnutChart',
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
          text: 'Traffic Sources',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          // orient: 'horizontal',
          left: '15%',
          top: '33%',
          data: [
            'Direct',
            'Email',
            'Ad Networks',
            'Video Ads',
            'Search Engines',
          ],
        },
        series: [
          {
            name: 'Traffic Sources',
            type: 'pie',
            radius: [20, 140],
            center: ['50%', '63%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 5,
            },
            label: {
              show: false,
            },
            data: [
              { value: 335, name: 'Direct' },
              { value: 310, name: 'Email' },
              { value: 284, name: 'Ad Networks' },
              { value: 235, name: 'Video Ads' },
              { value: 448, name: 'Search Engines' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
    }
  },
}
</script>
