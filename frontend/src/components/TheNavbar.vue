<template>
    <div class="container">
        <TabMenu :model="items" />
    </div>

</template>

<script setup>
import TabMenu from 'primevue/tabmenu';
import { ref } from 'vue';

const items = ref([
    {label: 'Home', icon: 'pi pi-fw pi-home', to: '/'},
    {label: 'Quizzes', icon: 'pi pi-fw pi-search', to: '/login'},
    {label: 'Profile', icon: 'pi pi-fw pi-user', to: '/about'}
]);


</script>

<style scoped>

.container {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e9ecef;
    height: 60px;
}

</style>