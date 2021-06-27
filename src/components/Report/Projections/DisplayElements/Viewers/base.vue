<script>
export default {
  props: {
    displayElement: {
      type: Object,
      required: true,
    },

    dataframes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  computed: {
    options () {
      return this.displayElement.options || undefined
    },
  },
}
</script>
