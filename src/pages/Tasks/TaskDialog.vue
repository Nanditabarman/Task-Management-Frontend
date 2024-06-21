<template>
  <q-dialog :model-value="visible" @update:model-value="updateVisible">
    <q-card class="custom-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 ok-form-title text-white">{{ dialogTitle }} </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="cancel" />
        <div class="col-12">
          <q-separator class="q-mb-lg q-mt-sm" color="purple-2" />
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-list class="row q-pb-md">
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section class="text-white">
              Title
              <q-input rounded outlined color="black" bg-color="white" type="text" autogrow v-model="localTask.title">
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pb-lg">
            <q-item-section class="text-white">
              Description
              <q-input rounded outlined color="black" bg-color="white" type="textarea" autogrow
                v-model="localTask.description">
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section class="text-white">
              Deadline
              <q-input v-model="localTask.deadline" bg-color="white" type="date" outlined rounded color="white" />
            </q-item-section>
          </q-item>
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-item-section class="text-white">
              Assign To
              <q-select outlined rounded v-model="localTask.assigned_to" option-label="name" option-value="id"
                color="white" bg-color="white" type="text" :options="employeeOptions" behavior="menu" />
            </q-item-section>
          </q-item>

        </q-list>
      </q-card-section>

      <div class="col-12">
        <q-separator class="q-mb-lg q-mt-sm" color="purple-2" />
      </div>

      <q-card-actions align="right" class="q-pb-md">
        <q-btn color="pink" text-color="white" label="Save" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import axios from 'axios';
import { useQuasar } from "quasar";

const props = defineProps({
  visible: Boolean,
  task: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:visible', 'task-saved']);

const localTask = reactive({ ...props.task });
const employeeOptions = ref([]);
const $q = useQuasar();

watch(
  () => props.task,
  (newVal) => {
    Object.assign(localTask, newVal);
  },
  { deep: true }
);

const updateVisible = (value) => {
  emit('update:visible', value);
};

const cancel = () => {
  emit('update:visible', false);
};

const save = async () => {
  try {
    const taskPayload = {
      ...localTask,
      assigned_to: localTask.assigned_to.id // Ensure assigned_to is the ID
    };

    if (taskPayload.id) {
      // PUT request for updating an existing task
      await axios.put(`http://127.0.0.1:8000/api/tasks/${taskPayload.id}/update`, taskPayload);
    } else {
      // POST request for creating a new task
      await axios.post('http://127.0.0.1:8000/api/tasks/store', taskPayload);
    }

    // Task saved successfully
    emit('task-saved');

    // Reset localTask to clear fields
    Object.keys(localTask).forEach(key => {
      if (key === 'assigned_to') {
        localTask[key] = null; // Reset assigned_to to null or appropriate default
      } else if (key === 'deadline') {
        localTask[key] = null; // Reset deadline to null or appropriate default
      } else {
        localTask[key] = ''; // Reset other fields to empty string or appropriate default
      }
    });

    emit('update:visible', false); // Close the dialog after saving
    $q.notify({
      progress: true,
      message: "Task created successfully",
      position: "top",
      color: 'purple',
      icon: 'add_task'
    });
  } catch (error) {
    console.error('Error saving task:', error);
  }
};


const fetchEmployees = () => {
  axios.get('http://127.0.0.1:8000/api/employees')
    .then(response => {
      employeeOptions.value = response.data.employees;
    })
    .catch(error => {
      console.error('Error fetching employees:', error);
    });
};

onMounted(() => {
  fetchEmployees();
});

const dialogTitle = computed(() => (props.task ? 'Task Update' : 'Task Create'));

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
