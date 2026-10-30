import Image from "next/image";
import { listOwnTickets } from "@/lib/tickets/server";
import { collectionMode } from "@/lib/tickets/collection";
import { previewCollection } from "@/lib/tickets/preview";
import { ticketMono } from "@/components/tickets/typography";
import { MyEventsCollection } from "@/components/my-events/MyEventsCollection";
import styles from "@/components/my-events/myEvents.module.css";
export const metadata = {
  title: "My events — Penn State ACM",
  robots: { index: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";
export default async function MyEventsPage() {
  const result = await listOwnTickets();
  const preview = collectionMode(result.state) === "preview";
  // One request-time snapshot keeps server-rendered filters and client hydration consistent.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  return (
    <section className={`${styles.scene} ${ticketMono.variable}`}>
      <Image
        src="/resources/events/clouds.png"
        alt=""
        width={2172}
        height={724}
        unoptimized
        className={styles.clouds}
        loading="eager"
      />
      <MyEventsCollection
        tickets={preview ? previewCollection(now).summaries : result.tickets}
        preview={preview}
        now={now}
        state={result.state}
      />
    </section>
  );
}
