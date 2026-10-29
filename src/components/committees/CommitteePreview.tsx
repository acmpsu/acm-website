import type { CSSProperties } from "react";

import type { CommitteePreview as Preview } from "@/lib/constants";
import styles from "./committees.module.css";

/** Data-driven positions are passed to CSS as custom properties. */
const vars = (values: Record<string, string | number>) => values as CSSProperties;

/** The illustrative mockup inside a sample-project window. Decorative, so it is hidden from assistive tech. */
export function CommitteePreview({ preview }: { preview: Preview }) {
  return (
    <div className={`${styles.preview} ${styles[preview.kind]}`} aria-hidden="true">
      {renderPreview(preview)}
    </div>
  );
}

function renderPreview(preview: Preview) {
  switch (preview.kind) {
    case "checklist":
      return preview.items.map((item, index) => (
        <p key={item.label} className={styles.checkRow}>
          <span className={styles.label}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.checkLabel}>{item.label}</span>
          <span className={styles.label}>{item.tag}</span>
        </p>
      ));
    case "wireframe":
      return (
        <>
          <span className={styles.wireNav} />
          <span className={styles.wireRow}>
            <span className={styles.wireHero}>{preview.headline}</span>
            <span className={styles.wireSide} />
          </span>
          <span className={styles.wireTiles}>
            <span className={styles.wireTile} />
            <span className={styles.wireTile} />
            <span className={styles.wireTile} />
          </span>
        </>
      );
    case "qa":
      return (
        <>
          <span className={`${styles.label} ${styles.caps}`}>Question</span>
          <span className={styles.question}>{preview.question}</span>
          <span className={`${styles.label} ${styles.caps}`}>Proposed answer</span>
          <span className={styles.answer}>{preview.answer}</span>
          <span className={`${styles.label} ${styles.caps}`}>{preview.sources.join("  /  ")}</span>
        </>
      );
    case "circuit":
      return (
        <>
          {Array.from({ length: preview.qubits }, (_, qubit) => (
            <span key={qubit} className={styles.qubit} style={vars({ "--row": qubit })}>
              <span className={styles.label}>q[{qubit}]</span>
              <span className={styles.wire} />
            </span>
          ))}
          {preview.gates.map((gate) => (
            <span key={`${gate.qubit}-${gate.at}`}>
              {gate.link ? (
                <span className={styles.link} style={vars({ "--at": gate.at, "--from": gate.link[0], "--to": gate.link[1] })} />
              ) : null}
              <span className={styles.gate} style={vars({ "--at": gate.at, "--row": gate.qubit })}>{gate.label}</span>
            </span>
          ))}
        </>
      );
    case "steps":
      return preview.items.map((item, index) => (
        <span key={item} className={styles.step}>
          <span className={styles.label}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.stepTitle}>{item}</span>
          <span className={`${styles.label} ${styles.caps} ${styles.small}`}>{preview.caption}</span>
        </span>
      ));
    case "chart": {
      const max = Math.max(...preview.values);
      return (
        <>
          <span className={`${styles.label} ${styles.caps} ${styles.small}`}>{preview.label}</span>
          <span className={styles.bars}>
            {preview.values.map((value, index) => (
              <span key={index} className={styles.bar} style={vars({ "--h": `${(value / max) * 100}%` })} />
            ))}
          </span>
        </>
      );
    }
  }
}
