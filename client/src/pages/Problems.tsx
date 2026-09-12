import { useEffect, useState } from "react";
import api from "../services/api";
import type { Problem } from "../types";
import ProblemCard from "../components/ProblemCard/ProblemCard";

const DIFFICULTY_ORDER = { Easy: 0, Medium: 1, Hard: 2 };

const Problems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get("/problems");
        const sorted = [...response.data.problems].sort(
          (a: Problem, b: Problem) =>
            DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty],
        );
        setProblems(sorted);
      } catch (err) {
        console.error(err);
        setError("Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filtered = filter === "All" ? problems : problems.filter((p) => p.difficulty === filter);

  const counts = {
    Easy: problems.filter((p) => p.difficulty === "Easy").length,
    Medium: problems.filter((p) => p.difficulty === "Medium").length,
    Hard: problems.filter((p) => p.difficulty === "Hard").length,
  };

  if (loading) return <div className="page">Loading problems...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <div>
      <div className="problems-hero">
        <div className="problems-hero-inner">
          <h1>Low-Level Design Practice</h1>
          <p>
            Master object-oriented design by building real systems from scratch.
            Define classes, responsibilities, relationships and explain your
            decisions — then get instant structured feedback.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{problems.length}</strong>
              <span>Problems</span>
            </div>
            <div className="hero-stat">
              <strong>{counts.Easy}</strong>
              <span>Easy</span>
            </div>
            <div className="hero-stat">
              <strong>{counts.Medium}</strong>
              <span>Medium</span>
            </div>
            <div className="hero-stat">
              <strong>{counts.Hard}</strong>
              <span>Hard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page">
        <div className="problems-toolbar">
          <p className="problems-count">
            Showing {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="filter-tabs">
            {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                className={`filter-tab ${filter === d ? "active" : ""} ${d !== "All" ? d.toLowerCase() : ""}`}
                onClick={() => setFilter(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="problem-grid">
          {filtered.map((problem) => (
            <ProblemCard key={problem._id} problem={problem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Problems;
