import fs, { read } from "fs";
import path from "path";
import url from "url";
import chalk from "chalk";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log(chalk.bgGreen.black("Part 1:"), chalk.green(part1()));
console.log(chalk.bgGreen.black("Part 2:"), chalk.green(part2()));

function part1() {
	const [instructions, map] = readFile("input.txt");
	let current = "AAA";
	let steps = 0;
	while (current !== "ZZZ") {
		const currentNode = map.get(current);
		if (!currentNode) throw new RangeError(`Invalid node ${current}`);

		const thisTurn = instructions[steps % instructions.length];
		current = thisTurn === "L" ? currentNode[0] : currentNode[1];
		steps++;
	}
	return steps;
}

function part2() {
	const [instructions, map] = readFile("input.txt");
	const currentNodeNames = [...map.keys()].filter((node) => node.endsWith("A"));
	const stepsToZ = [...currentNodeNames].map(() => 0);

	const isAtDestination = (/**@type {string} */ nodeName) =>
		nodeName.endsWith("Z");

	let steps = 0;
	while (!currentNodeNames.every(isAtDestination)) {
		for (let idx = 0; idx < currentNodeNames.length; idx++) {
			const current = currentNodeNames[idx];
			if (isAtDestination(current)) continue;

			const currentNode = map.get(current);
			if (!currentNode)
				throw new RangeError(`Invalid node ${currentNodeNames}`);

			const thisTurn = instructions[steps % instructions.length];
			currentNodeNames[idx] =
				thisTurn === "L" ? currentNode[0] : currentNode[1];

			stepsToZ[idx]++;
		}
		steps++;
	}

	// Tried a brute force - never ended.
	return lcm(stepsToZ);
}

/** @typedef {Map<string, [string, string]>} NodeList */
/**
 * @param {*} file
 * @returns {[string[], NodeList]}
 */
function readFile(file = "input.txt") {
	const [instructions, rest] = fs
		.readFileSync(path.join(__dirname, file), "utf8")
		.split(/\n\n/, 2);

	/** @type {NodeList} */
	let map = new Map();
	for (const line of rest.split("\n")) {
		const nodes = line.match(/([\w\d]{3})/g);
		if (nodes?.length !== 3) throw new Error(`Invalid input ${line}`);
		map.set(nodes[0], [nodes[1], nodes[2]]);
	}

	return [[...instructions], map];
}

/**
 * @param {Array<number>} numbers
 */
function lcm(numbers) {
	return numbers.reduce((a, b) => (a * b) / gcd(a, b));
}

/**
 * @param {number} a
 * @param {number} b
 */
function gcd(a, b) {
	if (b === 0) return a;
	return gcd(b, a % b);
}
