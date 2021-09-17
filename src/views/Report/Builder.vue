<template>
  <div
    class="d-flex overflow-auto px-2 w-100"
  >
    <portal to="topbar-title">
      {{ pageTitle }}
    </portal>

    <portal to="topbar-tools">
      <b-button
        variant="secondary"
        size="sm"
        class="mr-1"
        @click="openDatasourceConfigurator"
      >
        Datasources
      </b-button>

      <b-button-group
        size="sm"
        class="mr-1"
      >
        <b-button
          variant="primary"
          style="margin-right:2px;"
          :to="reportViewer"
        >
          <font-awesome-icon
            :icon="['fas', 'eye']"
          />
          View Report
        </b-button>
        <b-button
          variant="primary"
          :to="reportEditor"
        >
          <font-awesome-icon
            :icon="['fas', 'pen']"
          />
        </b-button>
      </b-button-group>
    </portal>

    <grid
      v-if="report && showReport"
      :blocks.sync="projections.items"
      editable
    >
      <template
        slot-scope="{ block, index }"
      >
        <div
          class="h-100 editable-block"
        >
          <div
            class="add-element d-flex align-items-center justify-items-between mr-3 mt-3"
          >
            <b-button
              variant="link"
              class="text-light"
              @click="openDisplayElementSelector(index)"
            >
              <font-awesome-icon
                :icon="['fas', 'plus']"
                class="h4 mb-0"
              />
            </b-button>
            <b-button
              variant="link"
              class="text-light"
              @click="editProjection(index)"
            >
              <font-awesome-icon
                :icon="['far', 'edit']"
                class="h5 mb-0"
              />
            </b-button>

            <c-input-confirm
              size="md"
              variant="link text-danger"
              @confirmed="deleteProjection(index)"
            />
          </div>

          <projection
            v-if="block"
            :index="index"
            :projection="block"
            :datasources="reportDatasources"
          />
        </div>
      </template>
    </grid>

    <b-modal
      v-model="projections.showConfigurator"
      title="Block configuraton"
      ok-title="Save Projection"
      ok-variant="primary"
      cancel-variant="link"
      scrollable
      size="xl"
      body-class="p-0 border-top-0"
      header-class="pb-0 px-3 pt-3 border-bottom-0"
      @ok="updateProjection()"
    >
      <b-tabs
        v-if="projections.current"
        active-nav-item-class="bg-grey"
        nav-wrapper-class="bg-white border-bottom"
        active-tab-class="tab-content h-auto overflow-auto"
        card
      >
        <b-tab
          title="General"
          active
        >
          <b-form-group
            label="Title"
            label-class="text-primary"
          >
            <b-form-input
              v-model="projections.current.title"
              type="text"
              placeholder="Projection title"
            />
          </b-form-group>

          <b-form-group
            label="Description"
            label-class="text-primary"
          >
            <b-form-textarea
              v-model="projections.current.description"
              placeholder="Projection description"
            />
          </b-form-group>

          <b-form-group
            label="Layout"
            label-class="text-primary"
          >
            <b-form-radio-group
              v-model="projections.current.layout"
              :options="projectionLayoutOptions"
              buttons
              button-variant="outline-primary"
            />
          </b-form-group>
        </b-tab>

        <b-tab
          :active="!!projections.current.elements.length"
          title="Elements"
        >
          <configurator
            :items="currentDisplayElements"
            :current-index="currentDisplayElementIndex"
            draggable
            @select="setCurrentDisplayElement"
            @add="openDisplayElementSelector(projections.currentIndex)"
            @delete="deleteCurrentDisplayElement"
          >
            <template v-slot:label="{ item: { kind, name } }">
              {{ kind || name }}
              <font-awesome-icon
                :icon="['fas', 'bars']"
                class="grab text-grey"
              />
            </template>

            <template #configurator>
              <display-element-configurator
                v-if="currentDisplayElement"
                :display-element="currentDisplayElement"
                :projection="projections.current"
                :datasources="reportDatasources"
                class="pr-2"
              />
            </template>
          </configurator>
        </b-tab>
      </b-tabs>
    </b-modal>

    <b-modal
      v-model="datasources.showConfigurator"
      size="xl"
      scrollable
      ok-title="Save Datasources"
      ok-variant="primary"
      title="Datasources"
      body-class="py-3"
      @ok="refreshReport()"
    >
      <configurator
        v-if="report"
        :items="reportDatasources"
        :current-index="datasources.currentIndex"
        draggable
        @select="setCurrentDatasource"
        @add="openDatasourceSelector()"
        @delete="deleteCurrentDataSource"
      >
        <template v-slot:label="{ item: { step } }">
          <span
            class="d-inline-block text-truncate"
          >
            {{ datasourceLabel(step, datasources.currentIndex) }}
          </span>
        </template>

        <template #configurator>
          <component
            :is="getDatasourceComponent(reportDatasources[datasources.currentIndex])"
            v-if="currentDatasourceStep"
            :datasources="reportDatasources"
            :index="datasources.currentIndex"
            :step.sync="currentDatasourceStep"
          />
        </template>
      </configurator>
    </b-modal>

    <b-modal
      v-model="displayElements.showSelector"
      size="lg"
      scrollable
      hide-footer
      title="Add display element"
      body-class="px-0 py-3"
    >
      <selector
        :items="displayElements.types"
        @select="addDisplayElement"
      />
    </b-modal>

    <b-modal
      v-model="datasources.showSelector"
      size="lg"
      scrollable
      hide-footer
      title="Add datasource"
      body-class="px-0 py-3"
    >
      <selector
        :items="datasources.types"
        display-mode="text"
        @select="addDatasource"
      />
    </b-modal>

    <portal to="report-toolbar">
      <editor-toolbar
        :back-link="{ name: 'report.list' }"
        @delete="handleDelete"
        @save="handleReportSave"
      >
        <b-button
          variant="light"
          size="lg"
          @click="createProjection"
        >
          + Add block
        </b-button>
      </editor-toolbar>
    </portal>
  </div>
