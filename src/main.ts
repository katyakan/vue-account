import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useAccountsStore } from './stores/accounts'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

const accountsStore = useAccountsStore()

// Загрузка из localStorage при старте
const savedAccounts = localStorage.getItem('accounts')
if (savedAccounts) {
  accountsStore.setAccounts(JSON.parse(savedAccounts))
}

// Сохранение при каждом изменении
accountsStore.$subscribe((mutation, state) => {
  localStorage.setItem('accounts', JSON.stringify(state.accounts))
})

app.mount('#app')
