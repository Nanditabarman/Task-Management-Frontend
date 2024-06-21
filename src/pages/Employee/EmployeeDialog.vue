<template>
  <q-dialog :model-value="visible" @update:model-value="updateVisible">
    <q-card class="custom-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5 ok-form-title text-white">{{ isEdit ? 'Edit Employee' : 'Add Employee' }} </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="cancel" />
        <div class="col-12">
          <q-separator class="q-mb-lg q-mt-sm" color="purple-2" />
        </div>
      </q-card-section>

      <q-card-section>

        <q-form enctype="multipart/form-data">
          <q-list class="row q-pb-md">
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section class="text-white">
                Name
                <q-input rounded outlined color="black" bg-color="white" type="text" autogrow v-model="form.name">
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section class="text-white">
                Email
                <q-input rounded outlined color="black" bg-color="white" type="text" autogrow v-model="form.email">
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section class="text-white">
                Position
                <q-input rounded outlined color="black" bg-color="white" type="text" autogrow v-model="form.position">
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section class="text-white">
                Salary
                <q-input rounded outlined color="black" bg-color="white" type="text" autogrow v-model="form.salary">
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section class="text-white">
                Upload Image
                <q-file bg-color="white" rounded outlined v-model="form.image" label="Upload Image" />
              </q-item-section>
            </q-item>
          </q-list>
          <div class="col-12">
            <q-separator class="q-mb-lg q-mt-sm" color="purple-2" />
          </div>

          <q-card-actions align="right" class="q-pb-md">
            <q-btn color="pink" text-color="white" label="Save" @click="saveEmployee" />
          </q-card-actions>

        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


<script>
import axios from 'axios';
import { ref, watch } from 'vue';
import { useQuasar } from "quasar";

export default {
  name: 'EmployeeDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    employee: {
      type: Object,
      default: null
    }
  },
  emits: ['update:visible', 'employee-saved'],
  setup(props, { emit }) {
    const $q = useQuasar();
    const form = ref({
      id: null,
      name: '',
      email: '',
      position: '',
      salary: '',
      image: null
    });

    const isEdit = ref(false);

    // Define resetForm function
    const resetForm = () => {
      form.value = {
        id: null,
        name: '',
        email: '',
        position: '',
        salary: '',
        image: null
      };
      isEdit.value = false;
    };

    // Watch for changes in props.employee to populate form fields
    watch(() => props.employee, (newEmployee) => {
      if (newEmployee) {
        form.value = { ...newEmployee, image: null };
        isEdit.value = true;
      } else {
        resetForm();
      }
    }, { immediate: true });

    const saveEmployee = () => {
      const formData = new FormData();
      formData.append('name', form.value.name);
      formData.append('email', form.value.email);
      formData.append('position', form.value.position);
      formData.append('salary', form.value.salary);
      if (form.value.image) {
        formData.append('image', form.value.image);
      }

      const url = form.value.id
        ? `http://127.0.0.1:8000/api/employees/${form.value.id}`
        : 'http://127.0.0.1:8000/api/employees';

      const method = form.value.id ? 'put' : 'post';

      axios({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(() => {
          emit('employee-saved');
          $q.notify({
            progress: true,
            message: "Employee created successfully",
            position: "top",
            color: 'purple',
            icon: 'person_add'
          });
          closeDialog();

          resetForm(); // Reset form after successful save
        })
        .catch(error => {
          console.error('Error saving employee:', error);
        });
    };

    const closeDialog = () => {
      emit('update:visible', false);
    };

    return {
      form,
      isEdit,
      saveEmployee,
      closeDialog
    };
  }
};
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
