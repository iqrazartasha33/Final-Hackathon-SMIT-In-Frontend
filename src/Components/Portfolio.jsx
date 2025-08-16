import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Portfolio() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const [menuOpen, setMenuOpen] = useState(false);

  const [portfolioData, setPortfolioData] = useState({
    name: "",
    skills: "",
    projects: [{ title: "", description: "", link: "" }],
    githubLink: "",
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  const handleSkillsChange = (e) => {
    setPortfolioData({ ...portfolioData, skills: e.target.value });
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...portfolioData.projects];
    newProjects[index][field] = value;
    setPortfolioData({ ...portfolioData, projects: newProjects });
  };

  const addProject = () => {
    setPortfolioData({
      ...portfolioData,
      projects: [...portfolioData.projects, { title: "", description: "", link: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      name: portfolioData.name,
      skills: portfolioData.skills.split(",").map((s) => s.trim()),
      projects: portfolioData.projects.filter((p) => p.title),
      githubLink: portfolioData.githubLink,
    };

    try {
      const res = await fetch("https://final-hackathon-smit-in-backend.vercel.app/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Portfolio submitted successfully!");

        setPortfolioData({
          name: "",
          skills: "",
          projects: [{ title: "", description: "", link: "" }],
          githubLink: "",
        });

        setTimeout(() => {
          navigate("/Buildportfolio");
        }, 1500);
      } else {
        toast.error(data.message || "Error submitting portfolio.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-purple-700 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
         <CgProfile className="text-purple-300 drop-shadow-lg" />
            ProfileForge!
          </h1>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5"
          >
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>

          <ul
            className={`${
              menuOpen ? "flex" : "hidden"
            } md:flex md:static absolute top-16 left-0 w-full md:w-auto bg-purple-700 md:bg-transparent flex-col md:flex-row md:items-center text-center md:space-x-6`}
          >
            <li className="py-2 md:py-0 flex items-center gap-2 px-4">
              <span className="text-white font-semibold">{email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mt-20 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400">Welcome, {name}</h1>
        <p className="mt-2 text-gray-300">
          This is your profile page. You can add your portfolio below.
        </p>

        <div className="mt-6 bg-[#0f172a] border border-gray-700 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Portfolio Builder</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-200">Name</label>
              <input
                type="text"
                value={portfolioData.name}
                onChange={(e) => setPortfolioData({ ...portfolioData, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-200">Skills</label>
              <input
                type="text"
                value={portfolioData.skills}
                onChange={handleSkillsChange}
                required
                placeholder="JavaScript, React, Node.js"
                className="w-full px-3 py-2 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-200 mb-2">Projects</label>
              {portfolioData.projects.map((project, index) => (
                <div
                  key={index}
                  className="mb-3 p-3 rounded-xl bg-[#1f2937] border border-gray-600 shadow hover:shadow-purple-500/50 transition"
                >
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                    required
                    className="w-full mb-2 px-2 py-1 rounded-lg bg-[#111827] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Project Description"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                    className="w-full mb-2 px-2 py-1 rounded-lg bg-[#111827] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="url"
                    placeholder="Project Link (optional)"
                    value={project.link}
                    onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-[#111827] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addProject}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition"
              >
                + Add Another Project
              </button>
            </div>

            <div>
              <label className="block font-medium text-gray-200">GitHub Link</label>
              <input
                type="url"
                value={portfolioData.githubLink}
                onChange={(e) => setPortfolioData({ ...portfolioData, githubLink: e.target.value })}
                required
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
            >
              Submit Portfolio
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Portfolio;

