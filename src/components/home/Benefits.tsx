import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

export default function Benefits() {
  const benefitList = [
    {
      id: 'b1',
      icon: <Truck className="w-5 h-5 text-accent" />,
      title: 'ENVÍOS A TODO EL PERÚ',
      desc: 'Despachos express en Lima Metropolitana en un plazo de 24 a 48 horas. Envíos nacionales certificados vía Olva Courier y Shalom.',
    },
    {
      id: 'b2',
      icon: <RotateCcw className="w-5 h-5 text-accent" />,
      title: 'CAMBIOS SIN COMPLICACIONES',
      desc: 'Tu satisfacción es nuestra prioridad. Cuentas con hasta 7 días para realizar cambios de talla o modelo de forma rápida.',
    },
    {
      id: 'b3',
      icon: <ShieldCheck className="w-5 h-5 text-accent" />,
      title: 'CALIDAD STREETWEAR PESADO',
      desc: 'Tejidos estructurados premium con gramajes desde 240 GSM (polos) hasta 420 GSM (hoodies) diseñados para alta durabilidad.',
    },
    {
      id: 'b4',
      icon: <CreditCard className="w-5 h-5 text-accent" />,
      title: 'PAGO CONTRA ENTREGA & YAPE',
      desc: 'Compra con total seguridad. Cancela al momento de recibir en Lima Metropolitana, o paga mediante Yape, Plin y transferencia.',
    },
  ];

  return (
    <section id="purchase-benefits" className="border-y border-line bg-paper py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefitList.map((benefit) => (
            <div
              id={`benefit-${benefit.id}`}
              key={benefit.id}
              className="flex flex-col space-y-3 p-4 bg-paper-soft border border-line shadow-2xs hover:border-accent hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 ease-out"
            >
              <div className="w-10 h-10 bg-accent-soft flex items-center justify-center border border-line">
                {benefit.icon}
              </div>
              <h3 className="text-xs uppercase tracking-wider font-black text-ink">
                {benefit.title}
              </h3>
              <p className="text-muted text-xs font-light leading-relaxed font-sans">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
