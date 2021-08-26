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
    sticky-header
    class="mh-100 mb-0"
  >
    <colgroup
      class="local"
      span="3"
    />

    <colgroup
      class="foreign"
      span="4"
    />

    <colgroup
      class="foreign"
      span="4"
    />

    <b-thead
      :head-variant="options.headVariant"
    >
      <b-tr
        v-if="dataframes.length > 1"
      >
        <b-th
          v-for="(c, i) in tabelify.header"
          :key="i"
          v-bind="c.attrs || {}"
          class="border-0"
        >
          <p
            v-if="c.sourceName"
            class="m-0"
          >
            {{ c.sourceName }}
          </p>
        </b-th>
      </b-tr>
      <b-tr>
        <b-th
          v-for="(c, i) in tabelify.header"
          :key="i"
          class="border-0"
        >
          {{ c.label }}
        </b-th>
      </b-tr>
    </b-thead>

    <b-tbody>
      <b-tr
        v-for="(r, i) in tabelify.rows"
        :key="i"

        :class="{
          separator: !!r[0].separator,
        }"
      >
        <b-td
          v-for="(c, j) in r"
          :key="j"
          v-bind="c.attrs || {}"
        >
          {{ c.value }}
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      sort: {
        field: '',
        descending: false,
      },
    }
  },

  computed: {
    localDataframe () {
      return this.dataframes[0]
    },

    // indexFrames groups frames based on the related DS identifiers
    // for easier work.
    indexFrames () {
      const ix = {}
      for (const df of this.dataframes || []) {
        if (!df.relSource) {
          continue
        }

        if (!ix[df.relSource]) {
          ix[df.relSource] = {}
        }
        if (!ix[df.relSource][df.refValue]) {
          ix[df.relSource][df.refValue] = []
        }
        ix[df.relSource][df.refValue].push(df)
      }

      return ix
    },

    tabelify () {
      if (!this.dataframes.length) {
        return {}
      }

      return this.tabelifyFrame(this.localDataframe)
    },
  },

  methods: {
    // keyColumns returns all of the key columns with indexes for all of the
    // columns that are used in joins.
    keyColumns (frame) {
      const foreignFrames = this.getForeignFrames(frame)
      const keys = {}
      if (foreignFrames === undefined) {
        return keys
      }

      for (const ff of Object.values(foreignFrames)) {
        for (const f of ff) {
          keys[f.relColumn] = f.columns.findIndex(({ name }) => name === f.relColumn)
        }
      }

      return keys
    },

    getForeignFrames (frame) {
      return this.indexFrames[frame.ref]
    },

    // tabelifyFrame returns a set of rows and columns that should be shown
    // for this frame.
    //
    // maxSize is used to calculate the rowSpan that should be applied to joined
    // frames with fewer rows then the other.
    //
    // Flow outline:
    //  * for each row of the frame:
    //  ** find all foreign frames
    //  ** tabelify foreign frames
    //  ** merge with the current tabelified result
    tabelifyFrame (frame, maxSize = 1) {
      const outRows = []

      const displayedColumnIndexes = (this.options.columns[frame.ref] || []).map(({ name }) => {
        return frame.columns.findIndex(fc => fc.name === name)
      })

      let outHeader = [...frame.columns]

      if (this.dataframes.length === 1) {
        outHeader = outHeader.filter((c, index) => {
          return displayedColumnIndexes.includes(index)
        })
      }
      const hSeanFrames = {}

      const relFrames = this.getForeignFrames(frame)
      const usedKeys = this.keyColumns(frame)

      for (const r of frame.rows) {
        maxSize = 1

        const row = this.tabelifyRow(r)
        const auxRows = []
        for (const colIndex of Object.values(usedKeys)) {
          const relFrame = relFrames[r[colIndex]]

          // Determine the largest frame so our maxSize will match
          for (const rf of relFrame || []) {
            maxSize = Math.max(maxSize, rf.rows.length)
          }

          // Tabelify related frames
          for (const rf of relFrame || []) {
            // const refColumnIndexes = (this.options.columns[rf.ref] || []).map(({ name }) => {
            //   return frame.columns.findIndex(fc => fc.name === name)
            // })

            const aux = this.tabelifyFrame(rf, Math.max(rf.rows.length, maxSize))

            // Optionally append header
            if (!hSeanFrames[rf.ref]) {
              const x = [...aux.header]
              x[0].sourceName = rf.ref
              outHeader.push(...x)
              hSeanFrames[rf.ref] = true
            }

            // Rowspan smaller frames so the table is nice and aligned
            if (aux.rows.length < maxSize) {
              for (const col of aux.rows[aux.rows.length - 1]) {
                col.attrs = { rowspan: (maxSize - aux.rows.length) + 1 }
              }
            }

            auxRows.push(aux.rows)
          }
        }

        // Merge the original row with joined rows
        // - the forst row of the merged row gets joined with the original row
        // - the rest are appended to the list (they are offsetted by rowspan)
        if (auxRows.length > 0) {
          for (const c of row) {
            c.attrs = { rowspan: maxSize }
          }
          row[0].separator = true

          const merged = this.mergeRows(auxRows).pop()
          row.push(...merged[0])
          outRows.push(row)
          outRows.push(...merged.slice(1))
        } else {
          outRows.push(row)
        }

        if (this.dataframes.length === 1) {
          outRows[outRows.length - 1] = outRows[outRows.length - 1].filter((c, index) => {
            return displayedColumnIndexes.includes(index)
          })
        }
      }

      return { rows: outRows, maxSize, header: outHeader }
    },

    mergeRows (auxRows, maxSize) {
      if (auxRows.length <= 1) {
        return auxRows
      }

      const a = auxRows[auxRows.length - 2]
      const b = auxRows[auxRows.length - 1]

      const tmpRows = []
      for (let i = 0; i < a.length; i++) {
        const row = a[i]
        if (i >= b.length) {
          tmpRows.push(row)
          continue
        }
        row.push(...b[i])
        tmpRows.push(row)
      }

      if (b.length > a.length) {
        tmpRows.push(...b.slice(a.length))
      }

      auxRows.splice(auxRows.length - 2, 2, tmpRows)
      return this.mergeRows(auxRows)
    },

    tabelifyRow (row) {
      const out = []
      for (let i = 0; i < row.length; i++) {
        out.push({ value: row[i] })
      }

      return out
    },
  },
}
</script>

<style scoped lang="scss">
.foreign {
  border: 1px solid rgba($dark, 0.8);
  border-top: 0;
  border-bottom: 0;
}

.separator {
  border-top: 2px solid rgba($dark, 0.5);
}

</style>
