import { useEffect, useState } from "react";

export default function ProviderPanel({ onChange }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    provider: "openai-compatible",
    model: "gpt-4o-mini",
    api_key: "",
    base_url: "",
    extra_headers: "",
    temperature: 0.2,
    max_tokens: 512,
    system: "You are a helpful AI coding assistant.",
  });

  const backendBase = import.meta.env.VITE_BACKEND_URL || "";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${backendBase}/ai/providers`);
        const data = await res.json();
        setProviders(data.providers || []);
      } catch (e) {
        console.error("Failed to load providers", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [backendBase]);

  useEffect(() => {
    onChange?.(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(form)]);

  const current = providers.find((p) => p.key === form.provider);

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">Model Provider</h3>
          <p className="text-xs text-slate-300/70">Bring any API key or custom compatible endpoint</p>
        </div>
        {loading ? (
          <span className="text-xs text-slate-400">Loading…</span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-sm text-slate-200/90">
          Provider
          <select
            className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            value={form.provider}
            onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
          >
            {providers.map((p) => (
              <option key={p.key} value={p.key}>{p.name}</option>
            ))}
            {providers.length === 0 && (
              <option value="openai-compatible">OpenAI-Compatible</option>
            )}
          </select>
        </label>

        <label className="text-sm text-slate-200/90">
          Model
          <input
            className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            placeholder={current?.models?.[0] || "model name"}
            value={form.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
          />
        </label>

        <label className="text-sm text-slate-200/90">
          API Key / Token
          <input
            type="password"
            className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            placeholder="sk-… or token"
            value={form.api_key}
            onChange={(e) => setForm((f) => ({ ...f, api_key: e.target.value }))}
          />
        </label>

        {form.provider === "openai-compatible" && (
          <label className="text-sm text-slate-200/90">
            Base URL
            <input
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
              placeholder="https://your-endpoint/v1"
              value={form.base_url}
              onChange={(e) => setForm((f) => ({ ...f, base_url: e.target.value }))}
            />
          </label>
        )}

        <label className="text-sm text-slate-200/90">
          Temperature
          <input
            type="number"
            step="0.1"
            min="0"
            max="2"
            className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            value={form.temperature}
            onChange={(e) => setForm((f) => ({ ...f, temperature: Number(e.target.value) }))}
          />
        </label>

        <label className="text-sm text-slate-200/90">
          Max Tokens
          <input
            type="number"
            min="1"
            className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
            value={form.max_tokens}
            onChange={(e) => setForm((f) => ({ ...f, max_tokens: Number(e.target.value) }))}
          />
        </label>
      </div>

      <label className="block text-sm text-slate-200/90 mt-3">
        System Prompt (optional)
        <textarea
          rows={2}
          className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100"
          value={form.system}
          onChange={(e) => setForm((f) => ({ ...f, system: e.target.value }))}
        />
      </label>
    </div>
  );
}
