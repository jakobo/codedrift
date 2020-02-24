const pages = {
  "/thoughts/[slug]": /^\/thoughts\/[^\/]+$/,
};

const getPagePath = u => {
  if (u.indexOf("/") !== 0) return false;
  const res = Object.keys(pages).filter(p => {
    return pages[p].test(u);
  });

  if (res.length > 1) {
    console.error("multiple results for URL:", u, res);
    return false;
  }

  return res[0];
};

export { getPagePath };
