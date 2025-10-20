import React, { useState } from "react";

export default function AddEducationModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    degree: "",
    school: "",
    year: "",
    status: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.school.trim()) {
      alert("Degree and School are required");
      return;
    }
    await onSubmit(formData);
    setFormData({ degree: "", school: "", year: "", status: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Education</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Degree"
            className="w-full p-3 border rounded-lg"
            value={formData.degree}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, degree: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="School/University"
            className="w-full p-3 border rounded-lg"
            value={formData.school}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, school: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="Year (e.g., 2020-2024)"
            className="w-full p-3 border rounded-lg"
            value={formData.year}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, year: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Status (e.g., Current, Completed)"
            className="w-full p-3 border rounded-lg"
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value }))
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
              Add Education
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
