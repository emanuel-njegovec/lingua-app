<template>
    <Card>
        <template #content>
            <FileUpload mode="basic" auto="true" name="photo" :url="uploadUrl" customUpload @uploader="uploadHandler" withCredentials @upload="onUpload" accept="image/*" :maxFileSize="1000000" chooseLabel="Dodaj sliku">
            </FileUpload>
            <Image v-if="imageUrl" :src="imageUrl" width="400"/>
            <FloatLabel>
                <Textarea id="qtext" v-model="questionData.question_text" @input="handleInputChange" autoResize rows="1"/>
                <label for="qtext">Pitanje</label>
            </FloatLabel>
            <FloatLabel>
                <Textarea id="correct-ans" v-model="questionData.correct_ans" @input="handleInputChange" autoResize rows="1"/>
                <label for="correct-ans">Točan odgovor</label>
            </FloatLabel>
            <Button @click="saveQuestion">Spremi</Button>
        </template>
    </Card>
</template>

<script setup>
import Textarea from 'primevue/textarea';
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import Button from 'primevue/button';
import { ref, defineProps, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { API_URL } from '@/config';

const route = useRoute();
const param = route.params.question_id;

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const router = useRouter();

const uploadUrl = `${API_URL}/question/upload-image/${router.currentRoute.value.params.question_id}`;

const questionData = ref({
    question_text: '',
    correct_ans: '',
    q_type: ''
});

const imageUrl = ref('');

const saveQuestion = async () => {
    router.go(-1);
}

onMounted(() => {
    questionData.value.question_text = props.question[0].question_text;
    questionData.value.correct_ans = props.question[0].correct_ans;
    questionData.value.q_type = props.question[0].q_type;
    imageUrl.value = props.question[0].image_url;
    console.log(props);
})

const uploadHandler = async ({ files }) => {
    const formData = new FormData();
    formData.append('photo', files[0]);
    console.log(files);
    try {
        const response = await axios.post(uploadUrl, formData, { withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response.data);
        imageUrl.value = response.data.imageUrl;
        console.log(imageUrl.value);
    } catch (error) {
        console.error(error);
    
    }
}

const onUpload = (event) => {
    console.log('File uploaded successfully', event);
}

let saveTimeout;

const handleInputChange = () => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    
    }
    saveTimeout = setTimeout(async () => {
        try {
            console.log(questionData.value);
            await axios.put(`${API_URL}/question/${param}`, questionData.value, { withCredentials: true });
        } catch (error) {
            console.error(error);
        }
    }, 1000);
}

</script>

<style scoped>
:deep(.p-card) {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}
:deep(.p-card-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 30px;
}¸
:deep(.p-inputtextarea) {
    width: 800px;
}

@media (min-width: 768px) {
    :deep(.p-card-content) {
        width: 800px;
    }
    :deep(.p-inputtextarea) {
        width: 500px;
    }
}

</style>