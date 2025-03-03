<template>
  <AccountsList />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AccountsList from '@/components/AccountsList.vue'

export default defineComponent({
  name: 'App',
  components: { AccountsList }
})
</script>
