import { useEffect, useRef, useState } from "react";

/**
 * Open / closed state of an SOS card (FlipTile), with keyboard focus handled:
 * after flipping, focus jumps to "Send" (so Enter → Enter sends); after Cancel it goes back to the card.
 */
export function useFlip(onSend: () => void) {
  const [flipped, setFlipped] = useState(false);
  const frontButton = useRef<HTMLButtonElement>(null);
  const sendButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (flipped) sendButton.current?.focus();
  }, [flipped]);

  const send = () => {
    onSend();
    setFlipped(false);
  };
  const cancel = () => {
    setFlipped(false);
    requestAnimationFrame(() => frontButton.current?.focus()); // after the front can be focused again
  };

  return { flipped, flip: () => setFlipped(true), send, cancel, frontButton, sendButton };
}
