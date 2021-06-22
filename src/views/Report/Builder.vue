<template>
  <div
    class="d-flex overflow-auto px-2 w-100"
  >
    <portal to="topbar-title">
      Report Builder
    </portal>

    <portal to="topbar-tools">
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
      v-if="report"
      :blocks.sync="projections"
      editable
    >
      <template
        slot-scope="{ block, index }"
      >
        <div
          class="h-100 editable-block"
        >
          <div
            class="add-element d-flex bg-white align-items-center justify-items-between mr-3 mt-3"
          >
            <b-button
              variant="link"
              class="text-decoration-none"
              @click="openDisplayElementSelector(index)"
            >
              <font-awesome-icon
                :icon="['fas', 'plus']"
                class="h4 mb-0"
              />
            </b-button>
            <b-button
              variant="link"
              class="text-decoration-none"
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
            :projection="block"
            :index="index"
          />
        </div>
      </template>
    </grid>

    <b-modal
      v-model="displayElementSelector.show"
      size="lg"
      scrollable
      hide-footer
      title="Add display element"
      body-class="px-0 py-3"
    >
      <selector
        @select="addDisplayElement"
      />
    </b-modal>

    <b-modal
      v-model="projectionConfigurator.show"
      title="Projection configurator"
      ok-title="Save Projection"
      ok-variant="primary"
      cancel-variant="link"
      scrollable
      size="xl"
      body-class="p-0 border-top-0"
      header-class="pb-0 px-3 pt-3 border-bottom-0"
      @ok="updateProjection()"
      @hide="editor=null"
    >
      <b-tabs
        v-if="currentProjection"
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
              v-model="currentProjection.title"
              type="text"
              placeholder="Projection title"
            />
          </b-form-group>

          <b-form-group
            label="Description"
            label-class="text-primary"
          >
            <b-form-textarea
              v-model="currentProjection.description"
              placeholder="Projection description"
            />
          </b-form-group>

          <b-form-group
            label="Layout"
            label-class="text-primary"
          >
            <b-form-radio-group
              v-model="currentProjection.layout"
              :options="projectionLayoutOptions"
              buttons
              button-variant="outline-primary"
            />
          </b-form-group>
        </b-tab>

        <b-tab
          :active="!!currentProjection.elements.length"
          title="Display elements"
        >
          <b-container
            fluid
            class="p-0"
          >
            <b-row>
              <b-col
                cols="2"
              >
                <b-list-group>
                  <draggable
                    :list.sync="currentDisplayElements"
                    group="display-elements"
                  >
                    <b-list-group-item
                      v-for="(element, index) in currentDisplayElements"
                      :key="index"
                      button
                      :active="currentDisplayElementIndex ? currentDisplayElementIndex === index : index === 0"
                      :class="{ 'rounded-top': index === 0 }"
                      @click="setCurrentDisplayElement(index)"
                    >
                      {{ element.kind || element.name }}
                    </b-list-group-item>
                  </draggable>

                  <b-list-group-item
                    button
                    class="text-primary rounded-top"
                    :class="{ 'border-top-0': currentDisplayElements.length }"
                    @click="openDisplayElementSelector(currentProjectionIndex)"
                  >
                    + Add
                  </b-list-group-item>
                </b-list-group>
              </b-col>
              <b-col
                v-if="currentDisplayElementIndex !== undefined"
                cols="10"
                class="p-0"
              >
                <configurator
                  v-if="currentDisplayElement"
                  :display-element="currentDisplayElement"
                  :projection="currentProjection"
                  class="pr-2"
                />

                <c-input-confirm
                  variant="danger"
                  size="lg"
                  size-confirm="lg"
                  :borderless="false"
                  class="sticky-bot"
                  @confirmed="deleteCurrentDisplayElement"
                >
                  {{ $t('general.label.delete') }}
                </c-input-confirm>
              </b-col>
            </b-row>
          </b-container>
        </b-tab>

        <b-tab
          title="Data sources"
        >
          <b-container
            fluid
            class="p-0"
          >
            <b-row>
              <b-col
                cols="2"
              >
                <b-list-group>
                  <b-list-group-item
                    v-for="(element, index) in currentProjection.sources"
                    :key="index"
                    button
                    :active="currentDataSourceIndex ? currentDataSourceIndex === index : index === 0"
                    class="d-flex justify-content-between"
                    @click="currentDataSourceIndex = index"
                  >
                    <span
                      class="d-inline-block text-truncate"
                    >
                      {{ element.load.name || index }}
                    </span>
                  </b-list-group-item>
                  <b-list-group-item
                    key="-1"
                    button
                    class="text-primary"
                    @click="addDatasource(currentProjectionIndex)"
                  >
                    + Add
                  </b-list-group-item>
                </b-list-group>
              </b-col>
              <b-col
                v-if="currentDataSourceIndex !== undefined"
                cols="10"
              >
                <datasource
                  :sources.sync="currentProjection.sources"
                  :current-source-index="currentDataSourceIndex"
                />

                <c-input-confirm
                  variant="danger"
                  size="lg"
                  size-confirm="lg"
                  :borderless="false"
                  class="sticky-bot"
                  @confirmed="deleteCurrentDataSource"
                >
                  {{ $t('general.label.delete') }}
                </c-input-confirm>
              </b-col>
            </b-row>
          </b-container>
        </b-tab>
      </b-tabs>
    </b-modal>

    <portal to="report-toolbar">
      <editor-toolbar
        :back-link="{ name: 'report.list' }"
        @delete="handleDelete"
        @save="handleProjectionSave"
      >
        <b-button
          variant="light"
          size="lg"
          @click="createProjection"
        >
          New Projection
        </b-button>
      </editor-toolbar>
    </portal>
  </div>
