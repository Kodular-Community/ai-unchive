import {
	Badge,
	Checkbox,
	ColorInput,
	Divider,
	Group,
	NumberInput,
	ScrollArea,
	Stack,
	TextInput,
} from "@mantine/core";
import type { Component } from "aia-kit";
import type { ComponentPropertyEditor } from "aia-kit/types.js";
import { parseAiBoolean, parseAiColor } from "aia-kit/utils/utils.js";

export function PropertiesPanel({ component }: { component: Component }) {
	return (
		<div>
			<Group justify="apart" gap="xs" style={{ padding: "8px 4px" }}>
				<b>{component.name}</b>
				<div>properties</div>
				<Badge>{component.type}</Badge>
			</Group>
			<Divider />
			<ScrollArea
				offsetScrollbars
				scrollbarSize={6}
				scrollHideDelay={300}
				styles={{
					viewport: {
						height: "calc(100dvh - var(--app-shell-header-height) - 85px)",
					},
				}}
			>
				<Stack gap="xs">
					{component.properties.map((property) => (
						<RenderPropertyEditor property={property} key={property.name} />
					))}
				</Stack>
			</ScrollArea>
		</div>
	);
}

function RenderPropertyEditor({
	property,
}: { property: ComponentPropertyEditor }) {
	if (!property.editorType) return null;

	if (["boolean", "visibility"].includes(property.editorType)) {
		return (
			<Checkbox
				label={property.name}
				checked={parseAiBoolean(property.value)}
				readOnly
				size="xs"
			/>
		);
	}
	if (property.editorType === "float") {
		return (
			<NumberInput
				label={property.name}
				value={Number.parseFloat(property.value)}
				readOnly
				size="xs"
			/>
		);
	}
	if (property.editorType === "color" || property.value.startsWith("&H")) {
		return (
			<ColorInput
				label={property.name}
				value={parseAiColor(property.value)}
				readOnly
				size="xs"
			/>
		);
	}
	return (
		<TextInput
			label={property.name}
			value={property.value}
			readOnly
			size="xs"
		/>
	);
}
