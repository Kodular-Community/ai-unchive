import { Center, Loader, Tabs } from '@mantine/core';
import { useQuery } from "@tanstack/react-query";
import { AIAReader } from "aia-kit";
import { IconDeviceMobile, IconIcons, IconPuzzle } from "@tabler/icons-react";
import { ScreenTab } from "./components/ScreenTab.js";
import { ExtensionsTab } from "./components/ExtensionsTab.js";
import { AssetsTab } from "./components/AssetsTab.js";
import { OverviewTab } from "./components/OverviewTab.js";
import { ProjectContext } from './hooks/useProject.js';

export function Explorer({ file }: { file: File }) {

  const { status, data: project, error } = useQuery({
    queryKey: [file.name, 'project'],
    queryFn: () => AIAReader.parse(file)
  })

  if (status === 'pending') {
    return <Center h="calc(100dvh - var(--app-shell-header-height))"><Loader /></Center>
  }

  if (status === 'error') {
    return <pre>{JSON.stringify(error, null, 2)}</pre>
  }

  return (
    <ProjectContext value={project}>
      <Tabs defaultValue="overview" keepMounted>
        <Tabs.List>
          <Tabs.Tab value="overview"><b>{project.name}</b></Tabs.Tab>
          <Tabs.Tab value="assets"
            leftSection={<IconIcons size='1.2rem' stroke={1.5} />}>
            Assets
          </Tabs.Tab>
          <Tabs.Tab value="extensions"
            leftSection={<IconPuzzle size='1.2rem' stroke={1.5} />}>
            Extensions
          </Tabs.Tab>
          {
            project.screens.map((screen) => (
              <Tabs.Tab key={screen.name} value={screen.name}
                leftSection={<IconDeviceMobile size='1.2rem' stroke={1.5} />}>
                {screen.name}
              </Tabs.Tab>
            ))
          }
        </Tabs.List>
        <Tabs.Panel value="overview">
          <OverviewTab project={project} />
        </Tabs.Panel>
        <Tabs.Panel value="assets">
          <AssetsTab assets={project.assets} />
        </Tabs.Panel>
        <Tabs.Panel value="extensions">
          <ExtensionsTab exts={project.extensions} />
        </Tabs.Panel>
        {
          project.screens.map((screen) => (
            <Tabs.Panel key={screen.name} value={screen.name}>
              <ScreenTab screen={screen} />
            </Tabs.Panel>
          ))
        }
      </Tabs>
    </ProjectContext>
  )
}
