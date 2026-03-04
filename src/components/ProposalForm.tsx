import { useCallback } from 'preact/hooks';
import type { TransactionData } from '../lib/types';
import { formatCurrency } from '../lib/format';

interface ProposalFormProps {
  transaction: TransactionData;
  setTransaction: (tx: TransactionData) => void;
  oakwoodSellerFee: number;
  setOakwoodSellerFee: (fee: number) => void;
  oakwoodBuyerFee: number;
  setOakwoodBuyerFee: (fee: number) => void;
}

export default function ProposalForm({
  transaction,
  setTransaction,
  oakwoodSellerFee,
  setOakwoodSellerFee,
  oakwoodBuyerFee,
  setOakwoodBuyerFee,
}: ProposalFormProps) {
  const updateField = useCallback(
    <K extends keyof TransactionData>(field: K, value: TransactionData[K]) => {
      setTransaction({ ...transaction, [field]: value });
    },
    [transaction, setTransaction],
  );

  /** Format the purchase price input on blur */
  const handlePriceBlur = useCallback(() => {
    if (transaction.purchasePrice > 0) {
      // The display formatting happens via the input value;
      // we just ensure the number is stored cleanly
      const rounded = Math.round(transaction.purchasePrice * 100) / 100;
      updateField('purchasePrice', rounded);
    }
  }, [transaction.purchasePrice, updateField]);

  /** Parse a currency-formatted string into a number */
  const parseCurrency = (raw: string): number => {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  /** Auto-format phone to (XXX) XXX-XXXX */
  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits.length ? `(${digits}` : '';
    if (digits.length <= 6)
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const inputClass =
    'w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 ' +
    'placeholder-gray-400 focus:border-[#38b5ad] focus:ring-2 focus:ring-[#38b5ad]/30 ' +
    'focus:outline-none transition-colors';

  const inputClassWide =
    'w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 ' +
    'placeholder-gray-400 focus:border-[#38b5ad] focus:ring-2 focus:ring-[#38b5ad]/30 ' +
    'focus:outline-none transition-colors';

  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1';

  return (
    <div class="rounded-2xl bg-[#f7f5e7] p-6 shadow-sm border border-gray-200">
      <h2 class="text-xl font-bold text-gray-900 mb-6">New Escrow Proposal</h2>

      {/* Agent Info */}
      <fieldset class="mb-6">
        <legend class="text-sm font-bold uppercase tracking-wider text-[#38b5ad] mb-3">
          Agent Info
        </legend>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label class={labelClass} htmlFor="agentName">
              Agent Name
            </label>
            <input
              id="agentName"
              type="text"
              class={inputClass}
              placeholder="Jane Smith"
              value={transaction.agentName}
              onInput={(e) =>
                updateField('agentName', (e.target as HTMLInputElement).value)
              }
            />
          </div>
          <div>
            <label class={labelClass} htmlFor="agentPhone">
              Agent Phone
            </label>
            <input
              id="agentPhone"
              type="tel"
              class={inputClass}
              placeholder="(619) 980-3333"
              value={transaction.agentPhone}
              onInput={(e) => {
                const formatted = formatPhone((e.target as HTMLInputElement).value);
                updateField('agentPhone', formatted);
              }}
            />
          </div>
          <div>
            <label class={labelClass} htmlFor="agentEmail">
              Agent Email
            </label>
            <input
              id="agentEmail"
              type="email"
              class={inputClass}
              placeholder="jane@brokerage.com"
              value={transaction.agentEmail}
              onInput={(e) =>
                updateField('agentEmail', (e.target as HTMLInputElement).value)
              }
            />
          </div>
        </div>
      </fieldset>

      {/* Property Info */}
      <fieldset class="mb-6">
        <legend class="text-sm font-bold uppercase tracking-wider text-[#38b5ad] mb-3">
          Property Info
        </legend>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label class={labelClass} htmlFor="propertyAddress">
              Property Address
            </label>
            <input
              id="propertyAddress"
              type="text"
              class={inputClassWide}
              placeholder="1234 Main St, Riverside, CA 92501"
              value={transaction.propertyAddress}
              onInput={(e) =>
                updateField(
                  'propertyAddress',
                  (e.target as HTMLInputElement).value,
                )
              }
            />
          </div>
          <div>
            <label class={labelClass} htmlFor="purchasePrice">
              Purchase Price
            </label>
            <input
              id="purchasePrice"
              type="text"
              class={inputClass}
              placeholder="$500,000"
              value={
                transaction.purchasePrice > 0
                  ? formatCurrency(transaction.purchasePrice)
                  : ''
              }
              onInput={(e) => {
                const raw = (e.target as HTMLInputElement).value;
                updateField('purchasePrice', parseCurrency(raw));
              }}
              onBlur={handlePriceBlur}
            />
          </div>
          <div>
            <label class={labelClass} htmlFor="estimatedCOE">
              Estimated COE
            </label>
            <input
              id="estimatedCOE"
              type="date"
              class={inputClass}
              value={transaction.estimatedCOE}
              onInput={(e) =>
                updateField(
                  'estimatedCOE',
                  (e.target as HTMLInputElement).value,
                )
              }
            />
          </div>
        </div>
      </fieldset>

      {/* Oakwood Fees */}
      <fieldset>
        <legend class="text-sm font-bold uppercase tracking-wider text-[#38b5ad] mb-3">
          Oakwood Fees
        </legend>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <label class={labelClass} htmlFor="oakwoodSellerFee">
              Seller Fee
            </label>
            <input
              id="oakwoodSellerFee"
              type="text"
              class={inputClass}
              placeholder="$1,500"
              value={oakwoodSellerFee > 0 ? formatCurrency(oakwoodSellerFee) : ''}
              onInput={(e) => {
                const raw = (e.target as HTMLInputElement).value;
                setOakwoodSellerFee(parseCurrency(raw));
              }}
            />
          </div>
          <div>
            <label class={labelClass} htmlFor="oakwoodBuyerFee">
              Buyer Fee
            </label>
            <input
              id="oakwoodBuyerFee"
              type="text"
              class={inputClass}
              placeholder="$1,500"
              value={oakwoodBuyerFee > 0 ? formatCurrency(oakwoodBuyerFee) : ''}
              onInput={(e) => {
                const raw = (e.target as HTMLInputElement).value;
                setOakwoodBuyerFee(parseCurrency(raw));
              }}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
