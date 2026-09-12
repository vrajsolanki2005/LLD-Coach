import { useEffect, useState } from "react";
import api from "../services/api";
import type { Problem } from "../types";
import ProblemCard from "../components/ProblemCard/ProblemCard";

const Problems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get("/problems");

        setProblems(response.data.problems);
      } catch (err) {
        console.error(err);
        setError("Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div className="page">Loading problems...</div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>LLD Practice Problems</h1>
          <p>
            Practice designing classes, relationships, responsibilities, and
            extensible systems.
          </p>
        </div>
      </div>

      <div className="problem-grid">
        {problems.map((problem) => (
          <ProblemCard key={problem._id} problem={problem} />
        ))}
      </div>
    </div>
  );
};

export default Problems;
