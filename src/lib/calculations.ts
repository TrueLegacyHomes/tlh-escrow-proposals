import { lookupEscrowFee } from './fee-tables/fa-escrow-rates';
import { lookupTitleFee } from './fee-tables/fa-title-rates';
import type { OakwoodFees, FirstAmEscrowFees, FirstAmTitleFees } from './types';

/**
 * Calculate Oakwood Escrow fees from manually-entered seller and buyer fees.
 */
export function calculateOakwoodFees(
  sellerFee: number,
  buyerFee: number,
): OakwoodFees {
  return {
    sellerFee,
    buyerFee,
    totalFees: sellerFee + buyerFee,
  };
}

/**
 * Calculate First American Escrow fees based on purchase price.
 * The total escrow fee is looked up from the rate table, then split
 * evenly between seller and buyer.
 */
export function calculateFAEscrowFees(
  purchasePrice: number,
): FirstAmEscrowFees {
  const totalEscrowFee = lookupEscrowFee(purchasePrice);
  const half = totalEscrowFee / 2;

  return {
    totalEscrowFee,
    sellerFee: half,
    buyerFee: half,
  };
}

/**
 * Calculate First American Title fees based on purchase price.
 *
 * Looks up the Eagle Owner's Policy premium from the rate table.
 * Seller pays the full title premium.
 * Buyer pays 10% of seller fee (binder).
 */
export function calculateFATitleFees(
  purchasePrice: number,
): FirstAmTitleFees {
  const sellerTitleFee = lookupTitleFee(purchasePrice);
  const buyerTitleFee = sellerTitleFee * 0.10; // binder = 10% of seller fee

  return {
    sellerTitleFee,
    buyerTitleFee,
    policyType: "Eagle Owner's Policy",
    totalFees: sellerTitleFee + buyerTitleFee,
  };
}
