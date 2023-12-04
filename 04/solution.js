const fs = require("fs");
const path = require("path");

console.log(part1());
console.log(part2());

function part1() {
	const rounds = parseInput();

	let totalPoints = 0;
	for (const { won } of rounds) {
		if (won) {
			totalPoints += 2 ** (won - 1);
		}
	}
	return totalPoints;
}

function part2() {
	const rounds = parseInput();

	/** @type {Map<number, number>} */
	const cardsPlayed = new Map(rounds.map((r) => [r.card, 1]));
	let totalCards = 0;
	for (const { card, won } of rounds) {
		const thisCount = cardsPlayed.get(card) ?? 1;

		if (won) {
			// add won cards
			const maxCard = Math.min(rounds.length, card + won)
			for (let next = card + 1; next <= maxCard; next++) {
				const nextCount = cardsPlayed.get(next) ?? 0;
				cardsPlayed.set(next, nextCount + thisCount);
			}
		}
		
		totalCards += cardsPlayed.get(card) ?? 0;
	}

	return totalCards;
}

function parseInput() {
	const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
	const lines = input.split("\n");

	/** @type {Array<{ card: number, won: number }>} */
	const rounds = [];

	let card = 0;
	for (const line of lines) {
		card++;
		const parts = line.replace(/.*:/, "").split(" | ");
		const winners = new Set(getNumbers(parts[0]));
		const played = new Set(getNumbers(parts[1]));

		const won = [...winners].filter((n) => played.has(n));

		rounds.push({ card, won: won.length });
	}
	return rounds;
}

/**
 * @param {string} input
 */
function getNumbers(input) {
	const numbers = input.match(/(\d+)\b\D*/g);
	if (numbers) {
		return numbers.map((n) => Number(n));
	}
	return [];
}
