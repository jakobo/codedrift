// convert offset/limit to page/per_page syntax
export const pager = (offset: number, limit: number) => {
  let range: number;
  let leftShift: number;
  for (range = limit; range <= offset + limit; range++) {
    for (leftShift = 0; leftShift <= range - limit; leftShift++) {
      if ((offset - leftShift) % range === 0) {
        const page = (offset - leftShift) / range;
        return {
          per_page: range,
          page,
          waste: {
            head: leftShift,
            tail: (page + 1) * range - (offset + limit),
          },
        };
      }
    }
  }

  throw new Error("Unable to convert offset/limit to page/per_page");
};
