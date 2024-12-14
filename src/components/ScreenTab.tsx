import type {Screen} from "aia-kit";
import {useState} from "react";
import {Container, Grid} from "@mantine/core";
import {LayoutPanel} from "./LayoutPanel.js";
import {PropertiesPanel} from "./PropertiesPanel.js";
import {BlocksPanel} from "./BlocksPanel.js";

export function ScreenTab({screen}: { screen: Screen }) {
    const [selected, setSelected] = useState(screen.form)
    return (
        <Container fluid>
            <Grid>
                <Grid.Col span={3}>
                    <LayoutPanel form={screen.form} selected={selected} setSelected={setSelected}/>
                </Grid.Col>
                <Grid.Col span={3}>
                    <PropertiesPanel component={selected}/>
                </Grid.Col>
                <Grid.Col span={6}>
                    <BlocksPanel blocksXml={screen.blocks}/>
                </Grid.Col>
            </Grid>
        </Container>
    )
}
