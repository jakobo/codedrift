import { useColorScheme } from "src/hooks/useColorScheme";
import { useRouter } from "next/router";
import Icon from "../Icon";
import Link from "next/link";
import Logo from "../Logo";
import React, { useCallback } from "react";

const Twitter = ({ className }) => (
  <a
    href="https://twitter.com/jakobo"
    className={`no-underline hover:text-brand-500 dark:hover:text-brand-invert-500 ${
      className || ""
    }`}
  >
    <Icon height="16" icon="twitter" className="fill-current" />
  </a>
);
const GitHub = ({ className }) => (
  <a
    href="https://github.com/jakobo"
    className={`no-underline hover:text-brand-500 dark:hover:text-brand-invert-500 ${
      className || ""
    }`}
  >
    <Icon height="16" icon="github" className="fill-current" />
  </a>
);
const LightSwitch = ({ className }) => {
  const { mode, setColorScheme } = useColorScheme();

  const flipLights = useCallback(() => {
    setColorScheme(mode === "dark" ? "light" : "dark");
  }, [mode]);

  return (
    <div onClick={flipLights} className={`cursor-pointer ${className || ""}`}>
      {mode === "light" ? "🌙" : "🔆"}
    </div>
  );
};

const navLinks = [
  { title: "Home", url: "/", className: "hidden lg:inline-block" },
  { title: "Writing", url: "/thunked", className: "" },
  {
    title: "Notes",
    url: "https://coda.io/d/Jakobs-Notes_dFBvQLDXnR5/Home_suijF#_lu2BJ",
    className: "",
  },
  {
    title: "Aibex",
    url: "https://aibex.com",
    className: "hidden md:inline-block",
  },
  { title: "About", url: "/about", className: "" },
  { title: "Twitter", Component: Twitter, className: "pt-1" },
  { title: "GitHub", Component: GitHub, className: "pt-1" },
  { title: "LightSwitch", Component: LightSwitch, className: "" },
];

const footerLinks = [
  {
    title: "Back to Top",
    url: "#",
    className: "",
    onClick: () => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
  },
  { title: "Home", url: "/", className: "" },
  { title: "Writing", url: "/thunked", className: "" },
  { title: "About", url: "/about", className: "" },
  { title: "Contact", url: "/contact", className: "" },
];

function TitleBar() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="bg-gray-100 dark:bg-gray-800 w-full h-5 border-b border-gray-300 border-solid">
        {/* todo hamburger here... maybe. Ideally not */}
      </div>
      <div className="flex flex-row pb-5 px-5 w-full max-w-7xl">
        <div className="-mt-5 bg-gray-100 dark:bg-gray-800 justify-center items-center px-5 py-2 border-b-4 rounded-lg border-solid w-auto">
          <Logo
            left="text-gray-400"
            right="text-brand-500 dark:text-brand-invert-500"
            text={false}
            style={{ height: "80px" }}
            className="pointer"
            onClick={() => router.push("/")}
          />
        </div>
        <div className="flex-grow flex flex-row justify-end self-start pt-1">
          {navLinks.map((item, idx) => (
            <React.Fragment key={item.title}>
              {item.Component ? (
                <item.Component
                  className={`${item.className} ${idx === 0 ? "" : "ml-2"}`}
                />
              ) : (
                <Link href={item.url} passHref>
                  <a className={`${item.className} ${idx === 0 ? "" : "ml-2"}`}>
                    {item.title}
                  </a>
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

const Footer = () => {
  return (
    <div className="w-full bg-dark dark:bg-gray-800 border-t border-t-gray-300 px-5 pb-5">
      <div className="flex flex-col lg:flex-row mx-2 space-x-5 pt-5">
        <div className="flex flex-col space-y-2">
          {footerLinks.map((item) => (
            <React.Fragment key={item.title}>
              {item.onClick ? (
                <a
                  href={item.url || "#"}
                  className={`${item.className} text-white no-underline hover:no-underline`}
                  onClick={item.onClick}
                >
                  {item.title}
                </a>
              ) : (
                <Link href={item.url} passHref>
                  <a
                    className={`${item.className} text-white no-underline hover:no-underline`}
                  >
                    {item.title}
                  </a>
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex-grow">
          <p className="text-gray-400">
            Code Drift is the personal website of Rudolph Jakob Heuser
          </p>
        </div>
        <div>
          <div className="flex flex-col items=center lg:items-end -mt-5">
            <div className="-mt-1 px-5 py-2 bg-light dark:bg-dark border-b-0 lg:border-b-4 border-t-none border-b-gray-900 rounded-lg rounded-t-none mb-5">
              <Logo
                left="text-gray-600"
                right="text-gray-500"
                text={false}
                style={{ height: "80px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Title = ({ children }) => <>{children} on Code Drift</>;

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen min-w-full max-w-full">
      <TitleBar />
      <div className="flex flex-row flex-grow mx-0 lg:mx-auto px-5 lg:px-0 max-w-full mb-10">
        {children}
      </div>
      <Footer />
    </div>
  );
}
