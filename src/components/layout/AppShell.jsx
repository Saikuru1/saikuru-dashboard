export default function AppShell({ header, children }) {
  return (
    <div className="app-shell">
      {header && <header className="app-header">{header}</header>}
      <main className="app-main">{children}</main>
    </div>
  );
}