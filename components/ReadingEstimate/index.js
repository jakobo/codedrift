import { Text } from "../Typography";
import React from "react";

const WPM = 200;

// min # of minutes to read
const tiers = [0, 5, 10, 20, 60];

const rawEstimate = words => Math.ceil(words / WPM);

const ReadingEstimate = ({ words = 0, emoji = "☕️", ...rest }) => {
  const min = Math.ceil(words / WPM);
  const closest = tiers.reduce((p, c, i) => (c < min ? i : p), 0);
  const str = emoji.repeat(closest + 1);
  return <Text {...rest}>{str}</Text>;
};

export { rawEstimate };
export default ReadingEstimate;
