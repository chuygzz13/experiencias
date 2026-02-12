import React, { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";

import "./App.css";

import Header from "./Header";
import MapView from "./MapView";
import ExperienciasFeed from "./ExperienciasFeed";
import ExperienciaForm from "./ExperienciaForm";

// Categorías con emojis (usado para filtrado en App)
const categories = [
  { id: "restaurant", name: "Restaurante", emoji: "🍽️" },
  { id: "museum", name: "Museo", emoji: "🏛️" },
  { id: "park", name: "Parque", emoji: "🌳" },
  { id: "entertainment", name: "Entretenimiento", emoji: "🎢" },
  { id: "event", name: "Evento", emoji: "🎭" },
];

function compressImage(base64Image, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = base64Image;
  });
}

function analyzePhoto() {
  return [
    {
      category: "restaurant",
      confidence: 85,
      emoji: "🍽️",
      label: "Restaurante",
    },
    { category: "museum", confidence: 60, emoji: "🏛️", label: "Museo" },
    { category: "park", confidence: 45, emoji: "🌳", label: "Parque" },
  ].sort((a, b) => b.confidence - a.confidence);
}

export default function App() {
  const [view, setView] = useState("map");
  const [experiences, setExperiences] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
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

  useEffect(() => {
    const saved = localStorage.getItem("experiences");
    if (saved) {
      setExperiences(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("experiences", JSON.stringify(experiences));
  }, [experiences]);

  const stats = {
    total: experiences.length,
    states: new Set(
      experiences.map((e) => e.location?.split(",")[1]?.trim() || "Desconocido")
    ).size,
    favorites: experiences.filter((e) => e.rating >= 4).length,
  };

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

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current
            .play()
            .then(() => setCameraLoading(false))
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
      selectFromGallery();
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL("image/jpeg", 0.8);
      const compressedPhoto = await compressImage(photoData);
      setCapturedPhoto(compressedPhoto);

      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }

      setAiSuggestions(analyzePhoto());
    }
  };

  const selectFromGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const compressedPhoto = await compressImage(event.target.result);
          setCapturedPhoto(compressedPhoto);

          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
          }

          setAiSuggestions(analyzePhoto());
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

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

  const saveExperience = () => {
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
      photo: capturedPhoto,
      placeName: formData.placeName.trim(),
      location: formData.location.trim(),
      rating: formData.rating,
      notes: formData.notes.trim(),
      date: new Date().toISOString(),
    };

    try {
      setExperiences((prev) => [newExperience, ...prev]);
      alert("✅ Experiencia guardada exitosamente!");
      closeCamera();
      setView("map");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(
        "❌ Error al guardar. La imagen puede ser muy grande. Intenta con otra foto."
      );
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`${interactive ? "rating-star" : "star-filled"} ${
          interactive && i < rating ? "active" : ""
        }`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      >
        ★
      </span>
    ));
  };

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
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

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setAiSuggestions([]);
    openCamera();
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="app-container">
        <Header view={view} onViewChange={setView} />

        {view === "map" && <MapView stats={stats} />}

        {view === "list" && (
          <ExperienciasFeed
            experiences={experiences}
            filteredExperiences={filteredExperiences}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateExperience={openCamera}
          />
        )}

        {!showCamera && (
          <button className="fab" onClick={openCamera}>
            <Plus size={32} />
          </button>
        )}

        <ExperienciaForm
          showCamera={showCamera}
          cameraLoading={cameraLoading}
          capturedPhoto={capturedPhoto}
          currentStep={currentStep}
          aiSuggestions={aiSuggestions}
          selectedCategory={selectedCategory}
          isRecording={isRecording}
          formData={formData}
          videoRef={videoRef}
          canvasRef={canvasRef}
          onClose={closeCamera}
          onCapturePhoto={capturePhoto}
          onSelectFromGallery={selectFromGallery}
          onRetakePhoto={handleRetakePhoto}
          onSelectSuggestion={setSelectedCategory}
          onSaveExperience={saveExperience}
          onStepChange={setCurrentStep}
          onFormChange={setFormData}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          renderStars={renderStars}
        />
      </div>
    </>
  );
}
