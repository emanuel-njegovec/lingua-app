<template>
    <div class="container">
        <Card v-if="question">
            <template #content>
                <Image :src="question.image_url" width="400"></Image>
                <h2>
                    <span v-for="(word, index) in text_split" :key="index">
                        <InputText v-if="word === answer" />
                        <span v-else>{{ word }}</span>
                        <span v-if="index < text_split.length - 1">&nbsp;</span>
                    </span>
                </h2>
            </template>    
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import { ref, defineProps } from 'vue';
import Image from 'primevue/image';

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const text_split = props.question.question_text.split(' ');
const answer = ref(props.question.correct_ans);

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