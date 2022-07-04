import { default as component } from './Chart.vue'
import chartType from './data'

const props = {
  option: {},
}

const scenarios = [
  {
    label: 'Bar chart',
    props: chartType.bar,
  },
  {
    label: 'Doughnut chart',
    props: chartType.doughnut,
  },
  {
    label: 'Funnel chart',
    props: chartType.funnel,
  },
  {
    label: 'Line chart',
    props: chartType.line,
  },
  {
    label: 'Pie chart',
    props: chartType.pie,
  },
]

export default {
  name: 'Chart',
  group: ['Report'],
  component,
  props,
  controls: [],
  scenarios,
}
