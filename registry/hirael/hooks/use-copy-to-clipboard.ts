import * as React from 'react';

export interface UseCopyToClipboardOptions {
  /** How long `copied` stays true after a copy, in milliseconds. */
  timeout?: number;
  /** Called after the text reached the clipboard. */
  onCopy?: (text: string) => void;
  /** Called when the browser refused, for example on an insecure origin. */
  onError?: (error: unknown) => void;
}

/** Copies text and reports `copied` for a moment, for a check-mark swap on a copy button. */
export const useCopyToClipboard = ({ timeout = 2000, onCopy, onError }: UseCopyToClipboardOptions = {}) => {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        onError?.(error);

        return false;
      }
      setCopied(true);
      onCopy?.(text);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), timeout);

      return true;
    },
    [timeout, onCopy, onError],
  );

  const reset = React.useCallback(() => {
    window.clearTimeout(timerRef.current);
    setCopied(false);
  }, []);

  return { copied, copy, reset };
};
