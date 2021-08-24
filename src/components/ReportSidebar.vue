<template>
  <div>
    <portal to="sidebar-body-expanded">
      <div
        v-if="reports.length"
        class="h-100"
      >
        <b-input
          v-model.trim="query"
          class="mw-100"
          type="search"
          placeholder="Search reports"
        />

        <c-sidebar-nav-items
          :items="filteredReports"
          :start-expanded="!!query"
          default-route-name="report.view"
          class="overflow-auto h-100"
        />
      </div>

      <h5
        v-else
        class="d-flex justify-content-center mt-5"
      >
        No Reports
      </h5>
    </portal>
  </div>
</template>

<script>
import { components } from '@cortezaproject/corteza-vue'
const { CSidebarNavItems } = components

export default {
  components: {
    CSidebarNavItems,
  },

  data () {
    return {
      query: '',

      reports: [],
    }
  },

  computed: {
    filteredReports () {
      let reports = this.reports
      if (this.query) {
        reports = this.reports.filter(({ reportID, handle, meta: { name = '' } }) => {
          const reportString = `${reportID}${handle}$name}`.toLowerCase().trim()
          return reportString.indexOf(this.query.toLowerCase().trim()) > -1
        })
      }

      return reports.map(({ reportID, handle, meta: { name = '' } }) => {
        return {
          page: { name: 'report.view', title: name || handle },
          params: { reportID },
        }
      })
    },
  },

  mounted () {
    this.$SystemAPI.reportList()
      .then(({ set = [] }) => {
        this.reports = set
      })
      .catch(this.toastErrorHandler(this.$t('notification.report.listFetchFailed')))
  },
}
</script>

<style scoped lang="scss">
// This has to be there, so chevrons are clickable inside the button
.pointer-none {
  pointer-events: none;
}

// Using font-weight-bold moves the sidebar nav content; text-stroke keeps in nicely in place
.nav-active {
  color: $primary;
  -webkit-text-stroke: 0.4px $primary;
}
</style>
