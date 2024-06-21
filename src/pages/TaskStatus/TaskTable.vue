// Example of fetching the data in a Vue component

<template>
  <div>
    <div v-for="status in statuses" :key="status.id">
      <p>Task: {{ status.task.title }}</p>
      <p>Employee: {{ status.employee.name }}</p>
      <p>Status: {{ status.status }}</p>
      <p>Progress: {{ status.progress }}%</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  name: 'TaskStatuses',
  setup() {
    const statuses = ref([]);

    const fetchStatuses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/task-statuses');
        statuses.value = response.data.statuses;
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };

    onMounted(() => {
      fetchStatuses();
    });

    return {
      statuses,
    };
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
