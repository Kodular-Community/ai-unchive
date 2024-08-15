<script setup lang="ts">
import { AIExtension } from "aia-kit/ai_extension.js";

defineProps<{ exts: AIExtension[] }>();
</script>

<template>
  <el-table :data="$props.exts" scrollable scrollHeight="flex" tableStyle="min-width: 50rem">
    <el-table-column prop="name" label="Type" sortable />
    <el-table-column prop="descriptorJSON.name" label="Name" sortable />
    <el-table-column prop="descriptorJSON.version" label="Version" sortable />
    <el-table-column prop="descriptorJSON.helpString" label="Description" />
    <el-table-column prop="descriptorJSON.iconName" label="Icon" />
  </el-table>
</template>
