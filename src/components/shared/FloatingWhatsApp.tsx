import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Check availability status based on PET / Local time (09:00 - 22:00)
  useEffect(() => {
    const checkStatus = () => {
      const hour = new Date().getHours();
      setIsOnline(hour >= 9 && hour < 22);
    };
    checkStatus();
    // Re-check status every 60 seconds
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const formattedMessage = `Hola, VANTA. Me comunico desde su tienda web para realizar una consulta general sobre las prendas de temporada.`;
    const whatsappUrl = `https://wa.me/51904536406?text=${encodeURIComponent(formattedMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      id="whatsapp-floating-trigger"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center space-x-2.5 font-sans"
    >
      {/* Dynamic elegant black tooltip */}
      <div
        className={`bg-[#0e0e14] text-white text-[10px] font-mono uppercase tracking-widest px-3 py-2 border border-line shadow-2xl transition-all duration-300 flex flex-col gap-1 ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-accent animate-pulse' : 'bg-line'}`} />
          <span className="font-bold">{isOnline ? 'En Línea' : 'Fuera de Línea'}</span>
        </div>
        <div className="text-[8px] text-white/60 font-light">
          Atención: 09:00 AM - 10:00 PM
        </div>
      </div>

      {/* Floating button with radar pulse */}
      <div className="relative">
        <button
          id="whatsapp-floating-btn"
          onClick={handleClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative bg-[#0e0e14] text-white p-3.5 border border-zinc-700 hover:border-white hover:bg-[#161622] hover:shadow-2xl transition-all flex items-center justify-center group cursor-pointer"
          aria-label="Contactar por WhatsApp"
        >
          {/* Radar pulsing ring matching status */}
          <span className={`absolute inset-0 w-full h-full -z-10 animate-ping opacity-30 ${isOnline ? 'bg-emerald-500/40' : 'bg-zinc-700/30'}`} />
          <img src="/iconos/whatsapp.jfif" alt="WhatsApp" className="w-6 h-6 object-cover rounded-full transition-transform duration-300 group-hover:scale-110" />
        </button>

        {/* Small absolute availability indicator dot */}
        <span
          id="whatsapp-status-indicator"
          className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border border-black shadow-md flex items-center justify-center transition-colors duration-500 ${
            isOnline ? 'bg-accent' : 'bg-line'
          }`}
          title={isOnline ? 'En Línea (9am - 10pm)' : 'Fuera de Línea (9am - 10pm)'}
        >
          <span className={`w-1.5 h-1.5 rounded-full bg-white opacity-85 ${isOnline ? 'animate-pulse' : ''}`} />
        </span>
      </div>
    </div>
  );
}
