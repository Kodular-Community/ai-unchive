<script setup lang="ts">
import { AIProject } from "aia-kit/ai_project.js";
import { parseAiBoolean, parseAiColor } from "aia-kit/utils/utils.js";
import ColorView from './ColorView.vue';
import * as R from "remeda";
import { getPackageName } from "../utils";
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";

const props = defineProps<{ project: AIProject }>();

const project = props.project;

const COLORS = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#5e35b1'];

const data = computed(() => {
  const totalBlocks = R.sum(project.screens.map((s) => (s.blocks?.match(/<\/block>/g) ?? []).length))
  const blocksPerScreen = project.screens.map(s => ({
    name: s.name,
    value: (s.blocks?.match(/<\/block>/g) ?? []).length
  }))

  const avgBlocksPerScreen = R.sum(blocksPerScreen.map(R.prop('value'))) / blocksPerScreen.length

  const totalAssets = project.assets.length
  const assetsPerType = R.groupBy(project.assets, R.prop('type'))

  const totalExtensions = project.extensions.length

  return {
    totalBlocks,
    blocksPerScreen,
    avgBlocksPerScreen,
    totalAssets,
    assetsPerType,
    totalExtensions,
  }
})

function parseProperty(value: string) {
  if (['True', 'False'].includes(value)) {
    return { type: 'boolean', value: parseAiBoolean(value) }
  }
  if (!Number.isNaN(Number.parseFloat(value))) {
    return { type: 'number', value: parseFloat(value) }
  }
  if (value.startsWith('&H')) {
    return { type: 'color', value: parseAiColor(value) }
  }
  return { type: 'text', value }
}

const projectProperties = Object.entries(project.properties).map(([k, v]) => ({
  name: k,
  ...parseProperty(v)
}))

const chartOptions = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true
      }
    },
  }
}
</script>

<template>
  <div class="flex">

    <div class="flex flex-col gap-4 p-4">
      <div>
        <img src="/logo.png" style="height: 64px" />
        <p>Package name = {{ getPackageName(project) }}</p>
      </div>

      <template v-for="property in projectProperties">
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
          <el-input id="property.name" v-model="property.value" readOnly />
        </div>
      </template>
    </div>

    <div class="flex-1 flex flex-col items-center gap-4 p-4">
      <div class="flex justify-around w-full">
        <el-statistic title="Total blocks" :value="data.totalBlocks" />
        <el-statistic title="Avg blocks per screen" :value="data.avgBlocksPerScreen" />
        <el-statistic title="Total assets" :value="data.totalAssets" />
        <el-statistic title="Total size of assets" :value="data.totalAssets" />
        <el-statistic title="Total extensions" :value="data.totalExtensions" />
      </div>

      <section>
        <p>% of blocks by screen</p>
        <Doughnut :options="chartOptions" :data="{
          labels: data.blocksPerScreen.map(R.prop('name')),
          datasets: [{
            data: data.blocksPerScreen.map(d => 100 * d.value / data.totalBlocks),
            backgroundColor: COLORS,
          }]
        }" />
      </section>

      <section>
        <p>% of assets by type</p>
        <Doughnut :options="chartOptions" :data="{
          labels: Object.keys(data.assetsPerType),
          datasets: [{
            data: Object.values(data.assetsPerType).map(d => 100 * d.length / data.totalAssets),
            backgroundColor: COLORS,
          }]
        }" />
      </section>

    </div>
  </div>
</template>
