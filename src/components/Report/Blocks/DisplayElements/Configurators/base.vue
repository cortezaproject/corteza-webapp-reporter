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

    datasource: {
      type: Object,
      default: undefined,
    },
  },

  computed: {
    options: {
      get () {
        return this.displayElement.options || undefined
      },

      set (options) {
        this.$emit('update:displayElement', { ...this.displayElement, options })
      },
    },
  },
}
</script>
