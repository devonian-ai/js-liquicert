const { ethers } = require('ethers');

class Liquicert {
    constructor(provider) {
        this.provider = new ethers.providers.Web3Provider(provider); // Wrap the provider, preserves accounts
    }

    async uploadData(data) {
        console.log('uploading')
    }

    async createAttestation(attestationName, dataCID, attestationDescription, trustedBool, contractAddress = 'default_sepolia_contract', network = 'sepolia') {
        if (!attestationName || !dataCID || !attestationDescription) {
            throw new Error('Missing required parameters for creating an attestation.');
        }
        
        console.log('attesting')
    }

    async findPath(src, target) {
        console.log('searching for path')
    }
}

module.exports = Liquicert;
