import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { auth } from "../firebase";
import Navbar from "./Navbar";
import LoadingOverlay from "./LoadingOverlay"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faBriefcase,
  faFileLines,
  faUser,
  faPercent,
  faMedal,
  faFolderOpen,
  faTrash,
  faEye,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = ({ setPage, setModalData, handleLogout }) => {
  const [files, setFiles] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResumes, setShowResumes] = useState(false);

  const API = "https://thousand-steven-section-actors.trycloudflare.com";

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) setPage("login");
  }, [setPage]);

  const averageScore =
    results.length > 0
      ? (results.reduce((a, b) => a + b.match_score, 0) / results.length).toFixed(1)
      : 0;

  const handleDelete = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || jobDesc.trim() === "") {
      alert("Please upload resumes and add job description.");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login again");
        setPage("login");
        return;
      }
      const token = await user.getIdToken();

  
      await fetch(`${API}/clear-resumes`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      
      await Promise.all(
        files.map((file) => {
          const formData = new FormData();
          formData.append("file", file);
          return fetch(`${API}/upload-resume`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
        })
      );

      
      const response = await fetch(`${API}/rank-resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_description: jobDesc }),
      });

      const data = await response.json();
      setResults(data.ranked_results || []);
    } catch (err) {
      console.error(err);
      setModalData({
        title: "Error",
        message: "Something went wrong during analysis.",
      });
    }

    setLoading(false);
  };

  const handleClearResumes = async () => {
    if (files.length === 0) {
      setModalData({ title: "Nothing to Delete", message: "No resumes found." });
      return;
    }

    const user = auth.currentUser;
    const token = await user.getIdToken();

    await fetch(`${API}/clear-resumes`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setFiles([]);
    setResults([]);
    setModalData({ title: "Success", message: "All resumes cleared successfully." });
  };

  return (
    <>
    {loading && <LoadingOverlay />}
    <div className="app-container">
      
      
      
      <Navbar handleLogout={handleLogout} />

      <main className="dashboard-content">
        <section className="main-layout">
          
          <aside className="left-column">
            <div className="glass-card">
              <div className="dlt-conatiner">
                <h3 className="card-title">
                  <FontAwesomeIcon icon={faUpload} /> Upload Resumes
                </h3>
                <button className="clear-btn" onClick={handleClearResumes}>
                  Clear Resumes
                </button>
              </div>

              <p className="card-desc">Drag & drop PDF or DOCX files</p>

              <div
                className="upload-zone"
                onClick={() => document.getElementById("resume-input").click()}
              >
                <input
                  type="file"
                  id="resume-input"
                  hidden
                  multiple
                  accept=".pdf,.docx"
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files);
                    const validFiles = [];
                    const invalidFiles = [];

                    selectedFiles.forEach((file) => {
                      const fileName = file.name.toLowerCase();
                      if (fileName.endsWith(".pdf") || fileName.endsWith(".docx")) {
                        validFiles.push(file);
                      } else {
                        invalidFiles.push(file.name);
                      }
                    });

                    if (invalidFiles.length > 0) {
                      setModalData({
                        title: "Unsupported File Type",
                        message: `These files are not supported:\n${invalidFiles.join(", ")}\n\nOnly PDF and DOCX files are allowed`,
                      });
                    }

                    if (validFiles.length > 0) {
                      setFiles((prev) => [...prev, ...validFiles]);
                    }
                    e.target.value = null;
                  }}
                />

                <div className="upload-icon-box">
                  <FontAwesomeIcon icon={faFileLines} />
                </div>

                <p className="upload-text">
                  {files.length > 0
                    ? `${files.length} resume(s) uploaded`
                    : "Click to upload resumes"}
                </p>
                <span className="upload-hint">PDF, DOCX up to 10MB</span>
              </div>

              {files.length > 0 && (
                <button
                  className="see-resume-btn"
                  onClick={() => setShowResumes(!showResumes)}
                >
                  <FontAwesomeIcon icon={faEye} />
                  See Uploaded Resumes ({files.length})
                  {showResumes ? (
                    <FontAwesomeIcon icon={faChevronUp} />
                  ) : (
                    <FontAwesomeIcon icon={faChevronDown} />
                  )}
                </button>
              )}

              {showResumes && (
                <div className="uploaded-list">
                  {files.map((file, index) => (
                    <div key={index} className="uploaded-item">
                      <span className="file-name">{file.name}</span>
                      <button className="delete-btn" onClick={() => handleDelete(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            
            <div className="glass-card">
              <h3 className="card-title">
                <FontAwesomeIcon icon={faBriefcase} /> Job Requirements
              </h3>
              <p className="card-desc">Paste the job description to match against</p>
              <textarea
                className="custom-textarea"
                placeholder="Example: We are looking for a React developer with 2+ years of experience..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
              <button
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze & Rank Candidates"}
              </button>
            </div>
          </aside>

          
          <article className="results-column">
            <section className="stats-row-inline">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div>
                  <span className="stat-label">TOTAL CANDIDATES</span>
                  <h2 className="stat-value">{files.length}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">
                  <FontAwesomeIcon icon={faPercent} />
                </div>
                <div>
                  <span className="stat-label">AVG MATCH SCORE</span>
                  <h2 className="stat-value">{averageScore}%</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <FontAwesomeIcon icon={faMedal} />
                </div>
                <div>
                  <span className="stat-label">TOP MATCH</span>
                  <h2 className="stat-value">{results[0]?.match_score || 0}%</h2>
                </div>
              </div>
            </section>

            <div className="results-container-main">
              <div className="results-header">
                <h3>Ranking Results</h3>
                <p>AI-driven match scoring based on JD</p>
              </div>

              <div className="results-body">
                {results.length === 0 ? (
                  <div className="empty-ui">
                    <div className="empty-icon">
                      <FontAwesomeIcon icon={faFolderOpen} />
                    </div>
                    <h4>No Results Yet</h4>
                    <p>Upload resumes and paste a job description to see results here.</p>
                  </div>
                ) : (
                  <div className="results-list">
                    {results.map((candidate, index) => (
                      <div key={index} className="result-item">
                        <span>
                          {index + 1}&nbsp;&nbsp;{candidate.file_name}
                        </span>
                        <strong>{candidate.match_score}%</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
    </>
  );
  
};

export default Dashboard;