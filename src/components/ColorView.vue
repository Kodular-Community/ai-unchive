<script setup lang="ts">
defineProps<{ color: string }>();
</script>

<template>
    <div class="flex items-center gap-2">
        <span class="colorview" :style="{ backgroundColor: $props.color }"></span>
        <span>{{ $props.color }}</span>
    </div>
</template>

<style scoped>
.colorview {
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    outline: 2px solid #5557;
}
</style>