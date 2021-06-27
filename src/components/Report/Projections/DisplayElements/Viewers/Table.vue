<template>
  <b-table-simple
    :table-variant="options.tableVariant"
    :dark="options.dark"
    :bordered="options.bordered"
    :borderless="options.borderless"
    :outlined="options.outlined"
    :striped="options.striped"
    :responsive="options.responsive"
    :fixed="options.fixed"
    :hover="options.hover"
    :small="options.small"
    :no-border-collapse="options.noCollapse"
    class="h-100 mb-0"
  >
    <b-thead head-variant="dark">
      <b-tr
        v-for="(h, i) of tabelify.headers"
        :key="i"
      >
        <b-th
          v-for="(col, j) of h"
          :key="j"
          v-bind="col.attrs"
        >
          {{ col.name }}
        </b-th>
      </b-tr>
    </b-thead>
    <b-tbody>
      <b-tr
        v-for="(r, i) of tabelify.rows"
        :key="i"
      >
        <component
          :is="c.slot === 'header' ? 'b-th' : 'b-td'"
          v-for="(c, j) of r"
          :key="j"
          v-bind="c.attrs || {}"
        >
          <template v-if="c.slot === 'header'">
            {{ c.name }}
          </template>
          <template v-else>
            {{ c.value }}
          </template>
        </component>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import base from './base'

export default {
  extends: base,

  computed: {
    localFrame () {
      return this.dataframes[0]
    },
    localColumns () {
      return this.localFrame.columns
    },

    foreignFrames () {
      return this.dataframes.slice(1)
    },
    hasForeignFrames () {
      return !!this.foreignFrames.length
    },
    foreignColumns () {
      if (!this.hasForeignFrames) {
        return undefined
      }

      return this.foreignFrames[0].columns
    },
    foreignLocalCol () {
      if (!this.hasForeignFrames) {
        return
      }

      // they are all the same, so this is ok
      return this.foreignFrames[0].relColumn
    },

    localColIndex () {
      if (!this.hasForeignFrames) {
        return -1
      }

      for (let i = 0; i < this.localColumns.length; i++) {
        const c = this.localColumns[i]
        if (c.name === this.foreignLocalCol) {
          return i
        }
      }

      return -1
    },
    foreignFramesIndexed () {
      if (!this.hasForeignFrames) {
        return
      }

      const i = {}
      for (const f of this.foreignFrames) {
        i[f.refValue] = f
      }

      return i
    },

    tabelify () {
      return {
        headers: this.tabelifyHeaders,
        rows: this.tabelifyRows,
      }
    },

    tabelifyHeaders () {
      const headers = []
      if (this.hasForeignFrames) {
        // the first header row is for local columns
        const aux = this.localColumns.map(c => ({ ...c }))
        for (const c of aux.slice(0, this.localColIndex)) {
          c.attrs = { rowspan: 2 }
        }

        aux[this.localColIndex].attrs = { colspan: this.foreignColumns.length }

        for (const c of aux.slice(this.localColIndex + 1)) {
          c.attrs = { rowspan: 2 }
        }

        headers.push(aux, this.foreignColumns)
      } else {
        headers.push(this.localColumns.map(c => ({ ...c })))
      }

      return headers
    },

    // TabelifyRows returns a list of local rows with nested foreign rows.
    // The data is shaped with colspans and rowspans.
    tabelifyRows () {
      const rows = []

      // nothing special todo
      if (!this.hasForeignFrames) {
        return this.localFrame.rows.map(r => r.map(c => ({ value: c, attrs: {} })))
      }

      for (const r of this.localFrame.rows) {
        const out = []
        rows.push(out)

        const c = r[this.localColIndex]
        const ff = this.foreignFramesIndexed[c]

        out.push(...r.map(c => ({ value: c, attrs: {} })))

        // no foreign; nothing to do
        if (!ff) {
          continue
        }

        // give local cell rowspan
        for (const c of out.slice(0, this.localColIndex)) {
          c.attrs = {
            rowspan: ff.rows.length + 1,
          }
        }
        for (const c of out.slice(this.localColIndex + 1)) {
          c.attrs = {
            rowspan: ff.rows.length + 1,
          }
        }

        // replace local column with foreign header
        out.splice(this.localColIndex, 1, ...this.foreignColumns.map(c => ({ ...c, slot: 'header' })))

        // add foreign rows
        rows.push(...ff.rows.map(r => r.map(c => ({ value: c, attrs: {} }))))
      }

      return rows
    },
  },
}
</script>
