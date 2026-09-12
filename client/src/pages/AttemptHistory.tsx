import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getMyAttempts, retryAttempt } from "../services/attempt.service";

import { Attempt } from "../types";

const AttemptHistory = () => {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttempts = async () => {
    try {
      setLoading(true);

      const data = await getMyAttempts();

      setAttempts(data);
      setError("");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message || "Failed to load attempt history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttempts();
  }, []);

  const handleRetry = async (attemptId: string) => {
    try {
      const newAttempt = await retryAttempt(attemptId);

      navigate(`/attempts/${newAttempt._id}`);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message || "Failed to create a new attempt.",
      );
    }
  };

  const getStatusLabel = (status: Attempt["status"]) => {
    switch (status) {
      case "DRAFT":
        return "Draft";

      case "SUBMITTED":
        return "Submitted";

      case "EVALUATING":
        return "Evaluating";

      case "COMPLETED":
        return "Completed";

      case "FAILED":
        return "Evaluation Failed";

      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="history-page">
        <div className="loading-card">
          <div className="loader" />

          <h2>Loading your attempts...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div>
            <span className="result-label">Practice history</span>

            <h1>Your Attempts</h1>

            <p>
              Review your previous solutions and keep improving your LLD skills.
            </p>
          </div>

          <Link to="/problems" className="primary-button">
            Practice a Problem
          </Link>
        </div>

        {error && <div className="history-error">{error}</div>}

        {attempts.length === 0 ? (
          <div className="empty-history">
            <h2>No attempts yet</h2>

            <p>Start practicing an LLD problem to see your attempts here.</p>

            <Link to="/problems" className="primary-button">
              Browse Problems
            </Link>
          </div>
        ) : (
          <div className="attempt-list">
            {attempts.map((attempt) => (
              <div className="attempt-history-card" key={attempt._id}>
                <div className="attempt-main">
                  <div className="attempt-info">
                    <span
                      className={`difficulty ${attempt.problemId.difficulty.toLowerCase()}`}
                    >
                      {attempt.problemId.difficulty}
                    </span>

                    <h2>{attempt.problemId.title}</h2>

                    <p>
                      Started {new Date(attempt.startedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`attempt-status ${attempt.status.toLowerCase()}`}
                  >
                    {getStatusLabel(attempt.status)}
                  </span>
                </div>

                <div className="attempt-actions">
                  {attempt.status === "COMPLETED" ? (
                    <>
                      <Link
                        to={`/attempts/${attempt._id}/result`}
                        className="secondary-button"
                      >
                        View Feedback
                      </Link>

                      <button
                        className="primary-button"
                        onClick={() => handleRetry(attempt._id)}
                      >
                        Try Again
                      </button>
                    </>
                  ) : attempt.status === "EVALUATING" ? (
                    <Link
                      to={`/attempts/${attempt._id}/result`}
                      className="secondary-button"
                    >
                      View Evaluation
                    </Link>
                  ) : attempt.status === "DRAFT" ? (
                    <Link
                      to={`/attempts/${attempt._id}`}
                      className="primary-button"
                    >
                      Continue
                    </Link>
                  ) : attempt.status === "FAILED" ? (
                    <>
                      <Link
                        to={`/attempts/${attempt._id}/result`}
                        className="secondary-button"
                      >
                        View Status
                      </Link>

                      <button
                        className="primary-button"
                        onClick={() => handleRetry(attempt._id)}
                      >
                        Try Again
                      </button>
                    </>
                  ) : (
                    <Link
                      to={`/attempts/${attempt._id}/result`}
                      className="secondary-button"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttemptHistory;
