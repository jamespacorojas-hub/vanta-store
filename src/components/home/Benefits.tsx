import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

export default function Benefits() {
  const benefitList = [
    {
      id: 'b1',
      icon: <Truck className="w-5 h-5 text-accent" />,
      title: 'ENVÍOS A TODO EL PERÚ',
      desc: 'Despachos express en Lima en 24 a 48h y envíos nacionales seguros vía Olva y Shalom.',
    },
    {
      id: 'b2',
      icon: <RotateCcw className="w-5 h-5 text-accent" />,
      title: 'CAMBIOS SIN COMPLICACIONES',
      desc: 'Hasta 7 días para cambios de talla o modelo de forma rápida y asesorada.',
    },
    {
      id: 'b3',
      icon: <ShieldCheck className="w-5 h-5 text-accent" />,
      title: 'CALIDAD PESADA GARANTIZADA',
      desc: 'Fibras seleccionadas con gramajes altos y estructura boxy fit que no se deforma.',
    },
    {
      id: 'b4',
      icon: <CreditCard className="w-5 h-5 text-accent" />,
      title: 'PAGOS 100% SEGUROS',
      desc: 'Paga con Yape, Plin, tarjetas de crédito/débito o transferencia bancaria.',
    },
  ];

  return (
    <section id="purchase-benefits" className="border-y border-line bg-panel/40 text-ink py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefitList.map((benefit) => (
            <div
              id={`benefit-${benefit.id}`}
              key={benefit.id}
              className="flex flex-col space-y-3 p-6 bg-paper-soft border border-line rounded-3xl hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="w-12 h-12 bg-panel flex items-center justify-center border border-line rounded-2xl shrink-0 shadow-xs">
                {benefit.icon}
              </div>
              <h3 className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-ink font-heading">
                {benefit.title}
              </h3>
              <p className="text-muted text-xs sm:text-sm font-normal leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
