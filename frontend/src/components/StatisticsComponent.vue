<template>
    <div>
        <Chart type="line" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Chart from 'primevue/chart';
//import { useLanguageStore } from '@/store';
import { API_URL } from '@/config';
import { useLanguageStore } from '@/store';

const languageStore = useLanguageStore();

const chartData = ref([]);


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

onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/stats/user-quiz-results-all/${languageStore.language}`, { withCredentials: true });
        const temp = prepareChartData(response.data);
        temp.sort((a, b) => new Date(a.date) - new Date(b.date));
        chartData.value = {
            labels: temp.map(item => item.date),
            datasets: [
                {
                    label: 'Rezultat',
                    data: temp.map(item => item.totalAccuracy),
                    fill: false,
                    borderColor: '#42A5F5',
                    tension: 0.3
                }
            ]
        };
        console.log(chartData);
        //console.log(response.data);
    } catch (error) {
        console.error(error);
    }
});

</script>