import fs, { read } from "fs";
import path from "path";
import url from "url";
import chalk from "chalk";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log(chalk.bgGreen.black("Part 1:"), chalk.green(part1()));
console.log(chalk.bgGreen.black("Part 2:"), chalk.green(part2()));

function part1() {
	const input = readFile("input.txt");
	let sum = 0;
	for (const seq of input) {
		const diff = extrapolate(seq);
		const next = (seq.at(-1) ?? 0) + (diff.at(-1) ?? 0);
		sum += next;
	}
	return sum;
}

function part2() {
	const input = readFile("input.txt");
	let sum = 0;
	for (const seq of input) {
		const diff = extrapolateBackwards(seq);
		const prev = seq[0] - diff[0];
		sum += prev;
	}
	return sum;
}

function readFile(file = "input.txt") {
	const lines = fs.readFileSync(path.join(__dirname, file), "utf8").split(/\n/);
	return lines.map((line) => line.split(/\s+/).map(Number));
}

/**
 * @param {number[]} seq
 */
function extrapolate(seq) {
	if (seq.every((num) => num === 0)) return [...seq, 0];

	const diffs = getDiffs(seq);
	const next = extrapolate(diffs);
	diffs.push((diffs.at(-1) ?? 0) + (next.at(-1) ?? 0));

	return diffs;
}

/**
 * @param {number[]} seq
 */
function extrapolateBackwards(seq) {
	if (seq.every((num) => num === 0)) return [...seq, 0];

	const diffs = getDiffs(seq);
	const prev = extrapolateBackwards(diffs);
	diffs.unshift(diffs[0] - prev[0]);

	return diffs;
}

/**
 *
 * @param {number[]} seq
 * @returns
 */
function getDiffs(seq) {
	return seq.reduce((/** @type {number[]} */ acc, num, idx) => {
		if (idx === 0) return acc;
		acc.push(num - seq[idx - 1]);
		return acc;
	}, []);
}
