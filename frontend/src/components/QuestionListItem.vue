<template>
    <Card v-if="question">
        <template #title>
            {{ question.question_text }}
        </template>
        <template #content>
            <p>{{ question.correct_ans }}</p>
            <Button icon="pi pi-pencil" aria-label="Edit"></Button>
            <Button icon="pi pi-trash" aria-label="Delete"></Button>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { defineProps } from 'vue';

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

</script>

<style scoped>
.p-card {
    background-color: #1D3557;
    color: aliceblue;
}

</style>