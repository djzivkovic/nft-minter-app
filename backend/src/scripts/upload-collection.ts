import "dotenv/config";
import * as fs from "fs";
import * as FormData from "form-data";
import axios from "axios";

const JWT = "Bearer " + process.env.PINATA_API_KEY;

const pinDirectoryToPinata = async (dir: string, targetFolder: string): Promise<any> => {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    try {
        const files = await fs.readdirSync(dir);
        const data = new FormData();
        for (const file of files) {
            data.append(`file`, fs.createReadStream(dir + file), {
                filepath: targetFolder + "/" + file,
            });
        }
        const response = await axios.post(url, data, {
            headers: {
                Authorization: JWT,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const generateMetadata = async (metadataPath: string, imagesPath: string, baseImageUrl: string) => {
    const baseJson = {
        name: "NFT #",
        description: "Description for NFT #",
        image: baseImageUrl,
        attributes: [],
    };
    const files = await fs.readdirSync(imagesPath);
    if (!fs.existsSync(metadataPath)) {
        fs.mkdirSync(metadataPath);
    }
    for (const file of files) {
        const json = JSON.parse(JSON.stringify(baseJson)); // make a copy of baseJson
        json.name += file.split(".")[0];
        json.description += file.split(".")[0];
        json.image += file;
        fs.writeFileSync(metadataPath + file.split(".")[0] + ".json", JSON.stringify(json));
    }
};

const uploadCollection = async (metadataPath: string, imagesPath: string) => {
    const baseImageUrl = "ipfs://" + (await pinDirectoryToPinata(images, "images")).IpfsHash + "/";
    await generateMetadata(metadataPath, imagesPath, baseImageUrl);
    const metadataHash = (await pinDirectoryToPinata(metadataPath, "metadata")).IpfsHash;
    console.log("Finished uploading collection. Hash:", metadataHash);
};

const metadata = "assets/metadata/";
const images = "assets/images/";

uploadCollection(metadata, images);
