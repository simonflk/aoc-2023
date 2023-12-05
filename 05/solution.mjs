import fs from "fs";
import path from "path";
import url from "url";
import chalk from "chalk";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log(chalk.bgGreen.black("Part 1:"), chalk.green(part1()));
console.log(chalk.bgGreen.black("Part 2:"), chalk.green(part2()));

function part1() {
	const { seeds, converters } = parseInput("input.txt");
	let min = Infinity;
	for (const seed of seeds) {
		const location = convert(seed, "seed", "location", converters);
		if (location < min) {
			min = location;
		}
	}
	return min;
}

function part2() {
	const { seeds, converters } = parseInput("input.txt");

	let min = Infinity;
	for (let i = 0; i < seeds.length; i += 2) {
		const seedStart = seeds[i];
		const seedLen = seeds[i + 1];

		// TODO: So this is quite inefficient, but it works.
		// I think there's a way with recursion to start with small locations and work
		// back to seed, but I don't have time to look into it right now.
		for (let j = 0; j < seedLen; j++) {
			const seed = seedStart + j;
			const location = convert(seed, "seed", "location", converters);
			if (location < min) {
				min = location;
			}
		}
	}
	return min;
}

/** @typedef {{
    unit: string;
    to: string;
    map: Array<{
        source: number;
        dest: number;
        len: number;
    }>;
}} Converter*/
function parseInput(file = "input.txt") {
	const input = fs.readFileSync(path.join(__dirname, file), "utf8");

	const [seedsInput, ...maps] = input.split("\n\n");

	const seeds = seedsInput.match(/\d+/g)?.map(Number) ?? [];
	/** @type {Array<Converter>} */
	const converters = [];

	for (const map of maps) {
		const [id, ...lines] = map.split("\n");
		const [unit, to] = id
			.split("-to-")
			.map((token) => token.replace(/\s+.*/, ""));

		converters.push({
			unit,
			to,
			map: lines.map((line) => {
				const parsed = line.split(" ").map(Number);
				if (parsed.length !== 3) {
					throw new Error(`Invalid line: ${line}`);
				}
				const [dest, source, len] = parsed;
				return { source, dest, len };
			}),
		});
	}

	return { seeds, converters };
}

/**
 * @param {number} source
 * @param {string} from
 * @param {string} to
 * @param {Array<Converter>} converters
 */
function convert(source, from, to, converters) {
	let currentVal = source;
	let currentUnit = from;
	while (currentUnit !== to) {
		const converter = converters.find((c) => c.unit === currentUnit);
		if (!converter) {
			throw new Error(`No converter found for ${currentUnit}`);
		}

		currentVal = convertUnit(currentVal, converter);
		currentUnit = converter.to;
	}
	return currentVal;
}

/**
 * @param {number} source
 * @param {Converter} converter
 */
function convertUnit(source, converter) {
	const { map } = converter;

	let dest = source;
	const calc = map.find(
		(m) => source >= m.source && source <= m.source + m.len - 1
	);
	if (calc) {
		const distance = source - calc.source;
		dest = calc.dest + distance;
	}

	return dest;
}
