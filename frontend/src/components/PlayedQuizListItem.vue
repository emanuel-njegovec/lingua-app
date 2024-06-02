<template>
    <Card v-if="quiz">
        <template #title>
            {{ quiz.quiz_name }}
        </template>
        <template #content>
            <p>{{ quiz.description }}</p>
            <Button aria-label="Start" @click="playQuiz">Play again</Button>
            <Button aria-label="Info" @click="displayInfo = true">View more info</Button>
            <p>Last played at: {{ formatDate(quiz.started_at) }}</p>
            <p>Last score: {{ quiz.correct_answers }} / {{ quiz.correct_answers + quiz.incorrect_answers }}</p>
            
            <Dialog v-model:visible="displayInfo" modal draggable="false" header="History" @hide="displayInfo = false" :style="{ width: '900px' }">
                <DataTable :value="history" :sortField="'started_at'" :sortOrder="-1">
                    <Column field="started_at" header="Started at" :sortable="true"></Column>
                    <Column field="completed_at" header="Completed at"></Column>
                    <Column field="correct_answers" header="Correct answers"></Column>
                    <Column field="incorrect_answers" header="Incorrect answers"></Column>
                    <Column field="score" header="Score" :sortable="true"></Column>
                </DataTable>
            </Dialog>
        
        </template>

    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, defineProps, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';

const router = useRouter();

const props = defineProps({
    quiz: Object
});

const displayInfo = ref(false);

const history = ref([]);

watch(displayInfo, (value) => {
    if (value) {
        handleDialogOpen();
    }
});

//eslint-disable-next-line
const formatDate = (datetime) => {
    const date = new Date(datetime);
    const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toLocaleString('en-GB');
};

const handleDialogOpen = async () => {
    try {
        const response = await axios.get(`${API_URL}/stats/user-quiz-results/${props.quiz.quiz_id}`, { withCredentials: true });
        history.value = response.data.map(entry => ({
            ...entry,
            started_at: formatDate(entry.started_at),
            completed_at: formatDate(entry.completed_at),
            score: `${((entry.correct_answers / (entry.correct_answers + entry.incorrect_answers))*100).toFixed(1)}%`
        }));
        console.log(history.value);
    } catch (error) {
        console.error(error);
    
    }
}

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