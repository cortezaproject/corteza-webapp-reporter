<template>
  <b-container fluid>
    <b-row>
      <b-col
        cols="3"
      >
        <b-list-group>
          <b-list-group-item
            v-for="element in displayElements"
            :key="element.kind"
            button
            @mouseover="current = element.image"
            @click="$emit('select', element.kind)"
          >
            {{ element.label }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col
        cols="9"
        class="my-auto"
      >
        <b-img
          v-if="current"
          fluid
          thumbnail
          :src="current"
        />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import * as images from 'corteza-webapp-reporter/src/assets/DisplayElements'

export default {
  data () {
    return {
      current: images.Chart,
      displayElements: [
        {
          label: 'Text',
          kind: 'Text',
          image: images.Text,
        },
        {
          label: 'Table',
          kind: 'Table',
          image: images.Chart,
        },
        {
          label: 'Chart',
          kind: 'Chart',
          image: images.Chart,
        },
      ],
    }
  },
}
</script>
