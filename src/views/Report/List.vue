<template>
  <div class="d-flex w-100 py-3">
    <portal to="topbar-title">
      List of Reports
    </portal>

    <b-container fluid="xl">
      <b-row no-gutters>
        <b-col>
          <b-card
            no-body
            class="shadow-sm"
          >
            <b-card-header
              header-bg-variant="white"
              class="py-3"
            >
              <b-row
                class="align-items-center justify-content-between"
                no-gutters
              >
                <b-col>
                  <b-button
                    variant="primary"
                    size="lg"
                    :to="{ name: 'report.create' }"
                  >
                    New Report
                  </b-button>

                  <c-permissions-button
                    resource="corteza::system:report:*"
                    button-label="Permissions"
                    button-variant="light"
                    class="btn-lg ml-1"
                  />
                </b-col>

                <b-col>
                  <b-input-group>
                    <b-input
                      v-model.trim="query"
                      :placeholder="$t('list.searchPlaceholder')"
                    />
                    <b-input-group-append>
                      <b-input-group-text class="text-primary bg-white">
                        <font-awesome-icon
                          :icon="['fas', 'search']"
                        />
                      </b-input-group-text>
                    </b-input-group-append>
                  </b-input-group>
                </b-col>
              </b-row>
            </b-card-header>
            <b-card-body class="p-0">
              <b-table
                :fields="tableFields"
                :items="reports"
                :filter="query"
                :filter-included-fields="['handle', 'name']"
                head-variant="light"
                tbody-tr-class="pointer"
                responsive
                hover
                :class="{ 'mb-0': !!reports.length }"
                @row-clicked="viewReport"
              >
                <template v-slot:cell(name)="{ item: r }">
                  {{ r.meta.name }}
                </template>
                <template v-slot:cell(actions)="{ item: r }">
                  <b-button
                    variant="light"
                    class="mr-2"
                    @click="editReport(r)"
                  >
                    Open Builder
                  </b-button>
                  <b-button
                    variant="link"
                    class="mr-2"
                    :to="{ name: 'report.edit', params: { reportID: r.reportID } }"
                  >
                    Edit report
                  </b-button>
                  <c-permissions-button
                    :title="r.handle"
                    :target="r.handle"
                    :resource="'corteza::system:report:'+r.reportID"
                    class="btn px-2"
                    link
                  />
                </template>
              </b-table>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'ReportList',

  data () {
    return {
      query: '',
      reports: [],
    }
  },

  computed: {
    tableFields () {
      return [
        {
          key: 'name',
          sortable: true,
          tdClass: 'align-middle pl-4 text-nowrap',
          thClass: 'pl-4',
        },
        {
          key: 'handle',
          sortable: true,
          tdClass: 'align-middle',
        },
        {
          key: 'updatedAt',
          sortable: true,
          sortByFormatted: true,
          tdClass: 'align-middle',
          class: 'text-right',
          formatter: (updatedAt, key, item) => {
            return new Date(updatedAt || item.createdAt).toLocaleDateString('en-US')
          },
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ]
    },
  },

  created () {
    this.fetchReports()
  },

  methods: {
    fetchReports () {
      this.$SystemAPI.reportList()
        .then(({ set = [] }) => {
          this.reports = set
        })
        .catch(this.toastErrorHandler(this.$t('notification.report.listFetchFailed')))
    },

    viewReport ({ reportID }) {
      this.$router.push({
        name: 'report.view',
        params: { reportID },
      })
    },

    editReport ({ reportID }) {
      this.$router.push({
        name: 'report.builder',
        params: { reportID },
      })
    },
  },
}
</script>
