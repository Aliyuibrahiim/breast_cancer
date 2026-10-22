"use client";

import React, { useState } from "react";
import { saveDiagnosticResult } from "@/services/diagnostic";
import { useRouter } from "next/navigation";

interface RunScreeningModalProps {
    patientId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function RunScreeningModal({ patientId, isOpen, onClose }: RunScreeningModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<"input" | "loading" | "result">("input");
    const [error, setError] = useState("");

    // Form state for Multimodal Model
    const [image, setImage] = useState<File | null>(null);
    const [text, setText] = useState("");

    // Result state
    const [prediction, setPrediction] = useState<"benign" | "malignant" | null>(null);
    const [confidence, setConfidence] = useState<string>("");

    if (!isOpen) return null;

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !text) {
            setError("Please provide both an image and clinical text.");
            return;
        }

        setStep("loading");
        setError("");

        const formData = new FormData();
        formData.append("image", image);
        formData.append("text", text);

        try {
            const response = await fetch("http://localhost:8001/predict", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || "Failed to get prediction from the backend server. Is it running?");
            }

            const data = await response.json();

            // Expected data format: { prediction: "Malignant", confidence: 0.85 }
            const isMalignant = data.prediction.toLowerCase() === "malignant";

            setPrediction(isMalignant ? "malignant" : "benign");
            setConfidence((data.confidence * 100).toFixed(1) + "%");
            setStep("result");
        } catch (err: any) {
            setError(err.message || "Failed to run prediction");
            setStep("input");
        }
    };

    const handleSave = async () => {
        if (!prediction) return;
        setStep("loading");
        setError("");

        try {
            await saveDiagnosticResult({
                patientId,
                predictionResult: prediction,
                confidenceScore: confidence,
                notes: text, // Save the clinical notes provided
            });

            router.refresh();
            resetAndClose();
        } catch (err: any) {
            setError(err.message || "Failed to save diagnostic result");
            setStep("result");
        }
    };

    const resetAndClose = () => {
        setStep("input");
        setImage(null);
        setText("");
        setPrediction(null);
        setConfidence("");
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Multimodal AI Screening</h2>
                    <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {step === "input" && (
                        <form onSubmit={handlePredict}>
                            <p className="text-sm text-gray-800 mb-6">
                                Upload a mammogram and input clinical notes to run the multimodal AI prediction model.
                            </p>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mammogram Scan (Image)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                                        className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes (Text)</label>
                                    <textarea
                                        rows={4}
                                        placeholder="E.g., Patient presents with a palpable mass in the upper outer quadrant..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={resetAndClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!image || !text}
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Run AI Analysis
                                </button>
                            </div>
                        </form>
                    )}

                    {step === "loading" && (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <h3 className="text-lg font-medium text-gray-900">Processing Scan & Notes...</h3>
                            <p className="text-sm text-gray-500 text-center mt-2">
                                The AI model is analyzing the mammogram and clinical text. This usually takes a moment.
                            </p>
                        </div>
                    )}

                    {step === "result" && prediction && (
                        <div className="py-6 text-center">
                            <div className="mb-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Prediction Result</div>

                            <div className={`mx-auto w-32 h-32 flex items-center justify-center rounded-full mb-6 border-4 ${prediction === "malignant" ? "bg-red-50 border-red-200 text-red-600" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                                }`}>
                                <span className="text-2xl font-bold capitalize">{prediction}</span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                                    <span className="text-sm text-gray-600">Model Confidence</span>
                                    <span className="font-bold text-gray-900">{confidence}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {prediction === "malignant"
                                        ? "The model has flagged this case as high-risk. Immediate clinical review is recommended."
                                        : "The model indicates a low probability of malignancy. Standard monitoring advised."}
                                </p>
                            </div>

                            <div className="flex justify-center space-x-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setStep("input")} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                    Recalculate
                                </button>
                                <button onClick={handleSave} className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Save to Patient Record
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
