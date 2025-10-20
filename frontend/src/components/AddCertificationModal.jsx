import React, { useState } from "react";

export default function AddCertificationModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    year: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.issuer.trim()) {
      alert("Certificate name and issuer are required");
      return;
    }
    await onSubmit(formData);
    setFormData({ name: "", issuer: "", year: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Certification</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Certificate name"
            className="w-full p-3 border rounded-lg"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="Issuer"
            className="w-full p-3 border rounded-lg"
            value={formData.issuer}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, issuer: e.target.value }))
            }
            required
          />
          <input
            type="text"
            placeholder="Year"
            className="w-full p-3 border rounded-lg"
            value={formData.year}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, year: e.target.value }))
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
              Add Certification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
