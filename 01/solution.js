const fs = require("fs");
const path = require("path");

console.log(part1());
console.log(part2());

function part1() {
	const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
	let calibrationValueSum = 0;
	for (const line of input.split("\n")) {
		const numStr = line.replace(/\D/g, "");
		const calValue = parseInt((numStr.at(0) ?? "") + (numStr.at(-1) ?? ""));
		if (isNaN(calValue)) continue;
		calibrationValueSum += calValue;
	}
	return calibrationValueSum;
}

function part2() {
	const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
	let calibrationValueSum = 0;
	for (const line of input.split("\n")) {
		const numStr = line
			.replace(/oneight/g, "18")
			.replace(/twone/g, "21")
			.replace(/threeight/g, "38")
			.replace(/fiveight/g, "58")
			.replace(/sevenine/g, "79")
			.replace(/eightwo/g, "82")
			.replace(/eighthree/g, "83")
			.replace(/nineight/g, "98")
			.replace(/one/g, "1")
			.replace(/two/g, "2")
			.replace(/three/g, "3")
			.replace(/four/g, "4")
			.replace(/five/g, "5")
			.replace(/six/g, "6")
			.replace(/seven/g, "7")
			.replace(/eight/g, "8")
			.replace(/nine/g, "9")
			.replace(/\D/g, "");
		const calValue = parseInt((numStr.at(0) ?? "") + (numStr.at(-1) ?? ""));
		if (isNaN(calValue)) continue;
		calibrationValueSum += calValue;
	}
	return calibrationValueSum;
}
