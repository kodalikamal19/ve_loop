import crypto from 'crypto';
import { Wallet } from '../models/Wallet.js';
import { WalletTransaction } from '../models/WalletTransaction.js';

export const creditBalance = async ({ userId, asset, amount, reason, referenceId = null, performedBy = null, metadata = {} }) => {
  if (amount <= 0) throw new Error('Credit amount must be greater than zero');
  if (!['ves', 'sves', 'gems', 'tokens', 'xp'].includes(asset)) {
    throw new Error(`Invalid asset type: ${asset}`);
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new Error('Wallet not found for user');

  const previousBalance = wallet.balances[asset] || 0;
  const newBalance = previousBalance + amount;
  wallet.balances[asset] = newBalance;
  await wallet.save();

  const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const transaction = await WalletTransaction.create({
    userId,
    transactionId,
    type: 'credit',
    asset,
    amount,
    previousBalance,
    newBalance,
    reason,
    referenceId,
    status: 'completed',
    performedBy,
    metadata,
  });

  return { wallet, transaction };
};

export const debitBalance = async ({ userId, asset, amount, reason, referenceId = null, performedBy = null, metadata = {} }) => {
  if (amount <= 0) throw new Error('Debit amount must be greater than zero');
  if (!['ves', 'sves', 'gems', 'tokens', 'xp'].includes(asset)) {
    throw new Error(`Invalid asset type: ${asset}`);
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new Error('Wallet not found for user');

  const previousBalance = wallet.balances[asset] || 0;
  if (previousBalance < amount) {
    throw new Error(`Insufficient ${asset.toUpperCase()} balance. Available: ${previousBalance}, Required: ${amount}`);
  }

  const newBalance = previousBalance - amount;
  wallet.balances[asset] = newBalance;
  await wallet.save();

  const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const transaction = await WalletTransaction.create({
    userId,
    transactionId,
    type: 'debit',
    asset,
    amount,
    previousBalance,
    newBalance,
    reason,
    referenceId,
    status: 'completed',
    performedBy,
    metadata,
  });

  return { wallet, transaction };
};

export const reserveBalance = async ({ userId, asset, amount, reason, referenceId = null }) => {
  if (amount <= 0) throw new Error('Reserved amount must be greater than zero');
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new Error('Wallet not found for user');

  const previousBalance = wallet.balances[asset] || 0;
  if (previousBalance < amount) {
    throw new Error(`Insufficient ${asset.toUpperCase()} balance to reserve. Available: ${previousBalance}, Requested: ${amount}`);
  }

  wallet.balances[asset] = previousBalance - amount;
  wallet.reservedBalances[asset] = (wallet.reservedBalances[asset] || 0) + amount;
  await wallet.save();

  const transactionId = `RSV-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const transaction = await WalletTransaction.create({
    userId,
    transactionId,
    type: 'redemption',
    asset,
    amount,
    previousBalance,
    newBalance: wallet.balances[asset],
    reason: `Reserved for withdrawal (${reason})`,
    referenceId,
    status: 'pending',
    metadata: { reserved: true },
  });

  return { wallet, transaction };
};

export const releaseReservedBalance = async ({ userId, asset, amount, reason, referenceId = null, isApproved = false }) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new Error('Wallet not found for user');

  const currentReserved = wallet.reservedBalances[asset] || 0;
  if (currentReserved < amount) {
    throw new Error(`Cannot release ${amount} ${asset}; only ${currentReserved} is reserved.`);
  }

  wallet.reservedBalances[asset] = currentReserved - amount;

  if (!isApproved) {
    // Rejected: return back to available balance
    wallet.balances[asset] = (wallet.balances[asset] || 0) + amount;
  }
  // If approved: funds were already deducted from available balance during reservation!

  await wallet.save();

  const transactionId = `REL-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  await WalletTransaction.create({
    userId,
    transactionId,
    type: isApproved ? 'redemption' : 'refund',
    asset,
    amount,
    previousBalance: wallet.balances[asset],
    newBalance: wallet.balances[asset],
    reason: isApproved ? `Withdrawal fulfilled (${reason})` : `Withdrawal rejected/refunded: ${reason}`,
    referenceId,
    status: isApproved ? 'completed' : 'reversed',
  });

  return wallet;
};
