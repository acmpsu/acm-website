import Image from "next/image";
import { Mail } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { COMMITTEES } from "@/lib/constants";
import { initials, type TeamMember } from "@/lib/team";
import styles from "./team.module.css";

/** Directory card from the Figma "Resources / Team member" component (466:102). */
export function PersonCard({ member }: { member: TeamMember }) {
  const { name, role, photo, description, links } = member;
  const committee = COMMITTEES.find((c) => c.id === member.committee);
  const socials = [
    links?.linkedin && { href: links.linkedin, label: `${name} on LinkedIn`, Icon: LinkedinIcon },
    links?.github && { href: links.github, label: `${name} on GitHub`, Icon: GithubIcon },
    links?.email && { href: `mailto:${links.email}`, label: `Email ${name}`, Icon: Mail },
  ].filter((link) => !!link);

  return (
    <article className={styles.card}>
      {photo ? (
        <Image src={photo} alt={`Headshot of ${name}`} width={64} height={64} sizes="64px" className={styles.avatar} />
      ) : (
        <span className={styles.avatar} aria-hidden="true">{initials(name)}</span>
      )}

      <div className={styles.identity}>
        <p className={styles.role}>
          {committee ? <a href={`/committees#${committee.id}`}>{role}</a> : role}
        </p>
        <h3 className={styles.name}>{name}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      {socials.length > 0 ? (
        <ul className={styles.socials}>
          {socials.map(({ href, label, Icon }) => (
            <li key={href}>
              <a href={href} aria-label={label} className={styles.social} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">
                <Icon className={styles.socialIcon} />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
