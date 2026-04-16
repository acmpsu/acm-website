"use client";

import { useState, type FormEvent } from "react";

export function TeamFormationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [languages, setLanguages] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [teammates, setTeammates] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-xl font-bold text-gray-900">You&apos;re on the list!</h4>
        <p className="text-gray-600 mt-2">
          We&apos;ll match you with a team before the next practice contest.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tf-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="tf-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="tf-major" className="block text-sm font-medium text-gray-700 mb-1">
            Major <span className="text-red-500">*</span>
          </label>
          <input
            id="tf-major"
            type="text"
            required
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>
      <div>
        <label htmlFor="tf-languages" className="block text-sm font-medium text-gray-700 mb-1">
          Programming Languages <span className="text-red-500">*</span>
        </label>
        <input
          id="tf-languages"
          type="text"
          required
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder="e.g. C++, Python, Java"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="tf-experience" className="block text-sm font-medium text-gray-700 mb-1">
          Experience Level
        </label>
        <select
          id="tf-experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className={`${inputClasses} bg-white`}
        >
          <option value="beginner">Beginner — New to competitive programming</option>
          <option value="intermediate">Intermediate — Solved 50+ problems</option>
          <option value="advanced">Advanced — Regional/national contest experience</option>
        </select>
      </div>
      <div>
        <label htmlFor="tf-teammates" className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Teammates{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="tf-teammates"
          type="text"
          value={teammates}
          onChange={(e) => setTeammates(e.target.value)}
          placeholder="Names of people you'd like to team with"
          className={inputClasses}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-950 transition text-sm"
      >
        Find a Team
      </button>
    </form>
  );
}
