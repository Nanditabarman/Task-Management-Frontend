<template>
  <q-item :class="{ 'active-link': isLinkActive }" clickable tag="a"
    :href="isInternalLink ? $router.resolve(link).href : link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" class="q-py-sm" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="q-py-sm">{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '#',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const route = useRoute();

    const isLinkActive = computed(() => route.path === props.link);


    return {
      isLinkActive,
    };
  },
  computed: {
    isInternalLink() {
      return this.link && this.link.startsWith('/');
    },
  },
});
</script>


<style scoped>
.active-link {
  background-color: rgba(21, 0, 112, 0.819);
  color: white;
  border-radius: 20px;
}

.q-item.q-router-link--active,
.q-item--active {
  color: #fff;
}
</style>
