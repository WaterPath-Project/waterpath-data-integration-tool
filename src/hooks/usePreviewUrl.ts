import React from "react";
import { PreviewResult } from "@/lib/geodataPreview";

/**
 * Turns a preview result into a URL the reference map layers can `fetch`.
 * Bytes and JSON payloads become object URLs, revoked when they change or unmount.
 */
export function usePreviewUrl(result: PreviewResult | undefined): string | null {
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!result) {
      setUrl(null);
      return;
    }
    if ("url" in result) {
      setUrl(result.url);
      return;
    }
    const blob =
      "bytes" in result
        ? new Blob([result.bytes], { type: "image/tiff" })
        : new Blob([JSON.stringify(result.json)], { type: "application/json" });
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [result]);

  return url;
}
