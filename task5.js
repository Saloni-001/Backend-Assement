const express = require('express');
const Web3 = require('web3');

const app = express();
app.use(express.json());

// Ethereum RPC endpoint
const RPC_ENDPOINT = 'https://mainnet.infura.io/v3/your_infura_project_id';

// Initialize web3 with the provided RPC endpoint
const web3 = new Web3(RPC_ENDPOINT);

// API endpoint to retrieve Ethereum account balance
app.get('/api/ethereum/balance/:address', async (req, res) => {
    try {
        const address = req.params.address;
        
        // Check if the address is a valid Ethereum address
        if (!web3.utils.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }

        // Retrieve the balance of the account
        const balance = await web3.eth.getBalance(address);

        // Convert balance from Wei to Ether
        const balanceInEther = web3.utils.fromWei(balance, 'ether');

        res.json({ address: address, balance: balanceInEther });
    } catch (error) {
        console.error('Error retrieving Ethereum account balance:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
