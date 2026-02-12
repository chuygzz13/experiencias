import React from "react";
import { Map as MapIcon, List } from "lucide-react";

export default function Header({ view, onViewChange }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">Experiencia Privada</h1>
        <div className="header-actions">
          <button
            className={`btn ${
              view === "map" ? "btn-secondary active" : "btn-secondary"
            }`}
            onClick={() => onViewChange("map")}
          >
            <MapIcon size={18} />
            Mapa
          </button>
          <button
            className={`btn ${
              view === "list" ? "btn-secondary active" : "btn-secondary"
            }`}
            onClick={() => onViewChange("list")}
          >
            <List size={18} />
            Experiencias
          </button>
        </div>
      </div>
    </header>
  );
}
