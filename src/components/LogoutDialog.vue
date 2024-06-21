<template>
  <q-dialog v-model="show" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="logout" color="primary" text-color="white" />
        <span class="q-ml-sm">Confirm Logout</span>
      </q-card-section>

      <q-card-section>
        Are you sure you want to log out?
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Logout" color="negative" @click="confirmLogout" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { logout } from 'src/store/Auth/actions.js'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LogoutDialog',
  setup() {
    const show = ref(false)
    const router = useRouter()

    const confirmLogout = () => {
      logout()
        .then(() => {
          show.value = false
          router.push('/')
        })
        .catch((error) => {
          console.error('Error logging out:', error)
        })
    }

    return {
      show,
      confirmLogout
    }
  }
})

</script>
