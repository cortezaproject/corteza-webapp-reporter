<template>
  <div class="h-100 py-3 flex-grow-1 overflow-auto">
    <c-report
      v-if="openReport"
      class="mx-2"
      :report="openReport"
      :dataset="reportDataset"
      :editing="editing"
    />

    <!-- meta stuff -->
    <portal to="topbar-title">
      <template v-if="!editing">
        {{ pageTitle }}
      </template>
      <template v-else-if="openReportID">
        {{ $t('edit.title') }}
      </template>
      <template v-else>
        {{ $t('create.title') }}
      </template>
    </portal>

    <portal to="sidebar-body-expanded">
      <ul v-if="reports">
        <li
          v-for="r in reports"
          :key="r.reportID"
        >
          <router-link :to="{ name: 'reports.view', params: { reportID: r.reportID } }">
            {{ (r.meta || {}).name || r.handle }}
          </router-link>
        </li>
      </ul>
    </portal>

    <portal to="sidebar-footer-expanded">
      <router-link
        :to="{ name: 'reports.create' }"
        class="float-right"
      >
        + Add report
      </router-link>
    </portal>

    <portal to="sidebar-footer-collapsed">
      <router-link
        :to="{ name: 'reports.create' }"
        class="mx-auto"
      >
        +
      </router-link>
    </portal>
  </div>
</template>

<script>
import { system, reporter } from '@cortezaproject/corteza-js'
import { components } from '@cortezaproject/corteza-vue'
import * as mocs from './mocks'

