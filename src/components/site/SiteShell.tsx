import { Header } from "@/components/Header";

type SiteShellProps = {
  children: React.ReactNode;
  /**
   * `full-bleed` pages run edge to edge and their first block sits under the floating
   * header (it reads --page-top to clear it). `contained` pages get a centered column
   * that starts below the header.
   */
  layout: "full-bleed" | "contained";
};

/** Header + main, used by every route group so the shell is identical site-wide. The home page adds the footer inside its scroll stack. */
export function SiteShell({ children, layout }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        className={
          layout === "full-bleed"
            ? "page-full-bleed flex-1"
            : "mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-[calc(var(--site-header-height)+3rem)] sm:px-8"
        }
      >
        {children}
      </main>
    </div>
  );
}
