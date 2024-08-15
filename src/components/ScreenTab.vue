<script setup lang="ts">
import LayoutPanel from "./LayoutPanel.vue";
import PropertiesPanel from "./PropertiesPanel.vue";
import BlocksPanel from "./BlocksPanel.vue";
import { ref } from "vue";
import { AIScreen } from "aia-kit/ai_screen.js";
import { AIComponent } from "aia-kit/ai_component.js";

const props = defineProps<{ screen: AIScreen }>();

const selectedComponent = ref(props.screen.form);

function onComponentSelected(component: AIComponent) {
    selectedComponent.value = component;
}

</script>

<template>
    <div class="flex">
        <LayoutPanel :form="$props.screen.form" @componentSelected="onComponentSelected" />
        <PropertiesPanel :component="selectedComponent" />
        <BlocksPanel :blocksXml="$props.screen.blocks" />
    </div>
</template>