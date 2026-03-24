"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function Dashboard() {
  const [temperature, setTemperature] = useState("--");
  const [humidity, setHumidity] = useState("--");
  const [status, setStatus] = useState({ text: "Conectando al Broker...", color: "bg-yellow-500", glow: "shadow-[0_0_15px_rgba(234,179,8,0.5)]" });
  const [tempUpdated, setTempUpdated] = useState(false);
  const [humUpdated, setHumUpdated] = useState(false);

  useEffect(() => {
    // HiveMQ WebSocket URL
    const brokerUrl = "wss://ce6bb88c4eeb4bdc8bc96560b645b95e.s1.eu.hivemq.cloud:8884/mqtt";
    
    // Opciones del cliente MQTT
    const client = mqtt.connect(brokerUrl, {
      clientId: "ReactClient_" + Math.random().toString(16).substring(2, 8),
      username: "agrofloppy",
      password: "Actuana110398.com",
      clean: true,
      reconnectPeriod: 2000,
      protocolVersion: 4,
    });

    client.on("connect", () => {
      setStatus({ text: "Conectado en tiempo real", color: "bg-green-500", glow: "shadow-[0_0_15px_rgba(34,197,94,0.7)]" });
      client.subscribe("sensor/temperatura");
      client.subscribe("sensor/humedad");
    });

    client.on("reconnect", () => {
      setStatus({ text: "Reconectando con HiveMQ...", color: "bg-yellow-500", glow: "shadow-[0_0_15px_rgba(234,179,8,0.7)]" });
    });

    client.on("offline", () => {
      setStatus({ text: "Desconectado del Broker", color: "bg-red-500", glow: "shadow-[0_0_15px_rgba(239,68,68,0.7)]" });
    });

    client.on("message", (topic, message) => {
      const payload = message.toString();
      if (topic === "sensor/temperatura") {
        setTemperature(payload);
        setTempUpdated(true);
        setTimeout(() => setTempUpdated(false), 300);
      } else if (topic === "sensor/humedad") {
        setHumidity(payload);
        setHumUpdated(true);
        setTimeout(() => setHumUpdated(false), 300);
      }
    });

    return () => {
      if (client) client.end(true);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0c1222] text-slate-100 flex flex-col items-center justify-center p-6 font-sans"
         style={{ backgroundImage: "radial-gradient(circle at top right, #1e293b 0%, transparent 40%), radial-gradient(circle at bottom left, #0f172a 0%, transparent 40%)" }}>
      
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-5 bg-gradient-to-br from-cyan-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
          TempeMaster React
        </h1>
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-sm">
          <div className={`w-3.5 h-3.5 rounded-full ${status.color} ${status.glow} transition-colors duration-300`}></div>
          <span className="text-sm font-medium text-slate-300">{status.text}</span>
        </div>
      </header>

      <main className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-center">
        
        {/* Card Temperatura */}
        <div className="relative group overflow-hidden rounded-3xl bg-slate-800/40 backdrop-blur-xl border border-white/10 p-10 w-full max-w-sm flex flex-col items-center shadow-2xl transition-all duration-400 hover:-translate-y-3 hover:border-white/20">
          <div className="absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="text-6xl mb-5 drop-shadow-md">🌡️</div>
          <h2 className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-5">Temperatura</h2>
          
          <div className={`flex items-baseline transition-transform duration-300 ${tempUpdated ? 'scale-110' : 'scale-100'}`}>
            <span className="text-7xl font-black text-rose-500 drop-shadow-sm">
              {temperature}
            </span>
            <span className="text-2xl font-bold text-slate-300 ml-2">°C</span>
          </div>
        </div>

        {/* Card Humedad */}
        <div className="relative group overflow-hidden rounded-3xl bg-slate-800/40 backdrop-blur-xl border border-white/10 p-10 w-full max-w-sm flex flex-col items-center shadow-2xl transition-all duration-400 hover:-translate-y-3 hover:border-white/20">
          <div className="absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="text-6xl mb-5 drop-shadow-md">💧</div>
          <h2 className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mb-5">Humedad</h2>
          
          <div className={`flex items-baseline transition-transform duration-300 ${humUpdated ? 'scale-110' : 'scale-100'}`}>
            <span className="text-7xl font-black text-sky-400 drop-shadow-sm">
              {humidity}
            </span>
            <span className="text-2xl font-bold text-slate-300 ml-2">%</span>
          </div>
        </div>

      </main>
    </div>
  );
}
