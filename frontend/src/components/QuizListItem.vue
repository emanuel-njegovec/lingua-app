<template>
    <Card v-if="quiz">
        <template #title>
            {{ quiz.quiz_name }}
        </template>
        <template #content>
            <p>{{ quiz.description }}</p>
            <Button label="Pogledaj kviz">Pogledaj</Button>
        </template>    
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import { defineProps } from 'vue';

// eslint-disable-next-line
const props = defineProps({
    quiz: Object
});
//console.log('here', props.quiz);

</script>

<style scoped>
.p-card {
    background-color: #1D3557;
    color: aliceblue;
}


</style>