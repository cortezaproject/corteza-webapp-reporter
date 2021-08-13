<script>
export default {
  props: {
    displayElement: {
      type: Object,
      required: true,
    },

    options: {
      type: Object,
      required: true,
    },

    columns: {
      type: Array,
      required: true,
    },
  },
}
</script>
