import React from "react";
import { Search, MapPin, Plus } from "lucide-react";

const categories = [
  { id: "restaurant", name: "Restaurante", emoji: "🍽️" },
  { id: "museum", name: "Museo", emoji: "🏛️" },
  { id: "park", name: "Parque", emoji: "🌳" },
  { id: "entertainment", name: "Entretenimiento", emoji: "🎢" },
  { id: "event", name: "Evento", emoji: "🎭" },
];

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={i < rating ? "star-filled" : ""}
      style={{ color: i < rating ? "#00BFFF" : "#262626", fontSize: "16px" }}
    >
      ★
    </span>
  ));
}

export default function ExperienciasFeed({
  experiences,
  filteredExperiences,
  searchQuery,
  onSearchChange,
  onCreateExperience,
}) {
  return (
    <div className="experiences-container">
      <div className="experiences-header">
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          Mis Experiencias
        </h2>
        <p style={{ color: "#737373", marginBottom: "0" }}>
          {filteredExperiences.length} de {experiences.length} experiencias
        </p>

        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, ubicación o categoría..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {filteredExperiences.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div
            style={{
              fontSize: "80px",
              opacity: 0.2,
              marginBottom: "20px",
            }}
          >
            {experiences.length === 0 ? "✨" : "🔍"}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            {experiences.length === 0
              ? "No hay experiencias aún"
              : "No se encontraron resultados"}
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#737373",
              marginBottom: "32px",
            }}
          >
            {experiences.length === 0
              ? "Toca el botón + para crear tu primera experiencia"
              : "Intenta con otros términos de búsqueda"}
          </div>
          {experiences.length === 0 && (
            <button className="btn btn-primary" onClick={onCreateExperience}>
              <Plus size={18} />
              Crear Primera Experiencia
            </button>
          )}
        </div>
      ) : (
        <div className="experiences-grid">
          {filteredExperiences.map((exp) => (
            <div key={exp.id} className="experience-card">
              {exp.photo ? (
                <img
                  src={exp.photo}
                  alt={exp.placeName}
                  className="experience-image"
                />
              ) : (
                <div className="experience-placeholder">
                  {categories.find((c) => c.id === exp.category)?.emoji ||
                    "📍"}
                </div>
              )}
              <div className="experience-content">
                <span className="experience-category">
                  {categories.find((c) => c.id === exp.category)?.name ||
                    "Experiencia"}
                </span>
                <h3 className="experience-title">{exp.placeName}</h3>
                {exp.location && (
                  <div className="experience-location">
                    <MapPin size={14} />
                    {exp.location}
                  </div>
                )}
                <div className="experience-rating">
                  {renderStars(exp.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
