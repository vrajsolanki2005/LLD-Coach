import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import type { Problem } from "../types";

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/problems/${id}`);

        setProblem(response.data.problem);
      } catch (err) {
        console.error(err);
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const startAttempt = async () => {
    if (!id) return;

    try {
      setStarting(true);

      const response = await api.post(`/problems/${id}/attempts`);

      const attempt = response.data.attempt;

      navigate(`/attempts/${attempt._id}`);
    } catch (err) {
      console.error(err);
      setError("You must be logged in to start an attempt.");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (error || !problem) {
    return <div className="page error">{error || "Problem not found"}</div>;
  }

  return (
    <div className="page">
      <div className="problem-details">
        <div className="problem-details-header">
          <div>
            <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>

            <h1>{problem.title}</h1>
          </div>

          <button
            className="primary-button"
            onClick={startAttempt}
            disabled={starting}
          >
            {starting ? "Starting..." : "Start Practice"}
          </button>
        </div>

        <section>
          <h2>Problem</h2>
          <p>{problem.description}</p>
        </section>

        <section>
          <h2>Requirements</h2>

          <ul>
            {problem.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Expected Entities</h2>

          <div className="entity-list">
            {problem.entities.map((entity) => (
              <span key={entity} className="entity-tag">
                {entity}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2>Evaluation Criteria</h2>

          <ul>
            {problem.evaluationCriteria.map((criterion, index) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ProblemDetails;
