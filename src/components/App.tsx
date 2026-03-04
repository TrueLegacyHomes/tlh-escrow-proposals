import { useState } from 'preact/hooks';
import type { TransactionData, ProposalSet } from '../lib/types';
import {
  calculateOakwoodFees,
  calculateFAEscrowFees,
  calculateFATitleFees,
} from '../lib/calculations';
import ProposalForm from './ProposalForm';
import ProposalPreview from './ProposalPreview';
import ActionBar from './ActionBar';

const DEFAULT_TRANSACTION: TransactionData = {
  agentName: '',
  agentPhone: '',
  agentEmail: '',
  propertyAddress: '',
  purchasePrice: 0,
  estimatedCOE: '',
};

export default function App() {
  const [transaction, setTransaction] =
    useState<TransactionData>(DEFAULT_TRANSACTION);
  const [oakwoodSellerFee, setOakwoodSellerFee] = useState(1500);
  const [oakwoodBuyerFee, setOakwoodBuyerFee] = useState(1500);

  // Derive the full ProposalSet on every render
  const proposal: ProposalSet = {
    transaction,
    oakwood: calculateOakwoodFees(oakwoodSellerFee, oakwoodBuyerFee),
    faEscrow: calculateFAEscrowFees(transaction.purchasePrice),
    faTitle: calculateFATitleFees(transaction.purchasePrice),
  };

  return (
    <div class="space-y-8">
      {/* Data entry form */}
      <ProposalForm
        transaction={transaction}
        setTransaction={setTransaction}
        oakwoodSellerFee={oakwoodSellerFee}
        setOakwoodSellerFee={setOakwoodSellerFee}
        oakwoodBuyerFee={oakwoodBuyerFee}
        setOakwoodBuyerFee={setOakwoodBuyerFee}
      />

      {/* Three preview cards */}
      <ProposalPreview proposal={proposal} />

      {/* Download action */}
      <ActionBar proposal={proposal} />
    </div>
  );
}
