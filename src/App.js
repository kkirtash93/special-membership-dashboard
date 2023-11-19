import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import donutABI from './donut/abi.json';

function App() {
  const burnAddress = '0x0000000000000000000000000000000000000000';
  const contractAddress = '0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9';
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('0');

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
        } else {
          console.error('MetaMask not detected. Please install MetaMask extension.');
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error.message);
      }
    };

    initializeWeb3();
  }, []);

  const handleTransfer = async () => {
    if (web3 && account) {
      try {
        const erc20Contract = new web3.eth.Contract(donutABI, contractAddress);
        const gasPrice = await web3.eth.getGasPrice();
        const transactionObject = {
          from: account,
          to: burnAddress,
          value: web3.utils.toWei(amount, 'ether'),
          data: erc20Contract.methods.transferFrom(account, burnAddress, web3.utils.toWei(amount, 'ether')).encodeABI(),
          gasPrice: gasPrice,
        };
        await erc20Contract.methods.transferFrom(account, burnAddress, web3.utils.toWei(amount, 'ether')).send(transactionObject)
          .on('error', function (error, receipt) { console.log('error', error, 'receipt', receipt) });
        console.log('Transaction successful!');
      } catch (error) {
        console.error('Error transferring tokens:', error.message);
      }
    } else {
      console.error('Web3 or account not available.');
    }
  };

  return (
    <div>
      <h1>MetaMask ERC-20 Token DONUT Transfer</h1>
      {account && <p>Connected Account: {account}</p>}
      <div>
        <label htmlFor="amount">Amount (DONUT):</label>
        <input type="text" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <button onClick={handleTransfer}>Transfer DONUTs</button>
    </div>
  );
}

export default App;
