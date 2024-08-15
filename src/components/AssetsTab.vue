<script setup lang="ts">
import { AIAsset } from "aia-kit/ai_asset.js";
import prettyBytes from "pretty-bytes";
import * as R from "remeda";
import { IconDownload, IconEye } from "@tabler/icons-vue";

defineProps<{ assets: AIAsset[] }>();
</script>

<template>
  <el-table :data="$props.assets" scrollable scrollHeight="flex" tableStyle="min-width: 50rem">
    <el-table-column prop="name" label="Name" sortable />
    <el-table-column prop="type" label="Type" sortable />
    <el-table-column prop="size" :label="`Size (${prettyBytes(R.sum($props.assets.map(it => it.size)))})`" sortable>
      <template #default="{ row }">
        {{ prettyBytes(row.size) }}
      </template>
    </el-table-column>
    <el-table-column label="Download Asset">
      <template #default="{ row }">
        <el-popover v-if="['png', 'jpg'].includes(row.type)">
          <template #reference>
            <el-button :icon="IconEye" />
          </template>
          <img :src="row.getURL()" style="max-width: 100%" />
        </el-popover>
        <el-button tag="a" :href="row.getURL()" target="_blank" :icon="IconDownload" />
      </template>
    </el-table-column>
  </el-table>
</template>