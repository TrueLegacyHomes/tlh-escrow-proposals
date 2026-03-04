export interface TransactionData {
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  propertyAddress: string;
  purchasePrice: number;
  estimatedCOE: string;
}

export interface OakwoodFees {
  sellerFee: number;
  buyerFee: number;
  totalFees: number;
}

export interface FirstAmEscrowFees {
  totalEscrowFee: number;
  sellerFee: number;
  buyerFee: number;
}

export interface FirstAmTitleFees {
  sellerTitleFee: number;
  buyerTitleFee: number;
  policyType: string;
  totalFees: number;
}

export interface ProposalSet {
  transaction: TransactionData;
  oakwood: OakwoodFees;
  faEscrow: FirstAmEscrowFees;
  faTitle: FirstAmTitleFees;
}
