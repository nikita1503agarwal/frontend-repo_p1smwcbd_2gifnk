import { useEffect, useRef, useState } from "react";

export default function Terminal({ config }) {
  const [prompt, setPrompt] = useState("");
  const [lines, setLines] = useState([
    { type: "sys", text: "AI Terminal ready. Enter a command or prompt." },
  ]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  const backendBase = import.meta.env.VITE_BACKEND_URL || "";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const run = async () => {
    if (!prompt.trim()) return;
    const input = prompt;
    setPrompt("");
    setLines((l) => [...l, { type: "in", text: input }]);

    setBusy(true);
    try {
      const res = await fetch(`${backendBase}/ai/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: config.provider,
          model: config.model,
          prompt: input,
          system: config.system || undefined,
          api_key: config.api_key || undefined,
          base_url: config.base_url || undefined,
          extra_headers: config.extra_headers || undefined,
          temperature: Number(config.temperature || 0.2),
          max_tokens: Number(config.max_tokens || 512),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Request failed");
      setLines((l) => [...l, { type: "out", text: data.output }]);
    } catch (e) {
      setLines((l) => [
        ...l,
        { type: "err", text: `Error: ${e.message || String(e)}` },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      run();
    }
  };

  return (
    <div className="bg-black/80 rounded-xl border border-slate-700 overflow-hidden">
      <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-slate-300">AI Terminal</span>
      </div>

      <div className="p-4 h-[380px] overflow-y-auto font-mono text-sm text-slate-100 space-y-2">
        {lines.map((l, i) => (
          <div key={i} className={l.type === "in" ? "text-blue-300" : l.type === "err" ? "text-red-300" : "text-slate-100"}>
            {l.type === "in" ? "> " : l.type === "out" ? "< " : "* "}
            {l.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-900">
        <textarea
          rows={2}
          placeholder="Ask or type a command, then press Enter"
          className="w-full bg-black/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKey}
          disabled={busy}
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={run}
            disabled={busy}
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {busy ? "Running…" : "Run"}
          </button>
        </div>
      </div>
    </div>
  );
}
