import React, { type PropsWithChildren, useCallback } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
  HeartIcon,
  ChatAlt2Icon,
} from "@heroicons/react/solid/index.js";
import cx from "classnames";
import Head from "next/head.js";
import Link from "next/link.js";
import { ICON_LINK, LINK } from "@/data/constants.js";
import { useColorScheme } from "@/hooks/useColorScheme.js";

const IndieAuth = () => (
  <Head>
    <link rel="me" href="https://hachyderm.io/@jakobo" />
    <link rel="me" href="https://twitter.com/jakobo" />
    <link rel="me" href="https://linkedin.com/in/jakobheuser" />
    <link rel="me" href="https://github.com/jakobo" />
    <link rel="me" href="https://twitch.tv/jakobox" />
    <link rel="me" href="https://www.instagram.com/jakobheuser/" />
    <link rel="me" href="https://www.reddit.com/user/Jakobox" />
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

type LogoProps = {
  className?: string;
};
const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link
      href="/"
      className={cx(`h-[40px]`, "flex flex-row items-center", className)}
    >
      <ChevronLeftIcon className={cx(`color-current h-[30px] w-[30px]`)} />
      <ChevronRightIcon
        className={cx(`color-current ml-[-17px] mt-[10px] h-[30px] w-[30px]`)}
      />
      <span className="ml-[-5px] mt-[7px] hidden md:block">
        code
        <span className="brightness-50 dark:brightness-75">drift</span>
      </span>
    </Link>
  );
};

const navigation: Array<{
  href: string;
  label?: string;
  title?: string;
  icon?: React.FC;
  className?: string;
  rel?: string;
}> = [
  {
    href: "/thunked",
    label: "writing",
  },
  {
    href: "https://github.com/jakobo/codedrift/discussions/categories/ask-me-anything-ama",
    label: "ama",
    className: "hidden md:block",
  },
  {
    href: "/notes",
    label: "notes",
  },
  {
    href: "/help",
    title: "Helping Others",
    icon: () => <HeartIcon className="h-6 w-6 fill-current" />,
    className: ICON_LINK,
  },
  {
    href: "/social",
    title: "Elsewhere on the Web",
    icon: () => <ChatAlt2Icon className="h-6 w-6 fill-current" />,
    className: ICON_LINK,
  },
];

type LightSwitchProps = {
  className?: string;
};
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
        <MoonIcon className={cx("h-6 w-6", className)} />
      ) : (
        <SunIcon className={cx("h-6 w-6", className)} />
      )}
    </div>
  );
};

export const Layout: React.FC<PropsWithChildren<Record<string, unknown>>> = ({
  children,
}) => {
  return (
    <>
      <div className="flex h-screen min-w-full max-w-full flex-col items-start">
        <div className="h-6 w-full flex-shrink-0 bg-gray-600 dark:bg-gray-700" />
        <header className="flex w-full max-w-limit flex-row px-4">
          <Logo className={cx(LINK, "pt-2")} />
          <nav className="flex flex-grow flex-row items-center justify-end space-x-2 self-end">
            {navigation.map((v) => (
              <React.Fragment key={v.href}>
                <Link
                  href={v.href}
                  passHref
                  className={cx(LINK, v.className)}
                  title={v.title ?? undefined}
                  {...{
                    rel: v.rel ?? undefined,
                  }}
                >
                  {v.icon ? <v.icon /> : v.label}
                </Link>
              </React.Fragment>
            ))}
            <LightSwitch className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
          </nav>
        </header>
        <main className="w-full max-w-limit flex-grow p-4 pt-12">
          {children}
        </main>
        <footer className="mt-8 h-20 w-full bg-gray-700 bg-leather-stone-700 dark:bg-gray-800 dark:bg-leather-stone-700">
          <div className="flex max-w-limit flex-row items-center p-4 text-sm text-gray-100 dark:text-gray-200">
            <div className="w-1/4">&lt;/&gt;</div>
            <div className="flex-grow text-center">
              <button
                className="border-b border-dotted border-gray-500 hover:text-gray-300"
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
              <Link
                href="/colophon"
                className="border-b border-dotted border-gray-500 hover:text-gray-300"
              >
                &copy; 2022 Jakob Heuser
              </Link>
            </div>
          </div>
        </footer>
      </div>
      <IndieAuth />
      <Feeds />
    </>
  );
};
