import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { previewCollection } from "@/lib/tickets/preview";
import { TicketBackdrop } from "@/components/tickets/TicketBackdrop";
import { BoardingPass } from "@/components/tickets/BoardingPass";
import styles from "@/components/tickets/tickets.module.css";
export const metadata = { title: "Sample boarding pass — Penn State ACM", robots: { index: false } };
export const dynamic = "force-dynamic";
export default async function PreviewTicketPage({ params }: { params: Promise<{ previewId: string }> }) {
  if (isSupabaseConfigured) redirect("/my-events");
  const { previewId } = await params;
  const ticket = previewCollection().tickets.find(item => item.id === previewId);
  if (!ticket) notFound();
  return <TicketBackdrop><h1 className={styles.sceneHeading}>A little ticket. A good memory.</h1><p className={styles.sceneMessage}>Preview ticket · Sample event details. This ticket isn’t an actual RSVP.</p><BoardingPass ticket={ticket} /><div className={styles.controls}><Link href="/my-events" className={styles.secondary}>Back to My events</Link></div></TicketBackdrop>;
}
