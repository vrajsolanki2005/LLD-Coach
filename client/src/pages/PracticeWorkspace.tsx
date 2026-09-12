import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getAttempt,
  saveDraft,
  submitAttempt,
} from "../services/attempt.service";

import type { Attempt, ClassDefinition, Relationship } from "../types";

const PracticeWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<Attempt | null>(null);

  const [classes, setClasses] = useState<ClassDefinition[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  const [explanation, setExplanation] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadAttempt = async () => {
      try {
        const data = await getAttempt(id);

        setAttempt(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load attempt.");
      } finally {
        setLoading(false);
      }
    };

    loadAttempt();
  }, [id]);

  const addClass = () => {
    setClasses([
      ...classes,
      {
        name: "",
        responsibility: "",
        methods: [""],
      },
    ]);
  };

  const completionPercentage = Math.min(
    100,
    Math.round(
      (classes.length > 0 ? 25 : 0) +
        (relationships.length > 0 ? 25 : 0) +
        (explanation.trim().length >= 100 ? 25 : 0) +
        (code?.trim().length ? 25 : 0),
    ),
  );

  const removeClass = (index: number) => {
    setClasses(classes.filter((_, classIndex) => classIndex !== index));
  };

  const updateClass = (
    index: number,
    field: keyof ClassDefinition,
    value: string,
  ) => {
    const updated = [...classes];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setClasses(updated);
  };

  const addMethod = (classIndex: number) => {
    const updated = [...classes];

    updated[classIndex].methods.push("");

    setClasses(updated);
  };

  const updateMethod = (
    classIndex: number,
    methodIndex: number,
    value: string,
  ) => {
    const updated = [...classes];

    updated[classIndex].methods[methodIndex] = value;

    setClasses(updated);
  };

  const removeMethod = (classIndex: number, methodIndex: number) => {
    const updated = [...classes];

    updated[classIndex].methods = updated[classIndex].methods.filter(
      (_, index) => index !== methodIndex,
    );

    setClasses(updated);
  };

  const addRelationship = () => {
    setRelationships([
      ...relationships,
      {
        from: "",
        to: "",
        type: "Association",
        description: "",
      },
    ]);
  };

  const removeRelationship = (index: number) => {
    setRelationships(
      relationships.filter(
        (_, relationshipIndex) => relationshipIndex !== index,
      ),
    );
  };

  const updateRelationship = (
    index: number,
    field: keyof Relationship,
    value: string,
  ) => {
    const updated = [...relationships];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setRelationships(updated);
  };

  const getSubmissionData = () => ({
    classes,
    relationships,
    explanation,
    code,
  });

  const handleSaveDraft = async () => {
    if (!id) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await saveDraft(id, getSubmissionData());

      setMessage("Draft saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;

    if (classes.length === 0) {
      setError("Add at least one class before submitting.");
      return;
    }

    if (!explanation.trim()) {
      setError("Explain your design before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      const response = await submitAttempt(id, getSubmissionData());

      navigate(`/attempts/${response.attempt._id}/result`);
    } catch (err: any) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to submit attempt.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page">Loading workspace...</div>;
  }

  if (error && !attempt) {
    return <div className="page error">{error}</div>;
  }

  if (!attempt) {
    return <div className="page error">Attempt not found.</div>;
  }

  const problem = attempt.problemId;

  return (
    <div className="workspace-page">
      <div className="workspace-header">
        <div>
          <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
            {problem.difficulty}
          </span>

          <h1>{problem.title}</h1>
        </div>
        <div className="progress-card">
          <div className="progress-header">
            <span>Design progress</span>
            <strong>{completionPercentage}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="workspace-actions">
          <button
            className="secondary-button"
            onClick={handleSaveDraft}
            disabled={saving || submitting}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            className="primary-button"
            onClick={handleSubmit}
            disabled={submitting || saving}
          >
            {submitting ? "Submitting..." : "Submit Solution"}
          </button>
        </div>
      </div>

      {(message || error) && (
        <div
          className={
            error
              ? "workspace-message error-message"
              : "workspace-message success-message"
          }
        >
          {error || message}
        </div>
      )}

      <div className="workspace">
        {/* LEFT SIDE */}

        <aside className="problem-panel">
          <h2>Problem</h2>

          <p>{problem.description}</p>

          <h3>Requirements</h3>

          <ul>
            {problem.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>

          <h3>Expected Entities</h3>

          <div className="entity-list">
            {problem.entities.map((entity) => (
              <span key={entity} className="entity-tag">
                {entity}
              </span>
            ))}
          </div>
        </aside>

        {/* RIGHT SIDE */}

        <main className="design-panel">
          <section className="design-section">
            <div className="section-header">
              <div>
                <h2>Classes</h2>

                <p>
                  Define the main classes in your design and their
                  responsibilities.
                </p>
              </div>

              <button className="secondary-button" onClick={addClass}>
                + Add Class
              </button>
            </div>

            {classes.length === 0 && (
              <div className="empty-state">
                No classes added yet.
                <br />
                Start by adding your first class.
              </div>
            )}

            {classes.map((classItem, classIndex) => (
              <div className="class-card" key={classIndex}>
                <div className="class-card-header">
                  <h3>Class {classIndex + 1}</h3>

                  <button
                    className="danger-button"
                    onClick={() => removeClass(classIndex)}
                  >
                    Remove
                  </button>
                </div>

                <label>Class Name</label>

                <input
                  value={classItem.name}
                  onChange={(event) =>
                    updateClass(classIndex, "name", event.target.value)
                  }
                  placeholder="e.g. ParkingLot"
                />

                <label>Responsibility</label>

                <textarea
                  value={classItem.responsibility}
                  onChange={(event) =>
                    updateClass(
                      classIndex,
                      "responsibility",
                      event.target.value,
                    )
                  }
                  placeholder="What should this class be responsible for?"
                  rows={3}
                />

                <div className="methods-header">
                  <label>Methods</label>

                  <button
                    className="text-button"
                    onClick={() => addMethod(classIndex)}
                  >
                    + Add Method
                  </button>
                </div>

                {classItem.methods.map((method, methodIndex) => (
                  <div className="method-row" key={methodIndex}>
                    <input
                      value={method}
                      onChange={(event) =>
                        updateMethod(
                          classIndex,
                          methodIndex,
                          event.target.value,
                        )
                      }
                      placeholder="e.g. parkVehicle()"
                    />

                    {classItem.methods.length > 1 && (
                      <button
                        className="danger-button"
                        onClick={() => removeMethod(classIndex, methodIndex)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </section>

          <section className="design-section">
            <div className="section-header">
              <div>
                <h2>Relationships</h2>

                <p>Describe how your classes interact with each other.</p>
              </div>

              <button className="secondary-button" onClick={addRelationship}>
                + Add Relationship
              </button>
            </div>

            {relationships.map((relationship, index) => (
              <div className="relationship-card" key={index}>
                <select
                  value={relationship.from}
                  onChange={(event) =>
                    updateRelationship(index, "from", event.target.value)
                  }
                >
                  <option value="">From class</option>

                  {classes.map((classItem) => (
                    <option key={classItem.name} value={classItem.name}>
                      {classItem.name || "Unnamed class"}
                    </option>
                  ))}
                </select>

                <select
                  value={relationship.type}
                  onChange={(event) =>
                    updateRelationship(index, "type", event.target.value)
                  }
                >
                  <option>Association</option>

                  <option>Aggregation</option>

                  <option>Composition</option>

                  <option>Inheritance</option>

                  <option>Dependency</option>
                </select>

                <select
                  value={relationship.to}
                  onChange={(event) =>
                    updateRelationship(index, "to", event.target.value)
                  }
                >
                  <option value="">To class</option>

                  {classes.map((classItem) => (
                    <option key={classItem.name} value={classItem.name}>
                      {classItem.name || "Unnamed class"}
                    </option>
                  ))}
                </select>

                <input
                  value={relationship.description || ""}
                  onChange={(event) =>
                    updateRelationship(index, "description", event.target.value)
                  }
                  placeholder="Explain this relationship"
                />

                <button
                  className="danger-button"
                  onClick={() => removeRelationship(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <section className="design-section">
            <h2>Design Explanation</h2>

            <p>
              Explain why you chose this design. Mention important trade-offs or
              decisions.
            </p>

            <textarea
              className="large-textarea"
              value={explanation}
              onChange={(event) => setExplanation(event.target.value)}
              placeholder="Explain your design, responsibilities, relationships, patterns, trade-offs, and how the design could be extended..."
              rows={10}
            />
          </section>

          <section className="design-section">
            <h2>Optional Code</h2>

            <p>You can include a code implementation if useful.</p>

            <textarea
              className="code-textarea"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="// Optional implementation..."
              rows={15}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default PracticeWorkspace;
