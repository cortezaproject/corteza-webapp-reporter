<script>
export default {
  props: {
    displayElement: {
      type: Object,
      required: true,
    },

    processing: {
      type: Boolean,
      required: false,
    },
  },

  computed: {
    dataframes () {
      return this.displayElement.dataframes || []
    },

    options () {
      return this.displayElement.options || undefined
    },
  },
}
</script>
