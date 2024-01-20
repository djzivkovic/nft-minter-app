// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    uint256 public maxSupply;
    uint256 public registrationPrice;
    uint256 public mintPrice;

    string public baseURI;

    mapping(address => bool) public blacklistedAddresses;
    mapping(address => bool) public registeredAddresses;

    event NFTMinted(address indexed owner, uint256 tokenId);
    event AddressBlacklisted(address indexed blacklistedAddress);
    event AddressRegistered(address indexed registeredAddress);

    error Blacklisted();
    error NotRegistered();
    error AlreadyRegistered();
    error AlreadyBlacklisted();
    error InsufficientFunds(uint256 receivedAmount, uint256 requiredAmount);
    error InvalidTokenId(uint256 tokenId, uint256 maxSupply);

    constructor(uint256 _maxSupply, uint256 _registrationPrice, uint256 _mintPrice, string memory _baseURI)
        ERC721("NFT", "NFT")
        Ownable(msg.sender)
    {
        maxSupply = _maxSupply;
        registrationPrice = _registrationPrice;
        mintPrice = _mintPrice;
        baseURI = _baseURI;
    }

    modifier notBlacklisted() {
        if (blacklistedAddresses[msg.sender]) {
            revert Blacklisted();
        }
        _;
    }

    modifier onlyRegistered() {
        if (!registeredAddresses[msg.sender]) {
            revert NotRegistered();
        }
        _;
    }

    modifier notRegistered() {
        if (registeredAddresses[msg.sender]) {
            revert AlreadyRegistered();
        }
        _;
    }

    function mintNFT(uint256 _tokenId) external payable notBlacklisted onlyRegistered {
        if (msg.value < mintPrice) {
            revert InsufficientFunds(msg.value, mintPrice);
        }
        if (_tokenId >= maxSupply) {
            revert InvalidTokenId(_tokenId, maxSupply);
        }
        _safeMint(msg.sender, _tokenId);
        emit NFTMinted(msg.sender, _tokenId);
    }

    function addToBlacklist(address _address) external onlyOwner {
        if (blacklistedAddresses[_address]) {
            revert AlreadyBlacklisted();
        }
        blacklistedAddresses[_address] = true;
        emit AddressBlacklisted(_address);
    }

    function register() external payable notBlacklisted notRegistered {
        if (msg.value < registrationPrice) {
            revert InsufficientFunds(msg.value, registrationPrice);
        }
        registeredAddresses[msg.sender] = true;
        emit AddressRegistered(msg.sender);
    }
}
