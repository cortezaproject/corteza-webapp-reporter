<script>
export default {
  props: {
    displayElement: {
      type: Object,
      required: true,
    },

    columns: {
      type: Array,
      required: true,
    },
  },

  computed: {
    options () {
      return this.displayElement.options || undefined
    },
  },
}
</script>
