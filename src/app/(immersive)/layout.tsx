import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Full-bleed pages: unlike (pages), content is not boxed into a centered column.
export default function ImmersiveLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col"><Header /><main className="flex-1">{children}</main><Footer /></div>;
}
