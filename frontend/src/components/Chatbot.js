"use client";
import { useState, useRef, useEffect } from "react";
import { BsChatDots } from "react-icons/bs";
import { FiSend, FiX } from "react-icons/fi";

export default function Chatbot({ user }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const Base_API = "process.env.REACT_APP_API_URL"

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        const updated = [...messages, userMsg];

        setMessages(updated);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${Base_API}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updated,
                    userContext: {
                        name: user?.first_name,
                        email: user?.email
                    },
                }),
            });

            const data = await res.json();

            setMessages([
                ...updated,
                { role: "assistant", content: data.reply },
            ]);
        } catch {
            setMessages([
                ...updated,
                {
                    role: "assistant",
                    content: "Something went wrong. Try again!",
                },
            ]);
        }

        setLoading(false);
    };

    return (
        <>
            <button onClick={() => setOpen(!open)} style={styles.fab}>
                {open ? <FiX /> : <BsChatDots />}
            </button>

            {open && (
                <div style={styles.window}>
                    <div style={styles.header}>
                        <span style={styles.headerTitle}>
                            <BsChatDots /> Chatboat AI
                        </span>
                        <small style={styles.subText}>
                            Travel Assistant
                        </small>
                    </div>

                    <div style={styles.messages}>
                        {messages.length === 0 && (
                            <div style={styles.botMsg}>
                                Hi! I'm your travel assistant 🌍 Ask me anything about trips, destinations, or packages!
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div
                                key={i}
                                style={
                                    m.role === "user"
                                        ? styles.userMsg
                                        : styles.botMsg
                                }
                            >
                                {m.content}
                            </div>
                        ))}

                        {loading && (
                            <div style={styles.botMsg}>Typing...</div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    <div style={styles.inputRow}>
                        <input
                            style={styles.input}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                            placeholder="Ask about any destination..."
                        />
                        <button
                            style={styles.sendBtn}
                            onClick={sendMessage}
                            disabled={loading}
                        >
                            <FiSend />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

const styles = {
    fab: {
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "#0c444c",
        color: "#fff",
        fontSize: 20,
        border: "none",
        cursor: "pointer",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    window: {
        position: "fixed",
        bottom: 88,
        right: 24,
        width: 340,
        height: 460,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
        overflow: "hidden",
    },

    header: {
        background: "#0c444c",
        color: "#fff",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
    },

    headerTitle: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontWeight: "600",
    },

    subText: {
        opacity: 0.7,
        fontSize: 12,
    },

    messages: {
        flex: 1,
        overflowY: "auto",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },

    botMsg: {
        background: "#f0f4f4",
        borderRadius: "12px 12px 12px 2px",
        padding: "8px 12px",
        fontSize: 13.5,
        maxWidth: "80%",
        alignSelf: "flex-start",
    },

    userMsg: {
        background: "#0c444c",
        color: "#fff",
        borderRadius: "12px 12px 2px 12px",
        padding: "8px 12px",
        fontSize: 13.5,
        maxWidth: "80%",
        alignSelf: "flex-end",
    },

    inputRow: {
        display: "flex",
        padding: "10px 12px",
        borderTop: "1px solid #eee",
        gap: 8,
    },

    input: {
        flex: 1,
        padding: "8px 12px",
        borderRadius: 20,
        border: "1px solid #ddd",
        fontSize: 13,
        outline: "none",
    },

    sendBtn: {
        background: "#0c444c",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: 34,
        height: 34,
        cursor: "pointer",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
};