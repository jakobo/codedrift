import { Box, Button, Select, Slider, Text } from "@theme-ui/components";
import { hcoDefinitions } from "src/theme";
import React, { useCallback, useEffect, useState } from "react";

const containerStyle = {
  maxWidth: "813px",
  margin: "0 auto",
  background: `repeating-linear-gradient(
    to right,
    #f6f6f6,
    #f6f6f6 10px,
    #ffffff 10px,
    #ffffff 20px
  )`,
  border: "1px solid #000",
  paddingTop: "20px",
  padddingBottom: "20px",
  marginBottom: "20px",
  boxSizing: "border-box",
};

const fontOverlayStyle = { position: "absolute", left: 0, top: 0 };

const phrases = {
  short:
    "Ever since the invention of typography, we have sought to contain its power.",
  long:
    "This begs the question, are hamburgers a sandwich? If so, where does the madness stop? There are 35 reasons why fonts matter and zero why they don't. Sometimes, the right comment is all you need.",
};

const fonts = Object.getOwnPropertyNames(hcoDefinitions).reduce((prev, key) => {
  const variants = Object.getOwnPropertyNames(hcoDefinitions[key]).reduce(
    (acc, variant) => {
      return [...acc, `${key}.${variant}`];
    },
    []
  );
  return [...prev, ...variants];
}, []);

const getFontDefinition = (ns) => {
  const [name, variant] = ns.split(".");
  return hcoDefinitions[name][variant];
};

const ranged = (r, v) => Math.min(r[1], Math.max(r[0], v));
const emify = (v) => `${Number(v).toFixed(2)}em`;
const pxify = (v) => `${v}px`;

const RangedField = ({ name, calculated, min, max, step, value, onChange }) => {
  return (
    <Box>
      <Text>
        Fallback {name} Adjustment: {calculated}
      </Text>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        sx={{ height: "1em", p: 0, m: 0 }}
      />
    </Box>
  );
};

export default function Fout() {
  const [selection, setSelection] = useState(fonts[0]);
  const [fontSize, setFontSize] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [fontWeight, setFontWeight] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [css, setCss] = useState({});
  const resetSliders = useCallback(() => {
    setFontSize(0);
    setLineHeight(0);
    setFontWeight(0);
    setLetterSpacing(0);
    setWordSpacing(0);
  }, []);

  const handleSelection = useCallback(
    (e) => {
      setSelection(e.target.value);
      resetSliders();
    },
    [resetSliders]
  );

  useEffect(() => {
    const current = getFontDefinition(selection);
    setCss({
      fontSize: `${pxify(
        ranged([1, 900], parseInt(current.fontSize, 10) + parseInt(fontSize))
      )}`,
      lineHeight: ranged(
        [0.01, 99],
        Number(
          parseFloat(current.lineHeight || 0) + parseFloat(lineHeight)
        ).toFixed(2)
      ),
      fontWeight: ranged(
        [100, 900],
        (current.fontWeight || 0) + parseInt(fontWeight, 10)
      ),
      letterSpacing: emify(
        ranged(
          [-3, 3],
          parseFloat(current.letterSpacing || 0) + parseFloat(letterSpacing)
        )
      ),
      wordSpacing: emify(
        ranged(
          [-3, 3],
          parseFloat(current.wordSpacing || 0) + parseFloat(wordSpacing)
        )
      ),
    });
  }, [selection, fontSize, lineHeight, fontWeight, letterSpacing, wordSpacing]);

  const activeFont = getFontDefinition(selection);
  const { fallback, ...fontProps } = activeFont;

  return (
    <div style={containerStyle}>
      <Select
        sx={{ width: "auto", px: "2px", py: "4px", background: "white" }}
        defaultValue={fonts[0]}
        vaue={selection}
        onChange={handleSelection}
      >
        {fonts.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </Select>
      <Button onClick={resetSliders} sx={{ mb: "20px" }}>
        Reset
      </Button>
      <RangedField
        name="Font Size"
        calculated={css.fontSize}
        original={activeFont.fontSize || "1px"}
        min="-20"
        max="20"
        step="1"
        value={fontSize}
        onChange={(e) => setFontSize(e.target.value)}
      />
      <RangedField
        name="Line Height"
        calculated={Number(css.lineHeight).toFixed(2)}
        original={
          Number(activeFont.lineHeight).toFixed(2) || Number(1).toFixed(2)
        }
        min="-3"
        max="3"
        step="0.01"
        value={lineHeight}
        onChange={(e) => setLineHeight(e.target.value)}
      />
      <RangedField
        name="Font Weight"
        calculated={css.fontWeight}
        original={activeFont.fontWeight || 400}
        min="-900"
        max="900"
        step="100"
        value={fontWeight}
        onChange={(e) => setFontWeight(e.target.value)}
      />
      <RangedField
        name="Letter Spacing"
        calculated={css.letterSpacing}
        original={activeFont.letterSpacing || 0}
        min="-3"
        max="3"
        step="0.001"
        value={letterSpacing}
        onChange={(e) => setLetterSpacing(e.target.value)}
      />
      <RangedField
        name="Word Spacing"
        calculated={css.wordSpacing}
        original={activeFont.wordSpacing || 0}
        min="-3"
        max="3"
        step="0.001"
        value={wordSpacing}
        onChange={(e) => setWordSpacing(e.target.value)}
      />

      <Box sx={{ mt: "100px", pt: "400px", position: "relative" }}>
        <div style={fontOverlayStyle}>
          <div style={{ ...fontProps, color: "red", opacity: 0.8 }}>
            {phrases.short + " " + phrases.long}
          </div>
        </div>
        <div style={fontOverlayStyle}>
          <div
            style={{
              fontFamily: fallback.fontFamily,
              ...(fallback?.fontVariant
                ? { fontVariant: fallback.fontVariant }
                : {}),
              ...css,
            }}
          >
            {phrases.short + " " + phrases.long}
          </div>
        </div>
      </Box>
    </div>
  );
}
