import React from "react";
import iconPaths from "./selection.json";

function getPath(iconName) {
  const idx = iconPaths.selection.findIndex((icon) => icon.name === iconName);
  if (idx) {
    const icon = iconPaths.icons[idx];
    return icon.paths.join(" ");
  } else {
    console.warn(`icon ${iconName} does not exist.`);
    return null;
  }
}

const Icon = ({ icon, width, height, className } = {}) => (
  <svg
    className={`${className}`}
    width={height || width}
    height={height || width}
    viewBox="0 0 1024 1024"
  >
    <path d={getPath(icon)}></path>
  </svg>
);

export default Icon;
