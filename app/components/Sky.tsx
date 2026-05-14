"use client";

import { useMemo } from "react";

export type SkyMood =
  | "clear-day"
  | "clear-night"
  | "cloudy-day"
  | "cloudy-night"
  | "rain-day"
  | "rain-night"
  | "storm-day"
  | "storm-night"
  | "snow-day"
  | "fog-day"
  | "sunrise"
  | "sunset";

export function moodFromCode(code: number | undefined, isDay: boolean | number): SkyMood {
  const day = Boolean(isDay);
  if (code === undefined) return day ? "clear-day" : "clear-night";
  if ([95, 96, 99].includes(code)) return day ? "storm-day" : "storm-night";
  if ([80, 81, 82, 61, 63, 65, 66, 67].includes(code)) return day ? "rain-day" : "rain-night";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow-day";
  if ([45, 48].includes(code)) return "fog-day";
  if ([2, 3].includes(code)) return day ? "cloudy-day" : "cloudy-night";
  if ([1].includes(code)) return day ? "clear-day" : "clear-night";
  return day ? "clear-day" : "clear-night";
}

const SKY_CLASSES: Record<SkyMood, string> = {
  "clear-day": "sky-clear-day",
  "clear-night": "sky-clear-night",
  "cloudy-day": "sky-cloudy-day",
  "cloudy-night": "sky-cloudy-night",
  "rain-day": "sky-rain-day",
  "rain-night": "sky-rain-night",
  "storm-day": "sky-storm-day",
  "storm-night": "sky-storm-night",
  "snow-day": "sky-snow-day",
  "fog-day": "sky-fog-day",
  "sunrise": "sky-sunrise",
  "sunset": "sky-sunset",
};

export default function Sky({ mood }: { mood: SkyMood }) {
  const elements = useMemo(() => {
    const isDay = mood.endsWith("-day") || mood === "sunrise" || mood === "sunset";
    const showSun = mood === "clear-day" || mood === "cloudy-day";
    const showMoon = mood.endsWith("-night");
    const showStars = mood.endsWith("-night");
    const showClouds = ["cloudy-day", "cloudy-night", "rain-day", "rain-night", "storm-day", "storm-night", "fog-day"].includes(mood);
    const dimClouds = mood.startsWith("storm") || mood.startsWith("rain") || mood.endsWith("-night");
    const showRain = mood.startsWith("rain") || mood.startsWith("storm");
    return { isDay, showSun, showMoon, showStars, showClouds, dimClouds, showRain };
  }, [mood]);

  return (
    <div className={`sky ${SKY_CLASSES[mood]}`} aria-hidden>
      {elements.showStars && <div className="stars" />}
      {elements.showSun && (
        <div className="sun animate-sun-rotate" style={{ animationDuration: "200s" }} />
      )}
      {elements.showMoon && <div className="moon" />}
      {elements.showClouds && (
        <>
          <div
            className={`cloud animate-cloud-drift ${elements.dimClouds ? "dark" : ""}`}
            style={{ top: "8%", animationDuration: "80s", animationDelay: "-12s" }}
          />
          <div
            className={`cloud small animate-cloud-drift ${elements.dimClouds ? "dark" : ""}`}
            style={{ top: "22%", animationDuration: "120s", animationDelay: "-40s" }}
          />
          <div
            className={`cloud animate-cloud-drift ${elements.dimClouds ? "dark" : ""}`}
            style={{ top: "32%", animationDuration: "100s", animationDelay: "-65s" }}
          />
        </>
      )}
      {elements.showRain && <div className="rain-layer" />}
    </div>
  );
}
