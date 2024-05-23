<template>
    <Card v-if="quiz">
        <template #title>
            {{ quiz.quiz_name }}
        </template>
        <template #content>
            <p>{{ quiz.description }}</p>
            <Button icon="pi pi-play" aria-label="Start" @click="playQuiz"></Button>
        </template>    
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
//import axios from 'axios';

const router = useRouter();

const props = defineProps({
    quiz: Object
});
//const emit = defineEmits(['remove']);
//console.log('here', props.quiz);


const playQuiz = () => {
    router.push('/play/' + props.quiz.quiz_id);
}

</script>

<style scoped>
.p-card {
    background-color: #1D3557;
    color: aliceblue;
}


</style>