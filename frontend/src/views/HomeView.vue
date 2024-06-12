<template>
    <div class="container">
        <TheHeader></TheHeader>
        <div class="content">
            <transition :name="transitionName" mode="out-in">
                <component class="inner-content" :is="currentComponent"></component>
            </transition>
        </div>
        <div class="tab-menu-container">
            <TabMenu :model="menuItems" :activeIndex="activeIndex" @tab-change="onTabChange" class="p-tabview-nav"></TabMenu>
        </div>
    </div>
</template>

<script setup>
import TheHeader from '../components/TheHeader.vue';
import TabMenu from 'primevue/tabmenu';
import HomePanel from '../components/HomePanel.vue';
import UserQuizzes from '../components/UserQuizzes.vue';
import { ref, computed } from 'vue';

const menuItems = ref([
    { label: 'Početni', component: HomePanel },
    { label: 'Kvizovi', component: UserQuizzes },
]);

const transitionName = ref('fade');

const activeIndex = ref(0);

const currentComponent = computed(() => menuItems.value[activeIndex.value].component);

const onTabChange = (e) => {
    const newIndex = e.index;
    transitionName.value = newIndex > activeIndex.value ? 'fade-out-in' : 'fade-out-in-reverse';
    activeIndex.value = newIndex;
};

</script>

<style>
.content {
    margin-top: 110px;
    margin-bottom: 80px;
}

.tab-menu-container {
    width: 100%;
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    height: 75px;
    z-index: 1000;
    background-color: var(--surface-a); /* Background color */
}
.p-tabmenu {
    width: 100%;
}

.p-tabmenu-nav {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
}

.p-tabmenu-nav li {
    flex: 1;
    text-align: center;
}
.p-tabmenu-nav li a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 1em 0; /* Vertical padding for tabs */
    text-align: center;
    text-decoration: none;
    color: var(--text-color); /* Text color */
    transition: background-color 0.3s;
}



@media (min-width: 768px) {
    .content {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .inner-content {
        width: 800px;
    }

}
</style>