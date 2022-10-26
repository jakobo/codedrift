import { useColorScheme } from "hooks/useColorScheme";
import Head from "next/head";
import Link from "next/link";
import React, { PropsWithChildren, useCallback } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
  SupportIcon,
} from "@heroicons/react/solid";
import cx from "classnames";
import { ICON_LINK, LINK } from "data/constants";
import { TwitterIcon } from "./icons/Twitter";
import { GitHubIcon } from "./icons/Github";

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

const Feeds = () => (
  <Head>
    <link
      rel="alternate"
      type="application/rss+xml"
      title="RSS Feed for codedrift.com"
      href="/feed/rss"
    />
    <link
      rel="alternate"
      type="application/atom+xml"
      title="ATOM Feed for codedrift.com"
      href="/feed/atom"
    />
    <link
      rel="alternate"
      type="application/json+feed"
      title="JSON Feed for codedrift.com"
      href="/feed/json"
    />
  </Head>
);

interface LogoProps {
  className?: string;
}
const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link href="/">
      <a className={cx(`h-[40px]`, "flex flex-row items-center", className)}>
        <ChevronLeftIcon className={cx(`h-[30px] w-[30px] color-current`)} />
        <ChevronRightIcon
          className={cx(`mt-[10px] ml-[-17px] h-[30px] w-[30px] color-current`)}
        />
        <span className="mt-[7px] ml-[-5px] hidden md:block">codedrift</span>
      </a>
    </Link>
  );
};

const navigation: {
  href: string;
  label?: string;
  icon?: React.FC;
  className?: string;
}[] = [
  {
    href: "/thunked",
    label: "writing",
  },
  {
    href: "https://github.com/jakobo/codedrift/discussions/categories/ask-me-anything-ama",
    label: "ama",
  },
  {
    href: "/notes",
    label: "notes",
  },
  {
    href: "/support",
    icon: () => <SupportIcon className="h-4 w-4 fill-current" />,
    className: ICON_LINK,
  },
  {
    href: "https://twitter.com/jakobo",
    icon: () => <TwitterIcon className="h-4 w-4 fill-current" />,
    className: ICON_LINK,
  },
  {
    href: "https://github.com/jakobo",
    icon: () => <GitHubIcon className="h-4 w-4 fill-current" />,
    className: ICON_LINK,
  },
];

interface LightSwitchProps {
  className?: string;
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
      className="cursor-pointer"
      tabIndex={-1}
    >
      {mode === "dark" ? (
        <MoonIcon className={cx("h-4 w-4", className)} />
      ) : (
        <SunIcon className={cx("h-4 w-4", className)} />
      )}
    </div>
  );
};

export const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col items-start h-screen min-w-full max-w-full">
        <div className="w-full h-4 flex-shrink-0 bg-gray-600 dark:bg-gray-700" />
        <header className="w-full flex flex-row max-w-limit px-4">
          <Logo className={cx(LINK, "pt-2")} />
          <nav className="flex flex-row flex-grow self-end items-center justify-end space-x-2">
            {navigation.map((v) => (
              <React.Fragment key={v.href}>
                <Link href={v.href} passHref>
                  <a className={cx(LINK, v.className)}>
                    {v.icon ? <v.icon /> : v.label}
                  </a>
                </Link>
              </React.Fragment>
            ))}
            <LightSwitch className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
          </nav>
        </header>
        <main className="w-full max-w-limit flex-grow p-4 pt-12">
          {children}
        </main>
        <footer className="w-full h-20 bg-gray-700 bg-leather-stone-700 dark:bg-gray-800 dark:bg-leather-stone-700 mt-8">
          <div className="flex flex-row items-center max-w-limit text-gray-100 dark:text-gray-200 p-4 text-sm">
            <div className="w-1/4">&lt;/&gt;</div>
            <div className="flex-grow text-center">
              <button
                className="hover:text-gray-300 border-b border-dotted border-gray-500"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  }
                }}
              >
                top
              </button>
            </div>
            <div className="w-1/4 text-right">
              <Link href="/colophon">
                <a className="hover:text-gray-300 border-b border-dotted border-gray-500">
                  &copy; 2022 Jakob Heuser
                </a>
              </Link>
            </div>
          </div>
        </footer>
      </div>
      <IndieAuth />
      <Feeds />
      <WebMentionSupport />
    </>
  );
};
