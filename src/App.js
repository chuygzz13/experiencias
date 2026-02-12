import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Star,
  Plus,
  X,
  List,
  Map as MapIcon,
  Sparkles,
  Check,
  Search,
  Mic,
  ChevronRight,
} from "lucide-react";

// Estilos CSS-in-JS
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #000000;
    color: #FFFFFF;
    line-height: 1.6;
    overflow-x: hidden;
  }

  .app-container {
    min-height: 100vh;
  }

  /* Header */
  .header {
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #262626;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  /* Buttons */
  .btn {
    padding: 12px 20px;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    color: #000000;
    box-shadow: 0 4px 16px rgba(57, 255, 20, 0.25);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 191, 255, 0.35);
  }

  .btn-secondary {
    background: transparent;
    color: #B3B3B3;
    border: 1px solid #262626;
  }

  .btn-secondary:hover {
    border-color: #00BFFF;
    color: #FFFFFF;
    background: #1A1A1A;
  }

  .btn-secondary.active {
    background: #1A1A1A;
    color: #FFFFFF;
    border-color: #39FF14;
  }

  /* Floating Action Button */
  .fab {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    color: #000000;
    border: none;
    box-shadow: 0 8px 32px rgba(57, 255, 20, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 90;
  }

  .fab:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 12px 40px rgba(0, 191, 255, 0.5);
  }

  /* Map Container */
  .map-container {
    width: 100%;
    height: calc(100vh - 80px);
    background: #0F0F0F;
    position: relative;
    overflow: hidden;
  }

  .map-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
  }

  .map-svg {
    width: 90%;
    max-width: 800px;
    height: auto;
    filter: drop-shadow(0 0 20px rgba(57, 255, 20, 0.2));
  }

  .map-marker {
    position: absolute;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(57, 255, 20, 0.4);
  }

  .map-marker:hover {
    transform: rotate(-45deg) scale(1.2);
    box-shadow: 0 6px 20px rgba(0, 191, 255, 0.6);
  }

  .map-marker-inner {
    width: 16px;
    height: 16px;
    background: #000000;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  /* Stats Bar */
  .stats-bar {
    background: #0F0F0F;
    border-top: 1px solid #262626;
    padding: 16px 24px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-size: 12px;
    color: #737373;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Camera Modal */
  .camera-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000000;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
    max-height: -webkit-fill-available;
  }

  .camera-header {
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.9);
    flex-shrink: 0;
  }

  .camera-title {
    font-size: 18px;
    font-weight: 700;
    color: #FFFFFF;
  }

  .camera-close {
    background: #1A1A1A;
    border: 1px solid #262626;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #B3B3B3;
  }

  .camera-viewport {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000000;
    overflow: hidden;
  }

  .camera-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #000000;
  }

  .photo-preview-img {
    width: 100%;
    height: 100%;
    max-height: 80vh;
    object-fit: contain;
    display: block;
    background: #000000;
  }

  .camera-controls {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px;
    padding-bottom: 40px;
    background: #000000;
    display: flex;
    flex-direction: column;
    gap: 16px;
    -webkit-overflow-scrolling: touch;
  }

  .camera-capture-btn {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 4px solid #FFFFFF;
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    margin: 0 auto;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .camera-capture-btn:active {
    transform: scale(0.9);
  }

  /* Botón Siguiente con Flecha */
  .btn-next {
    position: absolute;
    bottom: 32px;
    right: 32px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000000;
    box-shadow: 0 4px 16px rgba(57, 255, 20, 0.4);
    transition: all 0.3s ease;
    z-index: 10;
  }

  .btn-next:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(0, 191, 255, 0.5);
  }

  .btn-next:active {
    transform: rotate(360deg) scale(1.1);
  }

  .arrow-icon {
    font-size: 32px;
    font-weight: bold;
  }

  /* Botón Voz */
  .btn-voice {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--cyan-blue);
    border: none;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-voice.recording {
    background: #FF006E;
    animation: pulse-recording 1.5s ease-in-out infinite;
  }

  @keyframes pulse-recording {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 0, 110, 0.7);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 0 10px rgba(255, 0, 110, 0);
    }
  }

  .comments-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #262626;
  }

  .comments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .voice-controls {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .camera-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .btn-camera {
    padding: 16px;
    border-radius: 12px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .btn-gallery {
    background: #1A1A1A;
    color: #FFFFFF;
    border: 1px solid #262626;
  }

  .btn-gallery:hover {
    background: #2A2A2A;
    border-color: #00BFFF;
  }

  /* AI Suggestions */
  .ai-suggestions {
    background: #0F0F0F;
    border: 1px solid #262626;
    border-radius: 16px;
    padding: 20px;
    margin-top: 20px;
  }

  .ai-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .ai-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000000;
  }

  .ai-title {
    font-size: 16px;
    font-weight: 700;
  }

  .ai-suggestions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .ai-suggestion-card {
    background: #1A1A1A;
    border: 2px solid #262626;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
  }

  .ai-suggestion-card:hover {
    border-color: #39FF14;
    transform: translateY(-2px);
  }

  .ai-suggestion-card.selected {
    border-color: #39FF14;
    background: rgba(57, 255, 20, 0.1);
  }

  .ai-suggestion-emoji {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .ai-suggestion-label {
    font-size: 14px;
    font-weight: 600;
  }

  .ai-confidence {
    font-size: 12px;
    color: #737373;
    margin-top: 4px;
  }

  /* Quick Form */
  .quick-form {
    width: 100%;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: #B3B3B3;
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    padding: 14px 18px;
    background: #1A1A1A;
    border: 1px solid #262626;
    border-radius: 12px;
    color: #FFFFFF;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
  }

  .form-input:focus {
    outline: none;
    border-color: #00BFFF;
    box-shadow: 0 0 0 4px rgba(0, 191, 255, 0.15);
  }

  .rating-input {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .rating-star {
    font-size: 32px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #262626;
  }

  .rating-star:hover,
  .rating-star.active {
    color: #39FF14;
    transform: scale(1.15);
  }

  /* Experiences List */
  .experiences-container {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .experiences-header {
    margin-bottom: 24px;
  }

  .search-wrapper {
    position: relative;
    margin-top: 20px;
  }

  .search-input {
    width: 100%;
    padding: 14px 18px 14px 48px;
    background: #1A1A1A;
    border: 1px solid #262626;
    border-radius: 12px;
    color: #FFFFFF;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #00BFFF;
    box-shadow: 0 0 0 4px rgba(0, 191, 255, 0.15);
  }

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #737373;
  }

  .experiences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 24px;
  }

  .experience-card {
    background: #0F0F0F;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #262626;
    transition: all 0.3s ease;
  }

  .experience-card:hover {
    transform: translateY(-4px);
    border-color: #39FF14;
  }

  .experience-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    background: #1A1A1A;
  }

  .experience-placeholder {
    width: 100%;
    height: 250px;
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 64px;
  }

  .experience-content {
    padding: 20px;
  }

  .experience-category {
    display: inline-block;
    padding: 4px 12px;
    background: linear-gradient(135deg, #39FF14, #00BFFF);
    color: #000000;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 6px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .experience-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .experience-location {
    font-size: 14px;
    color: #B3B3B3;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .experience-rating {
    display: flex;
    gap: 4px;
  }

  .star-filled {
    color: #00BFFF;
    font-size: 16px;
  }

  /* Loading */
  .loading {
    text-align: center;
    padding: 60px 20px;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #262626;
    border-top-color: #39FF14;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .experiences-grid {
      grid-template-columns: 1fr;
    }

    .fab {
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
    }

    .ai-suggestions-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// Categorías con emojis
const categories = [
  { id: "restaurant", name: "Restaurante", emoji: "🍽️" },
  { id: "museum", name: "Museo", emoji: "🏛️" },
  { id: "park", name: "Parque", emoji: "🌳" },
  { id: "entertainment", name: "Entretenimiento", emoji: "🎢" },
  { id: "event", name: "Evento", emoji: "🎭" },
];

// Componente Principal
export default function ExperienciaPrivada() {
  const [view, setView] = useState("map"); // 'map' o 'list'
  const [experiences, setExperiences] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: foto, 2: formulario
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [formData, setFormData] = useState({
    placeName: "",
    location: "",
    rating: 0,
    notes: "",
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Función para comprimir imagen
  const compressImage = (base64Image, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Redimensionar si es muy grande
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Comprimir a JPEG con calidad reducida
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = base64Image;
    });
  };

  // Cargar experiencias del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("experiences");
    if (saved) {
      setExperiences(JSON.parse(saved));
    }
  }, []);

  // Guardar experiencias
  useEffect(() => {
    localStorage.setItem("experiences", JSON.stringify(experiences));
  }, [experiences]);

  // Estadísticas
  const stats = {
    total: experiences.length,
    states: new Set(
      experiences.map((e) => e.location?.split(",")[1]?.trim() || "Desconocido")
    ).size,
    favorites: experiences.filter((e) => e.rating >= 4).length,
  };

  // Abrir cámara
  const openCamera = async () => {
    setShowCamera(true);
    setCapturedPhoto(null);
    setAiSuggestions([]);
    setSelectedCategory(null);
    setCurrentStep(1);
    setCameraLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      setCameraStream(stream);

      // Esperar a que el ref esté disponible
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .then(() => {
              setCameraLoading(false);
            })
            .catch((err) => {
              console.error("Error al reproducir video:", err);
              setCameraLoading(false);
            });
        }
      }, 100);
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      setCameraLoading(false);
      alert(
        "No se pudo acceder a la cámara. Por favor, permite el acceso o selecciona una foto de la galería."
      );
      // Ofrecer galería como alternativa
      selectFromGallery();
    }
  };

  // Capturar foto
  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL("image/jpeg", 0.8);

      // Comprimir imagen
      const compressedPhoto = await compressImage(photoData);
      setCapturedPhoto(compressedPhoto);

      // Detener stream
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }

      // Simular IA de detección
      analyzePhoto(compressedPhoto);
    }
  };

  // Seleccionar de galería
  const selectFromGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          // Comprimir imagen
          const compressedPhoto = await compressImage(event.target.result);
          setCapturedPhoto(compressedPhoto);

          // Detener stream si está activo
          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
          }

          analyzePhoto(compressedPhoto);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Analizar foto con "IA" (simulado)
  const analyzePhoto = (photoData) => {
    // Simulación de detección por IA
    // En producción, aquí llamarías a Claude API o Google Vision

    const suggestions = [
      {
        category: "restaurant",
        confidence: 85,
        emoji: "🍽️",
        label: "Restaurante",
      },
      { category: "museum", confidence: 60, emoji: "🏛️", label: "Museo" },
      { category: "park", confidence: 45, emoji: "🌳", label: "Parque" },
    ].sort((a, b) => b.confidence - a.confidence);

    setAiSuggestions(suggestions);
  };

  // Seleccionar categoría sugerida
  const selectSuggestion = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Cerrar cámara
  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
    setShowCamera(false);
    setCapturedPhoto(null);
    setCurrentStep(1);
    setAiSuggestions([]);
    setSelectedCategory(null);
    setIsRecording(false);
    setFormData({
      placeName: "",
      location: "",
      rating: 0,
      notes: "",
    });
  };

  // Guardar experiencia
  const saveExperience = () => {
    console.log("Intentando guardar experiencia...");
    console.log("Categoría seleccionada:", selectedCategory);
    console.log("Nombre del lugar:", formData.placeName);
    console.log("Rating:", formData.rating);

    // Validación más clara
    if (!selectedCategory) {
      alert(
        "⚠️ Por favor selecciona una categoría (toca una de las sugerencias de IA)"
      );
      return;
    }

    if (!formData.placeName || formData.placeName.trim() === "") {
      alert("⚠️ Por favor escribe el nombre del lugar");
      return;
    }

    if (formData.rating === 0) {
      alert("⚠️ Por favor califica tu experiencia (toca las estrellas)");
      return;
    }

    const newExperience = {
      id: Date.now(),
      category: selectedCategory,
      photo: capturedPhoto, // Ya está comprimida
      placeName: formData.placeName.trim(),
      location: formData.location.trim(),
      rating: formData.rating,
      notes: formData.notes.trim(),
      date: new Date().toISOString(),
    };

    console.log("Guardando experiencia:", newExperience);

    try {
      setExperiences((prev) => {
        const updated = [newExperience, ...prev];
        console.log("Experiencias actualizadas:", updated);
        return updated;
      });

      alert("✅ Experiencia guardada exitosamente!");
      closeCamera();

      // Regresar a la vista de mapa
      setView("map");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(
        "❌ Error al guardar. La imagen puede ser muy grande. Intenta con otra foto."
      );
    }
  };

  // Renderizar estrellas
  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`${interactive ? "rating-star" : "star-filled"} ${
          interactive && i < formData.rating ? "active" : ""
        }`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      >
        ★
      </span>
    ));
  };

  // Filtrar experiencias por búsqueda
  const filteredExperiences = experiences.filter((exp) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      exp.placeName.toLowerCase().includes(query) ||
      (exp.location && exp.location.toLowerCase().includes(query)) ||
      (exp.notes && exp.notes.toLowerCase().includes(query)) ||
      categories
        .find((c) => c.id === exp.category)
        ?.name.toLowerCase()
        .includes(query)
    );
  });

  // Iniciar grabación de voz
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        // Aquí normalmente llamarías a un API de speech-to-text
        // Por ahora simulamos el proceso
        setFormData((prev) => ({
          ...prev,
          notes:
            prev.notes +
            (prev.notes ? " " : "") +
            "[Transcripción de audio simulada] ",
        }));

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("No se pudo acceder al micrófono. Verifica los permisos.");
    }
  };

  // Detener grabación
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1 className="logo">Experiencia Privada</h1>
            <div className="header-actions">
              <button
                className={`btn ${
                  view === "map" ? "btn-secondary active" : "btn-secondary"
                }`}
                onClick={() => setView("map")}
              >
                <MapIcon size={18} />
                Mapa
              </button>
              <button
                className={`btn ${
                  view === "list" ? "btn-secondary active" : "btn-secondary"
                }`}
                onClick={() => setView("list")}
              >
                <List size={18} />
                Experiencias
              </button>
            </div>
          </div>
        </header>

        {/* Vista de Mapa */}
        {view === "map" && (
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
        )}

        {/* Vista de Lista */}
        {view === "list" && (
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
                {filteredExperiences.length} de {experiences.length}{" "}
                experiencias
              </p>

              {/* Barra de búsqueda */}
              <div className="search-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar por nombre, ubicación o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  <button className="btn btn-primary" onClick={openCamera}>
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
        )}

        {/* Floating Action Button */}
        {!showCamera && (
          <button className="fab" onClick={openCamera}>
            <Plus size={32} />
          </button>
        )}

        {/* Modal de Cámara */}
        {showCamera && (
          <div className="camera-modal">
            <div className="camera-header">
              <div className="camera-title">
                {currentStep === 1 ? "Nueva Experiencia" : "Detalles"}
              </div>
              <button className="camera-close" onClick={closeCamera}>
                <X size={20} />
              </button>
            </div>

            {/* PANTALLA 1: Solo Foto */}
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

                  {/* Botón de siguiente (flecha) */}
                  {capturedPhoto && (
                    <button
                      className="btn-next"
                      onClick={() => setCurrentStep(2)}
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
                        onClick={capturePhoto}
                        disabled={cameraLoading}
                        style={{ opacity: cameraLoading ? 0.5 : 1 }}
                      />
                      <div className="camera-actions">
                        <button
                          className="btn-camera btn-gallery"
                          onClick={selectFromGallery}
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
                      onClick={() => {
                        setCapturedPhoto(null);
                        setAiSuggestions([]);
                        openCamera();
                      }}
                    >
                      <Camera size={18} />
                      Retomar Foto
                    </button>
                  )}
                </div>
              </>
            )}

            {/* PANTALLA 2: Formulario */}
            {currentStep === 2 && (
              <>
                {/* Mini preview de la foto */}
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
                    {/* IA Suggestions */}
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
                                selectSuggestion(suggestion.category)
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

                    {/* Formulario rápido */}
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
                          setFormData((prev) => ({
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
                          setFormData((prev) => ({
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
                          setFormData((prev) => ({ ...prev, rating }))
                        )}
                      </div>
                    </div>

                    {/* Sección de Comentarios con Voz */}
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
                              isRecording ? stopRecording : startRecording
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
                          setFormData((prev) => ({
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
                      onClick={saveExperience}
                    >
                      <Check size={20} />
                      Guardar Experiencia
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
