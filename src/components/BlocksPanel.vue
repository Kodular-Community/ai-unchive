<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { getDescriptor } from "aia-kit/utils/utils.js";

const props = defineProps<{ blocksXml: string }>()

const totalBlocks = computed(() => props.blocksXml.match(/<\/block>/g)?.length ?? 'failed')

const renderMode = ref('Blocks')
const blocklyDivRef = ref<HTMLElement | null>(null)
const wsRef = ref(null)

watchEffect(() => {
  if (blocklyDivRef.value === null) {
    return
  }

  if (!wsRef.value) {
    const ws = Blockly.inject(blocklyDivRef.value, {
      readOnly: true,
      trashcan: false,
      toolbox: false,
      scrollbars: true,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      // zoom: {
      //     controls: true,
      //     // wheel: true,
      //     startScale: 1.0,
      //     maxScale: 3,
      //     minScale: 0.3,
      //     scaleSpeed: 1.2,
      //     pinch: true,
      // },
    });

    ws.getDescriptor = getDescriptor

    wsRef.value = ws
  }

  wsRef.value?.clear()
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(props.blocksXml), wsRef.value)
})

</script>

<template>
  <div class="flex flex-col gap-2 p-4 flex-1">
    <el-radio-group v-model="renderMode">
      <el-radio-button :label="`Blocks (${totalBlocks})`" value="Blocks" />
      <el-radio-button label="Raw" value="Raw" />
    </el-radio-group>
    <div v-if="renderMode === 'Blocks'" ref="blocklyDivRef" style="height: 100%; width: 100%"></div>
    <pre v-else>{{ $props.blocksXml }}</pre>
  </div>
</template>
