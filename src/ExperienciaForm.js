import React from "react";
import {
  Camera,
  Image as ImageIcon,
  X,
  Sparkles,
  Check,
  Mic,
  ChevronRight,
} from "lucide-react";

export default function ExperienciaForm({
  showCamera,
  cameraLoading,
  capturedPhoto,
  currentStep,
  aiSuggestions,
  selectedCategory,
  isRecording,
  formData,
  videoRef,
  canvasRef,
  onClose,
  onCapturePhoto,
  onSelectFromGallery,
  onRetakePhoto,
  onSelectSuggestion,
  onSaveExperience,
  onStepChange,
  onFormChange,
  onStartRecording,
  onStopRecording,
  renderStars,
}) {
  if (!showCamera) return null;

  return (
    <div className="camera-modal">
      <div className="camera-header">
        <div className="camera-title">
          {currentStep === 1 ? "Nueva Experiencia" : "Detalles"}
        </div>
        <button className="camera-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Step 1: Photo capture */}
      {currentStep === 1 && (
        <>
          <div className="camera-viewport" style={{ flex: 1 }}>
            {cameraLoading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  zIndex: 10,
                }}
              >
                <div className="spinner"></div>
                <div
                  style={{
                    color: "#FFFFFF",
                    marginTop: "16px",
                    fontSize: "14px",
                  }}
                >
                  Iniciando cámara...
                </div>
              </div>
            )}

            {!capturedPhoto ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
                style={{ display: cameraLoading ? "none" : "block" }}
              />
            ) : (
              <img
                src={capturedPhoto}
                alt="Captura"
                className="photo-preview-img"
              />
            )}

            {capturedPhoto && (
              <button
                className="btn-next"
                onClick={() => onStepChange(2)}
                title="Siguiente"
              >
                <ChevronRight size={32} strokeWidth={3} />
              </button>
            )}
          </div>

          <div
            className="camera-controls"
            style={{ flex: 0, padding: "24px" }}
          >
            {!capturedPhoto ? (
              <>
                <button
                  className="camera-capture-btn"
                  onClick={onCapturePhoto}
                  disabled={cameraLoading}
                  style={{ opacity: cameraLoading ? 0.5 : 1 }}
                />
                <div className="camera-actions">
                  <button
                    className="btn-camera btn-gallery"
                    onClick={onSelectFromGallery}
                  >
                    <ImageIcon size={20} />
                    Galería
                  </button>
                </div>
              </>
            ) : (
              <button
                className="btn btn-secondary"
                style={{ width: "100%" }}
                onClick={onRetakePhoto}
              >
                <Camera size={18} />
                Retomar Foto
              </button>
            )}
          </div>
        </>
      )}

      {/* Step 2: Form */}
      {currentStep === 2 && (
        <>
          <div
            style={{
              width: "100%",
              height: "120px",
              overflow: "hidden",
              borderBottom: "1px solid #262626",
            }}
          >
            <img
              src={capturedPhoto}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.7,
              }}
            />
          </div>

          <div className="camera-controls" style={{ flex: 1 }}>
            <div className="quick-form">
              {aiSuggestions.length > 0 && (
                <div className="ai-suggestions">
                  <div className="ai-header">
                    <div className="ai-icon">
                      <Sparkles size={18} />
                    </div>
                    <div className="ai-title">
                      ¿Qué tipo de experiencia es? *
                      {selectedCategory && (
                        <span
                          style={{ color: "#39FF14", marginLeft: "8px" }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                  {!selectedCategory && (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#737373",
                        marginBottom: "12px",
                        padding: "8px 12px",
                        background: "#1A1A1A",
                        borderRadius: "8px",
                      }}
                    >
                      👆 Toca una opción para seleccionarla
                    </div>
                  )}
                  <div className="ai-suggestions-grid">
                    {aiSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.category}
                        className={`ai-suggestion-card ${
                          selectedCategory === suggestion.category
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          onSelectSuggestion(suggestion.category)
                        }
                      >
                        <div className="ai-suggestion-emoji">
                          {suggestion.emoji}
                        </div>
                        <div className="ai-suggestion-label">
                          {suggestion.label}
                        </div>
                        <div className="ai-confidence">
                          {suggestion.confidence}% confianza
                        </div>
                        {selectedCategory === suggestion.category && (
                          <div
                            style={{
                              marginTop: "8px",
                              color: "#39FF14",
                              fontWeight: 700,
                              fontSize: "16px",
                            }}
                          >
                            ✓ Seleccionada
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  Nombre del lugar *
                  {formData.placeName && (
                    <span style={{ color: "#39FF14", marginLeft: "8px" }}>
                      ✓
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Café Central"
                  value={formData.placeName}
                  onChange={(e) =>
                    onFormChange((prev) => ({
                      ...prev,
                      placeName: e.target.value,
                    }))
                  }
                  style={{
                    borderColor: formData.placeName
                      ? "#39FF14"
                      : "#262626",
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ubicación (opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Centro, CDMX"
                  value={formData.location}
                  onChange={(e) =>
                    onFormChange((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Calificación *
                  {formData.rating > 0 && (
                    <span style={{ color: "#39FF14", marginLeft: "8px" }}>
                      ✓
                    </span>
                  )}
                </label>
                <div className="rating-input">
                  {renderStars(formData.rating, true, (rating) =>
                    onFormChange((prev) => ({ ...prev, rating }))
                  )}
                </div>
              </div>

              <div className="comments-section">
                <div className="comments-header">
                  <label
                    className="form-label"
                    style={{ marginBottom: 0 }}
                  >
                    Comentarios (opcional)
                  </label>
                  <div className="voice-controls">
                    <button
                      type="button"
                      className={`btn-voice ${
                        isRecording ? "recording" : ""
                      }`}
                      onClick={
                        isRecording ? onStopRecording : onStartRecording
                      }
                      title={
                        isRecording
                          ? "Detener grabación"
                          : "Grabar nota de voz"
                      }
                    >
                      <Mic size={24} />
                    </button>
                  </div>
                </div>
                {isRecording && (
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#FF006E",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "#FF006E",
                        borderRadius: "50%",
                        animation:
                          "pulse-recording 1.5s ease-in-out infinite",
                      }}
                    ></span>
                    Grabando... Toca el micrófono para detener
                  </div>
                )}
                <textarea
                  className="form-input"
                  style={{ minHeight: "100px" }}
                  placeholder="Escribe o graba tus comentarios..."
                  value={formData.notes}
                  onChange={(e) =>
                    onFormChange((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>

              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  marginTop: "24px",
                  opacity:
                    !selectedCategory ||
                    !formData.placeName ||
                    formData.rating === 0
                      ? 0.5
                      : 1,
                  cursor:
                    !selectedCategory ||
                    !formData.placeName ||
                    formData.rating === 0
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={onSaveExperience}
              >
                <Check size={20} />
                Guardar Experiencia
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
