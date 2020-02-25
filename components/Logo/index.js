import Box from "../Box";
import React, { forwardRef } from "react";

const Logo = forwardRef(
  (
    { l = "#ed2224", r = "#45a6dd", text = ["#4d4d4d", "#45a6dd"], ...rest },
    ref
  ) => {
    const styles = {
      l: {
        fill: l,
        fillRule: "evenodd",
      },
      r: {
        fill: r,
        fillRule: "evenodd",
      },
      code: {
        fill: text?.[0] || text || l,
        fillRule: "evenodd",
      },
      drift: {
        fill: text?.[1] || text || r,
        fillRule: "evenodd",
      },
    };
    return (
      <Box ref={ref} {...rest}>
        {text === false && <IconOnly styles={styles} />}
        {text !== false && <FullLogo styles={styles} />}
      </Box>
    );
  }
);
Logo.displayName = "Logo";

const IconOnly = ({ styles }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.41 126.99">
    <g id="cd" data-name="cd">
      <polygon
        style={styles.l}
        points="48.5 22.27 48.5 0 0 52.39 48.5 104.78 48.5 82.52 20.61 52.39 48.5 22.27"
      />
      <polygon
        style={styles.r}
        points="55.91 44.48 55.91 22.21 104.41 74.6 55.91 126.99 55.91 104.72 83.8 74.6 55.91 44.48"
      />
    </g>
  </svg>
);
IconOnly.displayName = "Logo(Icon-Only)";

const FullLogo = ({ styles }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 469.1 126.99">
    <g id="logo" data-name="logo">
      <g id="cd" data-name="cd">
        <polygon
          style={styles.l}
          points="48.5 22.27 48.5 0 0 52.39 48.5 104.78 48.5 82.52 20.61 52.39 48.5 22.27"
        />
        <polygon
          style={styles.r}
          points="55.91 44.48 55.91 22.21 104.41 74.6 55.91 126.99 55.91 104.72 83.8 74.6 55.91 44.48"
        />
      </g>
      <g id="codedrift" data-name="codedrift">
        <path
          style={styles.code}
          d="M157.71,85.77v5.37q0,14.22-13.41,14.22h-7.23q-13.41,0-13.41-14.22V35.86q0-14.23,13.41-14.23h7.23q13.41,0,13.41,14.23V45.3H146.52V36.67c0-3.26-1.67-4.9-5-4.9h-2.21c-3,0-4.43,1.64-4.43,4.9V90.32c0,3.27,1.47,4.9,4.43,4.9h2.8q4.42,0,4.43-4.9V85.77Z"
        />
        <path
          style={styles.code}
          d="M179.41,105.36q-13.53,0-13.53-14.22V36q0-14.34,13.41-14.34H190q13.41,0,13.41,14.34V91.14q0,14.22-13.53,14.22Zm2.68-10.14h5.71q4.44,0,4.44-4.9V36.67c0-3.26-1.68-4.9-5-4.9H182c-3.26,0-4.9,1.64-4.9,4.9V90.32C177.07,93.59,178.75,95.22,182.09,95.22Z"
        />
        <path
          style={styles.code}
          d="M213.34,105.36V21.63h19.48q15.75,0,15.74,16.09V93.24q0,12.12-13.41,12.12Zm11.2-10.14h8.4c2.95,0,4.43-1.25,4.43-3.73V37.84c0-4-1.67-6.07-5-6.07h-7.81Z"
        />
        <polygon
          style={styles.code}
          points="258.48 105.36 258.48 21.63 286.24 21.63 286.24 31.77 269.68 31.77 269.68 57.2 284.37 57.2 284.37 67.34 269.68 67.34 269.68 95.22 286.24 95.22 286.24 105.36 258.48 105.36"
        />
        <path
          style={styles.drift}
          d="M294.28,105.36V21.63h19.48q15.74,0,15.74,16.09V93.24q0,12.12-13.41,12.12Zm11.2-10.14h8.4c2.95,0,4.43-1.25,4.43-3.73V37.84c0-4-1.67-6.07-5-6.07h-7.81Z"
        />
        <path
          style={styles.drift}
          d="M339.42,21.63h21.92q12.82,0,12.83,14.34V56.61q0,11-6.65,13.88l7.82,34.87H364.72l-7.34-33.82h-6.77v33.82H339.42V21.63ZM350.61,62H358q5,0,5-6.06V37.84c0-4-1.67-6.07-5-6.07h-7.35Z"
        />
        <rect
          style={styles.drift}
          x="383.5"
          y="21.63"
          width="11.2"
          height="83.74"
        />
        <polygon
          style={styles.drift}
          points="431.08 57.2 431.08 67.34 416.39 67.34 416.39 105.36 405.19 105.36 405.19 21.63 432.95 21.63 432.95 31.77 416.39 31.77 416.39 57.2 431.08 57.2"
        />
        <polygon
          style={styles.drift}
          points="458.37 31.77 458.37 105.36 447.18 105.36 447.18 31.77 436.45 31.77 436.45 21.63 469.1 21.63 469.1 31.77 458.37 31.77"
        />
      </g>
    </g>
  </svg>
);
FullLogo.displayName = "Logo(Full-Logo)";

export default Logo;
