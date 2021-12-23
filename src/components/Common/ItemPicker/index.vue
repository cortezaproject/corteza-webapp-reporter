<template>
  <div
    class="overflow-hidden"
  >
    <b-input-group>
      <b-input
        v-model.trim="query"
        type="search"
        :placeholder="$t('builder:type-to-search')"
        class="text-truncate"
      />
      <b-input-group-append>
        <b-input-group-text class="text-primary bg-white border-left-0">
          <font-awesome-icon
            :icon="['fas', 'search']"
          />
        </b-input-group-text>
      </b-input-group-append>
    </b-input-group>

    <b-row
      class="mt-2 h-100"
    >
      <b-col
        cols="12"
        sm="6"
      >
        <div class="d-flex align-items-center">
          <label
            class="text-primary mb-0"
          >
            {{ $t('builder:available-columns') }}
          </label>
          <b-button
            variant="link"
            :class="[allSelected ? 'visible' : 'invisible']"
            class="ml-auto px-0 text-muted"
            @click.prevent="selectedItems = [...allItems]"
          >
            {{ $t('builder:select-all') }}
          </b-button>
        </div>
        <b-list-group
          vertical
        >
          <draggable
            :key="filteredAvailableItems.length"
            handle=".handle"
            group="fields"
            :value="filteredAvailableItems"
            class="drag-area overflow-auto"
          >
            <b-list-group-item
              v-for="item in filteredAvailableItems"
              :key="item.name"
              class="mb-3 border rounded"
              @dblclick="selectItem(item)"
            >
              <item
                :item="item"
                :selected="false"
                @select-item="selectItem"
              />
            </b-list-group-item>
          </draggable>
        </b-list-group>
      </b-col>
      <b-col
        cols="12"
        sm="6"
        class="pl-sm-0"
      >
        <div class="d-flex align-items-center">
          <label
            class="mb-0 text-primary"
          >
            {{ $t('builder:available-columns') }}
          </label>
          <b-button
            variant="link"
            :class="[allUnselected ? 'visible' : 'invisible']"
            class="ml-auto px-0 text-muted"
            @click.prevent="selectedItems = []"
          >
            {{ $t('builder:unselect-all') }}
          </b-button>
        </div>

        <b-list-group
          vertical
        >
          <draggable
            v-model="selectedItems"
            handle=".handle"
            group="fields"
            class="drag-area overflow-auto"
          >
            <b-list-group-item
              v-for="item in filteredSelectedItems"
              :key="item.name"
              class="mb-3 border rounded"
              @dblclick="unselectItem(item)"
            >
              <item
                :item="item"
                selected
                @unselect-item="unselectItem"
              />
            </b-list-group-item>
          </draggable>
        </b-list-group>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import Item from './Item'

export default {
  components: {
    draggable,
    Item,
  },

  props: {
    allItems: {
      type: Array,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      query: '',
    }
  },

  computed: {
    selectedItems: {
      get () {
        return this.items
      },

      set (f) {
        this.$emit('update:items', f)
      },
    },

    availableItems () {
      return this.allItems.filter(a => !this.selectedItems.some(f => a.name === f.name))
    },

    filteredAvailableItems () {
      return this.filterItems(this.availableItems)
    },

    filteredSelectedItems () {
      return this.filterItems(this.selectedItems)
    },

    allSelected () {
      return this.availableItems.length > 0
    },

    allUnselected () {
      return this.selectedItems.length > 0
    },
  },

  methods: {
    filterItems (items = []) {
      return items.filter(f => {
        return f.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1 || f.label.toLowerCase().indexOf(this.query.toLowerCase()) > -1
      })
    },

    selectItem (item) {
      if (this.selectedItems.some(selectedItem => selectedItem.label === item.label)) return
      this.selectedItems = [...this.selectedItems, item]
    },

    unselectItem (item) {
      this.selectedItems = this.selectedItems.filter(({ name }) => item.name !== name)
    },
  },
}
</script>
<style lang="scss" scoped>
.handle {
  cursor: grab;
}

.drag-area {
  height: 300px;
  max-height: 65vh;
}
</style>
