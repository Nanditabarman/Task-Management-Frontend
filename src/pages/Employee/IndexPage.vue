<template>
  <q-page padding>
    <q-toolbar>
      <q-toolbar-title class="text-bold text-purple-9">Employee Management</q-toolbar-title>
      <q-btn @click="openCreateDialog" label="Add Employee"
        style=" background-color: rgba(21, 0, 112, 0.819); color: white;" icon="person_add" />
    </q-toolbar>

    <q-table :rows="employees" :columns="columns" row-key="id" separator="horizontal" class="q-mt-md">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-bold text-purple-9"
            style="font-size: 16px; font-weight: 800;">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="row justify-center ">
            <!-- <q-btn @click="openEditDialog(props.row)" icon="edit_square" color="green-9" flat dense /> -->
            <q-btn @click="deleteEmployee(props.row.id)" icon="delete" color="negative" flat dense />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <q-avatar size="lg">
            <img :src="getImageUrl(props.row.image)" alt="Employee Image" />
          </q-avatar>
        </q-td>
      </template>
    </q-table>

    <employee-dialog :visible="isDialogVisible" :employee="selectedEmployee" @update:visible="isDialogVisible = $event"
      @employee-saved="fetchEmployees" />
  </q-page>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import EmployeeDialog from 'src/pages/Employee/EmployeeDialog.vue';
import { useQuasar } from "quasar";

export default {
  components: {
    EmployeeDialog
  },
  setup() {
    const employees = ref([]);
    const isDialogVisible = ref(false);
    const selectedEmployee = ref(null);
    const $q = useQuasar();

    const columns = [
      { name: 'image', label: 'Employee', align: 'left', field: 'image' }, // Added image column
      { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
      { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
      { name: 'position', label: 'Position', align: 'left', field: 'position', sortable: true },
      { name: 'salary', label: 'Salary', align: 'left', field: 'salary', sortable: true },
      { name: 'actions', label: 'Actions', align: 'center' }
    ];

    const fetchEmployees = () => {
      axios.get('http://127.0.0.1:8000/api/employees')
        .then(response => {
          employees.value = response.data.employees;
        })
        .catch(error => {
          console.error('Error fetching employees:', error);
        });
    };

    const openCreateDialog = () => {
      selectedEmployee.value = null;
      isDialogVisible.value = true;
    };

    const openEditDialog = (employee) => {
      selectedEmployee.value = employee;
      isDialogVisible.value = true;
    };

    const deleteEmployee = (id) => {
      axios.delete(`http://127.0.0.1:8000/api/employees/${id}`)
        .then(response => {
          $q.notify({
            progress: true,
            message: "Employee Delete successfully",
            position: "top",
            color: 'negative',
            icon: 'delete'
          });
          fetchEmployees(); // Refresh the list
        })
        .catch(error => {
          console.error('Error deleting employee:', error);
        });
    };

    const getImageUrl = (path) => {
      return path ? `http://127.0.0.1:8000/storage/${path}` : ''; // Adjust URL as needed
    };

    onMounted(() => {
      fetchEmployees();
    });

    return {
      employees,
      columns,
      isDialogVisible,
      selectedEmployee,
      fetchEmployees,
      openCreateDialog,
      openEditDialog,
      deleteEmployee,
      getImageUrl
    };
  }
};
</script>

<style>
/* Add your styles here */
</style>
