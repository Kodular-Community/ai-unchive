<script setup lang="ts">
import { AIComponent } from "aia-kit/ai_component.js";
import { ElTree } from "element-plus";
import { FilterNodeMethodFunction } from "element-plus/es/components/tree/src/tree.type.mjs";
import { computed, ref, watch } from "vue";

const props = defineProps<{ form: AIComponent }>();

const emit = defineEmits<{
  componentSelected: [component: AIComponent]
}>()

const visibility = ref("All");

type Tree = {
  key: string;
  label: string;
  children: Tree[];
  componentRef: AIComponent;
}

function componentToTreeNode(component: AIComponent): Tree | null {
  if (component.type !== 'Form') {
    if (visibility.value === 'Visible' && !component.visible) {
      return null
    }

    if (visibility.value === 'Non-Visible' && component.visible) {
      return null
    }
  }
  return {
    key: component.name,
    label: component.name,
    children: component.children.map(componentToTreeNode).filter(n => !!n),
    componentRef: component,
  };
}

const nodes = computed(() => [componentToTreeNode(props.form)]);

function onNodeSelect(node: Tree) {
  emit('componentSelected', node.componentRef);
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode: FilterNodeMethodFunction = (value, data) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}
</script>

<template>
  <div class="flex flex-col gap-2 p-4 w-80">
    <el-radio-group v-model="visibility" class="self-stretch">
      <el-radio-button label="All" value="All" />
      <el-radio-button label="Visible" value="Visible" />
      <el-radio-button label="Non-Visible" value="Non-Visible" />
    </el-radio-group>
    <el-input v-model="filterText" placeholder="Filter keyword" />
    <el-tree ref="treeRef" :data="nodes" node-key="key" :default-expanded-keys="[$props.form.name]"
      :filter-node-method="filterNode" @node-click="onNodeSelect" />
  </div>
</template>
