import fs, { read } from "fs";
import path from "path";
import url from "url";
import chalk from "chalk";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log(chalk.bgGreen.black("Part 1:"), chalk.green(part1()));
console.log(chalk.bgGreen.black("Part 2:"), chalk.green(part2()));

function part1() {
	const input = readFile("input.txt");
	for (const line of input.split("\n")) {
		continue;
	}
	return 0;
}

function part2() {
	const input = readFile("input.txt");
	for (const line of input.split("\n")) {
		continue;
	}
	return 0;
}

function readFile(file = "input.txt") {
	return fs.readFileSync(path.join(__dirname, file), "utf8");
}
