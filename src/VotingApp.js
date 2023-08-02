
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const contractAddress = '0x312d69Be7F06153ED9D7dC7A056A51B770681623';
const contractABI = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "voter", "type": "address" } ], "name": "Voted", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "candidateId", "type": "uint256" } ], "name": "getCandidateVotes", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "hasVoted", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "candidateId", "type": "uint256" } ], "name": "vote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "votesReceived", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]

const VotingApp = () => {
    const [candidateId, setCandidateId] = useState('');
    const [account, setAccount] = useState('');
    const [voteCount, setVoteCount] = useState(0);

    const web3 = window.ethereum ? new Web3(window.ethereum) : null;
    const contract = web3 ? new web3.eth.Contract(contractABI, contractAddress) : null;

    useEffect(() => {
        loadAccount();
    }, []);

    const loadAccount = async () => {
        try {
            if (web3) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            }
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
        } catch (error) {
            console.error('Error loading account:', error);
        }
    };

    const handleVote = async () => {
        try {
            if (!web3 || !contract) return;

            const candidateIdNum = parseInt(candidateId);
            await contract.methods.vote(candidateIdNum).send({ from: account });

            // Refresh the vote count after voting
            getCandidateVotes(candidateIdNum);
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const getCandidateVotes = async (candidateIdNum) => {
        try {
            if (!web3 || !contract) return;

            const voteCount = await contract.methods.getCandidateVotes(candidateIdNum).call();
            setVoteCount(voteCount);
        } catch (error) {
            console.error('Error getting vote count:', error);
        }
    };

    return (
        <div>
            <h1>Voting App</h1>
            <p>Connected Account: {account}</p>
            <label>
                Candidate ID:
                <input type="number" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} />
            </label>
            <button onClick={handleVote}>Vote</button>
            <div>
                <p>Vote Count for Candidate ID {candidateId}: {voteCount}</p>
                <button onClick={() => getCandidateVotes(candidateId)}>Get Vote Count</button>
            </div>
        </div>
    );
};

export default VotingApp;