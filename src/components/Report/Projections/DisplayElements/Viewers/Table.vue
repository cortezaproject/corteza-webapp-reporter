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
    <b-thead
      :head-variant="options.headVariant"
    >
      <b-tr
        v-for="(h, i) of tabelify.columns"
        :key="i"
      >
        <b-th
          v-for="(c, j) of h"
          :key="j"
          v-bind="c.attrs"
          class="pointer"
          @click="handleSort(c.name)"
        >
          <div
            class="d-flex align-items-center"
          >
            <div
              class="d-flex text-nowrap"
            >
              {{ c.label }}
            </div>

            <font-awesome-layers
              class="ml-2"
            >
              <font-awesome-icon
                :icon="['fas', 'angle-up']"
                class="mb-1"
                :style="{
                  color: sort.field === c.name && !sort.descending ? 'black' : 'grey',
                }"
              />
              <font-awesome-icon
                :icon="['fas', 'angle-down']"
                class="mt-1"
                :style="{
                  color: sort.field === c.name && sort.descending ? 'black' : 'grey',
                }"
              />
            </font-awesome-layers>
          </div>
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
            {{ c.label }}
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

  data () {
    return {
      sort: {
        field: '',
        descending: false,
      },
    }
  },

  computed: {
    localFrame () {
      return this.dataframes[0] || { rows: [] }
    },
    localColumns () {
      return (this.localFrame || {}).columns || []
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
      const tableConfiguration = {
        columns: this.tabelifyColumns,
        rows: this.tabelifyRows,
      }

      if (!this.hasForeignFrames) {
        let { columns = [] } = tableConfiguration

        if (columns.length && this.options.columns.length) {
          columns = columns[0] || []
          // Get selected column indexes
          const columnIndexes = this.options.columns.map(({ name }) => {
            return columns.findIndex(c => name === c.name)
          })

          tableConfiguration.columns = [this.options.columns]

          tableConfiguration.rows = tableConfiguration.rows.map(values => {
            const rowValues = []
            columnIndexes.forEach(i => {
              rowValues.push(values[i])
            })

            return rowValues
          })
        }
      }

      return tableConfiguration
    },

    tabelifyColumns () {
      const columns = []
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

        columns.push(aux, this.foreignColumns)
      } else {
        columns.push(this.localColumns.map(c => ({ ...c })))
      }

      return columns
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

  created () {
    // let firstField = this.options.sort

    // if (firstField.includes(',')) {
    //   firstField = this.options.sort.split(',')[0]
    // }

    // if (firstField.includes('DESC')) {
    //   this.sort.descending = true
    //   this.sort.field = firstField.split(' ')[0]
    // } else {
    //   this.sort.field = firstField
    // }
  },

  methods: {
    updateDefinition () {
      const { field, descending } = this.sort
      if (field) {
        // Generate sort string
        const sort = descending ? `${field} DESC` : field

        this.$emit('update', { sort })
      }
    },

    handleSort (fieldName) {
      if (fieldName) {
        const { field, descending } = this.sort

        if (fieldName === field) {
          this.sort.descending = !descending
        } else {
          this.sort.field = fieldName
          this.sort.descending = false
        }
      }

      this.updateDefinition()
    },
  },
}
</script>
