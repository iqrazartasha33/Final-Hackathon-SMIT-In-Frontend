import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Buildportfolio.css";

function Buildportfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(
          "https://final-hackathon-smit-in-backend.vercel.app/portfolios"
        );
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setPortfolio(data[data.length - 1]);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleChange = (field, value) => {
    setPortfolio({ ...portfolio, [field]: value });
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...portfolio.projects];
    newProjects[index][field] = value;
    setPortfolio({ ...portfolio, projects: newProjects });
  };

  const addProject = () => {
    setPortfolio({
      ...portfolio,
      projects: [...portfolio.projects, { title: "", description: "", link: "" }],
    });
  };

  const removeProject = (index) => {
    const newProjects = portfolio.projects.filter((_, i) => i !== index);
    setPortfolio({ ...portfolio, projects: newProjects });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `https://final-hackathon-smit-in-backend.vercel.app/portfolios/${portfolio._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(portfolio),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Portfolio updated successfully!");
        setEditing(false);
      } else {
        toast.error(data.message || "Error updating portfolio.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://final-hackathon-smit-in-backend.vercel.app/portfolios/${portfolio._id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        toast.success("Portfolio deleted successfully!");
        setPortfolio(null);
      } else {
        toast.error("Error deleting portfolio.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading portfolio...</div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="page">
        <div className="loading">No portfolio found.</div>
      </div>
    );
  }

  return (
    <div className="page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="card">
        <div className="profile">
      <img 
  src="/img.png"
  alt="Profile" 
  className="avatar" 
/>

          <h1 className="title">
            {editing ? "Edit Portfolio" : `${portfolio.name}'s Portfolio`}
          </h1>
        </div>
{editing ? (
  <>
    <input
      className="input"
      value={portfolio.name}
      onChange={(e) => handleChange("name", e.target.value)}
      placeholder="Your Name"
    />

    <input
      className="input"
      value={(portfolio.skills || []).join(", ")}
      onChange={(e) =>
        handleChange(
          "skills",
          e.target.value.split(",").map((s) => s.trim())
        )
      }
      placeholder="Skills (comma separated)"
    />
<div className="mb-6">
  <h2 className="section-title">Projects</h2>

  {portfolio.projects.map((project, index) => (
    <div key={index} className="project-edit">
      <div className="field-row">
        <label className="field-label">Title:</label>
        <input
          className="input"
          value={project.title}
          onChange={(e) =>
            handleProjectChange(index, "title", e.target.value)
          }
          placeholder="Project Title"
        />
      </div>

      <div className="field-row">
        <label className="field-label">Description:</label>
        <input
          className="input"
          value={project.description}
          onChange={(e) =>
            handleProjectChange(index, "description", e.target.value)
          }
          placeholder="Project Description"
        />
      </div>

      <div className="field-row">
        <label className="field-label">Link:</label>
        <input
          className="input"
          value={project.link}
          onChange={(e) =>
            handleProjectChange(index, "link", e.target.value)
          }
          placeholder="Project Link"
        />
      </div>

      <div className="actions-row">
        <button
          className="btn btn-danger"
          onClick={() => removeProject(index)}
        >
          Remove Project
        </button>
      </div>

      {index !== portfolio.projects.length - 1 && (
        <hr className="divider" />
      )}
    </div>
  ))}
</div>

<button className="btn btn-primary" onClick={addProject}>
  + Add Project
</button>


    <input
      className="input"
      value={portfolio.githubLink}
      onChange={(e) => handleChange("githubLink", e.target.value)}
      placeholder="GitHub Link"
    />

    <div className="actions">
      <button className="btn btn-primary" onClick={handleUpdate}>
        Save
      </button>
      <button className="btn btn-secondary" onClick={() => setEditing(false)}>
        Cancel
      </button>
    </div>
  </>
) : (
          <>
            <p className="meta-line">
              <span className="meta-key">Skills:</span>{" "}
              {(portfolio.skills || []).join(", ")}
            </p>

            <div className="section">
              <h2 className="section-title">Projects</h2>

              {portfolio.projects.map((project, index) => (
                <div key={index} className="project-view">
                  <div className="kv">
                    <span className="field-label">Title</span>
                    <span className="kv-value">{project.title || "-"}</span>
                  </div>

                  <div className="kv">
                    <span className="field-label">Description</span>
                    <span className="kv-value">
                      {project.description || "-"}
                    </span>
                  </div>

                  <div className="kv">
                    <span className="field-label">Link</span>
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {project.link}
                      </a>
                    ) : (
                      <span className="kv-value">-</span>
                    )}
                  </div>

                  {index !== portfolio.projects.length - 1 && (
                    <hr className="divider" />
                  )}
                </div>
              ))}
            </div>

            <p className="meta-line">
              <span className="meta-key">GitHub:</span>{" "}
              {portfolio.githubLink ? (
                <a
                  href={portfolio.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {portfolio.githubLink}
                </a>
              ) : (
                "-"
              )}
            </p>

            <div className="actions">
              <button className="btn btn-primary" onClick={() => setEditing(true)}>
                Edit Portfolio
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete Portfolio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Buildportfolio;
