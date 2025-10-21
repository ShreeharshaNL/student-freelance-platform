import React, { useState } from "react";

export default function AddSkillModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({ name: "", level: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Skill name is required");
      return;
    }
    await onSubmit(formData); // Call parent handler
    setFormData({ name: "", level: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Skill</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Skill name (e.g., React)"
            className="w-full p-3 border rounded-lg"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <input
            type="number"
            placeholder="Level (0-100)"
            className="w-full p-3 border rounded-lg"
            min={0}
            max={100}
            value={formData.level}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, level: e.target.value }))
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
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
