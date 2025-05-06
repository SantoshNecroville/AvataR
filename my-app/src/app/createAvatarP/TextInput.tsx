"use client";
import React from "react";
import { AlertTriangle, Text as LucideText } from "lucide-react";

type TextInputProps = {
  text: string;
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: {
    text?: string;
  };
};

const TextInput: React.FC<TextInputProps> = ({ text, handleTextChange, errors }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="text-input"
        className="flex items-center text-sm font-medium text-purple-700 mb-2"
      >
        <LucideText className="w-4 h-4 mr-2" />
        Text Input
      </label>

      <div
        className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
          errors.text
            ? "ring-2 ring-red-500"
            : "hover:ring-2 hover:ring-purple-400"
        }`}
      >
        <input
          id="text-input"
          name="text"
          type="text"
          value={text}
          onChange={handleTextChange}
          aria-invalid={!!errors.text}
          className={`w-full px-4 py-3 bg-purple-50 text-purple-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
            errors.text ? "ring-2 ring-red-500" : "ring-1 ring-purple-200"
          }`}
          placeholder="Enter your text here"
        />
      </div>

      {errors.text && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
          {errors.text}
        </p>
      )}
    </div>
  );
};

export default TextInput;
