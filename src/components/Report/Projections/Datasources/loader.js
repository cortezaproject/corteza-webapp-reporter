import { default as DLoad } from './Load/index.vue'
import { default as DJoin } from './Join.vue'

const Registry = {
  load: DLoad,
  join: DJoin,
}

export default function (k) {
  return Registry[k]
}
