<template>
    <div class="container">
        <Card v-if="question">
            <template #content>
                <Image :src="question.image_url" width="400"></Image>
                <h2>{{ question.question_text }}</h2>
                <InputText></InputText>
            </template>    
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import { defineProps } from 'vue';
import Image from 'primevue/image';

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

</script>

<style scoped>
.p-card {
    background-color: #1D3557;
    color: aliceblue;
    margin-left: 10px;
    margin-right: 10px;
    height: 100%;
}
.container {
    height: 50vh;
}

</style>