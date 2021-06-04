<script>
export default {
  props: {
    displayElement: {
      type: Object,
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
