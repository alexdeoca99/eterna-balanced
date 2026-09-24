"use client";
import { useState } from "react";
import s from "./Faq.module.css";

const faqs = [
  ["What kinds of symptoms do you help with?", "We work with women experiencing fatigue, mood changes, irritability, weight fluctuations, hormone-related concerns, gut-related symptoms, or the feeling that something simply is not right."],
  ["Is care personalized?", "Yes. Care emphasizes physician-guided protocols designed around your body, your symptoms and your goals rather than a one-size-fits-all plan."],
  ["Do you offer virtual appointments?", "Yes. Eterna Balanced is built around telemedicine, so you can meet by phone or video from the comfort of home."],
  ["Will everyone need advanced testing?", "Not necessarily. When appropriate, tools such as DUTCH and GI-MAP testing may be used to better understand hormone and gut health patterns and guide a more personalized plan."],
  ["Do I need to prepare anything before booking?", "No. The first step is simply choosing a time that works for you. Any additional details or instructions are shared after your appointment is confirmed."],
  ["What happens after I book?", "You'll receive a confirmation with everything you need for your visit, including instructions for joining remotely."],
  ["Will I be able to ask questions during the visit?", "Absolutely. Good care begins with listening, understanding your goals, and creating space for questions and shared decision-making."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className={s.faq}>
      <div className={`${s.grid} wrap`}>
        <div className={s.head}>
          <p className="eyebrow">Questions</p>
          <h2>
            Good to <em>know.</em>
          </h2>
          <p>Still wondering about something? Bring it to your free 15-minute consult.</p>
        </div>
        <div className={s.list}>
          {faqs.map(([q, a], i) => (
            <div key={q} className={s.item} data-open={open === i}>
              <h3>
                <button aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                  {q}
                  <span className={s.icon} aria-hidden />
                </button>
              </h3>
              <div id={`faq-${i}`} className={s.answer} role="region">
                <p>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
