import Text from './Text'
import Chart from './Chart'
import Table from './Table'

const Registry = {
  Text,
  Chart,
  Table,
}

export default function (k) {
  return Registry[k]
}
