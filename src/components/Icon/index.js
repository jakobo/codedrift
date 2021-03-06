import iconPaths from "./selection.js.js"; // the file exported from IcoMoon
import React from "react";

function getPath(iconName) {
  const icon = iconPaths.icons.find(
    (icon) => icon.properties.name === iconName
  );

  if (icon) {
    return icon.icon.paths.join(" ");
  } else {
    console.warn(`icon ${iconName} does not exist.`);
    return "";
  }
}

const Icon = (props) => (
  <svg width="22" height="22" viewBox="0 0 1024 1024">
    <path d={getPath(props.icon)}></path>
  </svg>
);

export default Icon;
