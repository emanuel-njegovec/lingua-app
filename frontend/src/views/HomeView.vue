<template>
    <div class="container">
        <TheHeader></TheHeader>
        <TabView>
            <TabPanel header="Home">
                <MyQuizzes></MyQuizzes>
            </TabPanel>
            <TabPanel header="Kvizovi">
                <UserQuizzes></UserQuizzes>
            </TabPanel>
            <TabPanel header="Profil">
                <ProfileComponent></ProfileComponent>
            </TabPanel>
        </TabView>
    </div>

</template>

<script setup>
import TheHeader from '../components/TheHeader.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ProfileComponent from '../components/ProfileComponent.vue';
import MyQuizzes from '../components/MyQuizzes.vue';
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