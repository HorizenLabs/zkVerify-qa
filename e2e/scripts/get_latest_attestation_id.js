require('dotenv').config();
const Web3 = require('web3').default;

if (!process.env.NH_CONTRACT) {
    throw new Error('Required environment variable NH_CONTRACT is not set.');
}

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

const contractABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "latestAttestationId",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = process.env.NH_CONTRACT;
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function getLatestAttestationId() {
    try {
        const latestId = await contract.methods.latestAttestationId().call();
        console.log("Latest Attestation ID:", latestId.toString());
    } catch (error) {
        console.error("Error fetching the latest attestation ID:", error);
    }
}

getLatestAttestationId();
