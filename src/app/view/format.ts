export function meter(label: string, value: number): string {
	const filled = Math.max(0, Math.min(10, Math.round(value / 10)));
	return `${label.padEnd(10)} ${"●".repeat(filled)}${"○".repeat(10 - filled)} ${String(value).padStart(3)}%`;
}
