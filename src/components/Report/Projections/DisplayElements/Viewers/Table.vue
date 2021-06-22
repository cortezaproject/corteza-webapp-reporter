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
    <b-thead
      :head-variant="options.headVariant"
    >
      <b-tr>
        <b-th
          v-for="(column, i) in tabelify.columns"
          :key="i"
        >
          {{ column.name }}
        </b-th>
      </b-tr>
    </b-thead>
    <b-tbody
      class="h-100"
    >
      <b-tr
        v-for="(row, i) in tabelify.rows"
        :key="i"
      >
        <b-td
          v-for="(value, k) in row"
          :key="k"
        >
          {{ value }}
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import base from './base'

export default {
  extends: base,

  computed: {
    tabelify () {
      let { columns = [], rows = [] } = this.dataset

      if (columns.length) {
        // return {
        //   columns: this.castDatasetColumns(columns, undefined, columns.length),
        //   rows: this.castDatasetRows(rows),
        // }

        // Get selected column indexes
        const columnIndexes = this.options.columns.map(({ name }) => {
          return columns.findIndex(c => name === c.name)
        })

        columns = this.options.columns

        rows = rows.map(values => {
          const rowValues = []
          columnIndexes.forEach(i => {
            rowValues.push(values[i])
          })

          return rowValues
        })
      }

      return { columns, rows }
    },
  },

  methods: {
    castDatasetRows (datasetRows = []) {
      const rows = []

      for (const r of datasetRows) {
        const row = []
        const attrs = {
          rowspan: 1,
        }

        rows.push(row)

        for (const c of r) {
          if (!c) {
            row.push({
              variable: undefined,
              attrs,
            })
          } else {
            if (c.matrix) {
              const aux = this.castDatasetRows(c.matrix)
              attrs.rowspan += (aux.length - 1)
              for (const ac of aux[0]) {
                if (ac) {
                  row.push(ac)
                }
              }
              rows.push(...aux.slice(1))
            } else {
              row.push({
                variable: c.variable,
                attrs,
                value: c,
              })
            }
          }
        }
      }

      return rows
    },

    castDatasetColumns (columns, padLeft = undefined, reqSize = undefined) {
      const row = []
      const rows = [row]
      const seenDimensions = new Set([])

      const rootDim = columns[0].dimension
      const attrs = { rowspan: 1 }

      for (const [i, c] of columns.entries()) {
        if (seenDimensions.has(c.dimension)) {
          continue
        }
        if (c.dimension && c.dimension !== rootDim) {
          const aux = this.castDatasetColumns(columns.slice(i), i, reqSize)

          row.push({
            name: c.dimension,
            attrs: { colspan: aux[0].length },
          })
          rows.push(...aux)

          attrs.rowspan += (aux[0].rowspan || 1)

          seenDimensions.add(c.dimension)
        } else if (rootDim && !c.dimension) {
          return rows
        } else {
          row.push({
            name: c.name,
            attrs,
          })
        }
      }

      return rows
    },
  },
}
</script>
