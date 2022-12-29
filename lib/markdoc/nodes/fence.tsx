import Highlight, { defaultProps, type Language } from "prism-react-renderer";
import vsDark from "prism-react-renderer/themes/vsDark";
import { Schema, Tag } from "@markdoc/markdoc";
import React, { useEffect } from "react";
import copy from "copy-to-clipboard";
import { ClipboardCopyIcon } from "@heroicons/react/outline";
import { ClipboardCopyIcon as ClipboardCopyIconSolid } from "@heroicons/react/solid";

interface CodeProps {
  "data-language": string;
  content: string;
}

export const fence: Schema = {
  render: "Fence",
  attributes: {
    content: { type: String, render: "content", required: true },
    language: { type: String, render: "data-language" },
    process: { type: Boolean, render: false, default: true },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const children = node.children.length
      ? node.transformChildren(config)
      : [node.attributes.content];

    return new Tag("Fence", attributes, children);
  },
};

export const Fence: React.FC<
  React.BaseHTMLAttributes<HTMLDivElement> & CodeProps
> = ({ content, "data-language": language }) => {
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (copied) {
      copy(ref.current?.innerText ?? "");
      const to = setTimeout(setCopied, 1000, false);
      return () => clearTimeout(to);
    }
  }, [copied]);

  return (
    <div className="code relative" aria-live="polite">
      <Highlight
        {...defaultProps}
        theme={vsDark}
        code={content}
        language={language as Language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <button
        className="absolute right-2 top-2 rounded bg-primary-400/50 py-1 px-1 text-white"
        title="copy to clipboard"
        onClick={() => setCopied(true)}
      >
        {copied ? (
          <ClipboardCopyIconSolid className="h-5 w-5" />
        ) : (
          <ClipboardCopyIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};
