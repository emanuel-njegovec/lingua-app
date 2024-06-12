<template>
    <Card v-if="quiz">
        <template #content>
            <div>
                <h2>{{ quiz.quiz_name }}</h2>
                <p>{{ quiz.description }}</p>
                <p>Težina kviza: {{ quiz.difficulty }}</p>
                <Rating v-model="rating" :cancel="false" :readonly="true" :stars="5" />
                <p>{{ formatDate(quiz.created_at) }}</p>
            </div>
            <Button label="Pokreni" @click="playQuiz"></Button>
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
:deep(.p-card-content) {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

</style>