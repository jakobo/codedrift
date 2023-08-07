// strips emojis from strings
export const demoji = (string_: string): string => {
  return (string_ || "")
    .replaceAll(
      /(?![*#0-9]+)[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]/gu,
      ""
    )
    .trim();
};
