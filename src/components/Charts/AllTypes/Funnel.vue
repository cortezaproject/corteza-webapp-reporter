<template>
  <v-chart
    id="chart"
    class="position-relative h-100 w-100 p-2 bg-white"
    autoresize
    :option="option"
  />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { FunnelChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  FunnelChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
])

export default {
  name: 'FunnelChart',

  components: {
    VChart,
  },

  data () {
    return {
      chart: undefined,
      option: {
        title: {
          text: 'Chart title',
          top: 0,
          left: 'center',
          right: 'center',
          textStyle: {
            color: '#333',
            fontFamily: 'Poppins-Regular',
            fontSize: '16',
            ellipsis: 'truncate',
          },
          textAlign: 'left',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        toolbox: {
          feature: {
            restore: {},
          },
        },
        legend: {
          top: '9%',
          data: ['Negotiation', 'Closed Won', 'Qualification', 'Proposal', 'Need Analysis'],
        },
        series: [
          {
            type: 'funnel',
            left: '10%',
            width: '80%',
            height: '80%',
            maxSize: '80%',
            label: {
              show: false,
              // position: 'inside',
              // formatter: '{c} $',
              // color: '#fff',
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              opacity: 0.8,
              borderColor: '#fff',
              borderWidth: 2,
            },
            // emphasis: {
            //   label: {
            //     position: 'inside',
            //     formatter: '{b}: {c}$',
            //   },
            // },
            // rows
            data: [
              { value: 165, name: 'Negotiation', label: { show: false } },
              { value: 105, name: 'Closed Won', label: { show: false } },
              { value: 65, name: 'Qualification', label: { show: false } },
              { value: 10, name: 'Proposal', label: { show: false } },
              { value: 5, name: 'Need Analysis', label: { show: false } },
            ],
            // Ensure outer shape will not be over inner shape when hover.
            z: 100,
          },
          // {
          //   name: 'Expected',
          //   type: 'funnel',
          //   left: '10%',          //   width: '80%',
          //   height: '80%',
          //   label: {
          //     formatter: '{b}Expected',
          //   },
          //   labelLine: {
          //     show: true,
          //   },
          //   itemStyle: {
          //     opacity: 0.7,
          //   },
          //   emphasis: {
          //     label: {
          //       position: 'inside',
          //       formatter: '{b}Expected: {c}%',
          //     },
          //   },
          //   data: [
          //     { value: 60, name: 'Visit' },
          //     { value: 40, name: 'Inquiry' },
          //     { value: 20, name: 'Order' },
          //     { value: 80, name: 'Click' },
          //     { value: 100, name: 'Show' },
          //   ],
          // },
        ],
      },
    }
  },
}
</script>
