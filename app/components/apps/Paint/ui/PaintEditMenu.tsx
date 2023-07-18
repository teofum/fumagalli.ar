import Menu from '~/components/ui/Menu';

export default function PaintEditMenu() {
  return (
    <Menu.Root trigger={<Menu.Trigger>Edit</Menu.Trigger>}>
      {/* <Menu.Item label="Undo" onSelect={undo} disabled={state.history.length} />
    <Menu.Item label="Redo" onSelect={redo} /> */}
    </Menu.Root>
  );
}
