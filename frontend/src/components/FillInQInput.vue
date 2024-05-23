<template>
    <div class="container">
        <FileUpload mode="basic" auto="true" name="photo" :url="uploadUrl" customUpload @uploader="uploadHandler" withCredentials @upload="onUpload" accept="image/*" :maxFileSize="1000000">
        </FileUpload>
        <Image v-if="imageUrl" :src="imageUrl" width="400"/>
        <FloatLabel>
            <Chips id="qtext" v-model="input" separator=" ">
                <template #chip="slotProps">
                    <div @click="setCorrectAnswer">
                        <span>{{ slotProps.value }}</span>
                    </div>
                </template>
            </Chips>
            <label for="qtext">Pitanje</label>
        </FloatLabel>
        
        <FloatLabel>
            <InputText id="correct-ans" v-model="questionData.correct_ans" @input="handleInputChange" />
            <label for="correct-ans">Točan odgovor</label>
        </FloatLabel>
        <FloatLabel>
            <InputText id="hint" v-model="questionData.ans_hint" @input="handleInputChange" />
            <label for="hint">Pomoć</label>
        </FloatLabel>
        <Button icon="pi pi-save" @click="saveQuestion"></Button>
    </div>
</template>

<script setup>
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import Button from 'primevue/button';
import Chips from 'primevue/chips';
import { ref, defineProps, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { API_URL } from '@/config';

const route = useRoute();
const param = route.params.question_id;

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const input = ref([]);

const router = useRouter();

const uploadUrl = `${API_URL}/api/upload-image/${router.currentRoute.value.params.question_id}`;

const questionData = ref({
    question_text: '',
    correct_ans: '',
    ans_hint: '',
    q_type: ''
});

const imageUrl = ref('');

watch(input, (newVal) => {
    console.log('Chip changed', newVal);
    questionData.value.question_text = newVal.join(' ');
    if (!newVal.includes(questionData.value.correct_ans)) {
        questionData.value.correct_ans = '';
    }
    handleInputChange();
});

const setCorrectAnswer = (event) => {
    questionData.value.correct_ans = event.target.innerText;
    handleInputChange();
};

const saveQuestion = async () => {
    await axios.put(`http://localhost:3000/api/update-question/${param}`, questionData.value, { withCredentials: true });
    router.go(-1);
};

onMounted(() => {
    questionData.value.question_text = props.question[0].question_text;
    questionData.value.correct_ans = props.question[0].correct_ans;
    questionData.value.ans_hint = props.question[0].ans_hint;
    questionData.value.q_type = props.question[0].q_type;
    imageUrl.value = props.question[0].image_url;
    input.value = props.question[0].question_text.split(' ');
    console.log(props);
});

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
};

const onUpload = (event) => {
    console.log('File uploaded successfully', event);
};

let saveTimeout;

const handleInputChange = () => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    
    }
    saveTimeout = setTimeout(async () => {
        try {
            console.log(questionData.value);
            await axios.put(`http://localhost:3000/api/update-question/${param}`, questionData.value, { withCredentials: true });
        } catch (error) {
            console.error(error);
        }
    }, 1000);
};


</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

</style>