import { Link } from "react-router-dom";
import { Problem } from "../../types";

interface ProblemCardProps {
  problem: Problem;
}

const ProblemCard = ({ problem }: ProblemCardProps) => {
  return (
    <div className="problem-card">
      <div className="problem-card-header">
        <h3>{problem.title}</h3>

        <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
      </div>

      <p>{problem.description}</p>

      <div className="problem-meta">
        <span>{problem.entities.length} entities</span>
        <span>{problem.requirements.length} requirements</span>
      </div>

      <Link to={`/problems/${problem._id}`} className="primary-button">
        View Problem
      </Link>
    </div>
  );
};

export default ProblemCard;
