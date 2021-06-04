import { system, reporter } from '@cortezaproject/corteza-js'

export const resultDryRun = '{"rows":[[{"matrix":{"rows":[[{"variable":"marketing"},{"variable":"100"}],[{"variable":"marketing"},{"variable":"50"}],[{"variable":"engineering"},{"variable":"75"}],[{"variable":"testko"},{"variable":"210"}],[{"variable":"marketing"},{"variable":"300"}]],"columns":[{"name":"type","label":"type","kind":"Select"},{"name":"cost","label":"cost","kind":"Number"}],"paging":{},"sorting":{"sort":"id"}}},{"matrix":{"rows":[[{"variable":"engineering"},{"variable":"75"}],[{"variable":"marketing"},{"variable":"450"}],[{"variable":"testko"},{"variable":"210"}]],"columns":[{"name":"type","label":"type","kind":"String"},{"name":"cost","label":"cost","kind":"Number"}],"paging":null,"sorting":null}},{"matrix":{"rows":[[{"variable":"Tomaz Ena"},{"variable":"Testko"}],[{"variable":"Tomaz Dva"},{"variable":"Testkoster"}]],"columns":[{"name":"first_name","label":"First Name","kind":"String"},{"name":"last_name","label":"Last Name","kind":"String"}],"paging":{},"sorting":{"sort":"id"}}},{"matrix":{"rows":[[{"variable":"J1 T1"},{"variable":"marketing"},{"variable":"100"}],[{"variable":"J2 T1"},{"variable":"marketing"},{"variable":"50"}],[{"variable":"J3 T1"},{"variable":"engineering"},{"variable":"75"}],[{"variable":"J1 T2"},{"variable":"testko"},{"variable":"210"}],[{"variable":"J2 T2"},{"variable":"marketing"},{"variable":"300"}]],"columns":[{"name":"name","label":"Name","kind":"String"},{"name":"type","label":"type","kind":"Select"},{"name":"cost","label":"cost","kind":"Number"}],"paging":{},"sorting":{"sort":"id"}}},{"matrix":{"rows":[[{"variable":"226898333191521392"},{"matrix":{"rows":[[{"variable":"226898333191521392"},{"variable":"engineering"},{"variable":"1"},{"variable":"7500"}],[{"variable":"226898333191521392"},{"variable":"marketing"},{"variable":"2"},{"variable":"15000"}]],"columns":null,"paging":null,"sorting":null},"variable":"226898333191521392"},{"variable":"Tomaz Ena"},{"variable":"Testko"}],[{"variable":"226898374446695536"},{"matrix":{"rows":[[{"variable":"226898374446695536"},{"variable":"marketing"},{"variable":"1"},{"variable":"30000"}],[{"variable":"226898374446695536"},{"variable":"testko"},{"variable":"1"},{"variable":"21000"}]],"columns":null,"paging":null,"sorting":null},"variable":"226898374446695536"},{"variable":"Tomaz Dva"},{"variable":"Testkoster"}]],"columns":[{"name":"id","label":"ID","kind":"Record"},{"dimension":"group(transform(users x jobs[jobs]))","name":"owner_user","label":"owner_user","kind":"Number"},{"dimension":"group(transform(users x jobs[jobs]))","name":"type","label":"type","kind":"String"},{"dimension":"group(transform(users x jobs[jobs]))","name":"count","label":"count","kind":"Number"},{"dimension":"group(transform(users x jobs[jobs]))","name":"cost","label":"cost","kind":"Number"},{"name":"first_name","label":"First Name","kind":"String"},{"name":"last_name","label":"Last Name","kind":"String"}],"paging":{},"sorting":{"sort":"id"}}}]],"columns":[{"name":"job chart[job type totals]","label":"","kind":""},{"name":"job chart[Jobs]","label":"","kind":""},{"name":"users x jobs[Users]","label":"","kind":""},{"name":"users x jobs[Jobs]","label":"","kind":""},{"name":"users x jobs[Combo]","label":"","kind":""}],"paging":null,"sorting":null}'
export const reportList = [
  new system.Report({
    reportID: '456789213124123',
    handle: 'test_report',
    createdAt: '2021-04-12T13:30:04Z',
    meta: {
      name: 'Test Report',
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum${'.'}`,
    },

    projections: [
      new reporter.Projection({
        name: 'Job Chart',
        key: 'job chart',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s.',
        xywh: [0, 0, 12, 6],

        elements: [
          reporter.ElementFactory.Make({
            name: 'job type totals',
            kind: 'Chart',
            options: {
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
            },
          }),
        ],
      }),
    ],
  }),
]
