import { defineStore } from 'pinia'

export interface Label {
  text: string;
}

export type AccountType = 'LDAP' | 'Локальная';

export interface Account {
  id: number;          // чтобы легко манипулировать конкретной записью
  labels: Label[];     // массив с объектами вида { text: '...' }
  type: AccountType;   
  login: string;       
  password: string | null; 
  // если type = 'LDAP', password = null
  // если type = 'Локальная', password = string
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
    nextId: 1, // простой счётчик id
  }),
  actions: {
    addAccount() {
      this.accounts.push({
        id: this.nextId++,
        labels: [],
        type: 'Локальная',
        login: '',
        password: '',
      })
    },
    removeAccount(id: number) {
      this.accounts = this.accounts.filter(acc => acc.id !== id)
    },
    updateAccount(updatedAccount: Account) {
      const index = this.accounts.findIndex(acc => acc.id === updatedAccount.id)
      if (index !== -1) {
        this.accounts[index] = { ...updatedAccount }
      }
    },
    setAccounts(accounts: Account[]) {
      // например, при инициализации из localStorage
      this.accounts = accounts
    }
  }
})
