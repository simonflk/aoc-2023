import fs, { read } from "fs";
import path from "path";
import url from "url";
import chalk from "chalk";
import { range } from "../utils/shared.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log(chalk.bgGreen.black("Part 1:"), chalk.green(part1()));
console.log(chalk.bgGreen.black("Part 2:"), chalk.green(part2()));

function part1() {
	const races = readFile();
	let totalWays = 1;

	for (const { time, distance } of races) {
		let ways = 0;
		for (const pressTime of range(0, time)) {
			const remaining = time - pressTime;
			const distCovered = pressTime * remaining;
			if (distCovered > distance) ways++;
		}
		totalWays *= ways;
	}
	return totalWays;
}

function part2() {
	const [time, distance] = readFilePart2();
	let ways = 0;

	for (const pressTime of range(0, time)) {
		const remaining = time - pressTime;
		const distCovered = pressTime * remaining;
		if (distCovered > distance) ways++;
	}
	return ways;
}

function readFile(file = "input.txt") {
	const lines = fs.readFileSync(path.join(__dirname, file), "utf8").split("\n");
	const [, ...times] = lines[0].split(/\s+/).map(Number);
	const [, ...distances] = lines[1].split(/\s+/).map(Number);
	return times.map((time, i) => ({ time, distance: distances[i] }));
}

function readFilePart2(file = "input.txt") {
	const lines = fs.readFileSync(path.join(__dirname, file), "utf8").split("\n");
	const [, time] = lines[0].replace(/\s+/g, "").split(":");
	const [, distance] = lines[1].replace(/\s+/g, "").split(":");
	return [Number(time), Number(distance)];
}
