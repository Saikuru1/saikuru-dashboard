export default function MetricCard({ label, value, subtitle }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {subtitle && <div className="metric-sub">{subtitle}</div>}
    </div>
  );
}