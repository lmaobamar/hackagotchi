type SpeechCollection = string[] & {
	getRandom(): string;
};

const theactualspeeches: string[] = [
	"I'm a dinosaur. Did you know?",
	"All hail Prophet Orpheus",
	"Can I autoapprove some npm scripts for you?",
	"You don't need these! Just keep your streak...",
];

const speeches: SpeechCollection = Object.assign(theactualspeeches, {
	getRandom(this: string[]): string {
		return this[Math.floor(Math.random() * this.length)] || "FAIL";
	},
});

export default speeches;
