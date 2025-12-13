export default function AppShell({ header, children }) {
  return (
    <div className="app-shell">
      {header}
      {children}
    </div>
  );
}