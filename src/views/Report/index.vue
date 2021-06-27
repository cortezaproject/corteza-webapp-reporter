<template>
  <div
    class="d-flex flex-column w-100"
  >
    <router-view
      class="flex-grow-1 overflow-auto"
    />

    <portal-target
      name="report-toolbar"
    />
  </div>
</template>
