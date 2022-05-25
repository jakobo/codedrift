export const LINK =
  "transition-all text-primary-700 hover:text-primary-500 dark:text-primary-500 hover:dark:text-primary-300";

export const MINOR_LINK = [
  "transition-all",
  "text-gray-500",
  "hover:text-gray-400",
  "dark:text-gray-500",
  "hover:dark:text-gray-400",
].join(" ");

export const PROSE = [
  "max-w-none",
  "prose",
  "prose-stone",
  "dark:prose-invert",
  // base color tweaks
  "dark:prose-headings:text-slate-100",
  "dark:prose-p:text-slate-100",
  "dark:prose-li:text-slate-100",
  // headings
  "prose-h2:font-normal",
  "prose-h3:font-normal",
  // links
  "prose-a:transition-all",
  "prose-a:text-primary-700",
  "hover:prose-a:text-primary-500",
  "dark:prose-a:text-primary-500",
  "hover:dark:prose-a:text-primary-300",
  // code
  "prose-code:font-black",
  "prose-code:text-secondary-700",
  "dark:prose-code:text-secondary-600",
  "prose-code:before:content-none",
  "prose-code:after:content-none",
].join(" ");

export const ICON_LINK =
  "transition-all text-gray-500 hover:!text-gray-400 dark:text-gray-500 hover:dark:!text-gray-400";

export const SECTION_HEADLINE = ["font-title", "text-7xl", "mb-3"].join(" ");
