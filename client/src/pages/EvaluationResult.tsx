import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getAttemptEvaluation,
  EvaluationResponse,
} from "../services/evaluation.service";

const EvaluationResult = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<EvaluationResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvaluation = useCallback(async () => {
    if (!id) return;

    try {
      const response = await getAttemptEvaluation(id);
      setData(response);
      setError("");
    } catch (err: any) {
      console.error(err);

      setError(err?.response?.data?.message || "Failed to load evaluation.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvaluation();
  }, [fetchEvaluation]);

  /*
   * Poll while evaluation is running.
   */
  useEffect(() => {
    if (!data) return;

    if (data.attemptStatus !== "EVALUATING") {
      return;
    }

    const interval = setInterval(() => {
      fetchEvaluation();
    }, 2000);

    return () => clearInterval(interval);
  }, [data, fetchEvaluation]);

  if (loading) {
    return (
      <div className="evaluation-page">
        <div className="loading-card">
          <div className="loader" />

          <h2>Loading evaluation...</h2>

          <p>We're checking your design and preparing feedback.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evaluation-page">
        <div className="error-card">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button onClick={fetchEvaluation}>Try Again</button>

          <Link to="/problems">Back to Problems</Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  /*
   * Evaluation is still running.
   */
  if (data.attemptStatus === "EVALUATING") {
    return (
      <div className="evaluation-page">
        <div className="evaluating-card">
          <div className="loader large" />

          <h1>Evaluating your design</h1>

          <p>
            We're reviewing your classes, responsibilities, relationships, and
            explanation.
          </p>

          <div className="evaluation-steps">
            <div className="evaluation-step active">
              <span>✓</span>
              Submission received
            </div>

            <div className="evaluation-step active">
              <span>⟳</span>
              Checking your design
            </div>

            <div className="evaluation-step">
              <span>○</span>
              Preparing feedback
            </div>
          </div>

          <p className="muted">
            This page automatically updates when your evaluation is ready.
          </p>
        </div>
      </div>
    );
  }

  /*
   * Evaluation failed.
   */
  if (data.attemptStatus === "FAILED" || data.evaluation.status === "FAILED") {
    return (
      <div className="evaluation-page">
        <div className="error-card">
          <h1>Evaluation failed</h1>

          <p>
            We couldn't complete the evaluation, but your submission has been
            preserved.
          </p>

          <button onClick={fetchEvaluation}>Check Again</button>

          <Link to={`/attempts/${id}`}>Review Submission</Link>
        </div>
      </div>
    );
  }

  const evaluation = data.evaluation;

  return (
    <div className="evaluation-page">
      <div className="evaluation-container">
        {/* Header */}
        <div className="result-header">
          <div>
            <span className="result-label">Evaluation complete</span>

            <h1>Your Design Feedback</h1>

            <p>
              Here's how your solution performed and where you can improve it.
            </p>
          </div>

          <div className="score-card">
            <span>Overall Score</span>

            <strong>{evaluation.overallScore?.toFixed(1) ?? "—"}</strong>

            <small>/ 10</small>
          </div>
        </div>

        {/* Categories */}
        <section className="feedback-section">
          <div className="section-heading">
            <h2>Design Breakdown</h2>

            <p>Your solution is evaluated across multiple design dimensions.</p>
          </div>

          <div className="category-grid">
            {evaluation.categories.map((category) => (
              <div className="category-card" key={category.name}>
                <div className="category-header">
                  <h3>{category.name}</h3>

                  <strong>{category.score.toFixed(1)}/10</strong>
                </div>

                <div className="score-bar">
                  <div
                    className="score-bar-fill"
                    style={{
                      width: `${category.score * 10}%`,
                    }}
                  />
                </div>

                <p>{category.feedback}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Strengths */}
        {evaluation.strengths.length > 0 && (
          <section className="feedback-section">
            <div className="section-heading">
              <h2>What You Did Well</h2>
            </div>

            <div className="feedback-list strengths-list">
              {evaluation.strengths.map((strength, index) => (
                <div className="feedback-item" key={index}>
                  <span className="feedback-icon">✓</span>

                  <p>{strength}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Issues */}
        {evaluation.issues.length > 0 && (
          <section className="feedback-section">
            <div className="section-heading">
              <h2>Issues to Improve</h2>

              <p>These are the most important gaps detected in your design.</p>
            </div>

            <div className="issues-list">
              {evaluation.issues.map((issue, index) => (
                <div className={`issue-card ${issue.severity}`} key={index}>
                  <div className="issue-header">
                    <span className={`severity-badge ${issue.severity}`}>
                      {issue.severity}
                    </span>

                    <h3>{issue.title}</h3>
                  </div>

                  <p className="issue-explanation">{issue.explanation}</p>

                  <div className="suggestion">
                    <strong>How to improve</strong>

                    <p>{issue.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trade-offs */}
        {evaluation.tradeoffs.length > 0 && (
          <section className="feedback-section">
            <div className="section-heading">
              <h2>Design Trade-offs</h2>
            </div>

            <div className="tradeoff-list">
              {evaluation.tradeoffs.map((tradeoff, index) => (
                <div className="tradeoff-item" key={index}>
                  <span>↔</span>

                  <p>{tradeoff}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Suggested Improvements */}
        {evaluation.suggestedImprovements.length > 0 && (
          <section className="feedback-section">
            <div className="improvement-card">
              <h2>Recommended Next Steps</h2>

              <p>Focus on these changes before attempting the problem again.</p>

              <ol>
                {evaluation.suggestedImprovements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Alternative approach */}
        {evaluation.alternativeApproach && (
          <section className="feedback-section">
            <div className="alternative-card">
              <h2>Think About This Approach</h2>

              <p>{evaluation.alternativeApproach}</p>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="result-actions">
          <Link to={`/attempts/${id}`} className="secondary-button">
            Review Submission
          </Link>

          <Link to="/problems" className="primary-button">
            Practice Another Problem
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResult;
