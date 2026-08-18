"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const AUTO_HIDE_DELAY = 900;
const MIN_THUMB_HEIGHT = 32;

export default function OverlayScrollbar() {
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [visible, setVisible] = useState(false);

  const draggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revealAndScheduleHide = useCallback(() => {
    setVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      if (!draggingRef.current) setVisible(false);
    }, AUTO_HIDE_DELAY);
  }, []);

  const updateMetrics = useCallback(() => {
    const doc = document.documentElement;
    const viewportHeight = window.innerHeight;
    const docHeight = doc.scrollHeight;
    const scrollable = docHeight > viewportHeight + 1;

    setCanScroll(scrollable);
    if (!scrollable) return;

    const trackHeight = viewportHeight;
    const rawThumbHeight = (viewportHeight / docHeight) * trackHeight;
    const height = Math.max(MIN_THUMB_HEIGHT, rawThumbHeight);

    const maxScroll = docHeight - viewportHeight;
    const scrollRatio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const top = scrollRatio * (trackHeight - height);

    setThumbHeight(height);
    setThumbTop(top);
  }, []);

  // Measure the browser's native scrollbar width once, so internal scroll
  // containers (.overlay-scroll) can offset it via a CSS var and render
  // their own scrollbars as an overlay instead of reserving layout space.
  useEffect(() => {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    outer.style.position = "absolute";
    outer.style.top = "-9999px";
    outer.style.width = "100px";
    outer.style.height = "100px";
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    inner.style.width = "100%";
    inner.style.height = "100%";
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    document.documentElement.style.setProperty("--sbw", `${scrollbarWidth}px`);
    document.body.removeChild(outer);
  }, []);

  useEffect(() => {
    updateMetrics();

    const handleScroll = () => {
      updateMetrics();
      revealAndScheduleHide();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateMetrics);

    const resizeObserver = new ResizeObserver(() => updateMetrics());
    resizeObserver.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateMetrics);
      resizeObserver.disconnect();
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [updateMetrics, revealAndScheduleHide]);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartScrollRef.current = window.scrollY;
    setVisible(true);

    const doc = document.documentElement;
    const viewportHeight = window.innerHeight;
    const docHeight = doc.scrollHeight;
    const maxScroll = docHeight - viewportHeight;
    const trackHeight = viewportHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - dragStartYRef.current;
      const scrollableTrack = trackHeight - thumbHeight;
      const scrollDelta = scrollableTrack > 0 ? (deltaY / scrollableTrack) * maxScroll : 0;
      window.scrollTo({ top: dragStartScrollRef.current + scrollDelta });
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      revealAndScheduleHide();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!canScroll) return null;

  return (
    <div
      className="fixed top-0 right-0 h-screen w-2.5 z-[9998] pointer-events-none"
      aria-hidden="true"
    >
      <div
        onMouseDown={handleThumbMouseDown}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => !draggingRef.current && revealAndScheduleHide()}
        className={`absolute right-0.5 w-1.5 rounded-[2px] cursor-pointer pointer-events-auto transition-opacity duration-200 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        } bg-slate-400/70 hover:bg-slate-500/80 dark:bg-slate-500/60 dark:hover:bg-slate-400/70`}
        style={{ top: thumbTop, height: thumbHeight }}
      />
    </div>
  );
}
