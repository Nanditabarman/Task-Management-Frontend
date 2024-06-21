<template>
  <q-dialog :model-value="visible" @update:model-value="updateVisible">
    <q-card class="custom-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 ok-form-title text-white">Update Task Status</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="cancel" />
        <div class="col-12">
          <q-separator class="q-mb-lg q-mt-sm" color="purple-2" />
        </div>
      </q-card-section>

      <q-card-section>
        <q-list class="row q-pb-md">
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section class="text-white">
              Status
              <q-select rounded outlined color="black" bg-color="white" v-model="localTask.status"
                :options="statusOptions" label="Status" />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section class="text-white">
              Progress (%)
              <q-input rounded outlined color="black" bg-color="white" type="number" v-model="localTask.progress"
                label="Progress (%)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <div class="col-12">
        <q-separator class="q-mb-lg q-mt-sm" color="purple-2" />
      </div>

      <q-card-actions align="right" class="q-pb-md">
        <q-btn color="pink" text-color="white" label="Save" @click="updateStatus" />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch, defineComponent } from 'vue';
import axios from 'axios';
import { useQuasar } from "quasar";

export default defineComponent({
  props: {
    visible: Boolean,
    task: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const localTask = ref({ ...props.task });
    const statusOptions = ref(['Not Started', 'In Progress', 'Completed']);
    const $q = useQuasar();
    watch(
      () => props.task,
      (newTask) => {
        localTask.value = { ...newTask };
      },
      { deep: true }
    );

    const updateVisible = (value) => {
      emit('update:visible', value);
    };

    const cancel = () => {
      emit('update:visible', false);
    };

    const updateStatus = async () => {
      try {
        await axios.post(`http://127.0.0.1:8000/api/tasks/${localTask.value.id}/status`, {
          status: localTask.value.status,
          progress: localTask.value.progress
        });
        $q.notify({
          progress: true,
          message: "Status Updated Successfully",
          position: "top",
          color: 'purple',
          icon: 'check'
        });
        emit('status-updated', localTask.value);
        emit('update:visible', false);
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };

    return {
      localTask,
      statusOptions,
      updateVisible,
      cancel,
      updateStatus
    };
  }
});
</script>

<style scoped>
.custom-card {
  background: linear-gradient(to bottom right, #8AA6E5, #BC6DED);
  width: 700px;
}

.custom-input .q-field__control {
  border-radius: 20px;
  color: white;
}
</style>
