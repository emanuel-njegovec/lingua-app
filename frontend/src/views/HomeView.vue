<template>
    <div class="container">
        <TheHeader></TheHeader>
        <Accordion :multiple="true" :activeIndex="[0]">
            <AccordionTab header="Moji kvizovi">
                <QuizListItem></QuizListItem>
            </AccordionTab>
            <AccordionTab header="Dodani kvizovi">
                <QuizListItem></QuizListItem>
            </AccordionTab>
        </Accordion>
        <TheNavbar></TheNavbar>
    </div>

</template>

<script setup>
import TheHeader from '../components/TheHeader.vue';
import TheNavbar from '../components/TheNavbar.vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import QuizListItem from '../components/QuizListItem.vue';

</script>