import React from 'react';
import { ArrowRight } from 'lucide-react';

const SILUETAS = [
  {
    category: 'Polera',
    section: '01',
    gsm: '400-420 GSM',
    desc: 'Poleras, hoodies y crewnecks de silueta boxy y hombros caídos. Construidas en tejidos pesados de alto gramaje que garantizan una estructura rígida inigualable.',
    fabrics: ['Waffer', 'Waffle', 'Jersey pesado'],
  },
  {
    category: 'Clásico',
    section: '02',
    gsm: '240-300 GSM',
    desc: 'Polos clásicos y cuellos redondos gruesos de silueta boxy y hombros caídos de inspiración vintage.',
    fabrics: ['Piqué', 'Jersey', 'Clásica'],
  },
  {
    category: 'Camisa',
    section: '03',
    gsm: '180-280 GSM',
    desc: 'Camisas de vestir minimalistas, camisas de manga corta y cuellos cubanos. Desarrollados con texturas rústicas y alveolares que elevan tu presencia con un look sartorial.',
    fabrics: ['Waffle', 'Piqué', 'Neru', 'Clásica'],
  },
  {
    category: 'Camisero',
    section: '04',
    gsm: '240-420 GSM',
    desc: 'Silueta de corte relajado ideal para layering urbano, con bolsillo frontal plano y una caída fluida que brinda máxima movilidad.',
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
  },
  {
    category: 'Manga Larga',
    section: '05',
    gsm: '240-420 GSM',
    desc: 'Polo pesado de manga larga y silueta holgada, con puños de rib acanalados y cuello cerrado de inspiración retro de los 90s.',
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
  },
  {
    category: 'Notch',
    section: '06',
    gsm: '240-420 GSM',
    desc: 'Diseño minimalista con cuello Notch (abertura sutil sin botones). Look refinado sin sacrificar la comodidad de la indumentaria streetwear.',
    fabrics: ['Waffle', 'Piqué', 'Jersey', 'Waffer'],
  },
  {
    category: 'Polera c/ Cierre',
    section: '07',
    gsm: '280-420 GSM',
    desc: 'Sudadera con capucha y cierre completo de deslizamiento suave, silueta oversized ajustable con puños y basta acanalados.',
    fabrics: ['Neru', 'Waffle', 'Piqué'],
  },
];

interface SiluetasSectionProps {
  onSelectCategory: (category: string) => void;
}

export default function SiluetasSection({ onSelectCategory }: SiluetasSectionProps) {
  return (
    <section id="visual-collections" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper scroll-mt-48">
      <div className="text-center space-y-1.5 mb-12 sm:mb-16">
        <span className="text-[10px] tracking-[0.25em] text-muted font-bold block uppercase">
          Estructura de nuestras siluetas
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink">
          Cuadros por categoría
        </h2>
        <p className="text-[11px] font-sans font-light text-muted max-w-md mx-auto">
          Selecciona una categoría para explorar sus dimensiones, tejidos correspondientes y siluetas de confección.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {SILUETAS.map((tile) => (
          <div
            key={tile.category}
            id={`collection-${tile.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-banner`}
            onClick={() => onSelectCategory(tile.category)}
            className="group flex flex-col justify-between h-[360px] p-6 bg-paper-soft text-ink border border-line cursor-pointer relative overflow-hidden transition-all duration-500 hover:border-accent"
          >
            <div className="flex justify-between items-start z-10 text-[9px] text-muted uppercase tracking-wide">
              <span>Sección {tile.section}</span>
              <span>{tile.gsm}</span>
            </div>

            <div className="z-10 space-y-2 my-auto">
              <h3 className="font-display text-2xl font-medium text-ink">{tile.category}</h3>
              <p className="text-[11px] font-sans font-light text-muted leading-relaxed">
                {tile.desc}
              </p>
              <div className="flex gap-1.5 flex-wrap pt-2">
                {tile.fabrics.map((f, i) => (
                  <span
                    key={f}
                    className={`text-[8px] font-mono border border-line bg-paper px-1.5 py-0.5 ${i === 0 ? 'text-accent' : 'text-muted'}`}
                  >
                    {f.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-end z-10 pt-4 border-t border-line">
              <span className="font-mono text-[8px] text-muted uppercase">S / M / L / XL</span>
              <button className="text-[10px] tracking-widest text-ink border-b border-accent pb-0.5 uppercase flex items-center group-hover:translate-x-1.5 transition-transform duration-300">
                Filtrar categoría <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
