import type { ProposalSet } from '../lib/types';
import OakwoodPreview from './OakwoodPreview';
import FirstAmEscrowPreview from './FirstAmEscrowPreview';
import FirstAmTitlePreview from './FirstAmTitlePreview';

interface ProposalPreviewProps {
  proposal: ProposalSet;
}

export default function ProposalPreview({ proposal }: ProposalPreviewProps) {
  return (
    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4">Preview</h2>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OakwoodPreview proposal={proposal} />
        <FirstAmEscrowPreview proposal={proposal} />
        <FirstAmTitlePreview proposal={proposal} />
      </div>
    </div>
  );
}
