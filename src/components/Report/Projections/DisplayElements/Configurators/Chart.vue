<template>
  <b-container
    tag="form"
    fluid="xl"
  >
    <b-row no-gutters>
      <b-col v-if="displayElement">
        <b-container
          fluid
          class="px-4 py-3"
        >
          <b-row>
            <b-col>
              <fieldset>
                <b-form-group
                  label="Color scheme"
                >
                  <b-form-select
                    v-model="displayElement.options.colorScheme"
                    :options="colorSchemes"
                    class="mt-1"
                  >
                    <template slot="first">
                      <option
                        :value="undefined"
                        disabled
                      >
                        {{ $t('chart.colorScheme') }}
                      </option>
                    </template>
                  </b-form-select>
                </b-form-group>
              </fieldset>

              <!-- Some charts support multiple reports -->
              <!-- <fieldset
                v-if="supportsMultipleReports"
                class="form-group mt-2"
              >
                <b-form-group class="mb-2">
                  <h4 class="d-inline-block">
                    {{ $t('block.chart.configure.reportsLabel') }}
                  </h4>
                  <b-btn
                    v-if="reportsValid"
                    class="float-right p-0"
                    variant="link"
                    @click="onAddReport"
                  >
                    + {{ $t('general.label.add') }}
                  </b-btn>
                  <div class="ml-1">
                    <draggable
                      v-model="reports"
                      :options="{ handle:'.handle' }"
                      class="w-100 d-inline-block"
                      tag="tbody"
                    >

                      <report-item
                        v-for="(r, i) in reports"
                        :key="i"
                        :report="r"
                        :fixed="reports.length === 1"
                        @edit="onEditReport(i)"
                        @remove="onRemoveReport(i)"
                      >
                        <template #report-label>
                          <template v-if="r.moduleID">
                            {{ moduleName(r.moduleID) }}
                          </template>
                          <template v-else>
                            {{ $t('chart.edit.unconfiguredReport') }}
                          </template>
                        </template>
                      </report-item>
                    </draggable>
                  </div>
                </b-form-group>
              </fieldset> -->

              <!-- Generic report editing component -->
              <!-- <component
                :is="reportEditor"
                v-if="editReport"
                :report.sync="editReport"
                :modules="modules"
                :dimension-field-kind="['Select']"
                :supported-metrics="1"
              /> -->
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
