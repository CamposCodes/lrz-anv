<template>
  <main>
    <CoverSection />

    <ContributorSection v-for="c in contributors" :key="c.name" :contributor="c" />

    <FinaleSection :contributors="contributors" />
  </main>
</template>

<script lang="ts" setup>
import { contributors } from '@/data/contributors'

useSeoMeta({
  title: 'Feliz Aniversário, Lorenzo'
})
</script>
