<template>
  <div class="account-item">
    <!-- Поле метки -->
    <div>
      <label>Метка (разделитель ";"):</label>
      <input
        type="text"
        v-model="labelInput"
        :class="{ 'error': errors.labels }"
        @blur="onLabelBlur"
      />
      <!-- если есть ошибка -->
      <span v-if="errors.labels" class="error-text">Максимум 50 символов на метку!</span>
    </div>

    <!-- Тип записи -->
    <div>
      <label>Тип записи:</label>
      <select
        v-model="localAccount.type"
        @change="onTypeChange"
      >
        <option value="LDAP">LDAP</option>
        <option value="Локальная">Локальная</option>
      </select>
    </div>

    <!-- Логин -->
    <div>
      <label>Логин:</label>
      <input
        type="text"
        v-model="localAccount.login"
        :class="{ 'error': errors.login }"
        @blur="onLoginBlur"
      />
      <span v-if="errors.login" class="error-text">Обязательное поле, максимум 100 символов!</span>
    </div>

    <!-- Пароль (только если Локальная) -->
    <div v-if="localAccount.type === 'Локальная'">
      <label>Пароль:</label>
      <input
        type="password"
        v-model="localAccount.password"
        :class="{ 'error': errors.password }"
        @blur="onPasswordBlur"
      />
      <span v-if="errors.password" class="error-text">Обязательное поле, максимум 100 символов!</span>
    </div>

    <!-- Кнопка удаления -->
    <button @click="$emit('remove')">
      Удалить
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import type { Account } from '@/stores/accounts'

export default defineComponent({
  name: 'AccountItem',
  props: {
    accountData: {
      type: Object as () => Account,
      required: true
    }
  },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    // Локальная копия, чтобы валидировать до момента потери фокуса
    const localAccount = ref({ ...props.accountData })

    // Поле для ввода меток (строка)
    // Преобразуем метки из массива в строку, склеивая через ";"
    const labelInput = ref(
      localAccount.value.labels.map(label => label.text).join(';')
    )

    // Простая схема ошибок
    const errors = ref({
      labels: false,
      login: false,
      password: false
    })

    // Валидация (достаточно примитивная)
    const validateLabels = (value: string) => {
      // Каждая метка максимум 50 символов
      // Сначала разбиваем по ";",trim() и проверяем каждую
      const splitted = value.split(';').map((str) => str.trim()).filter(Boolean)
      for (const label of splitted) {
        if (label.length > 50) {
          return false
        }
      }
      return true
    }

    const validateLogin = (value: string) => {
      if (!value) return false
      if (value.length > 100) return false
      return true
    }

    const validatePassword = (value: string | null) => {
      if (localAccount.value.type === 'Локальная') {
        if (!value) return false
        if (value.length > 100) return false
      }
      return true
    }

    // Обработчики blur
    const onLabelBlur = () => {
      errors.value.labels = !validateLabels(labelInput.value)
      if (!errors.value.labels) {
        // Преобразуем labelInput -> массив {text: ...}
        const splitted = labelInput.value
          .split(';')
          .map((s) => s.trim())
          .filter(Boolean)

        localAccount.value.labels = splitted.map(text => ({ text }))
        emitUpdate()
      }
    }

    const onLoginBlur = () => {
      errors.value.login = !validateLogin(localAccount.value.login)
      if (!errors.value.login) {
        emitUpdate()
      }
    }

    const onPasswordBlur = () => {
      errors.value.password = !validatePassword(localAccount.value.password)
      if (!errors.value.password) {
        emitUpdate()
      }
    }

    // Если меняем тип записи, нужно сразу синхронизировать пароль
    const onTypeChange = () => {
      if (localAccount.value.type === 'LDAP') {
        localAccount.value.password = null
      } else {
        // Если переключились на 'Локальная' и пароль = null, дадим пустую строку
        if (!localAccount.value.password) {
          localAccount.value.password = ''
        }
      }
      // А вот проверим на ошибки, вдруг раньше он был LDAP.
      onPasswordBlur()
    }

    // Вызовем emit('update') с обновлённой локальной записью
    const emitUpdate = () => {
      emit('update', { ...localAccount.value })
    }

    // Следим, если вдруг пропсы поменялись (в теории)
    watch(
      () => props.accountData,
      (newVal) => {
        localAccount.value = { ...newVal }
        labelInput.value = localAccount.value.labels.map(label => label.text).join(';')
      },
      { deep: true }
    )

    return {
      localAccount,
      labelInput,
      errors,
      onLabelBlur,
      onLoginBlur,
      onPasswordBlur,
      onTypeChange
    }
  }
})
</script>

<style scoped>
.error {
  border: 1px solid red;
}
.error-text {
  color: red;
  font-size: 12px;
  margin-left: 8px;
}
</style>
