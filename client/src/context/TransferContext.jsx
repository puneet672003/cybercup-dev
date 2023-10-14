import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { contractABI, contractAddress } from "../utils/constants";

import pako from "pako";

export const transferContext = React.createContext();
const { ethereum } = window;

const API_KEY = "a2ea8a231ff1f5321ffd";
const SECRET_API_KEY =
	"90e70d62b073371fbdc8ac54a40b7f1704c24b9740738e97b9f3c2fb8dcc59ad";

const getEthereumContract = () => {
	const provider = new ethers.providers.Web3Provider(ethereum);
	const signer = provider.getSigner();
	const transferContract = new ethers.Contract(
		contractAddress,
		contractABI,
		signer
	);

	return transferContract;
};

export const TransferProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState();
	const [isLoading, setIsLoading] = useState();

	const [formData, setFormData] = useState({
		addressTo: "",
		ipfsHash: "",
	});

	const uploadFileToIPFS = async (file) => {
		try {
			setIsLoading(true);

			const reader = new FileReader();

			reader.onload = (event) => {
				const fileData = new Uint8Array(event.target.result);
				const compressedData = pako.deflate(fileData);

				const originalSize = fileData.length;
				const compressedSize = compressedData.length;

				setFormData((prevFromData) => ({
					...prevFromData,
					originalSize,
					compressedSize,
				}));

				const formData = new FormData();
				formData.append("file", new Blob([compressedData]));

				(async () => {
					const response = await axios.post(
						"https://api.pinata.cloud/pinning/pinFileToIPFS",
						formData,
						{
							headers: {
								"Content-Type": "multipart/form-data",
								pinata_api_key: API_KEY,
								pinata_secret_api_key: SECRET_API_KEY,
							},
						}
					);

					setIsLoading(false);

					if (response.data.IpfsHash) {
						const ipfsHash = response.data.IpfsHash;
						console.log("ipfs hash: ", ipfsHash);

						setFormData((prevFromData) => ({
							...prevFromData,
							ipfsHash: ipfsHash,
						}));
					} else {
						console.error("Error uploading the file to IPFS.");
					}
				})();
			};

			reader.readAsArrayBuffer(file);
		} catch (error) {
			console.error("Error uploading the file to IPFS:", error);
		}
	};

	const handleChange = (e, name) => {
		setFormData((prevFromData) => ({
			...prevFromData,
			[name]: e.target.value,
		}));
	};

	const isWalletConnected = async () => {
		try {
			if (!ethereum) return alert("Please install metamask");

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length) {
				setCurrentAccount(accounts[0]);
			} else {
				console.log("no accounts found.");
			}
		} catch (err) {
			console.error(err);
		}
	};

	const connectWallet = async () => {
		try {
			if (!ethereum) return alert("Please install metamask");
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			setCurrentAccount(accounts[0]);
		} catch (err) {
			console.error(err);
		}
	};

	const transfer = async () => {
		try {
			if (!ethereum) return alert("Please install metamask.");

			const { addressTo, message, ipfsHash } = formData;
			const transferContract = getEthereumContract();

			const transferHash = await transferContract.addData(
				addressTo,
				message,
				ipfsHash
			);

			setIsLoading(true);
			console.log(`Loading: ${transferHash.hash}`);

			await transferHash.wait();

			setIsLoading(false);
			console.log(`Succes: ${transferHash.hash}`);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		isWalletConnected();
	}, []);

	return (
		<transferContext.Provider
			value={{
				connectWallet,
				currentAccount,
				formData,
				handleChange,
				transfer,
				isLoading,
				uploadFileToIPFS,
			}}
		>
			{children}
		</transferContext.Provider>
	);
};
