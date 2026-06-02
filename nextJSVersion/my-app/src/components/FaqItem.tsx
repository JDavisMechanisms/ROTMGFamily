// One FAQ accordion entry. Rendered once per entry in FAQS.
export function FaqItem({
  q,
  a,
  open = false,
}: {
  q: React.ReactNode;
  a: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details open={open}>
      <summary>{q}</summary>
      <div className="ans">{a}</div>
    </details>
  );
}
