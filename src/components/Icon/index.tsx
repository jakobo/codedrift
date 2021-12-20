import {
  AlertTriangle,
  ExternalLink,
  Facebook,
  GitHub,
  Heart,
  HelpCircle,
  Icon as RFIcon,
  Moon,
  Share2,
  Sun,
  Twitter,
} from "react-feather";
import React, { HTMLAttributes } from "react";

const featherIcons = {
  sun: Sun,
  moon: Moon,
  heart: Heart,
  "external-link": ExternalLink,
  twitter: Twitter,
  github: GitHub,
  warning: AlertTriangle,
  question: HelpCircle,
  "wm-source-twitter": Twitter,
  "wm-source-facebook": Facebook,
  "wm-source-other": Share2,
};

interface IconProps extends Omit<RFIcon, "children"> {
  icon: string;
  className: string;
  style?: HTMLAttributes<HTMLDivElement>["style"];
}

const Icon: React.FC<IconProps> = ({ icon, className, style, ...rest }) => {
  const Component: RFIcon = featherIcons[icon] || featherIcons.warning;
  return (
    <div className={className} style={style}>
      <Component size={null} {...rest} />
    </div>
  );
};
export default Icon;

export const InlineIcon: React.FC<IconProps> = ({
  icon,
  className,
  style,
  ...rest
}) => {
  const Component: RFIcon = featherIcons[icon] || featherIcons.warning;
  return (
    <span className={className} style={style}>
      <Component size={null} {...rest} />
    </span>
  );
};
