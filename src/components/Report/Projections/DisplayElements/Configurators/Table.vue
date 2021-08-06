<template>
  <div>
    <b-form-group
      label="Datasource"
      label-class="text-primary"
    >
      <b-form-select
        v-model="options.source"
        :options="sources"
        @input="sourceChanged"
      />
    </b-form-group>

    <b-form-group
      v-if="options.source && columns.length"
      label="Columns"
      label-class="text-primary"
    >
      <column-picker
        :all-columns="columns"
        :columns.sync="options.columns"
      />
    </b-form-group>

    <b-form-group
      v-if="options.source && columns.length"
      label="Presort order"
      label-class="text-primary"
    >
      <draggable
        :list.sync="presort"
        group="sort"
        handle=".grab"
      >
        <b-form-row
          v-for="(column, index) in presort"
          :key="index"
          class="mb-1"
        >
          <b-col
            cols="1"
            class="d-flex align-items-center justify-content-center"
          >
            <font-awesome-icon
              :icon="['fas', 'bars']"
              class="grab text-grey"
            />
          </b-col>

          <b-col
            cols="5"
          >
            <b-form-select
              v-model="column.field"
              :options="columns"
              text-field="label"
              value-field="name"
              class="rounded"
            >
              <template #first>
                <b-form-select-option
                  :value="undefined"
                >
                  None
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-col>

          <b-col
            cols="4"
            class="d-flex align-items-center"
          >
            <b-form-radio-group
              v-model="column.descending"
              :options="sortDirections"
              buttons
              button-variant="outline-primary"
            />
          </b-col>

          <b-col
            cols="1"
            class="d-flex align-items-center"
          >
            <c-input-confirm
              variant="link"
              size="lg"
              button-class="text-dark px-0"
              @confirmed="presort.splice(index, 1)"
            />
          </b-col>
        </b-form-row>
      </draggable>

      <b-button
        variant="primary"
        class="mt-1"
        @click="presort.push({ field: undefined, descending: false })"
      >
        +Add
      </b-button>
    </b-form-group>

    <b-row no-gutters>
      <b-col class="pr-3">
        <b-form-group
          label="Head Variant"
          label-class="text-primary"
        >
          <b-form-radio-group
            v-model="options.headVariant"
            class="mt-lg-2"
          >
            <b-form-radio
              :value="null"
              inline
            >
              None
            </b-form-radio>
            <b-form-radio
              value="light"
              inline
            >
              Light
            </b-form-radio>
            <b-form-radio
              value="dark"
              inline
            >
              Dark
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          label="Table Variant"
          label-class="text-primary"
        >
          <b-form-select
            v-model="options.tableVariant"
            :options="tableVariants"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <b-form-group
      label="Table Options"
      label-class="text-primary"
    >
      <b-form-checkbox
        v-model="options.striped"
        inline
      >
        Striped
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.bordered"
        inline
      >
        Bordered
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.borderless"
        inline
      >
        Borderless
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.small"
        inline
      >
        Small
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.hover"
        inline
      >
        Hover
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.dark"
        inline
      >
        Dark
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.responsive"
        inline
      >
        Responsive
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.fixed"
        inline
      >
        Fixed
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.noCollapse"
        inline
      >
        No border collapse
      </b-form-checkbox>
    </b-form-group>
  </div>
</template>

<script>
import base from './base'
import Draggable from 'vuedraggable'
import ColumnPicker from 'corteza-webapp-reporter/src/components/Common/ColumnPicker'

export default {
  components: {
    Draggable,
    ColumnPicker,
  },

  extends: base,

  data () {
    return {
      columns: [],

      presort: undefined,
    }
  },

  computed: {
    sortDirections () {
      return [
        { value: false, text: 'Ascending' },
        { value: true, text: 'Descending' },
      ]
    },

    tableVariants () {
      return [
        { value: '', text: 'None' },
        { value: 'primary', text: 'Primary' },
        { value: 'secondary', text: 'Secondary' },
        { value: 'info', text: 'Info' },
        { value: 'danger', text: 'Danger' },
        { value: 'warning', text: 'Warning' },
        { value: 'success', text: 'Success' },
        { value: 'light', text: 'Light' },
        { value: 'dark', text: 'Dark' },
      ]
    },
  },

  watch: {
    presort: {
      deep: true,
      handler (presort = [], oldPresort = undefined) {
        if (oldPresort) {
          this.options.sort = presort.filter(({ field }) => field).map(({ field, descending }) => {
            return descending ? `${field} DESC` : field
          }).join(',')
        }
      },
    },
  },

  created () {
    if (this.options.sort) {
      let sort = []

      if (this.options.sort.includes(',')) {
        sort = this.options.sort.split(',')
      } else {
        sort = [this.options.sort]
      }

      this.presort = sort.map(value => {
        let field = ''
        let descending = false

        if (value.includes('DESC')) {
          descending = true
          field = value.split(' ')[0]
        } else {
          field = value
        }

        return {
          field,
          descending: !!descending,
        }
      })
    } else {
      this.presort = []
    }
  },

  methods: {
    sourceChanged () {
      // Reset columns on user change of source
      this.options.columns = []
    },
  },
}
</script>
