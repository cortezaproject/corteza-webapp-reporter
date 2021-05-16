<template>
  <div class="d-flex flex-column w-100 vh-100 overflow-auto">
    <header>
      <c-topbar
        :sidebar-pinned="pinned"
      >
        <template #title>
          <portal-target
            name="topbar-title"
          />
        </template>
      </c-topbar>
    </header>

    <aside>
      <c-sidebar
        :expanded.sync="expanded"
        :pinned.sync="pinned"
      >
        <template #header-collapsed>
          <portal-target name="sidebar-header-collapsed" />
        </template>

        <template #header-expanded>
          <portal-target name="sidebar-header-expanded" />
        </template>

        <template #body-collapsed>
          <portal-target name="sidebar-body-collapsed" />
        </template>

        <template #body-expanded>
          <portal-target name="sidebar-body-expanded" />
        </template>

        <template #footer-expanded>
          <portal-target name="sidebar-footer-expanded" />
        </template>

        <template #footer-collapsed>
          <portal-target
            class="text-center"
            name="sidebar-footer-collapsed"
          />
        </template>
      </c-sidebar>
    </aside>

    <main class="d-inline-flex h-100">
      <!--
        Content spacer
        Large and xl screens should push in content when the nav is expanded
      -->
      <template>
        <div
          class="spacer"
          :class="{
            'expanded': expanded && pinned,
          }"
        />
      </template>

      <router-view />
    </main>
    <!-- <c-prompts /> -->
    <c-permissions-modal />
  </div>
</template>

<script>
import { components } from '@cortezaproject/corteza-vue'
const { CPermissionsModal, CTopbar, CSidebar } = components

export default {
  components: {
    CPermissionsModal,
    CTopbar,
    CSidebar,
  },

  data () {
    return {
      expanded: undefined,
      pinned: undefined,
    }
  },

  created () {
    this.$root.$on('alert', this.displayToast)
  },

  methods: {
    displayToast ({ title, message, variant, countdown }) {
      this.$bvToast.toast(message, {
        title,
        variant,
        solid: true,
        autoHideDelay: countdown,
        toaster: 'b-toaster-bottom-right',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.topbar {
  background-color: #F3F3F5;
}

main {
  padding-top: $topbar-height;
}

.spacer {
  min-width: 77px;
  transition: width 0.1s ease-in-out;

  &.expanded {
    min-width: $sidebar-width;
  }
}
</style>
