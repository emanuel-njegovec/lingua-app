<template>
    <Card v-if="quiz">
        <template #content>
            <div class="list-item-content">
                <h2>{{ quiz.quiz_name }}</h2>
                <p>{{ quiz.description }}</p>
            </div>
            <div class="list-item-btns">
                <Button label="Uredi" @click="getQuiz"></Button>
                <Button label="Pregled statistike" @click="showStats = true"></Button>
                <Button label="Obriši" severity="danger" @click="deleteDialog = true"></Button>
            </div>
            <Dialog header="Obrisati kviz?" v-model:visible="deleteDialog" modal="true">
                <p>Jesti li sigurni da želite obrisati kviz?</p>
                <div class="p-fluid">
                    <div class="p-field">
                        <Button label="Da" @click="deleteQuiz" />
                        <Button label="Ne" @click="deleteDialog = false" />
                    </div>
                </div>
            </Dialog>
            <Dialog header="Statistika kviza" v-model:visible="showStats" modal="true" :style="{ width: '800px' }">
                <Chart type="line" :data="data" />
                <p>Prosječno vrijeme rješavanja kviza: {{ average_time_spent.toFixed(1) }}s</p>
            </Dialog>
        </template>    
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Chart from 'primevue/chart';
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';

const router = useRouter();

const props = defineProps({
    quiz: Object
});
const emit = defineEmits(['remove']);

const data = ref([]);

const average_time_spent = ref(0);

const getQuiz = () => {
    router.push('/manage-quizzes/' + props.quiz.quiz_id);
}


const showStats = ref(false);
const deleteDialog = ref(false);

const prepareChartData = (data) => {
    const groupedByDate = data.reduce((acc, curr) => {
        const date = curr.completed_at.split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
    }, {});

    const chartData = Object.entries(groupedByDate).map(([date, results]) => {
        const totalAccuracy = results.reduce((acc, curr) => acc + parseFloat(curr.correct_answers / (curr.correct_answers + curr.incorrect_answers)), 0) / results.length;
        return { date, totalAccuracy };
    });

    return chartData;
}

watch(showStats, async (value) => {
    if (value) {
        try {
            const response = await axios.get(`${API_URL}/stats/quiz/${props.quiz.quiz_id}`, { withCredentials: true });
            const temp = prepareChartData(response.data);
            average_time_spent.value = response.data.reduce((acc, curr) => acc + (new Date(curr.completed_at) - new Date(curr.started_at)), 0) / response.data.length / 1000;
            temp.sort((a, b) => new Date(a.date) - new Date(b.date));
            data.value = {
                labels: temp.map(item => item.date),
                datasets: [
                    {
                        label: 'Prosječan rezultat korisnika',
                        data: temp.map(item => item.totalAccuracy),
                        fill: false,
                        borderColor: '#42A5F5',
                        tension: 0.3
                    }
                ]
            };
            console.log(data.value);
        } catch (error) {
            console.error(error);
        }
    }
});

const deleteQuiz = async () => {
    try {
        await axios.delete(`${API_URL}/quiz/${props.quiz.quiz_id}`, { withCredentials: true });
        deleteDialog.value = false;
        emit('remove', props.quiz.quiz_id);
    } catch (error) {
        console.error(error);
    }
}

</script>

<style scoped>
.list-item-btns {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
}
.list-item-content {
    flex: 3;
}
:deep(.p-card-content) {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 1rem;
}
.p-field {
    display: flex;
    gap: 1rem;
}
</style>