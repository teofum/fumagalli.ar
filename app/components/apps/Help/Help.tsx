import HelpContent from './HelpContent';
import HelpTreeView from './HelpTreeView';

export default function Help() {
  return (
    <div className="flex flex-row gap-0.5">
      <div className="w-48 min-w-48 flex flex-col">
        <HelpTreeView />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <HelpContent />
      </div>
    </div>
  );
}
