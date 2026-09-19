import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks } from "../services/firestore";
import { generateStudyRecommendation } from "../services/gemini";

function AIRecommendations() {
  const { user } = useAuth();

  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setRecommendation("");

      const tasks = await getTasks(user.uid);

      if (!tasks || tasks.length === 0) {
        setError("No tasks found. Please add some study tasks first.");
        return;
      }

      const result = await generateStudyRecommendation(tasks);

      setRecommendation(result);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate recommendation.");
    } finally {
      setLoading(false);
    }
  };

  // Format Gemini Markdown response
  const renderInlineMarkdown = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const renderRecommendation = () => {
    const lines = recommendation.split("\n");

    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) {
        return <div key={index} className="h-2" />;
      }

      // Markdown headings
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-lg font-bold text-blue-700 mt-6 mb-3"
          >
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      // Horizontal line
      if (trimmed === "---") {
        return (
          <hr
            key={index}
            className="my-5 border-gray-200"
          />
        );
      }

      // Bullet points
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return (
          <div
            key={index}
            className="flex gap-3 mb-2 text-gray-700 leading-7"
          >
            <span className="text-blue-600 font-bold">•</span>
            <span>
              {renderInlineMarkdown(trimmed.substring(2))}
            </span>
          </div>
        );
      }

      // Normal paragraph
      return (
        <p
          key={index}
          className="text-gray-700 leading-7 mb-2"
        >
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  return (
    <div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🤖 AI Study Recommendations
          </h1>

          <p className="text-gray-500 mt-1">
            Get a personalized study plan based on your tasks.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg
                     hover:bg-blue-700 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     font-medium shadow-sm"
        >
          {loading ? "🤖 Generating..." : "✨ Generate Plan"}
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-5">
          ⚠️ {error}
        </div>
      )}

      {/* Initial State */}
      {!recommendation && !loading && !error && (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">

          <div className="text-5xl mb-4">
            🧠
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Let AI plan your study time
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto">
            Click "Generate Plan" to get recommendations based on
            your current study tasks, priorities, dates, and progress.
          </p>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">

          <div className="text-5xl mb-4 animate-pulse">
            🤖
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            AI is analyzing your tasks...
          </h2>

          <p className="text-gray-500">
            Creating a personalized study plan for you.
          </p>

        </div>
      )}

      {/* AI Recommendation */}
      {recommendation && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Recommendation Header */}
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-5">

            <div className="flex items-center gap-3">
              <div className="text-3xl">
                📚
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Your AI Study Plan
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Personalized recommendations based on your current tasks
                </p>
              </div>
            </div>

          </div>

          {/* Recommendation Content */}
          <div className="px-6 py-5">
            {renderRecommendation()}
          </div>

          {/* Generate Again */}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end">

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              🔄 Generate Again
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default AIRecommendations;