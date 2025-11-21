import { useState } from "react";
import ProviderPanel from "./components/ProviderPanel.jsx";
import Terminal from "./components/Terminal.jsx";

function App() {
  const [cfg, setCfg] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="relative max-w-6xl mx-auto p-6 md:p-10">
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">AI Terminal Builder</h1>
              <p className="text-blue-200/80 text-sm">Bring your own keys. Talk to any model. Build without limits.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <ProviderPanel onChange={setCfg} />
            <div className="mt-3 text-xs text-slate-400">
              Your keys are sent only with your requests from this preview to the provider you choose.
            </div>
          </div>

          <div className="lg:col-span-3">
            <Terminal config={cfg || { provider: "openai-compatible", model: "gpt-4o-mini" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
