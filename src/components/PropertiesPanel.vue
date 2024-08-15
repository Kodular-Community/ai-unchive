<script setup lang="ts">
import { AIComponent } from "aia-kit/ai_component.js";
import { ComponentPropertyEditor } from "aia-kit/types.js";
import { parseAiBoolean, parseAiColor } from "aia-kit/utils/utils.js";
import ColorView from './ColorView.vue';
import { computed } from 'vue';

const props = defineProps<{ component: AIComponent }>();

function parseProperty(property: ComponentPropertyEditor): { type: 'text' | 'color' | 'number' | 'boolean', value: string | number | boolean, name: string } {
  if (['boolean', 'visibility'].includes(property.editorType!)) {
    return { type: 'boolean', value: parseAiBoolean(property.value), name: property.name }
  }
  if (property.editorType === 'float') {
    return { type: 'number', value: parseFloat(property.value), name: property.name }
  }
  if (property.editorType === 'color' || property.value.startsWith('&H')) {
    return { type: 'color', value: parseAiColor(property.value), name: property.name }
  }
  return { type: 'text', value: property.value, name: property.name }
}

const componentProperties = computed(() => props.component.properties.map(parseProperty))
</script>

<template>
  <div class="flex flex-col gap-4 p-4 w-80">
    <div>
      <p>{{ props.component.name }}</p>
      <p>{{ props.component.type }}</p>
    </div>

    <template v-for="property in componentProperties">
      <div v-if="property.type === 'boolean'" class="flex justify-between items-center">
        <label :for="property.name">{{ property.name }}</label>
        <el-switch :inputId="property.name" v-model="property.value" readOnly />
      </div>
      <div v-else-if="property.type === 'number'" class="flex flex-col">
        <label :for="property.name">{{ property.name }}</label>
        <el-input :inputId="property.name" v-model="property.value" readOnly />
      </div>
      <div v-else-if="property.type === 'color'" class="flex flex-col">
        <label :for="property.name">{{ property.name }}</label>
        <ColorView :color="property.value" />
      </div>
      <div v-else-if="property.type === 'text'" class="flex flex-col">
        <label :for="property.name">{{ property.name }}</label>
        <el-input type="textarea" autosize :inputId="property.name" v-model="property.value" readOnly />
      </div>
    </template>
  </div>
</template>
