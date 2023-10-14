const hre = require("hardhat");

// Transfers deployed to:  0x9241BfAC8590B92acc84aA23EAd181a7c06Ba0E9

const main = async () => {
	const Transfers = await hre.ethers.getContractFactory("Transfers");
	const transfers = await Transfers.deploy();

	await transfers.deployed();

	console.log("Transfers deployed to: ", transfers.address);
};

const runmain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

runmain();
