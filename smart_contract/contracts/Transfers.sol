// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transfers {
    struct Data {
        address from;
        string message;
        string ipfsHash;
    }

    event newDataAdded(address from, address to, string message, string ipfsHash);

    mapping(address => Data[]) userData;

    function addData(
        address payable to,
        string memory message,
        string memory ipfsHash
    ) public {
        Data memory newData = Data(msg.sender, message, ipfsHash);
        userData[to].push(newData);

        emit newDataAdded(msg.sender, to, message, ipfsHash);
    }

    function getData() public view returns (Data[] memory) {
        return userData[msg.sender];
    }
}
