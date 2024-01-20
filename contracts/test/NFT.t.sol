// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/NFT.sol";

contract NFTTest is Test {
    NFT public nft;
    uint256 public supply = 10;
    uint256 public registrationPrice = 1 ether;
    uint256 public mintPrice = 2 ether;
    string public baseURI = "https://example.com/";
    address public owner = vm.addr(1);
    address public user = vm.addr(2);

    function setUp() public {
        vm.startPrank(owner);
        nft = new NFT(supply, registrationPrice, mintPrice, baseURI);
        vm.stopPrank();
    }

    function testConstructor() public {
        assertEq(nft.maxSupply(), supply);
        assertEq(nft.registrationPrice(), registrationPrice);
        assertEq(nft.mintPrice(), mintPrice);
        assertEq(nft.baseURI(), baseURI);
    }

    function testBlacklist() public {
        assertEq(nft.blacklistedAddresses(user), false);
        vm.startPrank(owner);
        nft.addToBlacklist(user);
        vm.stopPrank();
        assertEq(nft.blacklistedAddresses(user), true);
    }

    function testBlacklistNotOwner() public {
        vm.startPrank(user);
        vm.expectRevert();
        nft.addToBlacklist(owner);
        vm.stopPrank();
    }

    function testBlacklistAlreadyBlacklisted() public {
        vm.startPrank(owner);
        nft.addToBlacklist(user);
        vm.stopPrank();

        vm.startPrank(owner);
        vm.expectRevert();
        nft.addToBlacklist(user);
        vm.stopPrank();
    }

    function testRegistration() public {
        assertEq(nft.registeredAddresses(user), false);
        vm.startPrank(user);
        vm.deal(user, registrationPrice);
        nft.register{value: registrationPrice}();
        vm.stopPrank();
        assertEq(nft.registeredAddresses(user), true);
    }

    function testRegistrationAlreadyRegistered() public {
        vm.startPrank(user);
        vm.deal(user, registrationPrice * 2);
        nft.register{value: registrationPrice}();

        vm.expectRevert();
        nft.register{value: registrationPrice}();
        vm.stopPrank();
    }

    function testRegistrationBlacklisted() public {
        vm.startPrank(owner);
        nft.addToBlacklist(user);
        vm.stopPrank();

        vm.startPrank(user);
        vm.deal(user, registrationPrice);
        vm.expectRevert();
        nft.register{value: registrationPrice}();
        vm.stopPrank();
    }

    function testRegistrationInsufficientFunds() public {
        vm.startPrank(user);
        vm.expectRevert();
        nft.register{value: 0.5 ether}();
        vm.stopPrank();
    }

    function testMint() public {
        assertEq(nft.balanceOf(user), 0);
        vm.startPrank(user);
        vm.deal(user, mintPrice + registrationPrice);
        nft.register{value: registrationPrice}();
        nft.mintNFT{value: mintPrice}(0);
        vm.stopPrank();
        assertEq(nft.balanceOf(user), 1);
    }

    function testMintAlreadyMintedId() public {
        vm.startPrank(user);
        vm.deal(user, registrationPrice + mintPrice * 2);
        nft.register{value: registrationPrice}();
        nft.mintNFT{value: mintPrice}(1);
        vm.expectRevert();
        nft.mintNFT{value: mintPrice}(1);
        vm.stopPrank();
    }

    function testMintNotRegistered() public {
        vm.startPrank(user);
        vm.deal(user, mintPrice);
        vm.expectRevert();
        nft.mintNFT{value: mintPrice}(0);
        vm.stopPrank();
    }

    function testMintInsufficientFunds() public {
        vm.startPrank(user);
        vm.deal(user, registrationPrice);
        nft.register{value: registrationPrice}();
        vm.expectRevert();
        nft.mintNFT{value: 0.5 ether}(0);
        vm.stopPrank();
    }

    function testMintBlacklisted() public {
        vm.startPrank(user);
        vm.deal(user, registrationPrice + mintPrice);
        nft.register{value: registrationPrice}();
        vm.stopPrank();

        vm.startPrank(owner);
        nft.addToBlacklist(user);
        vm.stopPrank();

        vm.startPrank(user);
        vm.expectRevert();
        nft.mintNFT{value: mintPrice}(0);
        vm.stopPrank();
    }

    function testMintMaxSupply() public {
        vm.startPrank(user);
        vm.deal(user, registrationPrice + 10 * mintPrice);
        nft.register{value: registrationPrice}();
        for (uint256 i = 0; i < 9; i++) {
            nft.mintNFT{value: mintPrice}(i);
        }
        vm.expectRevert();
        nft.mintNFT{value: mintPrice}(10);
        vm.stopPrank();
    }
}
