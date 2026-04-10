"use client";

import { useState, useEffect, useCallback } from "react";

interface Team {
  name: string;
  solved: number;
  penalty: number;
}

const INITIAL_TEAMS: Team[] = [
  { name: "Nittany Coders", solved: 7, penalty: 342 },
  { name: "Blue & White Bits", solved: 6, penalty: 289 },
  { name: "Happy Valley Hash", solved: 6, penalty: 315 },
  { name: "Recursive Lions", solved: 5, penalty: 267 },
  { name: "Stack Overflow PSU", solved: 5, penalty: 298 },
  { name: "Binary Berks", solved: 4, penalty: 245 },
  { name: "Algonauts", solved: 4, penalty: 310 },
  { name: "Segfault Squad", solved: 3, penalty: 198 },
];

export function ScoreboardDemo() {
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [flashTeam, setFlashTeam] = useState<string | null>(null);

  const tick = useCallback(() => {
    setTeams((prev) => {
      const idx = Math.floor(Math.random() * prev.length);
      const teamName = prev[idx].name;
      setFlashTeam(teamName);
      const updated = prev.map((t, i) =>
        i === idx
          ? {
              ...t,
              solved: t.solved + 1,
              penalty: t.penalty + Math.floor(Math.random() * 40) + 10,
            }
          : t
      );
      return updated.sort((a, b) => b.solved - a.solved || a.penalty - b.penalty);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 3500);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    if (flashTeam) {
      const timeout = setTimeout(() => setFlashTeam(null), 1500);
      return () => clearTimeout(timeout);
    }
  }, [flashTeam]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-blue-900 text-left">
            <th className="py-2 px-3 font-semibold text-blue-900 w-16">Rank</th>
            <th className="py-2 px-3 font-semibold text-blue-900">Team</th>
            <th className="py-2 px-3 font-semibold text-blue-900 text-center">Solved</th>
            <th className="py-2 px-3 font-semibold text-blue-900 text-right">Penalty</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, i) => (
            <tr
              key={team.name}
              className={`border-b border-gray-200 transition-all duration-700 ${
                flashTeam === team.name
                  ? "bg-green-100"
                  : i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
              }`}
            >
              <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{i + 1}</td>
              <td className="py-2.5 px-3 font-medium">
                {team.name}
                {flashTeam === team.name && (
                  <span className="ml-2 text-xs text-green-600 font-semibold animate-pulse">
                    +1 Solved!
                  </span>
                )}
              </td>
              <td className="py-2.5 px-3 text-center">
                <span className="inline-block bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded text-xs">
                  {team.solved}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-gray-500">{team.penalty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
