// One nav tab button. Rendered once per tab.
export function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className={"tab" + (active ? " active" : "")} onClick={onClick}>
      {label}
    </button>
  );
}
