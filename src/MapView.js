import React from "react";

export default function MapView({ stats }) {
  return (
    <>
      <div className="map-container">
        <div className="map-placeholder">
          <div
            style={{
              fontSize: "80px",
              opacity: 0.3,
              marginBottom: "20px",
            }}
          >
            🗺️
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Mapa de México
          </div>
          <div style={{ fontSize: "16px", color: "#737373" }}>
            Tus experiencias aparecerán marcadas aquí
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: "14px",
              color: "#B3B3B3",
            }}
          >
            (Integración con Google Maps próximamente)
          </div>
        </div>
      </div>
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Experiencias</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.states}</div>
          <div className="stat-label">Estados</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.favorites}</div>
          <div className="stat-label">Favoritas</div>
        </div>
      </div>
    </>
  );
}
