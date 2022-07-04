export default {
  option: {
    title: {
      text: 'Traffic Sources',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    toolbox: {
      feature: {
        restore: {},
      },
    },
    legend: {
      orient: 'vertical',
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
        radius: 140,
        center: ['50%', '55%'],
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
