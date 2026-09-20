export function getEpochDay(date: Date = new Date()): number {
	return Math.floor(date.getTime() / 86400000);
}

function hashString(str: string): number {
	let hash = 0x811c9dc5;
	for (let i = 0; i < str.length; i++) {
		hash ^= str.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return hash >>> 0;
}

export function createPRNG(
	seed: number = getEpochDay(),
	entropy?: string,
): () => number {
	let internalSeed = seed;
	if (entropy) {
		const entropyHash = hashString(entropy);
		internalSeed = (internalSeed ^ Math.imul(entropyHash, 0x9e3779b9)) >>> 0;
	}

	return () => {
		let t = (internalSeed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
