<template>
  <div
    class="d-flex overflow-auto px-2 w-100"
  >
    <portal to="topbar-title">
      {{ pageTitle }}
    </portal>

    <portal to="topbar-tools">
      <b-button-group
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
      :blocks.sync="report.projections"
    >
      <template
        slot-scope="{ block, index }"
      >
        <projection
          :index="index"
          :projection="block"
          :datasources="reportDatasources"
        />
      </template>
    </grid>
  </div>
</template>

<script>
import Grid from 'corteza-webapp-reporter/src/components/Report/Grid'
import Projection from 'corteza-webapp-reporter/src/components/Report/Projections'
import { system } from '@cortezaproject/corteza-js'

export default {
  name: 'ReportView',

  components: {
    Grid,
    Projection,
  },

  data () {
    return {
      processing: false,

      report: undefined,
      dataframes: [],
    }
  },

  computed: {
    reportID () {
      return this.$route.params.reportID
    },

    pageTitle () {
      const title = this.report ? (this.report.meta.name || this.report.handle) : ''
      return title || 'Report View'
    },

    reportBuilder () {
      return this.report ? { name: 'report.builder', params: { reportID: this.report.reportID } } : undefined
    },

    reportEditor () {
      return this.report ? { name: 'report.edit', params: { reportID: this.report.reportID } } : undefined
    },

    reportDatasources () {
      return this.report ? this.report.sources : []
    },
  },

  watch: {
    reportID: {
      immediate: true,
      handler (reportID) {
        if (reportID) {
          this.fetchReport(reportID)
        }
      },
    },
  },

  methods: {
    async fetchReport (reportID) {
      this.processing = true

      return this.$SystemAPI.reportRead({ reportID })
        .then(report => {
          this.report = new system.Report(report)

          this.report.projections = this.report.projections.map(({ xywh, ...p }, i) => {
            const [x, y, w, h] = xywh
            return { ...p, x, y, w, h, i }
          })
        })
        .catch(this.toastErrorHandler(this.$t('notification:report.fetchFailed')))
        .finally(() => {
          this.processing = false
        })
    },
  },
}
</script>
