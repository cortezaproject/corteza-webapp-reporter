<template>
  <div
    v-if="datasource"
  >
    <b-row>
      <b-col>
        <b-form-group
          label="Name"
          label-class="text-primary"
        >
          <b-form-input
            v-model="datasource.join.name"
            placeholder="Datasource Name..."
          />
        </b-form-group>
      </b-col>
    </b-row>

    <hr v-if="datasource.join.source">

    <b-row>
      <b-col cols="12">
        <b-form-group
          label="Local"
          label-class="text-primary"
        >
          <b-input-group>
            <template #prepend>
              <b-form-select
                v-model="datasource.join.localSource"
                :options="supportedSources"
              />
            </template>
            <b-form-input
              v-model="datasource.join.localColumn"
              placeholder="Local column"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-form-group
          label="Foreign"
          label-class="text-primary"
        >
          <b-input-group>
            <template #prepend>
              <b-form-select
                v-model="datasource.join.foreignSource"
                :options="supportedSources"
              />
            </template>
            <b-form-input
              v-model="datasource.join.foreignColumn"
              placeholder="Foreign column"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    sources: {
      type: Array,
      required: false,
      default: () => [],
    },

    datasource: {
      type: Object,
      required: true,
      default: () => ({}),
    },

    index: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  computed: {
    supportedSources () {
      const o = []

      for (let i = 0; i < this.sources.length; i++) {
        if (i === this.index) {
          continue
        }

        for (const [k, v] of Object.entries(this.sources[i])) {
          // @todo for now nested joins are not supported
          if (k === 'join') {
            break
          }

          o.push({ text: v.name, value: v.name })
        }
      }

      return o
    },
  },
}
</script>
