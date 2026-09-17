<template>
  <main>
    <NavMenu :contributors="contributors" />

    <CoverSection />

    <ContributorSection v-for="(c, i) in contributors" :key="c.name" :contributor="c" :index="i" />

    <FinaleSection :contributors="contributors" />
  </main>
</template>

<script lang="ts" setup>
import { contributors } from '@/data/contributors'

useSeoMeta({
  title: 'Feliz Aniversário, Lorenzo'
})
</script>
