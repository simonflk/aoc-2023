const fs = require("fs");
const path = require("path");

const lineRegex = /^Game (?<gameId>\d+): (?<sets>([^;]*;?)*)/;

console.log(part1());
console.log(part2());

function part1() {
	const bagContents = {
		red: 12,
		green: 13,
		blue: 14,
	};
	let validGameSum = 0;

	const gamesData = getGamesData();
	for (const game of gamesData) {
		if (game.maxRed > bagContents.red) continue;
		if (game.maxGreen > bagContents.green) continue;
		if (game.maxBlue > bagContents.blue) continue;

		validGameSum += game.gameId;
	}

	return validGameSum;
}

function part2() {
	const gamesData = getGamesData();
	let power = 0;
	for (const game of gamesData) {
		power += game.maxRed * game.maxGreen * game.maxBlue;
	}
	return power;
}

function getGamesData() {
	/** @type {Array<Record<'gameId'|'maxRed'|'maxGreen'|'maxBlue', number>>} */
	const gamesData = [];

	const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
	for (const line of input.split("\n")) {
		const match = lineRegex.exec(line);
		if (!match || !match.groups) {
			throw new Error("Invalid input: " + line);
		}
		const gameId = parseInt(match.groups.gameId, 10);

		/** @type {Record<'red'|'green'|'blue', number[]>} */
		const cubesSeen = {
			red: [],
			green: [],
			blue: [],
		};
		for (const set of match.groups.sets.split(/;\s*/)) {
			for (const draw of set.split(/,\s+/)) {
				const [number, color] = draw.split(" ");
				if (color === "red" || color === "blue" || color === "green") {
					cubesSeen[color].push(parseInt(number, 10));
				} else {
					throw new Error("Invalid color: " + color);
				}
			}
		}
		gamesData.push({
			gameId,
			maxRed: Math.max(...cubesSeen.red),
			maxGreen: Math.max(...cubesSeen.green),
			maxBlue: Math.max(...cubesSeen.blue),
		});
	}

	return gamesData;
}
