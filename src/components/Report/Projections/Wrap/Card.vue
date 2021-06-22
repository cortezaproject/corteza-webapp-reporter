<template>
  <div class="h-100 p-2 overflow-hidden">
    <b-card
      no-body
      class="h-100 border-0 shadow-sm"
    >
      <b-card-header
        v-if="headerSet"
        class="sticky-top border-0 border-bottom text-primary text-nowrap text-truncate p-0"
        header-bg-variant="white"
      >
        <slot
          name="header"
        />
      </b-card-header>

      <b-card-body
        v-if="bodySet"
        class="p-0 h-100 overflow-auto"
      >
        <slot
          name="default"
        />
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  computed: {
    headerSet () {
      return !!this.$scopedSlots.header
    },

    bodySet () {
      return !!this.$scopedSlots.default
    },

    footerSet () {
      return !!this.$scopedSlots.footer
    },
  },
}
</script>

<style>

</style>
