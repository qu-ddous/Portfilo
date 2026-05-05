import { Inbox } from 'lucide-react';

const EmptyState = ({
  message = 'No data found',
  submessage = 'Try adjusting your filters or adding new items.',
}) => (
  <div className="flex flex-col items-center justify-center p-14 text-center space-y-4">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
      <Inbox size={30} />
    </div>
    <div>
      <h4 className="text-base font-bold text-slate-700">{message}</h4>
      <p className="text-sm text-slate-400 mt-1 font-medium">{submessage}</p>
    </div>
  </div>
);

export default EmptyState;
