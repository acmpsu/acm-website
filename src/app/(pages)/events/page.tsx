"use client";

import { useState } from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: "workshop" | "hackathon" | "social";
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Web Development Workshop",
    date: "April 18, 2026",
    time: "6:00 PM – 8:00 PM",
    location: "Innovation Hub, Room 201",
    category: "workshop",
  },
  {
    id: 2,
    title: "AI Challenge 2026",
    date: "April 25–27, 2026",
    time: "All day",
    location: "Tech Center, Building 5",
    category: "hackathon",
  },
  {
    id: 3,
    title: "Coffee & Code Social",
    date: "April 20, 2026",
    time: "4:00 PM – 6:00 PM",
    location: "Campus Café",
    category: "social",
  },
];

const categoryConfig = {
  workshop: {
    label: "Workshop",
    badgeClass: "badge-workshop",
    iconStroke: "rgba(70,100,220,0.75)",
  },
  hackathon: {
    label: "Hackathon",
    badgeClass: "badge-hackathon",
    iconStroke: "rgba(59,130,246,0.75)",
  },
  social: {
    label: "Social",
    badgeClass: "badge-social",
    iconStroke: "rgba(10,150,90,0.75)",
  },
};

function CalendarIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <rect x="2" y="3" width="12" height="11" rx="2" />
      <line x1="2" y1="6.5" x2="14" y2="6.5" />
      <line x1="5.5" y1="2" x2="5.5" y2="4.5" />
      <line x1="10.5" y1="2" x2="10.5" y2="4.5" />
    </svg>
  );
}

function ClockIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <circle cx="8" cy="8" r="6" />
      <line x1="8" y1="5" x2="8" y2="8.5" />
      <line x1="8" y1="8.5" x2="10.5" y2="10" />
    </svg>
  );
}

