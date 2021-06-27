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
      const o = [{ value: '', text: 'None', disabled: true }]

      for (const [i, s] of Object.entries(this.projection.sources)) {
        for (const v of Object.values(s)) {
          o.push({ value: v.name || `${i}`, text: v.name || `${i}` })
        }
      }

      return o
    },

    options () {
      return this.displayElement.options || undefined
    },
  },
}
</script>
