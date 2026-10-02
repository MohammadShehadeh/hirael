type RevealHandler = (inView: boolean) => void;

interface RevealObserver {
  observer: IntersectionObserver;
  handlers: Map<Element, RevealHandler>;
}

// One observer per threshold, shared by every reveal on the page.
const observers = new Map<number, RevealObserver>();

/** Calls `handler(true)` once `amount` of the node is visible and `handler(false)` when it leaves. Returns a stop function. */
export const observeReveal = (node: Element, amount: number, handler: RevealHandler) => {
  let entry = observers.get(amount);
  if (!entry) {
    const handlers = new Map<Element, RevealHandler>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          // An element taller than viewport / amount can never reach the ratio, so it reveals on entry.
          const viewport = record.rootBounds?.height ?? window.innerHeight;
          const canReachAmount = record.boundingClientRect.height * amount <= viewport;
          if (record.isIntersecting && (record.intersectionRatio >= amount || !canReachAmount)) {
            handlers.get(record.target)?.(true);
          } else if (!record.isIntersecting) handlers.get(record.target)?.(false);
        }
      },
      { threshold: [0, amount] },
    );
    entry = { observer, handlers };
    observers.set(amount, entry);
  }
  const { observer, handlers } = entry;
  handlers.set(node, handler);
  observer.observe(node);

  return () => {
    if (!handlers.delete(node)) return;
    observer.unobserve(node);
    if (handlers.size === 0) {
      observer.disconnect();
      observers.delete(amount);
    }
  };
};
