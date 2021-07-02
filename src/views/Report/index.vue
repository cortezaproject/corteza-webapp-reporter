<template>
  <div
    class="d-flex flex-column w-100"
  >
    <router-view
      class="flex-grow-1 overflow-auto"
    />

    <portal-target
      name="report-toolbar"
    />

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

        <b-button
          v-for="report of filteredReports"
          :key="report.reportID"
          variant="link"
          class="w-100 text-left text-dark text-decoration-none pt-2 pr-0 pb-0 nav-item"
          active-class="nav-active"
          exact-active-class="nav-active"
          :to="{ name: 'report.view', params: { reportID: report.reportID }}"
        >
          {{ report.meta.name || report.handle }}
        </b-button>
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
export default {
  data () {
    return {
      query: '',

      reports: [],
    }
  },

  computed: {
    filteredReports () {
      if (this.query) {
        return this.reports.filter(({ rpeortID, handle, meta: { name = '' } }) => {
          const reportString = `${rpeortID}${handle}$name}`.toLowerCase().trim()
          return reportString.indexOf(this.query.toLowerCase().trim()) > -1
        })
      }

      return this.reports
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
