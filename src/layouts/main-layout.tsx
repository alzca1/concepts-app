import { AppHeader } from "./components/app-header";
import "./main-layout.css";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <AppHeader />

      <main>{children}</main>
    </div>
  );
}
