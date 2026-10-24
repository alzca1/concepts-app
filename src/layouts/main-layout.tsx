import { AppHeader } from "./components/app-header";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <AppHeader />

      <main>{children}</main>
    </div>
  );
}