</template>

<script>
import { reporter } from '@cortezaproject/corteza-js'
import report from 'corteza-webapp-reporter/src/mixins/report'
import Grid from 'corteza-webapp-reporter/src/components/Report/Grid'
import Projection from 'corteza-webapp-reporter/src/components/Report/Projections'
import datasources from 'corteza-webapp-reporter/src/components/Report/Datasources/loader'
import Configurator from 'corteza-webapp-reporter/src/components/Common/Configurator'
import Selector from 'corteza-webapp-reporter/src/components/Common/Selector'
import EditorToolbar from 'corteza-webapp-reporter/src/components/EditorToolbar'
import DisplayElementConfigurator from 'corteza-webapp-reporter/src/components/Report/Projections/DisplayElements/Configurators'
import * as displayElementThumbnails from 'corteza-webapp-reporter/src/assets/DisplayElements'

export default {
  name: 'ReportBuilder',

  components: {
    Grid,
    Selector,
    Configurator,
    Projection,
    DisplayElementConfigurator,
    EditorToolbar,
  },

  mixins: [
    report,
  ],

  data () {
    return {
      processing: false,
      showReport: true,

      report: undefined,

      dataframes: [],

      currentDisplayElementIndex: undefined,
      currentDisplayElement: undefined,

      projections: {
        showConfigurator: false,

        currentIndex: undefined,
        current: undefined,

        items: [],
      },

      displayElements: {
        showSelector: false,

        types: [
          {
            label: 'Text',
            kind: 'Text',
            value: displayElementThumbnails.Text,
          },
          {
            label: 'Metric',
            kind: 'Metric',
            value: displayElementThumbnails.Metric,
          },
          {
            label: 'Table',
            kind: 'Table',
            value: displayElementThumbnails.Table,
          },
          {
            label: 'Chart',
            kind: 'Chart',
            value: displayElementThumbnails.Chart,
          },
        ],
      },

      datasources: {
        showSelector: false,
        showConfigurator: false,

        currentIndex: undefined,

        types: [
          {
            label: 'Load',
            kind: 'Load',
            value: 'Load step description',
          },
          {
            label: 'Join',
            kind: 'Join',
            value: 'Join step description',
          },
          {
            label: 'Group',
            kind: 'Group',
            value: 'Group step description',
          },
        ],
      },
    }
  },

  computed: {
    reportID () {
      return this.$route.params.reportID
    },

    pageTitle () {
      const title = this.report ? (this.report.meta.name || this.report.handle) : ''
      return `Report Builder - '${title}'` || 'Report Builder'
    },

    currentDisplayElements () {
      return this.projections.current ? this.projections.current.elements : []
    },

    reportDatasources: {
      get () {
        return this.report ? this.report.sources : []
      },

      set (sources) {
        this.report.sources = sources
      },
    },

    currentDatasourceStep: {
      get () {
        return this.datasources.currentIndex !== undefined ? this.reportDatasources[this.datasources.currentIndex].step : undefined
      },

      set (step) {
        if (this.datasources.currentIndex !== undefined) {
          this.reportDatasources[this.datasources.currentIndex].step = step
        }
      },
    },

    reportViewer () {
      return this.report ? { name: 'report.view', params: { reportID: this.report.reportID } } : undefined
    },

    reportEditor () {
      return this.report ? { name: 'report.edit', params: { reportID: this.report.reportID } } : undefined
    },

    projectionLayoutOptions () {
      return [
        { text: 'Horizontal', value: 'horizontal' },
        { text: 'Vertical', value: 'vertical' },
      ]
    },
  },

  watch: {
    reportID: {
      immediate: true,
      handler (reportID) {
        if (reportID) {
          this.processing = true

          this.fetchReport(this.reportID)
            .then(() => {
              this.mapProjections()
            }).finally(() => {
              this.processing = false
            })
        }
      },
    },
  },

  methods: {
    refreshReport () {
      this.showReport = false
      return setTimeout(() => {
        this.showReport = true
      }, 50)
    },

    // If projection is added/reordered or deleted, vue-grid-layout needs fresh indexes to work properly
    reindexProjections (projections = this.projections.items || []) {
      this.projections.items = projections.map((projection, i) => {
        return { ...projection, i }
      })
    },

    // Datasources
    getDatasourceComponent ({ step }) {
      if (step) {
        for (const s in step) {
          return datasources(s)
        }
      }

      return undefined
    },

    datasourceLabel (datasource, currentIndex) {
      for (const v of Object.values(datasource)) {
        if (v && v.name) {
          return v.name
        }
      }

      return `${currentIndex}`
    },

    openDatasourceSelector () {
      this.datasources.showSelector = true
      this.datasources.currentIndex = this.reportDatasources.length ? 0 : undefined
    },

    openDatasourceConfigurator () {
      this.datasources.showConfigurator = true
      this.datasources.currentIndex = this.reportDatasources.length ? 0 : undefined
    },

    setCurrentDatasource (index) {
      this.datasources.currentIndex = index
    },

    deleteCurrentDataSource () {
      this.reportDatasources.splice(this.datasources.currentIndex, 1)
      this.datasources.currentIndex = this.reportDatasources.length ? 0 : undefined
    },

    addDatasource (kind = '') {
      if (kind) {
        let step

        switch (kind) {
          case 'Group':
            step = reporter.StepFactory({
              group: {
                name: 'Group',
                keys: [],
                columns: [],
                filter: {},
                sort: '',
              },
            })
            break

          case 'Join':
            step = reporter.StepFactory({
              join: {
                name: 'Join',
              },
            })
            break

          default:
            step = reporter.StepFactory({
              load: {
                name: 'Load',
                source: 'composeRecords',
                definition: {},
                filter: {},
                sort: '',
              },
            })
        }

        this.reportDatasources.push({
          step,
          meta: {},
        })
      }

      // Select newly added datasource in configurator
      this.datasources.currentIndex = this.reportDatasources.length - 1

      // Close selector, open configurator
      this.datasources.showSelector = false
      this.datasources.showConfigurator = true
    },

    // Projections
    handleReportSave () {
      this.report.projections = this.projections.items.map(({ moved, x, y, w, h, i, ...p }) => {
        p.elements = p.elements.map((e, index) => {
          e.name = `${index}_${e.kind}`
          return e
        })

        return { ...p, key: `${i}`, xywh: [x, y, w, h] }
      })

      this.handleSave()
        .then(() => {
          this.mapProjections()
        })
    },

    mapProjections () {
      this.projections.items = this.report.projections.map(({ xywh, ...p }, i) => {
        const [x, y, w, h] = xywh
        return { ...p, x, y, w, h, i }
      })
    },

    createProjection () {
      let newProjection = {
        ...new reporter.Projection(),
      }

      const [x, y, w, h] = newProjection.xywh
      newProjection = {
        ...newProjection,
        x,
        y,
        w,
        h,
      }

      this.reindexProjections([...this.projections.items, newProjection])
    },

    updateProjection () {
      if (this.projections.current) {
        const elements = this.projections.current.elements

        this.projections.items.splice(this.projections.currentIndex, 1, { ...this.projections.current, elements: [] })
        setTimeout(() => {
          this.projections.items.splice(this.projections.currentIndex, 1, { ...this.projections.current, elements })
        }, 50)
      }
    },

    editProjection (index = undefined) {
      this.projections.currentIndex = index
      this.projections.current = index !== undefined ? { ...this.projections.items[index] } : undefined
      this.setCurrentDisplayElement(this.projections.current.elements.length ? 0 : undefined)
      this.projections.showConfigurator = true
    },

    deleteProjection (index = undefined) {
      this.reindexProjections(this.projections.items.filter((p, i) => index !== i))
    },

    // Display elements
    openDisplayElementSelector (index) {
      this.projections.currentIndex = index
      this.displayElements.showSelector = true
    },

    setCurrentDisplayElement (index) {
      this.currentDisplayElementIndex = index
      this.currentDisplayElement = index !== undefined ? this.currentDisplayElements[index] : undefined
    },

    deleteCurrentDisplayElement () {
      this.projections.current.elements.splice(this.currentDisplayElementIndex, 1)
      this.currentDisplayElementIndex = this.projections.current.elements.length ? 0 : undefined
      this.setCurrentDisplayElement(this.currentDisplayElementIndex)
    },

    addDisplayElement (kind) {
      const name = `${this.projections.items[this.projections.currentIndex].elements.length}_${kind}`

      const newDisplayElement = reporter.DisplayElementMaker({ name, kind })

      const projectionElements = this.projections.items[this.projections.currentIndex].elements || []
      this.$set(this.projections.items[this.projections.currentIndex], 'elements', [
        ...projectionElements,
        newDisplayElement,
      ])

      this.currentDisplayElement = newDisplayElement

      this.displayElements.showSelector = false

      this.editProjection(this.projections.currentIndex)
      this.setCurrentDisplayElement(this.projections.current.elements.length - 1)
    },
  },
}
</script>

<style lang="scss">
.add-element {
  position: absolute;
  background-color: #1e2224;
  bottom: 0;
  left: 0;
  z-index: 1021;
  opacity: 0.5;
  border-top-right-radius: 10px;

  &:hover {
    opacity: 1;
  }
}
</style>
