const fs = require("fs");
const path = require("path");

console.log(part1());
console.log(part2());

function part1() {
	const { lines, numbers } = parseInput();
	let sum = 0;
	for (const num of numbers) {
		if (isValidPart(num, lines)) {
			sum += num.value;
		}
	}
	return sum;
}

function part2() {
	const { lines, numbers } = parseInput();
	const gears = findGears(lines);

	let sum = 0;

	for (const gear of gears) {
		/** @type {Set<PartNum>} */
		const surroundingParts = new Set();
		const minX = Math.max(0, gear.posStart - 1);
		const maxX = Math.min(lines[0].length - 1, gear.posEnd + 1);

		// ugh this is messy and repetetive - should probably put the numbers into structure I can
		// query more easily
		const numsAbove = range(minX, maxX).flatMap((x) =>
			numbers.filter(
				(n) => n.line === gear.line - 1 && n.posStart <= x && n.posEnd >= x
			)
		);
		const numsBelow = range(minX, maxX).flatMap((x) =>
			numbers.filter(
				(n) => n.line === gear.line + 1 && n.posStart <= x && n.posEnd >= x
			)
		);
		const numLeft = numbers.find(
			(n) => n.line === gear.line && n.posEnd === gear.posStart - 1
		);
		const numRight = numbers.find(
			(n) => n.line === gear.line && n.posStart === gear.posEnd + 1
		);
		const possibleNums = [...numsAbove, ...numsBelow, numLeft, numRight];
		for (const num of possibleNums) {
			if (num === undefined) {
				continue;
			}
			surroundingParts.add(num);
		}

		if (surroundingParts.size === 2) {
			const [part1, part2] = [...surroundingParts];
			sum += part1.value * part2.value;
		}
	}

	return sum;
}

/** @typedef {{posStart: number; posEnd: number; line: number}} ItemMatch */
/** @typedef {{value: number} & ItemMatch} PartNum */

function parseInput() {
	const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
	const lines = input.split("\n");

	/** @type {Array<PartNum>} */
	const numbers = [];
	const regex = /(\d+)/g;

	for (const [lineNum, line] of Object.entries(lines)) {
		/** @type RegExpExecArray | null*/
		let match;
		while ((match = regex.exec(line))) {
			numbers.push({
				value: Number(match[1]),
				line: Number(lineNum),
				posStart: match.index,
				posEnd: match.index + match[1].length - 1,
			});
		}
	}

	return { lines, numbers };
}

/**
 *
 * @param {PartNum} partNum
 * @param {Array<string>} rows
 */
function isValidPart(partNum, rows) {
	const lineLength = rows[0].length;
	const minX = Math.max(0, partNum.posStart - 1);
	const maxX = Math.min(lineLength - 1, partNum.posEnd + 1);

	const cellsAbove = range(minX, maxX).flatMap((x) => {
		const cellContent = rows[partNum.line - 1]?.[x];
		return cellContent ? [cellContent] : [];
	});
	const cellLeft = rows[partNum.line][partNum.posStart - 1];
	const cellRight = rows[partNum.line][partNum.posEnd + 1];
	const cellsBelow = range(minX, maxX).flatMap((x) => {
		const cellContent = rows[partNum.line + 1]?.[x];
		return cellContent ? [cellContent] : [];
	});

	const cells = [...cellsAbove, cellLeft, cellRight, ...cellsBelow].filter(
		(c) => c !== undefined
	);
	return cells.some((c) => c.match(/[^\d.]/));
}

/**
 * @param {number} start
 * @param {number} end
 */
function range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * @param {Array<string>} rows
 */
function findGears(rows) {
	/** @type {Array<ItemMatch>} */
	const gears = [];
	for (const [y, row] of Object.entries(rows)) {
		for (const [x, cell] of Object.entries(row)) {
			if (cell === "*") {
				gears.push({ posStart: Number(x), posEnd: Number(x), line: Number(y) });
			}
		}
	}
	return gears;
}
