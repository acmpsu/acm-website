"use client";

import { useState, useRef } from "react";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  diffColor: string;
  statement: string;
  inputDesc: string;
  outputDesc: string;
  testCases: { input: string; expected: string }[];
  hint: string;
  solution: string;
  starterCode: string;
}

const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "Maximum Subarray Sum",
    difficulty: "Medium",
    diffColor: "text-yellow-400",
    statement:
      "Given an array of n integers, determine the maximum sum of any contiguous subarray.",
    inputDesc: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
    outputDesc: "6",
    testCases: [
      { input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", expected: "6" },
      { input: "[1]", expected: "1" },
      { input: "[-1, -2, -3]", expected: "-1" },
      { input: "[5, -3, 5]", expected: "7" },
    ],
    hint: "Think about Kadane's Algorithm. Track the maximum sum ending at each position and update the overall maximum.",
    solution: `function solve(arr) {
  let maxCurrent = arr[0];
  let maxGlobal = arr[0];
  for (let i = 1; i < arr.length; i++) {
    maxCurrent = Math.max(arr[i], maxCurrent + arr[i]);
    maxGlobal = Math.max(maxGlobal, maxCurrent);
  }
  return maxGlobal;
}`,
    starterCode: `function solve(arr) {\n  // Your code here\n  \n}`,
  },
  {
    id: 2,
    title: "Two Sum",
    difficulty: "Easy",
    diffColor: "text-green-400",
    statement:
      "Given an array of integers and a target value, return the indices of two numbers that add up to the target. You may assume each input has exactly one solution.",
    inputDesc: "arr = [2, 7, 11, 15], target = 9",
    outputDesc: "[0, 1]",
    testCases: [
      { input: "[2, 7, 11, 15], 9", expected: "[0, 1]" },
      { input: "[3, 2, 4], 6", expected: "[1, 2]" },
      { input: "[3, 3], 6", expected: "[0, 1]" },
    ],
    hint: "Use a hash map to store the complement of each number as you iterate.",
    solution: `function solve(arr, target) {
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (complement in map) return [map[complement], i];
    map[arr[i]] = i;
  }
}`,
    starterCode: `function solve(arr, target) {\n  // Your code here\n  \n}`,
  },
  {
    id: 3,
    title: "Longest Increasing Subsequence",
    difficulty: "Hard",
    diffColor: "text-red-400",
    statement:
      "Given an array of integers, find the length of the longest strictly increasing subsequence.",
    inputDesc: "[10, 9, 2, 5, 3, 7, 101, 18]",
    outputDesc: "4",
    testCases: [
      { input: "[10, 9, 2, 5, 3, 7, 101, 18]", expected: "4" },
      { input: "[0, 1, 0, 3, 2, 3]", expected: "4" },
      { input: "[7, 7, 7, 7]", expected: "1" },
    ],
    hint: "Use dynamic programming with binary search for an O(n log n) solution. Maintain a tails array where tails[i] is the smallest tail element for an increasing subsequence of length i+1.",
    solution: `function solve(nums) {
  const tails = [];
  for (const num of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = num;
  }
  return tails.length;
}`,
    starterCode: `function solve(nums) {\n  // Your code here\n  \n}`,
  },
];

export function SampleProblem() {
  const [problemIdx, setProblemIdx] = useState(0);
  const [code, setCode] = useState(PROBLEMS[0].starterCode);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [results, setResults] = useState<
    { passed: boolean; input: string; expected: string; got: string }[] | null
  >(null);
  const [running, setRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const problem = PROBLEMS[problemIdx];

  function switchProblem(idx: number) {
    setProblemIdx(idx);
    setCode(PROBLEMS[idx].starterCode);
    setShowHint(false);
    setShowSolution(false);
    setResults(null);
  }

  function runTests() {
    setRunning(true);
    setResults(null);

    setTimeout(() => {
      const testResults = problem.testCases.map((tc) => {
        try {
          const fn = new Function(
            code + `\nreturn solve(${tc.input});`
          );
          const result = fn();
          const got = JSON.stringify(result);
          const expected = tc.expected;
          return {
            passed: got === expected,
            input: tc.input,
            expected,
            got,
          };
        } catch (err) {
          return {
            passed: false,
            input: tc.input,
            expected: tc.expected,
            got: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
          };
        }
      });
      setResults(testResults);
      setRunning(false);
    }, 600);
  }

  function handleTab(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = code.substring(0, start) + "  " + code.substring(end);
      setCode(updated);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  }

  const allPassed = results && results.every((r) => r.passed);

  return (
    <div className="space-y-4">
      {/* Problem tabs */}
      <div className="flex gap-2 flex-wrap">
        {PROBLEMS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => switchProblem(i)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              i === problemIdx
                ? "glass-card text-gray-900 shadow-lg scale-105"
                : "bg-white/50 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-white/80"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Problem card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="text-lg font-bold text-gray-900 font-mono">{problem.title}</h4>
          <span className={`text-xs font-bold uppercase tracking-wider ${problem.diffColor}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{problem.statement}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Sample Input</p>
            <pre className="text-sm text-emerald-600 font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              {problem.inputDesc}
            </pre>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Expected Output</p>
            <pre className="text-sm text-emerald-600 font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              {problem.outputDesc}
            </pre>
          </div>
        </div>
      </div>

      {/* Code editor */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-[10px] text-gray-400 font-mono ml-1">solution.js</span>
          </div>
          <button
            onClick={runTests}
            disabled={running}
            className="px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-all disabled:opacity-50"
          >
            {running ? "Running..." : "▶ Run Tests"}
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setResults(null);
          }}
          onKeyDown={handleTab}
          spellCheck={false}
          className="w-full bg-gray-50 text-gray-800 font-mono text-sm p-4 outline-none resize-none min-h-[180px] placeholder-gray-300 rounded-b-xl"
          placeholder="Write your solution here..."
        />
      </div>


      {/* Test results */}
      {results && (
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            {allPassed ? (
              <span className="text-emerald-400 font-bold text-sm">✓ All test cases passed!</span>
            ) : (
              <span className="text-red-400 font-bold text-sm">
                ✗ {results.filter((r) => !r.passed).length}/{results.length} test cases failed
              </span>
            )}
          </div>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 text-xs font-mono border ${
                  r.passed
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <span className="font-bold">{r.passed ? "PASS" : "FAIL"}</span>
                <span className="text-gray-400 mx-2">|</span>
                Input: {r.input}
                <span className="text-gray-400 mx-2">→</span>
                {r.passed ? (
                  r.got
                ) : (
                  <>
                    Expected {r.expected}, got {r.got}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hint / Solution buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl glass-card hover:bg-white/15 transition-all"
        >
          {showHint ? "Hide Hint" : "💡 Show Hint"}
        </button>
        <button
          onClick={() => {
            setShowSolution(!showSolution);
            if (!showSolution) setCode(problem.solution);
          }}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl glass-card hover:bg-white/15 transition-all"
        >
          {showSolution ? "Hide Solution" : "🔓 Show Solution"}
        </button>
      </div>

      {showHint && (
        <div className="glass-card p-4 text-sm text-gray-600 border-l-2 border-blue-400">
          <strong className="text-blue-600">Hint:</strong> {problem.hint}
        </div>
      )}
    </div>
  );
}