function PinIcon({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" />
      <circle cx="8" cy="6" r="1.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, transition: "transform 0.2s ease" }}>
      <line x1="2" y1="7" x2="12" y2="7" />
      <polyline points="8,3 12,7 8,11" />
    </svg>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const config = categoryConfig[event.category];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`glass-card ${hovered ? "glass-card--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="specular" />
      <h3 className="card-title">{event.title}</h3>
      <div className="meta-list">
        <div className="meta-row">
          <div className="meta-icon">
            <CalendarIcon stroke={config.iconStroke} />
          </div>
          <span className="meta-text">{event.date}</span>
        </div>
        <div className="meta-row">
          <div className="meta-icon">
            <ClockIcon stroke={config.iconStroke} />
          </div>
          <span className="meta-text">{event.time}</span>
        </div>
        <div className="meta-row">
          <div className="meta-icon">
            <PinIcon stroke={config.iconStroke} />
          </div>
          <span className="meta-text">{event.location}</span>
        </div>
      </div>
      <button className="btn">
        Learn More
        <ArrowIcon />
      </button>
    </div>
  );
}

export default function EventsPage() {
  return (
    <>
      <style>{`
        .events-page {
          min-height: calc(100vh + 96px);
          width: 100vw;
          position: relative;
          left: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          margin-top: -48px;
          margin-bottom: -48px;
          padding: 48px 0;
          background: linear-gradient(135deg, #f0f4f8 0%, #e1e8ed 25%, #d1dbe4 50%, #c4d4e0 75%, #b8cddc 100%);
          overflow: hidden;
        }
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: float 20s ease-in-out infinite;
        }
        .events-content {
          max-width: 1120px;
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
          position: relative;
        }
        .events-content::before {
          content: '';
          position: absolute;
          top: -50px;
          left: -100px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: particleFloat 15s ease-in-out infinite;
          pointer-events: none;
        }
        .events-content::after {
          content: '';
          position: absolute;
          bottom: -80px;
          right: -120px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: particleFloat 18s ease-in-out infinite reverse;
          pointer-events: none;
        }
        .orb1 { width: 600px; height: 600px; background: rgba(30,58,138,0.25); top: -200px; left: -100px; animation-delay: 0s; }
        .orb2 { width: 500px; height: 500px; background: rgba(59,130,246,0.2); top: 100px; right: -150px; animation-delay: -5s; }
        .orb3 { width: 400px; height: 400px; background: rgba(14,165,233,0.18); bottom: 0; left: 30%; animation-delay: -10s; }
        .orb4 { width: 350px; height: 350px; background: rgba(56,189,248,0.15); bottom: 100px; right: 10%; animation-delay: -15s; }

        .hero {
          position: relative;
          padding: 64px 0 48px;
          max-width: 700px;
          margin: 0 auto 24px;
          animation: heroFloat 12s ease-in-out infinite;
        }
        .hero-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(60,80,140,0.7);
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: clamp(42px, 6vw, 68px);
          font-weight: 300;
          line-height: 1.05;
          color: rgba(15,20,50,0.85);
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .hero-title strong {
          font-weight: 600;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: textGlow 4s ease-in-out infinite;
        }
        .hero-sub {
          font-size: 16px;
          font-weight: 400;
          color: rgba(30,40,80,0.55);
          max-width: 620px;
          line-height: 1.6;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          max-width: 1040px;
          margin: 0 auto;
          padding: 0 0 80px;
          position: relative;
        }

        .glass-card {
          position: relative;
          border-radius: 22px;
          padding: 24px 22px 20px;
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.75);
          box-shadow:
            0 8px 32px rgba(60,80,180,0.1),
            0 2px 8px rgba(60,80,180,0.06),
            inset 0 1px 0 rgba(255,255,255,0.9),
            inset 0 -1px 0 rgba(200,210,255,0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          cursor: default;
          transform: translateZ(0);
          animation:
            cardEntrance 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards,
            cardFloat 8s ease-in-out infinite 1s,
            cardGlow 6s ease-in-out infinite 2s;
          opacity: 0;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%, rgba(200,220,255,0.15) 100%);
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .glass-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent);
          border-radius: 22px 22px 0 0;
          transition: opacity 0.4s ease;
        }
        .glass-card--hovered {
          transform: translateY(-8px) scale(1.02) rotateX(2deg);
          box-shadow:
            0 25px 80px rgba(60,80,180,0.2),
            0 8px 25px rgba(60,80,180,0.15),
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 -1px 0 rgba(180,200,255,0.4);
        }
        .glass-card--hovered::before {
          opacity: 0.8;
        }
        .glass-card--hovered::after {
          opacity: 0.9;
        }

        .specular {
          position: absolute;
          top: 12px; right: 16px;
          width: 60px; height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 35%, rgba(255,255,255,0.5), transparent 70%);
          pointer-events: none;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(20px) scale(1.08) rotate(2deg); }
          50% { transform: translateY(-15px) translateX(-25px) scale(0.92) rotate(-1deg); }
          75% { transform: translateY(-35px) translateX(10px) scale(1.05) rotate(1.5deg); }
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.8; transform: scale(1.2) rotate(180deg); }
        }

        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          33% { transform: translateY(-3px) rotateX(0.5deg) rotateY(0.3deg); }
          66% { transform: translateY(2px) rotateX(-0.3deg) rotateY(-0.2deg); }
        }

        @keyframes cardGlow {
          0%, 100% {
            box-shadow:
              0 8px 32px rgba(60,80,180,0.1),
              0 2px 8px rgba(60,80,180,0.06),
              inset 0 1px 0 rgba(255,255,255,0.9),
              inset 0 -1px 0 rgba(200,210,255,0.2);
          }
          50% {
            box-shadow:
              0 12px 40px rgba(60,80,180,0.15),
              0 4px 12px rgba(60,80,180,0.1),
              inset 0 1px 0 rgba(255,255,255,0.95),
              inset 0 -1px 0 rgba(200,210,255,0.3);
          }
        }

        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(15px) scale(1.1) rotate(90deg); }
          50% { transform: translateY(-10px) translateX(-20px) scale(0.9) rotate(180deg); }
          75% { transform: translateY(-25px) translateX(10px) scale(1.05) rotate(270deg); }
        }

        @keyframes textGlow {
          0%, 100% {
            background: linear-gradient(135deg, #1e3a8a, #3b82f6, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          50% {
            background: linear-gradient(135deg, #3b82f6, #06b6d4, #1e3a8a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }

        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.01); }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px 4px 8px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .badge-workshop {
          background: rgba(80,130,255,0.12);
          color: rgba(40,80,200,0.85);
          border: 0.5px solid rgba(80,130,255,0.25);
        }
        .badge-workshop .badge-dot { background: #4a7af5; }
        .badge-hackathon {
          background: rgba(59,130,246,0.12);
          color: rgba(30,64,175,0.85);
          border: 0.5px solid rgba(59,130,246,0.25);
        }
        .badge-hackathon .badge-dot { background: #3b82f6; }
        .badge-social {
          background: rgba(30,180,130,0.12);
          color: rgba(10,120,80,0.85);
          border: 0.5px solid rgba(30,180,130,0.25);
        }
        .badge-social .badge-dot { background: #1eb882; }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: rgba(10,15,45,0.88);
          line-height: 1.25;
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }

        .meta-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }
        .meta-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .meta-icon {
          width: 30px; height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(255,255,255,0.6);
          border: 0.5px solid rgba(255,255,255,0.8);
          box-shadow: 0 1px 4px rgba(60,80,180,0.1);
        }
        .meta-text {
          font-size: 13px;
          color: rgba(20,30,80,0.6);
          line-height: 1.4;
          padding-top: 7px;
        }

        .btn {
          width: 100%;
          padding: 11px 16px;
          border-radius: 14px;
          border: 0.5px solid rgba(255,255,255,0.7);
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.01em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
          background: rgba(255,255,255,0.5);
          color: rgba(15,30,120,0.85);
          box-shadow:
            0 2px 8px rgba(60,80,180,0.12),
            inset 0 1px 0 rgba(255,255,255,0.9),
            inset 0 -1px 0 rgba(180,200,255,0.3);
          font-family: inherit;
        }
        .btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0));
          pointer-events: none;
        }
        .btn:hover {
          background: rgba(255,255,255,0.7);
          box-shadow:
            0 4px 16px rgba(60,80,180,0.18),
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 -1px 0 rgba(180,200,255,0.4);
          transform: translateY(-1px);
        }

        @media (max-width: 680px) {
          .events-grid { grid-template-columns: 1fr; padding: 0 20px 60px; }
          .hero { padding: 48px 20px 32px; }
        }
      `}</style>

      <div className="events-page">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-orb orb3" />
        <div className="bg-orb orb4" />

        <div className="events-content">
          <section className="hero">
            <p className="hero-eyebrow">ACM Student Chapter · Spring 2026</p>
            <h1 className="hero-title">
              Upcoming<br />
              <strong>Events</strong>
            </h1>
            <p className="hero-sub">
              Join us for workshops, hackathons, and networking events. Learn new skills, build projects, and connect with fellow students.
            </p>
          </section>

          <section className="events-grid">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
