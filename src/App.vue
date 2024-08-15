<script setup lang="ts">
import { ref } from 'vue';

import { IconBrandGithub, IconUpload } from "@tabler/icons-vue";

import Explorer from './Explorer.vue';
import { AIAReader } from 'aia-kit'
import { AIProject } from 'aia-kit/ai_project.js';
import { UploadFile, UploadProps } from 'element-plus';

const uploadedFile = ref<UploadFile | null>(null);
const project = ref<AIProject | null>(null);

const handleUpload: UploadProps['onChange'] = async (uploadFile) => {
  if (!uploadFile.raw) return;
  uploadedFile.value = uploadFile;
  project.value = await AIAReader.read(uploadFile.raw);
  document.title = `${uploadFile.name} - Unchive`;
}
</script>

<template>
  <el-container>
    <el-header class="border-b flex justify-between items-center x*:flex-1 justify-items-center">
      <div>
        <el-button link tag="a" href="/" style="text-decoration: none;">
          <span class="gradient-text">
            Unchive
          </span>
        </el-button>
      </div>

      <div>
        {{ uploadedFile?.name }}
      </div>

      <div>
        <el-button tag="a" href="https://github.com/Kodular/ai-unchive" target="_blank" :icon="IconBrandGithub" />
      </div>
    </el-header>

    <el-main class="p-0">
      <template v-if="project">
        <Explorer :project="project" />
      </template>
      <div v-else class="flex justify-center items-center" style="height: calc(100vh - 60px);">
        <el-upload drag accept=".aia" :auto-upload="false" :on-change="handleUpload">
          <el-icon class="el-icon--upload">
            <IconUpload />
          </el-icon>
          <div class="el-upload__text">
            Drop here your AIA file or <em>click to upload</em>
          </div>
        </el-upload>
      </div>
    </el-main>
  </el-container>
</template>

<style>
body {
  margin: 0;
  max-height: 100dvh;
  font-family: 'Inter Variable', sans-serif;
}

.gradient-text {
  background: linear-gradient(90deg, #f71dc1 0%, #fda000 100%);
  background-clip: text;
  color: transparent;

  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 2px;
}
</style>