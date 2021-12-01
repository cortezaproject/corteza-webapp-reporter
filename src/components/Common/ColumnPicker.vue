<template>
  <b-row>
    <b-col class="available">
      <div
        class="d-flex align-items-center justify-content-between"
      >
        Available
        <b-button
          variant="link"
          class="float-right"
          @click.prevent="selectedColumns = [...allColumns]"
        >
          Select all
        </b-button>
      </div>

      <draggable
        class="drag-area border"
        :list.sync="availableColumns"
        group="group"
      >
        <div
          v-for="column in availableColumns"
          :key="column.name"
          class="column"
          @dblclick="selectedColumns = [...selectedColumns, column]"
        >
          <span v-if="column.label">
            {{ column.label }} ({{ column.name }})
          </span>
        </div>
      </draggable>
    </b-col>

    <b-col class="selected">
      <div
        class="d-flex align-items-center justify-content-between"
      >
        Selected
        <b-button
          variant="link"
          class="float-right"
          @click.prevent="selectedColumns = []"
        >
          Unselect all
        </b-button>
      </div>

      <draggable
        v-model="selectedColumns"
        class="drag-area border"
        group="group"
      >
        <div
          v-for="column in selectedColumns"
          :key="column.name"
          class="column"
          @dblclick="selectedColumns = selectedColumns.filter(({ name }) => column.name !== name)"
        >
          <span v-if="column.label">
            {{ column.label }} ({{ column.name }})
          </span>
        </div>
      </draggable>
    </b-col>
  </b-row>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },

  props: {
    allColumns: {
      type: Array,
      required: true,
    },

    columns: {
      type: Array,
      required: true,
    },
  },

  computed: {
    selectedColumns: {
      get () {
        return this.columns
      },

      set (f) {
        this.$emit('update:columns', f)
      },
    },

    availableColumns () {
      // Remove selected columns
      return this.allColumns.filter(a => !this.columns.some(f => a.name === f.name))
    },
  },
}
</script>
<style lang="scss" scoped>
.selected .column {
  cursor: pointer;
}

.available .column {
  cursor: grab;
}

.drag-area {
  height: 150px;
  overflow-x: auto;
  padding: 2px;
  width: 100%;
}

span.system {
  font-size: 80%;
}
</style>
