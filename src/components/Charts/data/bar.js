export default {
  option: {
    title: {
      text: 'World Population',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
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
