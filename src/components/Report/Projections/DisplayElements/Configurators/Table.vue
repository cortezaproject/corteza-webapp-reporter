<template>
  <div>
    <b-form-group
      v-slot="{ ariaDescribedby }"
      label="Table Options"
      label-cols-lg="2"
    >
      <b-form-checkbox
        v-model="options.striped"
        :aria-describedby="ariaDescribedby"
      >
        Striped
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.bordered"
        :aria-describedby="ariaDescribedby"
      >
        Bordered
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.borderless"
        :aria-describedby="ariaDescribedby"
      >
        Borderless
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.outlined"
        :aria-describedby="ariaDescribedby"
      >
        Outlined
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.small"
        :aria-describedby="ariaDescribedby"
      >
        Small
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.hover"
        :aria-describedby="ariaDescribedby"
      >
        Hover
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.dark"
        :aria-describedby="ariaDescribedby"
      >
        Dark
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.fixed"
        :aria-describedby="ariaDescribedby"
      >
        Fixed
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.footClone"
        :aria-describedby="ariaDescribedby"
      >
        Foot Clone
      </b-form-checkbox>
      <b-form-checkbox
        v-model="options.noCollapse"
        :aria-describedby="ariaDescribedby"
      >
        No border collapse
      </b-form-checkbox>
    </b-form-group>

    <b-form-group
      v-slot="{ ariaDescribedby }"
      label="Head Variant"
      label-cols-lg="2"
    >
      <b-form-radio-group
        v-model="options.headVariant"
        :aria-describedby="ariaDescribedby"
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

    <b-form-group
      label="Table Variant"
      label-for="table-style-variant"
      label-cols-lg="2"
    >
      <b-form-select
        id="table-style-variant"
        v-model="options.tableVariant"
        :options="tableVariants"
      >
        <template #first>
          <option value="">
            -- None --
          </option>
        </template>
      </b-form-select>
    </b-form-group>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      tableVariants: [
        'primary',
        'secondary',
        'info',
        'danger',
        'warning',
        'success',
        'light',
        'dark',
      ],
    }
  },
}
</script>
