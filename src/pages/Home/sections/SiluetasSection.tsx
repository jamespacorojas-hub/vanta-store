import React from 'react';
import { ArrowRight } from 'lucide-react';

const SILUETAS = [
  {
    category: 'Polera',
    section: '01',
    gsm: '400-420 GSM',
    desc: 'Poleras Zyko, hoodies y crewnecks de silueta boxy y hombros caídos. Construidas en tejidos pesados de alto gramaje que garantizan una estructura rígida inigualable.',
    fabrics: ['Zyko', 'Waffer', 'Waffle', 'Jersey pesado'],
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
    fabrics: ['Waffle', 'Piqué', 'Zyko', 'Clásica'],
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
];

interface SiluetasSectionProps {
  onSelectCategory: (category: string) => void;
}

export default function SiluetasSection({ onSelectCategory }: SiluetasSectionProps) {
  return (
    <section id="visual-collections" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper scroll-mt-48">
      <div className="text-center space-y-2 mb-12 sm:mb-16">
        <span className="text-[10px] font-mono tracking-[0.35em] text-muted font-bold block uppercase flex items-center justify-center gap-2">
          <span className="text-accent">✦</span> ARQUITECTURA DE SILUETAS <span className="text-accent">✦</span>
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide uppercase">
          Cuadros por categoría
        </h2>
        <p className="text-[11px] font-sans font-light text-muted max-w-md mx-auto">
          Selecciona una categoría para explorar sus dimensiones, tejidos correspondientes y siluetas de confección.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {SILUETAS.map((tile) => (
          <div
            key={tile.category}
            id={`collection-${tile.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-banner`}
            onClick={() => onSelectCategory(tile.category)}
            className="group flex flex-col justify-between min-h-[260px] sm:min-h-[320px] p-4 sm:p-6 bg-[#0d0d12] text-ink border border-zinc-800 cursor-pointer relative overflow-hidden transition-all duration-500 hover:border-zinc-500 hover:shadow-2xl hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start z-10 text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
              <span>Sección {tile.section}</span>
              <span className="text-zinc-300 font-bold">{tile.gsm}</span>
            </div>

            <div className="z-10 space-y-1.5 my-3">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-zinc-200 transition-colors">{tile.category}</h3>
              <p className="text-[11px] font-sans font-light text-zinc-400 leading-relaxed line-clamp-3">
                {tile.desc}
              </p>
              <div className="flex gap-1 flex-wrap pt-1.5">
                {tile.fabrics.map((f, i) => (
                  <span
                    key={f}
                    className={`text-[8px] font-mono border border-zinc-800 bg-[#14141c] px-2 py-0.5 ${i === 0 ? 'text-white font-bold border-zinc-600' : 'text-zinc-400'}`}
                  >
                    {f.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-end z-10 pt-3 border-t border-zinc-800/80">
              <span className="font-mono text-[8.5px] text-zinc-500 uppercase">S / M / L / XL</span>
              <button className="text-[9.5px] sm:text-[10px] font-mono tracking-widest text-zinc-200 border-b border-zinc-600 pb-0.5 uppercase flex items-center group-hover:text-white group-hover:border-white transition-all">
                Filtrar <ArrowRight className="w-3 h-3 ml-1 text-zinc-300" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
