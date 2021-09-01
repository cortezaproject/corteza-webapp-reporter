<template>
  <div>
    <b-form-group
      v-if="options.valueColumn !== undefined"
      label="Label column"
      label-class="text-primary"
    >
      <b-form-select
        v-model="options.valueColumn"
        :options="valueColumns"
        text-field="label"
        value-field="name"
      >
        <template #first>
          <b-form-select-option
            value=""
          >
            None
          </b-form-select-option>
        </template>
      </b-form-select>
    </b-form-group>

    <b-row>
      <b-col>
        <b-form-group
          label="Format"
          label-class="text-primary"
        >
          <b-form-input
            v-model="options.format"
            placeholder="0.00"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          label="Prefix"
          label-class="text-primary"
        >
          <b-form-input
            v-model="options.prefix"
            placeholder="$"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          label="Suffix"
          label-class="text-primary"
        >
          <b-form-input
            v-model="options.suffix"
            placeholder="USD/mo"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-group
          label="Text color"
        >
          <b-form-input
            v-model="options.color"
            type="color"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group
          label="Background color"
        >
          <b-form-input
            v-model="options.backgroundColor"
            type="color"
          />
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,

  computed: {
    valueColumns () {
      const columns = this.columns.length ? this.columns[0] : []
      return [
        ...columns.filter(({ kind }) => ['Number'].includes(kind)),
      ].sort((a, b) => a.label.localeCompare(b.label))
    },
  },
}
</script>
