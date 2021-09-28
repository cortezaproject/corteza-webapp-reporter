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
      :blocks.sync="blocks.items"
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
              @click="editBlock(index)"
            >
              <font-awesome-icon
                :icon="['far', 'edit']"
                class="h5 mb-0"
              />
            </b-button>

            <c-input-confirm
              size="md"
              variant="link text-danger"
              @confirmed="deleteBlock(index)"
            />
          </div>

          <block
            v-if="block"
            :index="index"
            :block="block"
            :datasources="reportDatasources"
            :report-i-d="reportID"
          />
        </div>
      </template>
    </grid>

    <b-modal
      v-model="blocks.showConfigurator"
      title="Block configuraton"
      ok-title="Save Block"
      ok-variant="primary"
      cancel-variant="link"
      scrollable
      size="xl"
      body-class="p-0 border-top-0"
      header-class="pb-0 px-3 pt-3 border-bottom-0"
      @ok="updateBlock()"
    >
      <b-tabs
        v-if="blocks.current"
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
              v-model="blocks.current.title"
              type="text"
              placeholder="Block title"
            />
          </b-form-group>

          <b-form-group
            label="Description"
            label-class="text-primary"
          >
            <b-form-textarea
              v-model="blocks.current.description"
              placeholder="Block description"
            />
          </b-form-group>

          <b-form-group
            label="Layout"
            label-class="text-primary"
          >
            <b-form-radio-group
              v-model="blocks.current.layout"
              :options="blockLayoutOptions"
              buttons
              button-variant="outline-primary"
            />
          </b-form-group>
        </b-tab>

        <b-tab
          :active="!!blocks.current.elements.length"
          title="Elements"
        >
          <configurator
            :items="currentDisplayElements"
            :current-index="currentDisplayElementIndex"
            draggable
            @select="setCurrentDisplayElement"
            @add="openDisplayElementSelector(blocks.currentIndex)"
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
                :block="blocks.current"
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
        :processing="processing"
        @delete="handleDelete"
        @save="handleReportSave"
      >
        <b-button
          variant="light"
          size="lg"
          @click="createBlock"
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
import Block from 'corteza-webapp-reporter/src/components/Report/Blocks'
import datasources from 'corteza-webapp-reporter/src/components/Report/Datasources/loader'
import Configurator from 'corteza-webapp-reporter/src/components/Common/Configurator'
import Selector from 'corteza-webapp-reporter/src/components/Common/Selector'
import EditorToolbar from 'corteza-webapp-reporter/src/components/EditorToolbar'
import DisplayElementConfigurator from 'corteza-webapp-reporter/src/components/Report/Blocks/DisplayElements/Configurators'
import * as displayElementThumbnails from 'corteza-webapp-reporter/src/assets/DisplayElements'

export default {
  name: 'ReportBuilder',

  components: {
    Grid,
    Selector,
    Configurator,
    Block,
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

      blocks: {
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
            value: 'Loads data from a specified resource, such as Compose records',
          },
          {
            label: 'Join',
            kind: 'Join',
            value: 'Joins two Load datasources with a unique column that links them together, such as a Compose record selector',
          },
          {
            label: 'Group',
            kind: 'Group',
            value: 'Groups data from a load datasource based on a column value and aggregates it, such as counting the number of Accounts with the same status',
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
      return this.blocks.current ? this.blocks.current.elements : []
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

    blockLayoutOptions () {
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
              this.mapBlocks()
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

    // If block is added/reordered or deleted, vue-grid-layout needs fresh indexes to work properly
    reindexBlocks (blocks = this.blocks.items || []) {
      this.blocks.items = blocks.map((block, i) => {
        return { ...block, i }
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

    // Blocks
    handleReportSave () {
      this.report.blocks = this.blocks.items.map(({ moved, x, y, w, h, i, ...p }) => {
        p.elements = p.elements.map((e, index) => {
          e.name = `${index}_${e.kind}`
          return e
        })

        return { ...p, key: `${i}`, xywh: [x, y, w, h] }
      })

      this.handleSave()
        .then(() => {
          this.mapBlocks()
          this.refreshReport()
        })
    },

    mapBlocks () {
      this.blocks.items = this.report.blocks.map(({ xywh, ...p }, i) => {
        const [x, y, w, h] = xywh
        return { ...p, x, y, w, h, i }
      })
    },

    createBlock () {
      let newBlock = {
        ...new reporter.Block(),
      }

      const [x, y, w, h] = newBlock.xywh
      newBlock = {
        ...newBlock,
        x,
        y,
        w,
        h,
      }

      this.reindexBlocks([...this.blocks.items, newBlock])
    },

    updateBlock () {
      if (this.blocks.current) {
        const elements = this.blocks.current.elements

        this.blocks.items.splice(this.blocks.currentIndex, 1, { ...this.blocks.current, elements: [] })
        setTimeout(() => {
          this.blocks.items.splice(this.blocks.currentIndex, 1, { ...this.blocks.current, elements })
        }, 50)
      }
    },

    editBlock (index = undefined) {
      this.blocks.currentIndex = index
      this.blocks.current = index !== undefined ? { ...this.blocks.items[index] } : undefined
      this.setCurrentDisplayElement(this.blocks.current.elements.length ? 0 : undefined)
      this.blocks.showConfigurator = true
    },

    deleteBlock (index = undefined) {
      this.reindexBlocks(this.blocks.items.filter((p, i) => index !== i))
    },

    // Display elements
    openDisplayElementSelector (index) {
      this.blocks.currentIndex = index
      this.displayElements.showSelector = true
    },

    setCurrentDisplayElement (index) {
      this.currentDisplayElementIndex = index
      this.currentDisplayElement = index !== undefined ? this.currentDisplayElements[index] : undefined
    },

    deleteCurrentDisplayElement () {
      this.blocks.current.elements.splice(this.currentDisplayElementIndex, 1)
      this.currentDisplayElementIndex = this.blocks.current.elements.length ? 0 : undefined
      this.setCurrentDisplayElement(this.currentDisplayElementIndex)
    },

    addDisplayElement (kind) {
      const name = `${this.blocks.items[this.blocks.currentIndex].elements.length}_${kind}`

      const newDisplayElement = reporter.DisplayElementMaker({ name, kind })

      const blockElements = this.blocks.items[this.blocks.currentIndex].elements || []
      this.$set(this.blocks.items[this.blocks.currentIndex], 'elements', [
        ...blockElements,
        newDisplayElement,
      ])

      this.currentDisplayElement = newDisplayElement

      this.displayElements.showSelector = false

      this.editBlock(this.blocks.currentIndex)
      this.setCurrentDisplayElement(this.blocks.current.elements.length - 1)
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
