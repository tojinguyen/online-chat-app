export interface ParsedMediaContent {
  type: "image" | "video" | "file" | "text";
  url?: string;
  filename?: string;
  text?: string;
}

export const parseMessageContent = (content: string): ParsedMediaContent[] => {
  const parts: ParsedMediaContent[] = [];

  // Regex patterns for different media types
  const imagePattern = /\[IMG:(https?:\/\/[^\]]+)\]/g;
  const videoPattern = /\[VIDEO:(https?:\/\/[^\]]+)\]/g;
  const filePattern = /\[FILE:(https?:\/\/[^\]]+)\]([^\[]*)/g;

  let lastIndex = 0;
  let match;

  // Find all matches and their positions
  const matches: Array<{
    type: "image" | "video" | "file";
    start: number;
    end: number;
    url: string;
    filename?: string;
  }> = [];

  // Find image matches
  while ((match = imagePattern.exec(content)) !== null) {
    matches.push({
      type: "image",
      start: match.index,
      end: match.index + match[0].length,
      url: match[1],
    });
  }

  // Find video matches
  while ((match = videoPattern.exec(content)) !== null) {
    matches.push({
      type: "video",
      start: match.index,
      end: match.index + match[0].length,
      url: match[1],
    });
  }

  // Find file matches
  while ((match = filePattern.exec(content)) !== null) {
    matches.push({
      type: "file",
      start: match.index,
      end: match.index + match[0].length,
      url: match[1],
      filename: match[2].trim(),
    });
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Process content with matches
  for (const mediaMatch of matches) {
    // Add text before the match
    if (lastIndex < mediaMatch.start) {
      const textContent = content.slice(lastIndex, mediaMatch.start).trim();
      if (textContent) {
        parts.push({
          type: "text",
          text: textContent,
        });
      }
    }

    // Add the media content
    parts.push({
      type: mediaMatch.type,
      url: mediaMatch.url,
      filename: mediaMatch.filename,
    });

    lastIndex = mediaMatch.end;
  }

  // Add remaining text after all matches
  if (lastIndex < content.length) {
    const textContent = content.slice(lastIndex).trim();
    if (textContent) {
      parts.push({
        type: "text",
        text: textContent,
      });
    }
  }

  // If no matches found, treat as plain text
  if (parts.length === 0) {
    parts.push({
      type: "text",
      text: content,
    });
  }

  return parts;
};
