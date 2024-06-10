<template>
    <div class="container">
        <TheHeader></TheHeader>
        <div class="content">
            <TabView>
                <TabPanel header="Home">
                    <HomePanel></HomePanel>
                </TabPanel>
                <TabPanel header="Kvizovi">
                    <UserQuizzes></UserQuizzes>
                </TabPanel>
            </TabView>
        </div>

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

.content {
    margin-top: 100px;
    margin-bottom: 50px;
}


.p-tabview-nav {
    display: flex;
    justify-content:space-evenly;
    position: fixed;
    width: 100%;
    bottom: 0px;
    z-index: 900;
    background-color: #1F2937;
    border-radius: 5px;
    box-shadow: 0px -2px 10px 0px rgba(0,0,0,0.2);
}

</style>