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
  },

  computed: {
    sources () {
      return [
        { value: '', text: 'None' },
        ...this.projection.sources
          .filter(({ load }) => load)
          .map(({ load }, index) => ({ value: load.name || `${index}`, text: load.name || `${index}` })),
      ]
    },

    options () {
      return this.displayElement.options || undefined
    },
  },
}
</script>
