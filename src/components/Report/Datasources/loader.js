import { default as Load } from './Load'
import { default as Link } from './Link'
import { default as Aggregate } from './Aggregate'

const Registry = {
  load: Load,
  link: Link,
  aggregate: Aggregate,
}

export default function (k) {
  return Registry[k]
}
