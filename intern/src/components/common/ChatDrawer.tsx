"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { AdvisorAction } from "../../types";
import { Icon } from "../icons/Icons";

function formatAssistantHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br />");
}

const QUICK_PROMPTS = [
  "Which placement fits me best?",
  "What documents do I still need?",
  "Which government placements are open?",
  "How does verification work?",
];

export function ChatDrawer() {
  const {
    isChatOpen,
    openChat,
    closeChat,
    chatMessages,
    sendChat,
    askChat,
    openPlacement,
    go,
    dashGo,
    role,
  } = useApp();

  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  useEffect(() => {
    if (!isChatOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 180);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isChatOpen, closeChat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    sendChat(trimmed);
    setInput("");
  };

  const handleAction = (action: AdvisorAction) => {
    const payload = action.payload || {};
    if (typeof payload.placement_id === "string") {
      closeChat();
      openPlacement(payload.placement_id);
      return;
    }
    if (typeof payload.view === "string") {
      closeChat();
      dashGo(payload.view as Parameters<typeof dashGo>[0]);
      return;
    }
    if (typeof payload.route === "string") {
      closeChat();
      go(payload.route);
    }
  };

  return (
    <>
      <button
        type="button"
        className="chat-fab"
        onClick={openChat}
        aria-label="Open BrighterWorks Assistant"
      >
        <span className="dot" />
        Ask BrighterWorks
      </button>

      <div
        className={`drawer-veil${isChatOpen ? " on" : ""}`}
        onClick={closeChat}
        aria-hidden={!isChatOpen}
      />

      <aside
        className={`chat${isChatOpen ? " on" : ""}`}
        aria-label="BrighterWorks Virtual Assistant"
        aria-hidden={!isChatOpen}
      >
        <div className="chat-h">
          <div>
            <b>BrighterWorks Assistant</b>
            <div className="st">
              <i /> knows placements, requirements and your {role} record
            </div>
          </div>
          <button type="button" onClick={closeChat} aria-label="Close assistant">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="chat-b" ref={logRef}>
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`msg ${msg.who === "me" ? "me" : "bot"}`}
            >
              {msg.who !== "me" && <div className="who">BrighterWorks</div>}
              {msg.isTyping ? (
                <span>Thinking…</span>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatAssistantHtml(msg.text),
                  }}
                />
              )}
              {msg.actions && msg.actions.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "8px",
                  }}
                >
                  {msg.actions.map((action, idx) =>
                    action.type === "external_url" && typeof action.payload?.url === "string" ? (
                      <a
                        key={`${msg.id}-act-${idx}`}
                        href={action.payload.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm"
                      >
                        {action.label}
                      </a>
                    ) : (
                      <button
                        key={`${msg.id}-act-${idx}`}
                        type="button"
                        className="btn btn-sm"
                        onClick={() => handleAction(action)}
                      >
                        {action.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-q">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => askChat(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form className="chat-in" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a placement, requirement or your file"
            aria-label="Message BrighterWorks Assistant"
          />
          <button type="submit" aria-label="Send message">
            <Icon name="arrow" size={15} />
          </button>
        </form>
      </aside>
    </>
  );
}
