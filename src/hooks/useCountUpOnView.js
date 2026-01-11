import { useEffect, useRef, useState } from "react";

export function useCountUpOnView(target, { duration = 900, decimals = 0 } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = null;

    const animate = () => {
      const start = performance.now();
      const endValue = Number(target);

      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const next = endValue * t;
        setValue(decimals ? Number(next.toFixed(decimals)) : Math.floor(next));
        if (t < 1) rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          animate();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, duration, decimals]);

  return { ref, value };
}
