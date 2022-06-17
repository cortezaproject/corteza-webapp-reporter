<template>
  <v-chart
    class="position-relative h-100 w-100 p-2 bg-white"
    :option="option"
  />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GaugeChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
])

export default {
  name: 'GaugeChart',
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
          text: 'Statistic',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}%',
        },
        series: [
          {
            radius: '85%',
            center: ['50%', '55%'],
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false,
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 1,
                borderColor: '#464646',
              },
            },
            axisLine: {
              lineStyle: {
                width: 40,
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              distance: 50,
            },
            data: [
              {
                value: 20,
                name: 'Perfect',
                title: {
                  offsetCenter: ['0%', '-50%'],
                },
                detail: {
                  valueAnimation: true,
                  offsetCenter: ['0%', '-30%'],
                },
              },
              {
                value: 40,
                name: 'Good',
                title: {
                  offsetCenter: ['0%', '-8%'],
                },
                detail: {
                  valueAnimation: true,
                  offsetCenter: ['0%', '13%'],
                },
              },
              {
                value: 60,
                name: 'Commonly',
                title: {
                  offsetCenter: ['0%', '35%'],
                },
                detail: {
                  valueAnimation: true,
                  offsetCenter: ['0%', '55%'],
                },
              },
            ],
            title: {
              fontSize: 14,
            },
            detail: {
              width: 50,
              height: 14,
              fontSize: 14,
              color: 'inherit',
              borderColor: 'inherit',
              borderRadius: 20,
              borderWidth: 1,
              formatter: '{value}%',
            },
          },
        ],
      },
    }
  },
}
</script>
