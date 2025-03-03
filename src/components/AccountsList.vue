<template>
  <div>
    <h1>Учетные записи</h1>

    <!-- Кнопка добавления -->
    <button @click="handleAddAccount">
      Добавить учётную запись +
    </button>

    <div v-for="account in accounts" :key="account.id" class="account-item">
      <AccountItem
        :accountData="account"
        @remove="removeAccount(account.id)"
        @update="updateAccount"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAccountsStore, Account } from '@/stores/accounts'
import AccountItem from './AccountItem.vue'

export default defineComponent({
  name: 'AccountsList',
  components: { AccountItem },
  setup() {
    const accountsStore = useAccountsStore()
    
    const handleAddAccount = () => {
      accountsStore.addAccount()
    }

    const removeAccount = (id: number) => {
      accountsStore.removeAccount(id)
    }

    const updateAccount = (updated: Account) => {
      accountsStore.updateAccount(updated)
    }

    return {
      accounts: accountsStore.accounts,
      handleAddAccount,
      removeAccount,
      updateAccount
    }
  }
})
</script>

<style scoped>
.account-item {
  margin-bottom: 16px;
  border: 1px solid #ccc;
  padding: 12px;
}
</style>
