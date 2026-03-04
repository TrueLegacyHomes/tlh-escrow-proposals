import type { ProposalSet } from '../lib/types';
import { formatCurrency, formatDate } from '../lib/format';

interface OakwoodPreviewProps {
  proposal: ProposalSet;
}

export default function OakwoodPreview({ proposal }: OakwoodPreviewProps) {
  const { transaction, oakwood } = proposal;

  return (
    <div class="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-[#f8f7f4]">
      {/* Gold header bar */}
      <div class="bg-[#af9c6e] px-5 py-3">
        <h3 class="text-white font-bold text-lg">Oakwood Escrow</h3>
        <p class="text-white/80 text-xs">A Division of Lawyers Title Company</p>
      </div>

      <div class="p-5">
        {/* Officer */}
        <div class="mb-4">
          <p class="text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Escrow Officer
          </p>
          <p class="text-sm font-medium text-[#2c2c2c]">Cathia Serpa</p>
        </div>

        {/* Transaction details */}
        <div class="mb-4 space-y-2">
          <h4 class="text-xs uppercase tracking-wider text-[#2c2c2c] font-bold border-b border-gray-300 pb-1">
            Transaction Details
          </h4>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Property</span>
            <span class="text-[#2c2c2c] font-medium text-right max-w-[60%] truncate">
              {transaction.propertyAddress || '--'}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Purchase Price</span>
            <span class="text-[#2c2c2c] font-medium">
              {transaction.purchasePrice > 0
                ? formatCurrency(transaction.purchasePrice)
                : '--'}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Est. COE</span>
            <span class="text-[#2c2c2c] font-medium">
              {transaction.estimatedCOE
                ? formatDate(transaction.estimatedCOE)
                : '--'}
            </span>
          </div>
        </div>

        {/* Fee table */}
        <div class="mb-4">
          <h4 class="text-xs uppercase tracking-wider text-[#2c2c2c] font-bold border-b border-gray-300 pb-1 mb-2">
            Fee Estimate
          </h4>
          <div class="space-y-1.5">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Seller Fee</span>
              <span class="text-[#2c2c2c] font-medium">
                {formatCurrency(oakwood.sellerFee)}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Buyer Fee</span>
              <span class="text-[#2c2c2c] font-medium">
                {formatCurrency(oakwood.buyerFee)}
              </span>
            </div>
            <div class="flex justify-between text-sm font-bold border-t border-gray-300 pt-1.5">
              <span class="text-[#2c2c2c]">Total</span>
              <span class="text-[#af9c6e]">
                {formatCurrency(oakwood.totalFees)}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p class="text-[10px] text-gray-400 leading-tight">
          This is an estimate only. Actual fees may vary based on transaction
          specifics, amendments, and additional services requested.
        </p>
      </div>
    </div>
  );
}
