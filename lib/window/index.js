// window helpers
const windowHelpers = () => {
  if (typeof window === "undefined") return;

  // browser pathway
  window.codedrift = {};
  window.codedrift.debug = function(s) {
    if (typeof s !== "undefined") {
      localStorage.setItem("debug", s || "");
      location.reload(true);
    }
    return localStorage.getItem("debug");
  };
  if (localStorage.getItem("debug")) {
    console.log("Enabled debug: " + localStorage.getItem("debug"));
  }
};

export { windowHelpers };
