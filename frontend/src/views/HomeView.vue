<template>
    <div class="container">
        <TheHeader></TheHeader>
        <TabView>
            <TabPanel header="Home">
                <Accordion :multiple="true" :activeIndex="[0]">
                    <AccordionTab header="Moji kvizovi">
                        <QuizListItem></QuizListItem>
                    </AccordionTab>
                    <AccordionTab header="Dodani kvizovi">
                        <QuizListItem></QuizListItem>
                    </AccordionTab>
                </Accordion>
            </TabPanel>
            <TabPanel header="Kvizovi">
                <Accordion :multiple="true" :activeIndex="[0]">
                    <AccordionTab header="Moji kvizovi">
                        <QuizListItem></QuizListItem>
                    </AccordionTab>
                    <AccordionTab header="Dodani kvizovi">
                        <QuizListItem></QuizListItem>
                    </AccordionTab>
                </Accordion>
            </TabPanel>
            <TabPanel header="Profil">
                <ProfileComponent></ProfileComponent>
            </TabPanel>
        </TabView>
    </div>

</template>

<script setup>
import TheHeader from '../components/TheHeader.vue';
//import TheNavbar from '../components/TheNavbar.vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import QuizListItem from '../components/QuizListItem.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ProfileComponent from '../components/ProfileComponent.vue';

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