<template>
  <q-page padding>
    <q-toolbar>
      <q-toolbar-title class="text-bold text-purple-9">Task Management</q-toolbar-title>
      <q-btn @click="openCreateDialog" label="Add Task"
        style=" background-color: rgba(21, 0, 112, 0.819); color: white;" icon="add_task" />
    </q-toolbar>

    <q-table :rows="tasks" :columns="columns" row-key="id" separator="horizontal" class="q-mt-md">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-bold text-purple-9"
            style="font-size: 16px; font-weight: 800;">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top-left>
        <div class="text-h6 ok-table-title"></div>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="row justify-center">
            <q-btn @click="openEditDialog(props.row)" icon="edit_square" color="pink-9" flat dense />
            <q-btn @click="openStatusDialog(props.row)" icon="task_alt" color="green-9" flat dense />
            <q-btn @click="deleteTask(props.row.id)" icon="delete" color="negative" flat dense />

          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip v-if="props.row.statuses.length > 0" :color="getStatusColor(props.row.statuses[0].status)"
            :text-color="getStatusTextColor(props.row.statuses[0].status)" outline
            :icon-right="props.row.statuses[0].status === 'Completed' ? 'check' : 'star'">
            {{ props.row.statuses[0].status }}
          </q-chip>
          <span v-else>No status</span>
        </q-td>
      </template>

      <template v-slot:body-cell-progress="props">
        <q-td :props="props">
          <q-linear-progress :value="props.row.progress / 100" :color="getProgressColor(props.row.progress)" />
          <div>{{ props.row.progress }}%</div>

        </q-td>
      </template>
    </q-table>




    <task-dialog :visible="isDialogVisible" :task="selectedTask" @update:visible="isDialogVisible = $event"
      @task-saved="fetchTasks" />
    <task-status-dialog :visible="isStatusDialogVisible" :task="selectedTask"
      @update:visible="isStatusDialogVisible = $event" @status-updated="fetchTasks" />
  </q-page>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import TaskDialog from 'src/pages/Tasks/TaskDialog.vue';
import TaskStatusDialog from 'src/pages/TaskStatus/TaskStatusDialog.vue';
import { useQuasar } from "quasar";
export default {
  components: {
    TaskDialog,
    TaskStatusDialog
  },
  setup() {
    const tasks = ref([]);
    const isDialogVisible = ref(false);
    const isStatusDialogVisible = ref(false);
    const selectedTask = ref(null);
    const $q = useQuasar();
    const columns = [
      { name: 'title', label: 'Title', align: 'left', field: 'title', sortable: true },
      // { name: 'description', label: 'Description', align: 'left', field: 'description' },
      {
        name: 'employee',
        label: 'Employee',
        align: 'left',
        field: row => (row.employees && row.employees.length > 0 ? row.employees[0].name : 'Unassigned'),
        sortable: true
      },
      { name: 'status', label: 'Status', align: 'left', field: 'status' },
      { name: 'progress', label: 'Progress', align: 'left', field: 'progress' },
      { name: 'actions', label: 'Actions', align: 'center' }
    ];

    const getStatusColor = (status) => {
      switch (status) {
        case 'Not Started':
          return 'red';
        case 'In Progress':
          return 'orange';
        case 'Completed':
          return 'green';
        default:
          return 'grey';
      }
    };

    const getStatusTextColor = (status) => {
      return status === 'Completed' ? 'white' : 'black';
    };

    const fetchTasks = () => {
      axios.get('http://127.0.0.1:8000/api/tasks')
        .then(response => {
          // Transform the tasks to add progress field
          tasks.value = response.data.tasks.map(task => {
            let progress = 0;
            if (task.statuses && task.statuses.length > 0) {
              progress = task.statuses[0].progress;
            }
            return {
              ...task,
              progress: progress
            };
          });
        })
        .catch(error => {
          console.error('Error fetching tasks:', error);
        });
    };

    const openCreateDialog = () => {
      selectedTask.value = null;
      isDialogVisible.value = true;
    };

    const openEditDialog = (task) => {
      selectedTask.value = task;
      isDialogVisible.value = true;
    };

    const openStatusDialog = (task) => {
      selectedTask.value = task;
      isStatusDialogVisible.value = true;
    };

    const deleteTask = (id) => {
      axios.delete(`http://127.0.0.1:8000/api/tasks/${id}`)
        .then(response => {
          $q.notify({
            progress: true,
            message: "Task Delete successfully",
            position: "top",
            color: 'negative',
            icon: 'delete'
          });
          fetchTasks(); // Refresh the list
        })
        .catch(error => {
          console.error('Error deleting task:', error);
        });
    };

    const getProgressColor = (progress) => {
      return progress < 50 ? 'negative' : 'positive';
    };

    onMounted(() => {
      fetchTasks();
    });

    return {
      tasks,
      columns,
      getStatusColor,
      getStatusTextColor,
      isDialogVisible,
      isStatusDialogVisible,
      selectedTask,
      fetchTasks,
      openCreateDialog,
      openEditDialog,
      openStatusDialog,
      deleteTask,
      getProgressColor
    };
  }
};
</script>

<style>
/* Add your styles here */
</style>
