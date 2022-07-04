export default {
  option: {
    title: {
      text: 'Demo Line',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
      feature: {
        restore: {},
      },
    },
    toolbox: {
      feature: {
        restore: {},
      },
    },
    grid: {
      top: '20%',
      right: '5%',
      containLabel: true,
    },
    legend: {
      top: '9%',
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
    },
    xAxis: {
      type: 'category',
      smooth: true,
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} $  ',
      },
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
      },
      {
        type: 'slider',
        yAxisIndex: 0,
      },
      {
        type: 'inside',
        xAxisIndex: 0,
      },
      {
        type: 'inside',
        yAxisIndex: 0,
      },
    ],
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        lineStyle: {
          width: 10,
        },
        showSymbol: false,
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320],
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
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        label: {
          show: true,
          position: 'top',
        },
        data: [320, 332, 301, 334, 390, 330, 320],
      },
    ],
  },
}
