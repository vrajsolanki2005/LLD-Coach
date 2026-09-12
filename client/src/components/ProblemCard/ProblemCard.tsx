import { Link } from "react-router-dom";
import type { Problem } from "../../types";

interface ProblemCardProps {
  problem: Problem;
}

const ProblemCard = ({ problem }: ProblemCardProps) => {
  return (
    <div className="problem-card">
      <div className="problem-card-header">
        <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
      </div>

      <h3>{problem.title}</h3>

      <p className="problem-card-desc">{problem.description}</p>

      <div className="problem-card-criteria">
        {problem.evaluationCriteria.slice(0, 3).map((c) => (
          <span key={c} className="criteria-tag">{c}</span>
        ))}
        {problem.evaluationCriteria.length > 3 && (
          <span className="criteria-tag muted">+{problem.evaluationCriteria.length - 3} more</span>
        )}
      </div>

      <div className="problem-meta">
        <span>{problem.entities.length} entities</span>
        <span>{problem.requirements.length} requirements</span>
      </div>

      <Link to={`/problems/${problem._id}`} className="primary-button problem-card-btn">
        View Problem
      </Link>
    </div>
  );
};

export default ProblemCard;