</template>

<script>
import { reporter } from '@cortezaproject/corteza-js'
import report from 'corteza-webapp-reporter/src/mixins/report'
import Draggable from 'vuedraggable'
import Grid from 'corteza-webapp-reporter/src/components/Report/Grid'
import Projection from 'corteza-webapp-reporter/src/components/Report/Projections'
import Datasource from 'corteza-webapp-reporter/src/components/Report/Projections/Datasources'
import Selector from 'corteza-webapp-reporter/src/components/Report/Projections/DisplayElements/Selector'
import EditorToolbar from 'corteza-webapp-reporter/src/components/EditorToolbar'
import Configurator from 'corteza-webapp-reporter/src/components/Report/Projections/DisplayElements/Configurators'

export default {
  name: 'ReportBuilder',

  components: {
    Grid,
    Draggable,
    Selector,
    Projection,
    Configurator,
    EditorToolbar,
    Datasource,
  },

  mixins: [
    report,
  ],

  data () {
    return {
      processing: false,

      report: undefined,

      currentProjectionIndex: undefined,
      currentProjection: undefined,

      currentDisplayElementIndex: undefined,
      currentDisplayElement: undefined,

      currentDataSourceIndex: undefined,

      displayElementSelector: {
        show: false,
      },

      projectionConfigurator: {
        show: false,
      },

      projections: [],
    }
  },

  computed: {
    reportID () {
      return this.$route.params.reportID
    },

    currentDisplayElements () {
      return this.currentProjection ? this.currentProjection.elements : []
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
          this.refresh()
        }
      },
    },
  },

  methods: {
    refresh () {
      this.fetchReport(this.reportID)
        .then(() => {
          this.mapProjections()
        })
    },

    handleProjectionSave () {
      this.report.projections = this.projections.map(({ moved, x, y, w, h, i, ...p }) => {
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
      this.projections = this.report.projections.map(({ xywh, ...p }, i) => {
        const [x, y, w, h] = xywh
        return { ...p, x, y, w, h, i }
      })
    },

    // If projection is added/reordered or deleted, vue-grid-layout needs fresh indexes to work properly
    reindexProjections (projections = this.projections) {
      this.projections = projections.map((projection, i) => {
        return { ...projection, i }
      })
    },

    setCurrentDisplayElement (index) {
      this.currentDisplayElementIndex = index
      this.currentDisplayElement = index !== undefined ? this.currentDisplayElements[index] : undefined
    },

    openDisplayElementSelector (index) {
      this.currentProjectionIndex = index
      this.displayElementSelector.show = true
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

      this.reindexProjections([newProjection, ...this.projections])
    },

    updateProjection () {
      this.projections.splice(this.currentProjectionIndex, 1, this.currentProjection)
    },

    editProjection (index = undefined) {
      this.currentProjectionIndex = index
      this.currentProjection = index !== undefined ? { ...this.projections[index] } : undefined
      this.currentDataSourceIndex = this.currentProjection.sources.length ? 0 : undefined
      this.setCurrentDisplayElement(this.currentProjection.elements.length ? 0 : undefined)
      this.projectionConfigurator.show = true
    },

    deleteProjection (index = undefined) {
      this.reindexProjections(this.projections.filter((p, i) => index !== i))
    },

    deleteCurrentDisplayElement () {
      this.currentProjection.elements.splice(this.currentDisplayElementIndex, 1)
      this.currentDisplayElementIndex = this.currentProjection.elements.length ? 0 : undefined
      this.setCurrentDisplayElement(this.currentDisplayElementIndex)
    },

    deleteCurrentDataSource () {
      this.currentProjection.sources.splice(this.currentDataSourceIndex, 1)
      this.currentDataSourceIndex = this.currentProjection.sources.length ? 0 : undefined
    },

    addDisplayElement (kind) {
      const name = `${this.projections[this.currentProjectionIndex].elements.length}_${kind}`

      const newDisplayElement = reporter.ElementFactory.Make({ name, kind })

      const projectionElements = this.projections[this.currentProjectionIndex].elements || []
      this.$set(this.projections[this.currentProjectionIndex], 'elements', [
        ...projectionElements,
        newDisplayElement,
      ])

      this.currentDisplayElement = newDisplayElement

      this.displayElementSelector.show = false

      this.editProjection(this.currentProjectionIndex)
      this.setCurrentDisplayElement(this.currentProjection.elements.length - 1)
    },

    addDatasource () {
      this.currentProjection.sources.push(reporter.StepFactory({
        load: {
          source: 'composeRecords',
          definition: {},
        },
      }))

      this.currentDataSourceIndex = this.currentProjection.sources.length - 1
    },
  },
}
</script>

<style lang="scss">
.add-element {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1021;
  opacity: 0.7;
  border-top-right-radius: 10px;

  &:hover {
    opacity: 1;
  }
}
</style>
