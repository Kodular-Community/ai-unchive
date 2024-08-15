<script setup lang="ts">
import { Icon123, IconDeviceMobile, IconIcons, IconPuzzle } from "@tabler/icons-vue";
import ScreenTab from "./components/ScreenTab.vue";
import ExtensionsTab from "./components/ExtensionsTab.vue";
import AssetsTab from "./components/AssetsTab.vue";
import OverviewTab from "./components/OverviewTab.vue";

import { ref } from 'vue';
import { AIProject } from "aia-kit/ai_project.js";
import { AIScreen } from 'aia-kit/ai_screen.js';

const props = defineProps<{ project: AIProject }>();

const activeTab = ref('overview');
const selectedScreen = ref<AIScreen | null>(null);

const onMenuSelect = (index: string) => {
    if (index === 'overview' || index === 'assets' || index === 'extensions') {
        activeTab.value = index;
    } else {
        activeTab.value = 'screen';
        selectedScreen.value = props.project.screens.find(screen => screen.name === index)!;
    }
}
</script>

<template>
    <el-container style="height: calc(100vh - 60px)">
        <el-aside>
            <el-menu @select="onMenuSelect">
                <el-menu-item index="overview">
                    <el-icon>
                        <Icon123 />
                    </el-icon>
                    Project
                </el-menu-item>
                <el-menu-item index="assets">
                    <el-icon>
                        <IconIcons />
                    </el-icon>
                    Assets
                </el-menu-item>
                <el-menu-item index="extensions">
                    <el-icon>
                        <IconPuzzle />
                    </el-icon>
                    Extensions
                </el-menu-item>
                <el-sub-menu index="screens">
                    <template #title>
                        <el-icon>
                            <IconDeviceMobile />
                        </el-icon>
                        Screens
                    </template>
                    <el-menu-item v-for="screen in project.screens" :key="screen.name" :index="screen.name">
                        {{ screen.name }}
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>

        <el-main class="p-0">
            <template v-if="activeTab === 'overview'">
                <OverviewTab :project="project" />
            </template>
            <template v-else-if="activeTab === 'assets'">
                <AssetsTab :assets="project.assets" />
            </template>
            <template v-else-if="activeTab === 'extensions'">
                <ExtensionsTab :exts="project.extensions" />
            </template>
            <template v-else-if="activeTab === 'screen'">
                <ScreenTab :screen="selectedScreen" />
            </template>
        </el-main>
    </el-container>
</template>
