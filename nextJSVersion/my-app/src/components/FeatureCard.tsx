// One feature card on the Home tab. Rendered once per entry in HOME_FEATURES.
export function FeatureCard({
  ic,
  title,
  body,
}: {
  ic: string;
  title: string;
  body: string;
}) {
  return (
    <div className="card">
      <div className="ic">{ic}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
