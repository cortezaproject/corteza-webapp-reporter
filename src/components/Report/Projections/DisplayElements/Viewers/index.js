import Vue from 'vue'
import { capitalize } from 'lodash'

import Text from './Text'
import Chart from './Chart'
import Table from './Table'
import Metric from './Metric'

/**
 * List of all known display element components
 *
 */
const Registry = {
  Text,
  Chart,
  Table,
  Metric,
}

function GetComponent ({ displayElement }) {
  if (!displayElement) {
    throw new Error('displayElement prop missing')
  }

  const { kind } = displayElement
  if (Object.hasOwnProperty.call(Registry, capitalize(kind))) {
    return Registry[kind]
  }

  throw new Error('unknown displayElement kind: ' + kind)
}

export default Vue.component('display-element', {
  functional: true,

  render (ce, ctx) {
    return ce(GetComponent(ctx.props), ctx.data, ctx.children)
  },
})
