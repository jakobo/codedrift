import { BASELINE } from "src/theme"; // the file exported from IcoMoon
import { Box } from "@theme-ui/components";
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

const calcPad = (height) => {
  const total = height % BASELINE;
  return total % 2
    ? { py: total / 2 }
    : { pt: Math.ceil(total / 2), pb: Math.floor(total / 2) };
};

const Icon = ({ icon, width, height, sx = {} } = {}) => (
  <Box sx={{ ...calcPad(height || width || BASELINE), ...sx }}>
    <svg
      width={height || width || BASELINE}
      height={height || width || BASELINE}
      viewBox="0 0 1024 1024"
    >
      <path d={getPath(icon)}></path>
    </svg>
  </Box>
);

export default Icon;