export default {
  name: 'ReportList',

  i18nOptions: {
    namespaces: ['reporter.reports'],
  },

  components: {
    'c-report': components.CReport,
  },

  data () {
    return {
      reports: undefined,
      reportDataset: undefined,

      // have this not commented if you are working on the editing display
      openReportID: '456789213124123',
      editing: false,
      editingReport: undefined,

      // // have this not commented if you are working on the view display
      // openReportID: undefined,
      // editing: true,
      // editingReport: new system.Report({
      //   meta: {
      //     name: 'Report name',
      //     description: 'Report description',
      //   },
      //   handle: 'test_report',
      //   sources: [{
      //     name: 'Job x user source',
      //     groups: [
      //       {
      //         name: 'Loading stuff',
      //         steps: [{
      //           load: {
      //             name: 'users',
      //             source: 'composeRecords',
      //             definition: {
      //               moduleID: '226897628934194288',
      //               namespaceID: '226507277224395888',
      //             },
      //           },
      //         }, {
      //           load: {
      //             name: 'jobs',
      //             source: 'composeRecords',
      //             definition: {
      //               moduleID: '226897780029801584',
      //               namespaceID: '226507277224395888',
      //             },
      //           },
      //         }],
      //       }, {
      //         name: 'Aggregating stuff',
      //         steps: [],
      //       }, {
      //         name: 'Joining stuff',
      //         steps: [{
      //           join: {
      //             name: 'user_job',
      //             local: 'users.id',
      //             foreign: 'jobs.owner_user',
      //           },
      //         }],
      //       },
      //     ],
      //   }],

      //   projections: [
      //     new reporter.Projection({
      //       name: 'Job Chart',
      //       key: 'job chart',
      //       description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',

      //       elements: [[
      //         reporter.ElementFactory.Make({
      //           name: 'job type totals',
      //           kind: 'chart',
      //           options: [{
      //             name: 'jobs',
      //             chartType: 'pie',
      //             source: {
      //               name: 'composeRecords',
      //               definition: {
      //                 moduleID: '226897780029801584',
      //                 namespaceID: '226507277224395888',
      //               },
      //             },

      //             labelColumn: 'type',
      //             dataColumns: [{ name: 'cost' }],
      //           }],
      //         }), reporter.ElementFactory.Make({
      //           name: 'Jobs',
      //           kind: 'table',
      //           options: [{
      //             name: 'jobs',
      //             source: {
      //               name: 'composeRecords',
      //               definition: {
      //                 moduleID: '226897780029801584',
      //                 namespaceID: '226507277224395888',
      //               },
      //             },
      //             group: {
      //               groups: [{
      //                 column: 'type',
      //                 name: 'type',
      //                 expr: 'type',
      //               }],
      //               columns: [
      //                 { cost: { sum: 'cost' } },
      //               ],
      //             },
      //             columns: [{ name: 'type' }, { name: 'cost' }],
      //           }],
      //         })],
      //       ],
      //     }),

      //     new reporter.Projection({
      //       name: 'Users x Jobs',
      //       key: 'users x jobs',
      //       description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',

      //       elements: [[
      //         reporter.ElementFactory.Make({
      //           name: 'Users',
      //           kind: 'table',
      //           options: [{
      //             name: 'users',
      //             source: {
      //               name: 'composeRecords',
      //               definition: {
      //                 moduleID: '226897628934194288',
      //                 namespaceID: '226507277224395888',
      //               },
      //             },
      //             columns: [{ name: 'first_name' }, { name: 'last_name' }],
      //           }],
      //         }), reporter.ElementFactory.Make({
      //           name: 'Jobs',
      //           kind: 'table',
      //           options: [{
      //             name: 'jobs',
      //             source: {
      //               name: 'composeRecords',
      //               definition: {
      //                 moduleID: '226897780029801584',
      //                 namespaceID: '226507277224395888',
      //               },
      //             },
      //             columns: [{ name: 'name' }, { name: 'type' }, { name: 'cost' }],
      //           }],
      //         })], [
      //         reporter.ElementFactory.Make({
      //           name: 'Combo',
      //           kind: 'table',
      //           variant: 'stacked',
      //           options: [{
      //             name: 'users',
      //             source: {
      //               name: 'composeRecords',
      //               definition: {
      //                 moduleID: '226897628934194288',
      //                 namespaceID: '226507277224395888',
      //               },
      //             },
      //             columns: [{ name: 'first_name' }, { name: 'last_name' }],

      //             relationships: [{
      //               column: 'id',
      //               refTable: 'jobs',
      //               refColumn: 'owner_user',
      //             }],
      //           },
      //           {
      //             name: 'jobs',
      //             source: {
      //               name: 'composeRecords',
      //               definition: {
      //                 moduleID: '226897780029801584',
      //                 namespaceID: '226507277224395888',
      //               },
      //             },
      //             transform: {
      //               columns: [{
      //                 name: 'owner_user',
      //                 expr: 'owner_user',
      //               }, {
      //                 name: 'name',
      //                 expr: 'name',
      //               }, {
      //                 name: 'type',
      //                 expr: 'type',
      //               }, {
      //                 name: 'cost',
      //                 expr: 'cost*100',
      //               }],
      //             },
      //             group: {
      //               groups: [{
      //                 column: 'owner_user',
      //                 name: 'owner_user',
      //                 expr: 'owner_user',
      //               }, {
      //                 column: 'type',
      //                 name: 'type',
      //                 expr: 'type',
      //               }],
      //               columns: [
      //                 { count: { count: '*' } },
      //                 { cost: { sum: 'cost' } },
      //               ],
      //             },
      //             columns: [{ name: 'type' }, { name: 'count' }, { name: 'cost' }],
      //           }],
      //         })],
      //       ],
      //     }),
      //   ],
      // }),
    }
  },

  computed: {
    openReport () {
      if (this.editing && this.editingReport) {
        return this.editingReport
      }

      if (!this.openReportID) {
        return undefined
      }
      return this.reports?.find(r => r.reportID === this.openReportID)
    },

    pageTitle () {
      if (!this.openReport) {
        return this.$t('list.title')
      }

      if (!this.openReport.meta?.name) {
        return this.$t('list.untitledTitle')
      }

      return this.openReport.meta.name
    },
  },

  watch: {
    '$route.params.reportID': {
      handler (reportID) {
        if (reportID && reportID !== '0') {
          this.openReportID = reportID
          return
        }
        this.openReportID = undefined
      },
      immediate: true,
    },

    '$route.name': {
      handler (route) {
        if (route === 'reports.create') {
          this.prepareReport()
        }
      },
      immediate: true,
    },

    openReport: {
      handler (r) {
        if (!this.editing && r) {
          this.runReport(r)
        }
      },
      deep: true,
      immediate: true,
    },
  },

  async created () {
    // try {
    //   const { set, filter } = await this.$SystemAPI.reportList()
    // } catch (err) {
    //   console.error(err)
    // }

    // Mock reports
    this.reports = [
      new system.Report({
        reportID: '456789213124123',
        handle: 'test_report',
        meta: {
          name: 'Test Report',
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum${'.'}`,
        },

        projections: [
          new reporter.Projection({
            name: 'Job Chart',
            key: 'job chart',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',

            elements: [[
              reporter.ElementFactory.Make({
                name: 'job type totals',
                kind: 'chart',
                options: [{
                  name: 'jobs',
                  chartType: 'pie',
                  source: {
                    name: 'composeRecords',
                    definition: {
                      moduleID: '226897780029801584',
                      namespaceID: '226507277224395888',
                    },
                  },

                  labelColumn: 'type',
                  dataColumns: [{ name: 'cost' }],
                }],
              }), reporter.ElementFactory.Make({
                name: 'Jobs',
                kind: 'table',
                options: [{
                  name: 'jobs',
                  source: {
                    name: 'composeRecords',
                    definition: {
                      moduleID: '226897780029801584',
                      namespaceID: '226507277224395888',
                    },
                  },
                  group: {
                    groups: [{
                      column: 'type',
                      name: 'type',
                      expr: 'type',
                    }],
                    columns: [
                      { cost: { sum: 'cost' } },
                    ],
                  },
                  columns: [{ name: 'type' }, { name: 'cost' }],
                }],
              })],
            ],
          }),

          new reporter.Projection({
            name: 'Users x Jobs',
            key: 'users x jobs',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',

            elements: [[
              reporter.ElementFactory.Make({
                name: 'Users',
                kind: 'table',
                options: [{
                  name: 'users',
                  source: {
                    name: 'composeRecords',
                    definition: {
                      moduleID: '226897628934194288',
                      namespaceID: '226507277224395888',
                    },
                  },
                  columns: [{ name: 'first_name' }, { name: 'last_name' }],
                }],
              }), reporter.ElementFactory.Make({
                name: 'Jobs',
                kind: 'table',
                options: [{
                  name: 'jobs',
                  source: {
                    name: 'composeRecords',
                    definition: {
                      moduleID: '226897780029801584',
                      namespaceID: '226507277224395888',
                    },
                  },
                  columns: [{ name: 'name' }, { name: 'type' }, { name: 'cost' }],
                }],
              })], [
              reporter.ElementFactory.Make({
                name: 'Combo',
                kind: 'table',
                variant: 'stacked',
                options: [{
                  name: 'users',
                  source: {
                    name: 'composeRecords',
                    definition: {
                      moduleID: '226897628934194288',
                      namespaceID: '226507277224395888',
                    },
                  },
                  columns: [{ name: 'first_name' }, { name: 'last_name' }],

                  relationships: [{
                    column: 'id',
                    refTable: 'jobs',
                    refColumn: 'owner_user',
                  }],
                },
                {
                  name: 'jobs',
                  source: {
                    name: 'composeRecords',
                    definition: {
                      moduleID: '226897780029801584',
                      namespaceID: '226507277224395888',
                    },
                  },
                  transform: {
                    columns: [{
                      name: 'owner_user',
                      expr: 'owner_user',
                    }, {
                      name: 'name',
                      expr: 'name',
                    }, {
                      name: 'type',
                      expr: 'type',
                    }, {
                      name: 'cost',
                      expr: 'cost*100',
                    }],
                  },
                  group: {
                    groups: [{
                      column: 'owner_user',
                      name: 'owner_user',
                      expr: 'owner_user',
                    }, {
                      column: 'type',
                      name: 'type',
                      expr: 'type',
                    }],
                    columns: [
                      { count: { count: '*' } },
                      { cost: { sum: 'cost' } },
                    ],
                  },
                  columns: [{ name: 'type' }, { name: 'count' }, { name: 'cost' }],
                }],
              })],
            ],
          }),
        ],
      }),
    ]
  },

  methods: {
    prepareReport () {
      if (!this.reports) {
        this.reports = []
      }

      const r = new system.Report({})
      this.reports.push(r)
      this.reportDataset = undefined
      this.openReportID = undefined
      this.editing = true
      this.editingReport = r
    },

    async runReport (r) {
      // const dd = r.reportDefinitions()
      // this.reportDataset = await this.$SystemAPI.reportRunFresh({
      //   sources: r.sources,
      //   steps: dd.model,
      //   datasets: dd.dataset,
      // })
      this.reportDataset = JSON.parse(mocs.resultDryRun)
    },
  },
}
</script>
