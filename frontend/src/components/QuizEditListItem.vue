<template>
    <Card v-if="quiz">
        <template #title>
            {{ quiz.quiz_name }}
        </template>
        <template #content>
            <p>{{ quiz.description }}</p>
            <Button aria-label="Edit" @click="getQuiz">Edit</Button>
            <Button aria-label="Stats" @click="showStats = true">Show stats</Button>
            <Button aria-label="Delete" @click="deleteQuiz">Delete</Button>
            <Dialog header="Quiz stats" v-model:visible="showStats" modal="true" :style="{ width: '800px' }">
                <Chart type="line" :data="data" />
                <p>Prosječno vrijeme rješavanja kviza: {{ average_time_spent }}s</p>
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
                        label: 'Score',
                        data: temp.map(item => item.totalAccuracy),
                        fill: false,
                        borderColor: '#42A5F5'
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
        emit('remove', props.quiz.quiz_id);
    } catch (error) {
        console.error(error);
    }
}

</script>

<style scoped>
.p-card {
    background-color: #1D3557;
    color: aliceblue;
}


</style>