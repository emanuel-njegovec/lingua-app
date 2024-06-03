<template>
    <Card v-if="quiz">
        <template #title>
            {{ quiz.quiz_name }}
        </template>
        <template #content>
            <p>{{ quiz.description }}</p>
            <p>{{ quiz.difficulty }}</p>
            <p>{{ formatDate(quiz.created_at) }}</p>
            <Rating v-model="rating" :cancel="false" :readonly="true" :stars="5" />
            <Button aria-label="Start" @click="playQuiz">Play</Button>
        </template>    
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Rating from 'primevue/rating';
import { computed, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate } from '@/utils';

const router = useRouter();

const props = defineProps({
    quiz: Object
});

const rating = computed(() => props.quiz.average_rating);

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