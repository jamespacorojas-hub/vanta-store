import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

const SILUETAS = [
  {
    category: 'Polera',
    section: '01',
    gsm: '400-420 GSM',
    desc: 'Poleras Zyko, hoodies y crewnecks de silueta boxy y hombros caídos. Tejidos pesados de alto gramaje con estructura rígida inigualable.',
    fabrics: ['Zyko', 'Waffer', 'Waffle', 'Jersey pesado'],
  },
  {
    category: 'Clásico',
    section: '02',
    gsm: '240-300 GSM',
    desc: 'Polos clásicos y cuellos redondos de silueta relajada y hombros caídos con caída limpia de inspiración contemporánea.',
    fabrics: ['Piqué', 'Jersey', 'Clásica'],
  },
  {
    category: 'Camisa',
    section: '03',
    gsm: '180-280 GSM',
    desc: 'Camisas urbanas minimalistas y cuellos cubanos. Desarrolladas con texturas rústicas y alveolares para un look sartorial.',
    fabrics: ['Waffle', 'Piqué', 'Zyko', 'Clásica'],
  },
  {
    category: 'Camisero',
    section: '04',
    gsm: '240-420 GSM',
    desc: 'Silueta de corte relajado ideal para layering urbano, con bolsillo plano y una caída fluida que brinda máxima presencia.',
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
  },
  {
    category: 'Manga Larga',
    section: '05',
    gsm: '240-420 GSM',
    desc: 'Polo pesado de manga larga y silueta holgada, con puños de rib acanalados y cuello cerrado de inspiración urbana.',
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
  },
  {
    category: 'Notch',
    section: '06',
    gsm: '240-420 GSM',
    desc: 'Diseño vanguardista con cuello Notch sin botones. Look refinado sin sacrificar la comodidad de la indumentaria streetwear.',
    fabrics: ['Waffle', 'Piqué', 'Jersey', 'Waffer'],
  },
];

interface SiluetasSectionProps {
  onSelectCategory: (category: string) => void;
}

export default function SiluetasSection({ onSelectCategory }: SiluetasSectionProps) {
  return (
    <section id="visual-collections" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper scroll-mt-48">
      <div className="text-center space-y-2 mb-12 sm:mb-16">
        <span className="text-xs font-sans tracking-widest text-muted font-bold uppercase flex items-center justify-center gap-2">
          <Layers className="w-3.5 h-3.5 text-accent" />
          PATRONAJE URBANO • COLECCIÓN 2026
        </span>
        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink tracking-tight uppercase">
          Siluetas Signature
        </h2>
        <p className="text-sm font-normal text-muted max-w-lg mx-auto">
          Cortes de confección pesada con siluetas boxy y proporciones balanceadas para un calce impecable.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {SILUETAS.map((tile) => (
          <div
            key={tile.category}
            id={`collection-${tile.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-banner`}
            onClick={() => onSelectCategory(tile.category)}
            className="group flex flex-col justify-between min-h-[260px] sm:min-h-[290px] p-6 sm:p-7 bg-paper-soft hover:bg-panel text-ink border border-line rounded-3xl cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex justify-between items-center z-10 text-xs">
              <span className="text-muted uppercase tracking-wider font-semibold">Corte 0{tile.section}</span>
              <span className="bg-accent/10 text-accent font-bold px-3 py-1 rounded-full border border-accent/20">
                {tile.gsm}
              </span>
            </div>

            <div className="z-10 space-y-2 my-4">
              <h3 className="font-heading font-bold text-2xl text-ink group-hover:text-accent transition-colors">
                {tile.category}
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                {tile.desc}
              </p>
              <div className="flex gap-1.5 flex-wrap pt-2">
                {tile.fabrics.map((f, i) => (
                  <span
                    key={f}
                    className={`text-[10px] px-2.5 py-1 rounded-full border border-line ${
                      i === 0
                        ? 'bg-panel text-ink font-semibold border-accent/30'
                        : 'bg-paper text-muted'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center z-10 pt-4 border-t border-line text-xs font-semibold">
              <span className="text-muted">Tallas S al XL</span>
              <span className="text-accent flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Ver prendas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
