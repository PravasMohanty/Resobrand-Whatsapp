import { useState } from 'react';

import { NavLink } from 'react-router-dom';

const WHATSAPP_LINK = import.meta.env.VITE_WHATSAPP_LINK;

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className={`floating-chat${open ? ' open' : ''}`}>
      <div className="floating-chat-panel">
        <span className="floating-chat-tag">Live support</span>
        <h3>Start a WhatsApp conversation</h3>
        <p>
          Open a direct chat with our team for pricing, setup help, or chatbot planning.
        </p>
        <div className="floating-chat-actions">
          <a
            className="button floating-chat-primary"
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
          >
            Open WhatsApp
          </a>
          <NavLink
            className="button button-outline floating-chat-secondary"
            to="/contact"
            onClick={() => setOpen(false)}
          >
            Talk to Team
          </NavLink>
        </div>
      </div>

      <button
        className="floating-chat-trigger"
        type="button"
        aria-expanded={open}
        aria-label="Open chat launcher"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="floating-chat-ring" aria-hidden="true" />
        <span className="floating-chat-cube" aria-hidden="true">
          <span className="floating-chat-face">
            <span className="floating-chat-dot" />
            <span className="floating-chat-dot" />
            <span className="floating-chat-dot" />
          </span>
        </span>
      </button>
    </div>
  )
}
