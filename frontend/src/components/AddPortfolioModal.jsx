import React, { useState } from "react";

export default function AddPortfolioModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    link: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required");
      return;
    }

    const portfolioData = {
      ...formData,
      technologies: formData.technologies
        ? formData.technologies.split(",").map((t) => t.trim())
        : [],
    };

    await onSubmit(portfolioData);
    setFormData({ title: "", description: "", technologies: "", link: "", image: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Portfolio Project</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Project title"
            className="w-full p-3 border rounded-lg"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-3 border rounded-lg"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="Technologies (comma separated)"
            className="w-full p-3 border rounded-lg"
            value={formData.technologies}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, technologies: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Project link"
            className="w-full p-3 border rounded-lg"
            value={formData.link}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, link: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Image URL / Emoji"
            className="w-full p-3 border rounded-lg"
            value={formData.image}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, image: e.target.value }))
            }
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
