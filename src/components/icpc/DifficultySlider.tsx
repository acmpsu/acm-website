"use client";

import { useState } from "react";

const LEVELS = [
  {
    label: "Beginner",
    topics: ["BFS / DFS", "Sorting", "Basic math", "String manipulation", "Greedy basics"],
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-700",
  },
  {
    label: "Intermediate",
    topics: ["Dynamic Programming", "Union-Find", "Binary Search", "Graph shortest paths", "Backtracking"],
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    dot: "bg-yellow-700",
  },
  {
    label: "Advanced",
    topics: ["Max-flow / Min-cut", "Computational Geometry", "Segment Trees", "Suffix Arrays", "Heavy-Light Decomposition"],
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-700",
  },
];

export function DifficultySlider() {
  const [level, setLevel] = useState(0);
  const current = LEVELS[level];

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-sm font-medium text-gray-500">
        <span>Beginner</span>
        <span>Advanced</span>
      </div>
      <input
        type="range"
        min={0}
        max={2}
        step={1}
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
        aria-label="Difficulty level"
      />
      <div className={`mt-5 rounded-lg p-5 border ${current.bg} ${current.border} transition-colors duration-300`}>
        <h4 className={`font-bold text-lg ${current.color}`}>{current.label}</h4>
        <p className="text-sm text-gray-600 mt-1 mb-3">Example topics at this level:</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {current.topics.map((topic) => (
            <li key={topic} className="text-sm text-gray-700 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${current.dot} shrink-0`} />
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
