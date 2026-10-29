import { SponsorInquiryForm } from "@/components/sponsors/SponsorInquiryForm";
import styles from "@/components/sponsors/inquiry.module.css";
import { BackdropScene } from "@/components/ui/BackdropScene";

export const metadata = { title: "Sponsor ACM — Penn State ACM" };

export default function SponsorPage() {
  return (
    // Figma "ACM — Sponsors / Contact Us" (494:169), using its background poster.
    <BackdropScene image="/resources/sponsor/windmill.png" panelClassName={styles.panel}>
      <header className={styles.intro}>
        <div className={styles.overline}>
          <p className={styles.eyebrow}>Sponsor inquiries</p>
          <p className={styles.mark} aria-hidden="true">ACM / Penn State</p>
        </div>
        <h1 className={styles.title}>Sponsor ACM</h1>
        <p className={styles.lede}>
          Support the next generation of builders at Penn State.
          <br />
          Tell us how you’d like to partner with ACM.
        </p>
      </header>

      <hr className={styles.rule} />

      <SponsorInquiryForm />
    </BackdropScene>
  );
}
