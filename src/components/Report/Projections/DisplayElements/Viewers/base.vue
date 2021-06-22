<script>
export default {
  props: {
    displayElement: {
      type: Object,
      required: true,
    },

    dataset: {
      type: Object,
      required: false,
      default: undefined,
    },
  },

  computed: {
    options () {
      return this.displayElement.options || undefined
    },
  },
}
</script>
