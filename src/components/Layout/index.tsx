import { useColorScheme } from "src/hooks/useColorScheme";
import { useRouter } from "next/router";
import Head from "next/head";
import Icon from "../Icon";
import Link from "next/link";
import Logo from "../Logo";
import React, { useCallback } from "react";

interface TwitterProps {
  className: string;
}
const Twitter: React.FC<TwitterProps> = ({ className }) => (
  <a
    href="https://twitter.com/jakobo"
    className={`no-underline text-gray-300 dark:text-gray-500 hover:text-brand-500 dark:hover:text-brand-invert-500 ${
      className || ""
    }`}
  >
    <Icon icon="twitter" className="h-4 w-4 fill-current" />
  </a>
);

interface GithubProps {
  className: string;
}
const GitHub: React.FC<GithubProps> = ({ className }) => (
  <a
    href="https://github.com/jakobo"
    className={`no-underline text-gray-300 dark:text-gray-500 hover:text-brand-500 dark:hover:text-brand-invert-500 ${
      className || ""
    }`}
  >
    <Icon icon="github" className="h-4 w-4 fill-current" />
  </a>
);

interface LightSwitchProps {
  className: string;
}
const LightSwitch: React.FC<LightSwitchProps> = ({ className }) => {
  const { mode, setColorScheme } = useColorScheme();

  const flipLights = useCallback(() => {
    setColorScheme(mode === "dark" ? "light" : "dark");
  }, [mode, setColorScheme]);

  return (
    <div
      onClick={flipLights}
      onKeyPress={flipLights}
      role="button"
      className={`cursor-pointer ${className || ""}`}
      tabIndex={-1}
    >
      <Icon icon={mode === "light" ? "moon" : "sun"} className="h-4 w-4" />
    </div>
  );
};

const navLinks = [
  { title: "Home", url: "/", className: "" },
  { title: "Writing", url: "/thunked", className: "" },
  {
    title: "Notes",
    url: "https://coda.io/d/Jakobs-Notes_dFBvQLDXnR5/Home_suijF#_lu2BJ",
    className: "",
  },
  { title: "Twitter", Component: Twitter, className: "pt-1" },
  { title: "GitHub", Component: GitHub, className: "pt-1" },
  { title: "LightSwitch", Component: LightSwitch, className: "pt-1" },
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
  { title: "Contact", url: "/contact", className: "" },
];

interface TitleBarProps {
  disabled: boolean;
}
const TitleBar: React.FC<TitleBarProps> = ({ disabled = false }) => {
  const router = useRouter();

  const bgGray100 = disabled
    ? "bg-red-100 dark:bg-red-800"
    : "bg-gray-100 dark:bg-gray-800";
  const borderGray300 = disabled ? "border-red-300" : "border-gray-300";
  const colorGray400 = disabled ? "text-red-400" : "text-gray-400";
  const colorBrand500 = disabled
    ? "text-red-500"
    : "text-brand-500 dark:text-brand-invert-500";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className={`${bgGray100} w-full h-5 border-b ${borderGray300} border-solid`}
      >
        {/* todo hamburger here... maybe. Ideally not */}
      </div>
      <div className="flex flex-row pb-5 px-5 w-full max-w-7xl">
        <div
          className={`-mt-5 ${bgGray100} justify-center items-center px-5 py-2 border-b-4 rounded-lg border-solid w-auto`}
        >
          <Logo
            left={colorGray400}
            right={colorBrand500}
            text={false}
            style={{ height: "80px" }}
            className="pointer"
            onClick={() => router.push("/")}
          />
        </div>
        <div className="flex-grow flex flex-row justify-end self-start pt-1">
          {disabled ? (
            <div className="flex flex-row">
              <span>no navigation</span>
              <LightSwitch className="pt-1 ml-2" />
            </div>
          ) : (
            navLinks.map((item, idx) => (
              <React.Fragment key={item.title}>
                {item.Component ? (
                  <item.Component
                    className={`${item.className} ${idx === 0 ? "" : "ml-2"}`}
                  />
                ) : (
                  <Link href={item.url} passHref>
                    <a
                      href={item.url}
                      className={`${item.className} ${idx === 0 ? "" : "ml-2"}`}
                    >
                      {item.title}
                    </a>
                  </Link>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface FooterProps {
  disabled: boolean;
}
const Footer: React.FC<FooterProps> = ({ disabled = false }) => {
  const bgDark = disabled
    ? "bg-red-800 dark:bg-red-900"
    : "bg-dark dark:bg-gray-800";
  const borderGray300 = disabled ? "border-red-300" : "border-gray-300";
  const borderGray900 = disabled ? "border-red-900" : "border-gray-900";
  const bgLight = disabled
    ? "bg-red-100 dark:bg-red-800"
    : "bg-light dark:bg-dark";
  const colorGray600 = disabled ? "text-red-600" : "text-gray-600";
  const colorGray500 = disabled ? "text-red-500" : "text-gray-500";

  return (
    <>
      <div className={`w-full ${bgDark} border-t ${borderGray300} px-5 pb-5`}>
        <div className="flex flex-col lg:flex-row px-2 space-x-5 pt-5 w-full max-w-7xl mx-auto">
          <div className="flex flex-col space-y-2">
            {disabled
              ? null
              : footerLinks.map((item) => (
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
                          href={item.url}
                          className={`${item.className} text-white no-underline hover:no-underline`}
                        >
                          {item.title}
                        </a>
                      </Link>
                    )}
                  </React.Fragment>
                ))}
          </div>
          <div className="flex-grow pt-2 md:pt-0">
            {disabled ? null : (
              <p className="text-gray-400">
                Code Drift is the personal website of Rudolph Jakob Heuser
              </p>
            )}
          </div>
          <div className="hidden lg:block">
            <div className="flex flex-col items=center lg:items-end -mt-5">
              <div
                className={`-mt-1 px-5 py-2 ${bgLight} border-b-0 lg:border-b-4 border-t-none ${borderGray900} rounded-lg rounded-t-none mb-5`}
              >
                <Logo
                  left={colorGray500}
                  right={colorGray600}
                  text={false}
                  style={{ height: "80px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 px-5 lg:hidden flex flex-row justify-end">
        <Logo
          left={colorGray500}
          right={colorGray600}
          text={false}
          style={{ height: "80px" }}
        />
      </div>
    </>
  );
};

const IndieAuth = () => (
  <Head>
    <link rel="me" href="https://twitter.com/jakobo" />
    <link rel="me" href="https://linkedin.com/in/jakobheuser" />
    <link rel="me" href="https://github.com/jakobo" />
    <link rel="me" href="https://twitch.tv/jakobox" />
    <link rel="me" href="https://www.instagram.com/jakobheuser/" />
    <link rel="me" href="https://www.reddit.com/user/Jakobox" />
  </Head>
);

const WebMentionSupport = () => (
  <Head>
    <link
      rel="webmention"
      href="https://webmention.io/codedrift.com/webmention"
    />
    <link rel="pingback" href="https://webmention.io/codedrift.com/xmlrpc" />
  </Head>
);

export const createTitle = (text) => `${text} on Code Drift`;

export default function Layout({ disabled = false, children }) {
  return (
    <div className="flex flex-col min-h-screen min-w-full max-w-full">
      <TitleBar disabled={disabled} />
      <div className="flex flex-row flex-grow mx-0 lg:mx-auto px-5 lg:px-0 max-w-full mb-10">
        {children}
      </div>
      <Footer disabled={disabled} />
      {disabled ? null : (
        <>
          <IndieAuth />
          <WebMentionSupport />
        </>
      )}
    </div>
  );
}
