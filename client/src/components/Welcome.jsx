import React, { useContext, useState } from "react";

import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { Loader } from "./";
import { transferContext } from "../context/TransferContext";

const commonStyles =
	"min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => {
	return (
		<input
			placeholder={placeholder}
			type={type}
			step="0.0001"
			value={value}
			onChange={(e) => handleChange(e, name)}
			className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
		/>
	);
};

const Welcome = () => {
	const [sent, setSent] = useState(false);

	const {
		connectWallet,
		currentAccount,
		formData,
		handleChange,
		transfer,
		isLoading,
		uploadFileToIPFS,
	} = useContext(transferContext);

	const getIPFSHttpLink = (ipfsHash) => {
		const gatewayUrl = "https://ipfs.io/ipfs/"; // IPFS public gateway URL
		return `${gatewayUrl}${ipfsHash}`;
	};

	const handleSubmit = async (e) => {
		const { addressTo, message, ipfsHash } = formData;

		// to prevent page reloads
		console.log("Address to: ", addressTo);
		console.log("Message: ", message);
		console.log("Ipfs hash: ", ipfsHash);
		e.preventDefault();

		if (!addressTo || !ipfsHash || !message) return;
		await transfer();

		setSent(true);
	};

	return (
		<div className="flex w-full justify-center items-center">
			<div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
				<div className="flex flex-1 justify-start flex-col mf:mr-10">
					<h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
						Send Files <br />
						Across the world!
					</h1>
					<p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
						Faster than you can say "meow"! <br />
						Send and recieve compressed file on decentralised
						network.
					</p>
					{!currentAccount && (
						<button
							type="button"
							onClick={connectWallet}
							className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
						>
							<p className="text-white text-base font-semibold">
								Connect Wallet
							</p>
						</button>
					)}
					<div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
						<div className={`rounded-tl-2xl ${commonStyles}`}>
							Reliability
						</div>
						<div className={commonStyles}>Security</div>
						<div className={`rounded-tr-2xl ${commonStyles}`}>
							Ethereum
						</div>
						<div className={`rounded-bl-2xl ${commonStyles}`}>
							Web 3.0
						</div>
						<div className={commonStyles}>Low fees</div>
						<div className={`rounded-br-2xl ${commonStyles}`}>
							Blockchain
						</div>
					</div>
				</div>

				<div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
					<div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
						<div className="flex justify-between flex-col w-full h-full">
							<div className="flex justify-between items-start">
								<div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
									<SiEthereum fontSize={21} color="#fff" />
								</div>
								<BsInfoCircle fontFamily={17} color="#fff" />
							</div>
							<div>
								<p className="text-white font-light text-sm">
									Address
								</p>
								<p className="text-white font-semibold text-lg mt-1">
									Ethereum
								</p>
							</div>
						</div>
					</div>

					{!sent ? (
						<div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
							<Input
								placeholder="Address To"
								name="addressTo"
								type="text"
								handleChange={handleChange}
							/>
							<Input
								placeholder="Enter Message"
								name="message"
								type="text"
								handleChange={handleChange}
							/>
							<div className="flex flex-col mt-2">
								<label
									htmlFor="fileInput"
									className="text-white font-light text-sm"
								></label>
								<div className="flex">
									<label
										htmlFor="fileInput"
										className="text-white cursor-pointer "
									>
										Choose File
									</label>
									<input
										type="file"
										accept=".pdf, .jpg, .jpeg, .png, .gif"
										onChange={(e) =>
											uploadFileToIPFS(e.target.files[0])
										}
										id="fileInput"
										className="hidden"
									/>
								</div>
							</div>

							<div className="h-[1px] w-full bg-gray-400 my-2" />

							{/* isLoading */}
							{isLoading ? (
								<Loader />
							) : (
								<button
									type="button"
									onClick={handleSubmit}
									className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
								>
									Send Now
								</button>
							)}
						</div>
					) : (
						<div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism text-white">
							<div className="tick-mark"></div>
							<br />
							<div className="h-[1px] w-full bg-gray-400 my-2" />

							<h3 className="p-2 text-lg">Transaction Details</h3>
							<p>
								<a
									className="underline text-[#5e8cff]"
									href={getIPFSHttpLink(formData.ipfsHash)}
								>
									IPFS file link
								</a>
							</p>
							<p>
								Original file size: {formData.originalSize}{" "}
								bytes
							</p>
							<p>
								Compressed file size: {formData.compressedSize}{" "}
								bytes
							</p>
							<p>
								Compression ratio:{" "}
								{formData.originalSize /
									formData.compressedSize}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Welcome;
