'use client'

import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, Send, ChevronUp, ChevronDown, X } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function WalletModal({ isOpen, onClose }) {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [showTransactions, setShowTransactions] = useState(false);
  const userId = Cookies.get('userId');
  const [transactions, setTransactions] = useState([
    { type: 'deposit', amount: 50, date: '2023-10-15' },
    { type: 'withdrawal', amount: 20, date: '2023-10-14' },
    { type: 'transfer', amount: 30, date: '2023-10-13' },
  ]);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.post('/api/getWallet', { userId }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        console.log('User ID:', userId);
        console.log('Wallet Data:', response.data);  // Check the response structure
        
        setBalance(response?.data?.walletBalance || 0);  // Set balance correctly
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    if (userId) {
      fetchWalletBalance();  // Fetch wallet balance only if userId exists
    }
  }, [userId]);

  const handleDeposit = () => {
    if (amount && !isNaN(Number(amount))) {
      const depositAmount = Number(amount);
      setBalance(prevBalance => prevBalance + depositAmount);
      setTransactions(prevTransactions => [
        { type: 'deposit', amount: depositAmount, date: new Date().toISOString().split('T')[0] },
        ...prevTransactions
      ]);
      setAmount('');
    }
  };

  const handleWithdraw = () => {
    if (amount && !isNaN(Number(amount)) && Number(amount) <= balance) {
      const withdrawAmount = Number(amount);
      setBalance(prevBalance => prevBalance - withdrawAmount);
      setTransactions(prevTransactions => [
        { type: 'withdrawal', amount: withdrawAmount, date: new Date().toISOString().split('T')[0] },
        ...prevTransactions
      ]);
      setAmount('');
    }
  };

  const toggleTransactions = () => {
    setShowTransactions(!showTransactions);
  };

  if (!isOpen) return null; // Don't render modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-2 text-xl font-bold mb-1">
            <Wallet className="h-6 w-6" />
            My Wallet
          </div>
          <p className="text-sm text-gray-500 mb-6">Manage your funds and transactions</p>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-4xl font-bold">₹{balance.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                id="amount"
                type="text"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeposit}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" /> Deposit
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw
              </button>
            </div>
          </div>

          {/* Remaining transactions and modal structure stays the same */}
        </div>
      </div>
    </div>
  );
}
