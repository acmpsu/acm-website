import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Clouds } from "@/components/ui/Clouds";
import { FOOTER_NAV } from "@/lib/constants";
import styles from "./site/footer.module.css";

/**
 * Site footer from the Figma (482:151): gradient sky, cloud bank, links. The credits
 * terminal only appears on the home page (`credits`).
 */
export function Footer({ credits = false }: { credits?: boolean }) {
  return (
    <footer className={styles.footer}>
      <Image
        src="/resources/footer/gradient.png"
        alt=""
        fill
        sizes="100vw"
        className={styles.gradient}
      />

      <div className={styles.cloudBand} aria-hidden="true">
        <Clouds art="bank" sizes="82vw" className={styles.clouds} />
      </div>

      {credits ? (
        <div className={styles.credits}>
          {/* A playful "agent session" crediting the team (Figma "Contact Activity Log"). */}
          <figure className={styles.terminal} aria-label="Website credits">
            <div className={styles.terminalBar} aria-hidden="true">
              <span />
              <span />
              <span />
              <p>agent · www.psuacm.org/</p>
            </div>
            <div className={styles.terminalBody}>
              <p>
                <span className={styles.prompt} aria-hidden="true">
                  ❯
                </span>{" "}
                who made this website?
              </p>
              <p>
                <span className={styles.prompt} aria-hidden="true">
                  ⚝
                </span>{" "}
                acm · get_maintainers …{" "}
                <span className={styles.result}>ok</span>
              </p>
              <p>
                <span className={styles.prompt} aria-hidden="true">
                  ⚝
                </span>{" "}
                git · count_commits …{" "}
                <span className={styles.result}>way too many</span>
              </p>
              <figcaption className={styles.answer}>
                Created at State College by the ACM Dev Team.
                <br />
                Powered by the 3 C’s: Cursor, Claude, and Codex
              </figcaption>
              <p aria-hidden="true">
                <span className={styles.prompt}>❯</span>{" "}
                <span className={styles.cursor} />
              </p>
            </div>
          </figure>
        </div>
      ) : null}

      <div className={styles.bottom}>
        <Link
          href="/"
          className={styles.wordmark}
          aria-label="Penn State ACM home"
        >
          <Image
            src="/logos/acm.png"
            alt=""
            width={64}
            height={64}
            sizes="64px"
          />
        </Link>

        <nav aria-label="Footer">
          <ul className={styles.links}>
            {FOOTER_NAV.map((link) => (
              <li key={link.href}>
                <Button variant="onDark" href={link.href}>
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.meta}>
          <p className={styles.copyright}>
            © ACM {new Date().getFullYear()} · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
