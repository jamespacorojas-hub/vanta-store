import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

export default function Benefits() {
  const benefitList = [
    {
      id: 'b1',
      icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />,
      title: 'ENVÍOS A TODO EL PERÚ',
      desc: 'Despachos express en Lima en 24 a 48h y envíos nacionales vía Olva y Shalom.',
    },
    {
      id: 'b2',
      icon: <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />,
      title: 'CAMBIOS SIN COSTO',
      desc: 'Cuentas con hasta 7 días para cambios de talla o modelo de forma ágil.',
    },
    {
      id: 'b3',
      icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />,
      title: 'CALIDAD PESADA',
      desc: 'Fibras seleccionadas con gramajes altos y estructura boxy fit duradera.',
    },
    {
      id: 'b4',
      icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />,
      title: 'YAPE, PLIN & TARJETAS',
      desc: 'Paga con total seguridad por Yape, transferencia bancaria o contra-entrega.',
    },
  ];

  return (
    <section id="purchase-benefits" className="border-y border-line bg-paper-soft text-ink py-8 sm:py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {benefitList.map((benefit) => (
            <div
              id={`benefit-${benefit.id}`}
              key={benefit.id}
              className="flex flex-col space-y-2 p-3 sm:p-5 bg-panel border border-line rounded-xs hover:border-ink/40 transition-all duration-300"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-paper flex items-center justify-center border border-line rounded-full shrink-0">
                {benefit.icon}
              </div>
              <h3 className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-ink font-mono flex items-center gap-1">
                <span className="text-accent">◈</span> {benefit.title}
              </h3>
              <p className="text-muted text-[10px] sm:text-xs font-light leading-relaxed font-sans">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
