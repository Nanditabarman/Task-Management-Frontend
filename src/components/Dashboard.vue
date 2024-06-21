<template>
  <q-page class="q-pa-md">
    <h4 style="margin-top: 10px;">Hello, {{ user ? user.name : 'Overview' }}</h4>
    <p style="margin-top: -30px;">This is your Dashboard</p>
    <div class="row q-col-gutter-md">
      <!-- Total Employees Card -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card flat bordered class="gradient-purple text-white">
          <q-card-section>
            <div class="row justify-between">
              <div>
                <div class="text-h4">{{ totalEmployees }}</div>
                <div>Total Employees</div>
              </div>
              <q-icon name="people" size="32px" class="q-mr-md" />
            </div>
            <div class="row items-center justify-end text-caption text-white q-mt-sm">
              +10
              <q-badge color="white" text-color="green" class="q-ml-sm">5%</q-badge>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Total Tasks Card -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card flat bordered class="gradient-green text-white">
          <q-card-section>
            <div class="row justify-between">
              <div>
                <div class="text-h4">{{ totalTasks }}</div>
                <div>Total Tasks</div>
              </div>
              <q-icon name="list" size="32px" class="q-mr-md" />
            </div>
            <div class="row items-center justify-end text-caption text-white q-mt-sm">
              +16
              <q-badge color="white" text-color="green" class="q-ml-sm">10%</q-badge>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Incomplete Tasks Card -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card flat bordered class="gradient-blue text-white">
          <q-card-section>
            <div class="row justify-between">
              <div>
                <div class="text-h4">{{ totalIncompleteTasks }}</div>
                <div>Incomplete Tasks</div>
              </div>
              <q-icon name="warning" size="32px" class="q-mr-md" />
            </div>
            <div class="row items-center justify-end text-caption text-white q-mt-sm">
              -9
              <q-badge color="white" text-color="blue" class="q-ml-sm">3%</q-badge>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Completed Tasks Card -->
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card flat bordered class="gradient-pink text-white">
          <q-card-section>
            <div class="row justify-between">
              <div>
                <div class="text-h4">{{ totalTasks - totalIncompleteTasks }}</div>
                <div>Complete Tasks</div>
              </div>
              <q-icon name="check_circle" size="32px" class="q-mr-md" />
            </div>
            <div class="row items-center justify-end text-caption text-white q-mt-sm">
              -12
              <q-badge color="white" text-color="purple" class="q-ml-sm">3%</q-badge>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-6 col-xs-6 q-mt-lg bg-white"
        style="border-radius: 20px; box-shadow: 1px solid black;">
        <!-- New Progress Chart -->
        <q-card flat bordered class="gradient-orange text-white">
          <q-card-section>
            <div class="text-h6">Tasks Progress</div>
            <div class="row ">
              <bar-chart :chart-data="chartData" style="height: 300px" />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Donut Chart Section -->
      <div class="col-md-6 col-sm-6 col-xs-6 q-mt-lg bg-white"
        style="border-radius: 20px; box-shadow: 1px solid black;">
        <q-card flat bordered class="gradient-yellow text-white q-pa-md">
          <q-card-section>
            <div class="text-h6">Tasks Distribution</div>
            <div class="row q-mt-md" style="height: 100%;">
              <donut-chart :chart-data="donutChartData" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, h } from 'vue';
import { fetchAuthUser } from "src/store/Auth/actions.js";
import axios from 'axios';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);


export default {
  name: 'DashboardPage',
  components: {
    BarChart: {
      extends: Bar,
      props: ['chartData'],
      setup(props) {
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          barPercentage: 0.3, // Adjust this value to make bars thinner
          categoryPercentage: 0.5 // Adjust this value to make bars thinner
        };

        return () => h(Bar, {
          data: props.chartData,
          options: chartOptions
        });
      }
    },
    DonutChart: {
      extends: Doughnut,
      props: ['chartData'],
      setup(props) {
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false
        };

        return () => h(Doughnut, {
          data: props.chartData,
          options: chartOptions
        });
      }
    }
  },
  setup() {
    const employees = ref([]);
    const tasks = ref([]);
    const totalEmployees = ref(0);
    const totalTasks = ref(0);
    const totalIncompleteTasks = ref(0);
    const user = ref(null);

    const totalCompletedTasks = computed(() => totalTasks.value - totalIncompleteTasks.value);

    const tasksZeroPercent = computed(() => tasks.value.filter(task => task.progress === 0).length);
    const tasksLessThanFiftyPercent = computed(() => tasks.value.filter(task => task.progress > 0 && task.progress < 50).length);
    const tasksFiftyToHundredPercent = computed(() => tasks.value.filter(task => task.progress >= 50 && task.progress < 100).length);

    const createGradient = (ctx, color1, color2) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      return gradient;
    };

    const chartData = computed(() => {
      const ctx = document.createElement('canvas').getContext('2d');
      return {
        labels: ['50% - 100%', '0% - 50%', '0%'],
        datasets: [
          {
            label: 'Tasks',
            backgroundColor: [
              createGradient(ctx, '#ff0051', '#ff76fa'),
              createGradient(ctx, '#009dff', '#00eebf'),
              createGradient(ctx, '#4caf50', '#4caf50')
            ],
            borderRadius: 15, // Adding border radius
            data: [
              tasksZeroPercent.value,
              tasksLessThanFiftyPercent.value,
              tasksFiftyToHundredPercent.value
            ]
          }
        ]
      };
    });

    const donutChartData = computed(() => {
      const ctx = document.createElement('canvas').getContext('2d');
      return {
        labels: ['50% - 100%', '0% - 50%', '0%'],
        datasets: [
          {
            label: 'Tasks',
            backgroundColor: [
              createGradient(ctx, '#4caf50', '#4caf50'),
              createGradient(ctx, '#009dff', '#00eebf'),
              createGradient(ctx, '#ff0051', '#ff76fa')
            ],
            data: [
              tasksZeroPercent.value,
              tasksLessThanFiftyPercent.value,
              tasksFiftyToHundredPercent.value
            ]
          }
        ]
      };
    });


    const getUserData = () => {
      fetchAuthUser()
        .then(response => {
          user.value = response.data;
        })
        .catch(error => {
          console.error('Error fetching authenticated user:', error);
        });
    };


    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/employees');
        employees.value = response.data.employees;
        totalEmployees.value = employees.value.length;
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/tasks');
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
        totalTasks.value = tasks.value.length;
        totalIncompleteTasks.value = tasks.value.filter(task => task.progress < 100).length;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    onMounted(() => {
      getUserData();
      fetchEmployees();
      fetchTasks();
    });

    return {
      user,
      employees,
      tasks,
      totalEmployees,
      totalTasks,
      totalIncompleteTasks,
      totalCompletedTasks,
      tasksZeroPercent,
      tasksLessThanFiftyPercent,
      tasksFiftyToHundredPercent,
      chartData,
      donutChartData
    };
  }
};
</script>


<style>
.gradient-green {
  background: linear-gradient(45deg, #009dff, #00eebf);
}

.gradient-pink {
  background: linear-gradient(45deg, #ff0051, #ff76fa);
}

.gradient-blue {
  background: linear-gradient(45deg, #644cff, #cf69ff);
}

.gradient-purple {
  background: linear-gradient(45deg, #ab51db, #ff91e9);
}

.text-dark {
  color: #333;
}

.text-positive {
  color: #4caf50;
}

.text-negative {
  color: #f44336;
}
</style>
