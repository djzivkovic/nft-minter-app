// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFT.sol";

contract NFTScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory baseURI = vm.envString("NFT_BASE_URI");
        vm.startBroadcast(deployerPrivateKey);

        uint256 registrationPrice = 0.005 ether;
        uint256 mintPrice = 0.01 ether;
        uint256 maxSupply = 10;

        NFT nft = new NFT(maxSupply, registrationPrice, mintPrice, baseURI);
        vm.stopBroadcast();
    }
}
