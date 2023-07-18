import Menu from '~/components/ui/Menu';
import { usePaintState } from '../context';

export default function PaintEditMenu() {
  const [state, setState] = usePaintState();

  const canUndo = state.history.length > state.undoCount + 1;
  const undo = () => {
    const ctx = state.canvas?.getContext('2d');
    if (!ctx || !canUndo) return;

    const restored = state.history.at(state.undoCount + 1);
    if (restored) {
      ctx.putImageData(restored, 0, 0);
      setState({ undoCount: state.undoCount + 1, selection: null });
    }
  };

  const canRedo = state.undoCount > 0;
  const redo = () => {
    const ctx = state.canvas?.getContext('2d');
    if (!ctx || !canRedo) return;

    const restored = state.history.at(state.undoCount - 1);
    if (restored) {
      ctx.putImageData(restored, 0, 0);
      setState({ undoCount: state.undoCount - 1, selection: null });
    }
  };

  return (
    <Menu.Root trigger={<Menu.Trigger>Edit</Menu.Trigger>}>
      <Menu.Item label="Undo" onSelect={undo} disabled={!canUndo} />
      <Menu.Item label="Redo" onSelect={redo} disabled={!canRedo} />
    </Menu.Root>
  );
}
