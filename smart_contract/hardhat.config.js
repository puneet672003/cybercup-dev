require("@nomiclabs/hardhat-waffle");

module.exports = {
	solidity: "0.8.0",
	networks: {
		goerli: {
			url:
				"https://eth-goerli.g.alchemy.com/v2/ArSbzgL2TiSrnRY6FfVJcLicrYrGp9hr",
			accounts: [
				"31186592a5ad9e8a94ccb1f980a69186fcfe8f097766cfe54a08f0a372d75afe",
			],
		},
	},
};
