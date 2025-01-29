<script setup lang="ts">

import ServerList from 'components/server/ServerList.vue'
import Header from 'src/widgets/HeaderWidget.vue'
</script>

<template>

  <q-page class="row items-center justify-evenly">
    <Header/>
<!--    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>-->
<!--      <q-list>-->
<!--        <q-item-label header> Essential Links </q-item-label>-->

<!--        &lt;!&ndash;        <CommunityLinksView />&ndash;&gt;-->
<!--      </q-list>-->
<!--    </q-drawer>-->
    <ServerList />
  </q-page>
</template>
