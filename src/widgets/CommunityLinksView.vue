<script lang="ts" setup>
import {ref} from 'vue'
import Axios from "axios";
import {Dark} from "quasar";
import { ORGANIZATION_DATA_URL } from 'src/shared/configs'

export interface CommunityLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}


const showLinks = ref(false)
const communityLinks = ref<CommunityLinkProps[]>([])

Axios.get(ORGANIZATION_DATA_URL).then((response) => {
  if (response?.data?.links instanceof Array) {
    communityLinks.value = response?.data?.links
  }
})

const toggleShowLinks = () => showLinks.value = !showLinks.value
</script>

<template>
  <q-item tag="label">
    <q-item-section>
      <q-item-label>Community</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn
        round
        flat
        no-caps
        dense
        color="transparent"
        :text-color="Dark.isActive ? 'white' : 'black'"
        :icon="!showLinks ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"
        @click="toggleShowLinks"
      />
    </q-item-section>
  </q-item>

  <q-separator/>

  <div v-if="showLinks">
    <q-item
      v-for="(prop, index) in communityLinks"
      :key="index"
      clickable
      tag="a"
      target="_blank"
      :href="prop.link"
    >
      <q-item-section avatar>
        <q-icon :name="prop.icon"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ prop.title }}</q-item-label>
        <q-item-label caption>{{ prop.caption ? prop.caption : '' }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>
