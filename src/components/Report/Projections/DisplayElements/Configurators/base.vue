<script>
export default {
  props: {
    displayElement: {
      type: Object,
      required: true,
    },

    projection: {
      type: Object,
      required: true,
    },

    datasources: {
      type: Array,
      required: true,
    },
  },

  computed: {
    sources () {
      const options = [{ value: '', text: 'None', disabled: true }]

      this.datasources.forEach(({ step }, index) => {
        Object.values(step).forEach(({ name }) => {
          options.push({ value: name || `${index}`, text: name || `${index}` })
        })
      })

      return options
    },

    options () {
      return this.displayElement.options || undefined
    },
  },

  watch: {
    'options.source': {
      immediate: true,
      handler (source) {
        this.columns = []

        const steps = this.datasources.map(({ step }) => step)

        if (source) {
          this.$SystemAPI.reportDescribe({ steps, describe: [this.options.source] })
            .then((frames = []) => {
              const { columns = [] } = frames.find(({ source }) => source === this.options.source) || {}
              this.columns = columns.sort((a, b) => a.label.localeCompare(b.label))
            })
        }
      },
    },
  },
}
</script>
