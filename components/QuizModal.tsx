"use client";
import { useEffect, useRef, useState } from "react";
import s from "./QuizModal.module.css";

// Typeform behind the site's existing live embed (data-tf-live 01KYT3AFZAGBV1PNASW8NXW4B9).
const QUIZ = "https://form.typeform.com/to/gKsyCc7u";
export const openQuiz = () => window.dispatchEvent(new Event("open-quiz"));

export default function QuizModal() {
  const dlg = useRef<HTMLDialogElement>(null);
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    const open = () => {
      setSrc(QUIZ); // only load Typeform once someone asks for it
      dlg.current!.showModal();
    };
    window.addEventListener("open-quiz", open);
    return () => window.removeEventListener("open-quiz", open);
  }, []);

  return (
    <dialog
      ref={dlg}
      className={s.dialog}
      aria-label="Hormone Health Score quiz"
      onClick={(e) => e.target === dlg.current && dlg.current!.close()}
      data-lenis-prevent
    >
      <div className={s.head}>
        <span>Hormone Health Score</span>
        <button className={s.close} onClick={() => dlg.current!.close()} aria-label="Close quiz">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
      <div className={s.body}>
        <p className={s.fallback}>
          Loading quiz… If it doesn&apos;t appear,{" "}
          <a href={QUIZ} target="_blank" rel="noopener">
            open it in a new tab
          </a>
          .
        </p>
        {src && <iframe src={src} title="Hormone Health Score quiz" className={s.tf} allow="camera; microphone; autoplay; encrypted-media;" />}
      </div>
    </dialog>
  );
}
