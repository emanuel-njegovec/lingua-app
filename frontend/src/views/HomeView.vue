<template>
    <div class="container">
        <TheHeader></TheHeader>
        <TabView>
            <TabPanel header="Home">
                <HomePanel></HomePanel>
            </TabPanel>
            <TabPanel header="Kvizovi">
                <UserQuizzes></UserQuizzes>
            </TabPanel>
        </TabView>
    </div>

</template>

<script setup>
import TheHeader from '../components/TheHeader.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import HomePanel from '../components/HomePanel.vue';
import UserQuizzes from '../components/UserQuizzes.vue';

</script>

<style>
.p-tabview-nav {
    display: flex;
    justify-content:space-evenly;
    position: fixed;
    width: 100%;
    bottom: 0px;
    z-index: 1000;
}

</style>