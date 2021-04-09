import {
  AlertTriangle,
  ExternalLink,
  Facebook,
  GitHub,
  Heart,
  HelpCircle,
  Moon,
  Share2,
  Sun,
  Twitter,
} from "react-feather";
import React from "react";

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

export default function Icon({ icon, ...rest }) {
  const Component = featherIcons[icon] || featherIcons.warning;
  return <Component size={null} {...rest} />;
}
