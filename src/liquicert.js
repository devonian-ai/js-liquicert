const { ethers } = require('ethers');

// const apiURL = "http://localhost:3001"
const apiURL = "http://liquicert.io"

class Liquicert {
    constructor(provider, wallet) {
        this.provider = provider;
        this.wallet = wallet;
    }

    async uploadData(data) {
        console.log('uploading')
    }

    async createAttestation(attestationName, dataCID, attestationDescription, trustedBool, contractAddress = 'default_sepolia_contract', network = 'sepolia') {

        // Make sure we have all the required inputs
        if (!attestationName || !dataCID || !attestationDescription || !trustedBool) {
            throw new Error('Missing required parameters for creating an attestation.');
        }

        // Create the JSON object that will be our attestation
        const attestation = {
            name: attestationName,
            CID: dataCID,
            description: attestationDescription,
            trusted: trustedBool
        }
        const attestation_message = JSON.stringify(attestation);

        try {
            const signature = await this.wallet.signMessage(attestation_message);
            const signerAddress = await this.wallet.getAddress();
            
            const response = await fetch(apiURL+"/addAttestation", {
                method: "POST",
                body: JSON.stringify({
                    signer_address: signerAddress, 
                    message: attestation_message, 
                    signature}),
                headers: {
                "Content-type": "application/json; charset=UTF-8"
                }
            })

            // Handle errors from the api
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Failed to add attestation.');
            }
            

        }catch (error) {
            console.error("Error: "+ error.message)
        };
        
        console.log('attesting')
    }

    async findPath(srcCommunityAddress, targetDataCID) {
        try {
            const queryString = `${apiURL}/findTrustPaths?communitySrc=${srcCommunityAddress}&dataTarget=${targetDataCID}`;
            const res = await fetch(queryString);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error.message || 'Failed to find path.');
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error:", error.message);
        }        
    }

    async savePath(pathDataJSON) {
        try {
            const response = await fetch(`${apiURL}/savePath`, {
                method: "POST",
                body: JSON.stringify({ "proofPath": JSON.stringify(pathDataJSON) }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            });
    
            // Handle errors from the API
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Failed to save path.');
            }
    
            const data = await response.json();
            return data;  // Assuming the API returns a string
    
        } catch (error) {
            console.error("Error:", error.message);
            throw error;  // Re-throw the error to be handled by the caller
        }
    }    
}

module.exports = Liquicert;
