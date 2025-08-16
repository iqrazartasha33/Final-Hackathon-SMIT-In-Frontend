import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Buildportfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("https://final-hackathon-smit-in-backend.vercel.app/portfolios");
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
      const res = await fetch(`https://final-hackathon-smit-in-backend.vercel.app/portfolios/${portfolio._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolio),
      });
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
      const res = await fetch(`https://final-hackathon-smit-in-backend.vercel.app/portfolios/${portfolio._id}`, {
        method: "DELETE",
      });
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        Loading portfolio...
      </div>
    );

  if (!portfolio)
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        No portfolio found.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 rounded-2xl shadow-2xl border border-gray-700 bg-gradient-to-br from-[#111827] to-[#1F2937]">
      <ToastContainer position="top-right" autoClose={3000} />

      {editing ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-purple-400 text-center drop-shadow-lg">
            Edit Portfolio
          </h1>

          <input
            className="border border-gray-600 p-3 w-full mb-4 rounded-lg bg-[#1F2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={portfolio.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Your Name"
          />

          <input
            className="border border-gray-600 p-3 w-full mb-4 rounded-lg bg-[#1F2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={portfolio.skills.join(", ")}
            onChange={(e) =>
              handleChange("skills", e.target.value.split(",").map((s) => s.trim()))
            }
            placeholder="Skills (comma separated)"
          />

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-white drop-shadow-sm">Projects</h2>
            {portfolio.projects.map((project, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-gray-600 rounded-xl shadow-md bg-[#1F2937] hover:shadow-purple-500/40 transition"
              >
                <p className="text-sm text-purple-300 font-semibold">Title:</p>
                <input
                  className="border border-gray-600 p-2 w-full rounded-lg bg-[#111827] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2"
                  value={project.title}
                  onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                />

                <p className="text-sm text-purple-300 font-semibold">Description:</p>
                <input
                  className="border border-gray-600 p-2 w-full rounded-lg bg-[#111827] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2"
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                />

                <p className="text-sm text-purple-300 font-semibold">Link:</p>
                <input
                  className="border border-gray-600 p-2 w-full rounded-lg bg-[#111827] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2"
                  value={project.link}
                  onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                />

                <button
                  className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 hover:shadow-red-500/50 transition mt-2"
                  onClick={() => removeProject(index)}
                >
                  Remove Project
                </button>
              </div>
            ))}

            <button
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 hover:shadow-purple-500/50 transition"
              onClick={addProject}
            >
              + Add Project
            </button>
          </div>

          <input
            className="border border-gray-600 p-3 w-full mb-6 rounded-lg bg-[#1F2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={portfolio.githubLink}
            onChange={(e) => handleChange("githubLink", e.target.value)}
            placeholder="GitHub Link"
          />

          <div className="flex justify-center gap-4">
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 hover:shadow-purple-500/50 transition font-semibold"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 text-purple-400 text-center drop-shadow-lg">
            {portfolio.name}'s Portfolio
          </h1>

          <p className="text-white mb-6">
            <strong>Skills:</strong> {portfolio.skills.join(", ")}
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-white drop-shadow-sm">Projects</h2>
            {portfolio.projects.map((project, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-gray-600 rounded-xl shadow-md bg-gradient-to-r from-[#111827] to-[#1F2937] hover:shadow-purple-500/40 transition"
              >
                <p className="text-sm text-purple-300 font-semibold">Title:</p>
                <p className="text-lg font-bold text-white mb-2">{project.title}</p>

                <p className="text-sm text-purple-300 font-semibold">Description:</p>
                <p className="text-gray-300 mb-2">{project.description}</p>

                {project.link && (
                  <>
                    <p className="text-sm text-purple-300 font-semibold">Link:</p>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 font-medium underline hover:text-purple-300 text-sm"
                    >
                      {project.link}
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>

          <p className="mb-6 text-white">
            <strong>GitHub:</strong>{" "}
            <a
              href={portfolio.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 underline hover:text-purple-300"
            >
              {portfolio.githubLink}
            </a>
          </p>

          <div className="flex justify-center gap-6">
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 hover:shadow-purple-500/50 transition font-semibold"
              onClick={() => setEditing(true)}
            >
              Edit Portfolio
            </button>
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 hover:shadow-red-500/50 transition font-semibold"
              onClick={handleDelete}
            >
              Delete Portfolio
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Buildportfolio;


