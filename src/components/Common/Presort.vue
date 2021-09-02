<template>
  <div>
    <draggable
      :list.sync="items"
      group="sort"
      handle=".grab"
    >
      <b-form-row
        v-for="(column, index) in items"
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
          cols="6"
          class="d-flex align-items-center justify-content-around"
        >
          <b-form-radio-group
            v-model="column.descending"
            :options="sortDirections"
            buttons
            size="sm"
            button-variant="outline-primary"
          />
          <c-input-confirm
            variant="link"
            size="lg"
            button-class="text-dark px-0"
            @confirmed="items.splice(index, 1)"
          />
        </b-col>
      </b-form-row>
    </draggable>

    <b-row>
      <b-col
        cols="5"
      >
        <b-button
          variant="link text-decoration-none"
          class="d-flex align-items-center px-1 mt-1"
          @click="items.push({ field: undefined, descending: false })"
        >
          <font-awesome-icon
            :icon="['fas', 'plus']"
            size="sm"
            class="mr-1"
          />
          Add
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable,
  },

  props: {
    presort: {
      type: String,
      default: '',
    },

    columns: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      items: [],
    }
  },

  computed: {
    sortDirections () {
      return [
        { value: false, text: 'Ascending' },
        { value: true, text: 'Descending' },
      ]
    },
  },

  watch: {
    presort: {
      immediate: true,
      handler (presort) {
        if (presort) {
          const sort = presort.includes(',') ? presort.split(',') : [presort]

          this.items = sort.map(value => {
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
          this.items = []
        }
      },
    },

    items: {
      deep: true,
      handler (items = [], oldItems = undefined) {
        if (oldItems) {
          this.$emit('update:presort', items.filter(({ field }) => field).map(({ field, descending }) => {
            return descending ? `${field} DESC` : field
          }).join(','))
        }
      },
    },
  },
}
</script>
