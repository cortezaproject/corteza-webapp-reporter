<template>
  <b-container
    fluid
    class="bg-white shadow border-top p-3"
  >
    <b-row
      no-gutters
      class="align-items-center"
    >
      <b-col>
        <b-button
          v-if="backLink"
          variant="link"
          size="lg"
          :to="backLink"
          class="d-flex align-items-center p-0 text-dark back"
        >
          <font-awesome-icon
            :icon="['fas', 'chevron-left']"
            class="back-icon mr-1"
          />
          {{ $t('general.label.back') }}
        </b-button>
      </b-col>

      <b-col
        class="d-flex justify-content-center"
      >
        <slot />
      </b-col>

      <b-col
        class="d-flex justify-content-end"
      >
        <c-input-confirm
          v-if="!hideDelete"
          class="mr-1"
          size="lg"
          size-confirm="lg"
          variant="danger"
          :borderless="false"
          @confirmed="$emit('delete')"
        >
          {{ $t('general.label.delete') }}
        </c-input-confirm>
        <b-button
          variant="primary"
          size="lg"
          @click="$emit('save')"
        >
          {{ $t('general.label.save') }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>

export default {
  props: {
    backLink: {
      type: Object,
      required: false,
      default: () => ({ name: 'root' }),
    },
    hideDelete: {
      type: Boolean,
      required: false,
    },
    hideSave: {
      type: Boolean,
      required: false,
    },
    disableSave: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.back {
  &:hover {
    text-decoration: none;

    .back-icon {
      transition: transform 0.3s ease-out;
      transform: translateX(-4px);
    }
  }
}
</style>
