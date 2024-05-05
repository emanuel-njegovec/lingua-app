<template>
    <div class="container">
        <TabMenu :model="items">
            <template>
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span v-bind="props.icon" />
                        <span v-bind="props.label">{{ item.label }}</span>
                    </a>
                </router-link>
            </template>
        </TabMenu>
    </div>

</template>

<script setup>
import TabMenu from 'primevue/tabmenu';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const items = ref([
    {label: 'Home', icon: 'pi pi-fw pi-home', route: '/home'},
    {label: 'Quizzes', icon: 'pi pi-fw pi-search', command: () => {
        router.push('/quizzes');
    }},
    {label: 'Profile', icon: 'pi pi-fw pi-user', route: '/profile'}
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