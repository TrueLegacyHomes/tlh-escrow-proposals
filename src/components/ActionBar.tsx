import { useState } from 'preact/hooks';
import type { ProposalSet } from '../lib/types';
import { parseAddressForFilename } from '../lib/format';

interface ActionBarProps {
  proposal: ProposalSet;
}

export default function ActionBar({ proposal }: ActionBarProps) {
  const [downloading, setDownloading] = useState(false);

  /** Generate all 3 PDFs and trigger browser downloads */
  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      // Dynamically import PDF generators to keep initial bundle small
      const [{ generateOakwoodPDF }, { generateFAEscrowPDF }, { generateFATitlePDF }] =
        await Promise.all([
          import('../lib/pdf/oakwood-pdf'),
          import('../lib/pdf/fa-escrow-pdf'),
          import('../lib/pdf/fa-title-pdf'),
        ]);

      const { street, number } = parseAddressForFilename(proposal.transaction.propertyAddress);
      const addrSuffix = number ? `${street}_${number}` : street;

      // Generate all three PDFs
      const oakwoodDoc = generateOakwoodPDF(proposal);
      const faEscrowDoc = generateFAEscrowPDF(proposal);
      const faTitleDoc = generateFATitlePDF(proposal);

      // Download each via temporary anchor tags
      // Naming: Escrow_Fee_Oakwood_Main St_1234
      const downloads: [Blob, string][] = [
        [oakwoodDoc.output('blob'), `Escrow_Fee_Oakwood_${addrSuffix}.pdf`],
        [faEscrowDoc.output('blob'), `Escrow_Fee_First AM_${addrSuffix}.pdf`],
        [faTitleDoc.output('blob'), `Title_Fee_First AM_${addrSuffix}.pdf`],
      ];

      for (const [blob, filename] of downloads) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        // Small delay to avoid browser download throttling
        await new Promise((r) => setTimeout(r, 300));
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDFs. Check console for details.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div class="flex justify-center">
      <button
        type="button"
        onClick={handleDownloadAll}
        disabled={downloading}
        class={
          'inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 ' +
          'text-white font-semibold transition-colors text-lg ' +
          (downloading
            ? 'bg-[#38b5ad]/60 cursor-not-allowed'
            : 'bg-[#38b5ad] hover:bg-[#2f9e97] active:bg-[#278f88]')
        }
      >
        {downloading ? (
          <Spinner />
        ) : (
          <DownloadIcon />
        )}
        {downloading ? 'Generating...' : 'Download All Proposals'}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inline SVG icons                                                    */
/* ------------------------------------------------------------------ */

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      class="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
