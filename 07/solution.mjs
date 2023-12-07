import fs, { read } from "fs";
import path from "path";
import url from "url";
import chalk from "chalk";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const HandType = {
	FiveOfAKind: 7,
	FourOfAKind: 6,
	FullHouse: 5,
	ThreeOfAKind: 4,
	TwoPair: 3,
	OnePair: 2,
	HighCard: 1,
};
const HandTypeId = Object.fromEntries(
	Object.entries(HandType).map(([k, v]) => [v, k])
);

console.log(chalk.bgGreen.black("Part 1:"), chalk.green(part1()));
console.log(chalk.bgGreen.black("Part 2:"), chalk.green(part2()));

function part1() {
	const players = readFile("input.txt");

	const cardStrength = [2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K", "A"].map(
		String
	);

	const sorted = sortHands(players
		.map((player) => ({ ...player, type: getHandType(player.cards) })),
		cardStrength)

	let totalWinnings = 0;
	for (let rank = 0; rank < sorted.length; rank++) {
		const player = sorted[rank];
		const winnings = player.bid * (rank + 1);
		totalWinnings += winnings;
	}
	return totalWinnings;
}

function part2() {
	const players = readFile("input.txt");

	const cardStrength = ["J", 2, 3, 4, 5, 6, 7, 8, 9, "T", "Q", "K", "A"].map(
		String
	);

	const sorted = sortHands(players
		.map((player) => ({ ...player, type: getBestHandType(player.cards) })),
		cardStrength)

	let totalWinnings = 0;
	for (let rank = 0; rank < sorted.length; rank++) {
		const player = sorted[rank];
		const winnings = player.bid * (rank + 1);
		totalWinnings += winnings;
	}
	return totalWinnings;
}

/** @typedef {{ cards: string[], bid: number }} Player */
function readFile(file = "input.txt") {
	const lines = fs.readFileSync(path.join(__dirname, file), "utf8").split(/\n/);

	/** @type {Array<Player>} */
	let players = [];
	for (const line of lines) {
		const match = line.match(/^([2-9AKQJT]+) (\d+)/);
		if (!match) {
			throw new Error(`Invalid input: ${line}`);
		}
		const cards = [...match[1]];
		const bid = Number(match[2]);
		players.push({ cards, bid });
	}
	return players;
}

/**
 * @param {string[]} cards
 */
function getCardCounts(cards) {
	/** @type {Map<string, number>} */
	const cardCounts = new Map();
	for (const card of cards) {
		const count = cardCounts.get(card) ?? 0;
		cardCounts.set(card, count + 1);
	}

	// invert the map
	/** @type {Map<number, string[]>} */
	const counts = new Map();
	for (const [card, count] of cardCounts) {
		const cards = counts.get(count) ?? [];
		cards.push(card);
		counts.set(count, cards);
	}
	return { cardCounts, counts };
}

/**
 * @param {string[]} cards
 */
function getHandType(cards) {
	const { counts } = getCardCounts(cards);
	if (counts.get(5)) {
		return HandType.FiveOfAKind;
	} else if (counts.get(4)) {
		return HandType.FourOfAKind;
	} else if (counts.get(3) && counts.get(2)) {
		return HandType.FullHouse;
	} else if (counts.get(3)) {
		return HandType.ThreeOfAKind;
	} else if (counts.get(2)?.length === 2) {
		return HandType.TwoPair;
	} else if (counts.get(2)) {
		return HandType.OnePair;
	} else {
		return HandType.HighCard;
	}
}

/**
 * @param {string[]} cards
 */
function getBestHandType(cards) {
	const { cardCounts, counts } = getCardCounts(cards);

	const jokerCount = cardCounts.get("J") ?? 0;
	if (jokerCount === 0 || jokerCount === 5) {
		// No jokers, or all jokers, just return the hand type
		return getHandType(cards);
	}

	// Remove joker from `counts`
	if (counts.get(jokerCount)?.length === 1) {
		counts.delete(jokerCount);
	} else {
		counts.set(
			jokerCount,
			(counts.get(jokerCount) ?? []).filter((c) => c !== "J")
		);
	}

	if (counts.has(4)) {
		return HandType.FiveOfAKind;
	} else if (counts.has(3)) {
		// It can't be a full house, because we removed the joker from the counts
		return jokerCount === 2 ? HandType.FiveOfAKind : HandType.FourOfAKind;
	} else if (counts.get(2)?.length === 2) {
		return HandType.FullHouse;
	} else if (counts.has(2)) {
		return jokerCount === 3
			? HandType.FiveOfAKind
			: jokerCount === 2
			? HandType.FourOfAKind
			: HandType.ThreeOfAKind;
	} else {
		return jokerCount === 4
			? HandType.FiveOfAKind
			: jokerCount === 3
			? HandType.FourOfAKind
			: jokerCount === 2
			? HandType.ThreeOfAKind
			: HandType.OnePair;
	}
}

/**
 * 
 * @param {Array<Player & { type: number }>} hands 
 * @param {string[]} cardStrength 
 */
function sortHands(hands, cardStrength) {
	return hands.sort((a, b) => {
		const cmp = a.type - b.type;
		if (!cmp) {
			// Find the strongest hand of the same type in order of cards
			for (let i = 0; i < a.cards.length; i++) {
				const aCard = a.cards[i];
				const bCard = b.cards[i];
				if (aCard === bCard) continue;

				const aStrength = cardStrength.indexOf(aCard);
				const bStrength = cardStrength.indexOf(bCard);
				if (aStrength !== bStrength) {
					return aStrength - bStrength;
				}
			}
		}
		return cmp;
	});
}