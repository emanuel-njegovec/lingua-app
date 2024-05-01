<template>
    <div class="container">
        <Dropdown optionLabel="name" placeholder="Select a language" />
    </div>
</template>

<script setup>
import Dropdown from 'primevue/dropdown';

</script>

<style scoped>

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1D3557;
    border-bottom: 1px solid #e9ecef;
    height: 60px;
}
</style>