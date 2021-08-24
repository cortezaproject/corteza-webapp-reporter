<template>
  <div class="py-3">
    <portal to="topbar-title">
      <div
        class="d-flex w-100"
      >
        {{ pageTitle }}
      </div>
    </portal>

    <portal to="topbar-tools">
      <b-button-group
        v-if="!isNew"
        size="sm"
        class="mr-1"
      >
        <b-button
          variant="primary"
          style="margin-right:2px;"
          :to="reportBuilder"
        >
          <font-awesome-icon
            :icon="['fas', 'cogs']"
          />
          Report Builder
        </b-button>
        <b-button
          variant="primary"
          :to="reportViewer"
        >
          <font-awesome-icon
            :icon="['fas', 'eye']"
          />
        </b-button>
      </b-button-group>
    </portal>

    <b-container v-if="report">
      <b-row no-gutters>
        <b-col>
          <b-card
            no-body
            show
            class="shadow-sm"
          >
            <b-card-header
              v-if="!isNew"
              header-bg-variant="white border-bottom"
              class="py-3"
            >
              <b-row
                no-gutters
                class="align-items-center"
              >
                <div>
                  <b-button
                    variant="primary"
                    size="lg"
                    class="mr-1"
                    :to="{ name: 'report.create' }"
                  >
                    New Report
                  </b-button>

                  <b-button
                    variant="light"
                    size="lg"
                  >
                    Export
                  </b-button>

                  <c-permissions-button
                    :title="report.handle"
                    :target="report.handle"
                    :resource="`corteza::system:report:${report.reportID}`"
                    button-label="Permissions"
                    button-variant="light"
                    class="btn-lg ml-1"
                  />
                </div>
              </b-row>
            </b-card-header>

            <b-container
              fluid
              class="px-4 pt-3"
            >
              <b-row>
                <b-col
                  cols="12"
                  md="6"
                  xl="4"
                >
                  <b-form-group
                    label="Name*"
                    class="text-primary"
                  >
                    <b-form-input
                      v-model="report.meta.name"
                      placeholder="Name"
                      required
                      :state="nameState"
                    />
                  </b-form-group>
                </b-col>
                <b-col
                  cols="12"
                  md="6"
                  xl="4"
                >
                  <b-form-group
                    label="Handle*"
                    class="text-primary"
                  >
                    <b-form-input
                      v-model="report.handle"
                      placeholder="handle (a - z, 0 - 9, underscore, dash)"
                      required
                      :state="handleState"
                    />
                  </b-form-group>
                </b-col>
              </b-row>

              <b-form-group
                label="Description"
                class="text-primary"
              >
                <b-form-textarea
                  v-model="report.meta.description"
                  placeholder="Report description..."
                  rows="5"
                />
              </b-form-group>

              <b-form-group
                label="Tags"
                class="text-primary"
              >
                <b-form-tags
                  v-model="report.meta.tags"
                />
              </b-form-group>
            </b-container>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <portal to="report-toolbar">
      <editor-toolbar
        :back-link="{ name: 'report.list' }"
        :hide-delete="isNew"
        :save-disabled="!canSave"
        @delete="handleDelete"
        @save="handleSave"
      />
    </portal>
  </div>
</template>

<script>
import { system } from '@cortezaproject/corteza-js'
import report from 'corteza-webapp-reporter/src/mixins/report'
import EditorToolbar from 'corteza-webapp-reporter/src/components/EditorToolbar'

export default {
  name: 'EditReport',

  components: {
    EditorToolbar,
  },

  mixins: [
    report,
  ],

  data () {
    return {
      processing: false,

      report: undefined,
    }
  },

  computed: {
    reportID () {
      return this.$route.params.reportID
    },

    isNew () {
      return !this.reportID
    },

    pageTitle () {
      return this.isNew ? 'Create Report' : 'Edit Report'
    },

    reportBuilder () {
      return this.report ? { name: 'report.builder', params: { reportID: this.report.reportID } } : undefined
    },

    reportViewer () {
      return this.report ? { name: 'report.view', params: { reportID: this.report.reportID } } : undefined
    },

    nameState () {
      if (this.report) {
        const { name = '' } = this.report.meta
        return name.length ? true : null
      }

      return null
    },

    handleState () {
      if (!this.report || !this.report.handle.length) {
        return null
      }

      return /^[A-Za-z][0-9A-Za-z_\-.]*[A-Za-z0-9]$/.test(this.report.handle)
    },

    canSave () {
      return this.nameState && this.handleState
    },
  },

  watch: {
    reportID: {
      immediate: true,
      handler (reportID) {
        // Fetch report or make a new one
        if (reportID) {
          this.fetchReport(reportID)
        } else {
          this.report = new system.Report()
        }
      },
    },
  },
}
</script>
