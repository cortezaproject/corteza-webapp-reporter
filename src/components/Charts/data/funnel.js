export default {
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
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          opacity: 0.8,
          borderColor: '#fff',
          borderWidth: 2,
        },
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
    ],
  },
}
