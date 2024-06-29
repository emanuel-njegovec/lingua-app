<template>
    <Card v-if="quiz">
        <template #content>
            <div class="quiz-item-content">
                <h2>{{ quiz.quiz_name }}</h2>
                <p>{{ quiz.description }}</p>
                <p>Posljednji rezultat: {{ quiz.correct_answers }} / {{ quiz.correct_answers + quiz.incorrect_answers }}</p>
                <p>Posljednje rješavano: {{ formatDate(quiz.started_at) }}</p>
            </div>
            <div class="quiz-item-buttons">
                <Button label="Pokreni ponovno" @click="playQuiz"></Button>
                <Button label="Više informacija" @click="displayInfo = true"></Button>
            </div>
            
            <Dialog v-model:visible="displayInfo" modal draggable="false" header="History" @hide="displayInfo = false" :style="{ width: '900px' }">
                <DataTable :value="history" :sortField="'started_at'" :sortOrder="-1">
                    <Column field="started_at" header="Započeto" :sortable="true"></Column>
                    <Column field="completed_at" header="Završeno"></Column>
                    <Column field="correct_answers" header="Točni odgovori"></Column>
                    <Column field="incorrect_answers" header="Netočni odgovori"></Column>
                    <Column field="score" header="Rezultat" :sortable="true"></Column>
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
import { formatDate } from '@/utils';

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

.p-card-title {
    display: none;
}
:deep(.p-card-content) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;

}
.quiz-item-content {
    flex: 3;
}
.quiz-item-buttons {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    flex: 1;
    margin-left: 10px;
}


</style>