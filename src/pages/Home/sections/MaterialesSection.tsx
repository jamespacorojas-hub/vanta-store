import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

// Every weave we offer is spun in these three yarn counts (Ne) — shown once, in the detail modal.
const YARN_COUNTS = ['30/1', '24/1', '20/1'];

const WEAVES = [
  {
    name: 'Waffle',
    gsm: '400 GSM',
    desc: 'Estructura alveolar tridimensional táctil similar al panal de abeja. Absorbe la luz de forma mate y otorga una caída muy pesada.',
    detail: 'Tejido alveolar tridimensional (nido de abeja) de alta densidad. Su relieve absorbe la luz reduciendo reflejos y proporciona un tacto abrigado con un peso y estructura inigualable.',
    idealFor: 'Hoodies, camisas y camiseros oversize pensados para climas fríos y looks de abrigo con volumen visible.',
    care: 'Lavar en frío del revés y secar en colgador. Evita planchar directamente sobre el relieve para no aplastar la textura.',
    photo: '/texturas/waffle.png',
  },
  {
    name: 'Waffer',
    gsm: '420 GSM',
    desc: 'Stitch entrelazado grueso y robusto de máxima ingeniería. Mayor aislamiento térmico y solidez estructural única.',
    detail: 'Variante de waffle extra-grueso de alta ingeniería. Posee un gramaje superior de 420g para aislamiento térmico avanzado y siluetas hiper-estructuradas.',
    idealFor: 'Prendas de invierno de alto gramaje donde se busca una silueta estructurada y máxima retención de calor.',
    care: 'Lavar en frío del revés, ciclo suave. No usar secadora a alta temperatura para conservar la solidez del tejido.',
    photo: '/texturas/waffer.png',
  },
  {
    name: 'Piqué',
    gsm: '300 GSM',
    desc: 'Tejido granulado de punto de arroz característico de alta costura. Excelente transpirabilidad y firmeza contra las arrugas.',
    detail: 'Tejido entrelazado de punto de arroz característico de alta gama. Máxima estabilidad dimensional, excelente resistencia a las arrugas y un acabado sutilmente granulado.',
    idealFor: 'Camisas y camiseros de uso diario que buscan un balance entre look formal-casual y transpirabilidad.',
    care: 'Lavado delicado en frío para conservar el granulado. Planchar a temperatura media.',
    photo: '/texturas/pique.png',
  },
  {
    name: 'Jersey',
    gsm: '240 GSM',
    desc: 'Punto plano clásico ultra-peinado e hilado fino. Una suavidad excepcional sobre la piel con gran flexibilidad urbana.',
    detail: 'Punto liso clásico ultra suave de algodón peinado. Tejido ligero y fluido de 240g de tacto fresco ideal para uso diario bajo cualquier silueta urbana.',
    idealFor: 'Camisas y camiseros ligeros de entretiempo, y cualquier prenda de uso diario que priorice la comodidad.',
    care: 'Lavado normal en frío. Seca rápido y no requiere cuidados especiales.',
    photo: '/texturas/jersey.png',
  },
  {
    name: 'Neru',
    gsm: '280 GSM',
    desc: 'Entramado rústico irregular de hilos cruzados que simula lino grueso de alta gama. Máxima ventilación y caída orgánica natural.',
    detail: 'Tejido orgánico de hilos rústicos cruzados que asemeja textura de lino grueso. Extraordinaria ventilación y un look arrugado natural muy de vanguardia.',
    idealFor: 'Prendas de temporada cálida y siluetas relajadas que lucen bien con su arrugado natural.',
    care: 'Lavar del revés en frío para conservar la textura rústica. No requiere plancha: su arrugado es parte del look.',
    photo: '/texturas/neru.png',
  },
];

export default function MaterialesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Track which card sits closest to the carousel's center as the user swipes on mobile
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      const center = scroller.scrollLeft + scroller.offsetWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const itemCenter = el.offsetLeft + el.offsetWidth / 2;
        const distance = Math.abs(itemCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      setActiveIndex(closestIndex);
    };

    handleScroll();
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToIndex = (i: number) => {
    itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const openWeave = openIndex !== null ? WEAVES[openIndex] : null;

  return (
    <section id="interactive-fabrics" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-panel border-b border-line scroll-mt-48">
      <div className="text-center space-y-1.5 mb-10 sm:mb-16">
        <span className="text-[10px] tracking-[0.25em] text-muted font-bold block uppercase">
          Cátedra de materiales & ingeniería textil
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink">
          Cuadros por tejido
        </h2>
        <p className="text-[11px] font-sans font-light text-muted max-w-md mx-auto">
          Conoce la textura, el peso y las características de cada tejido que usamos en nuestras prendas. Toca un cuadro para ver el detalle.
        </p>
      </div>

      {/* Mobile: swipeable carousel, active card highlighted */}
      <div className="sm:hidden">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-[14%] pb-1"
        >
          {WEAVES.map((weave, i) => (
            <div
              id={`fabric-card-mobile-${weave.name}`}
              key={weave.name}
              ref={(el) => { itemRefs.current[i] = el; }}
              onClick={() => setOpenIndex(i)}
              className={`snap-center shrink-0 w-[72%] flex flex-col bg-paper-soft border overflow-hidden cursor-pointer transition-all duration-300 ${
                activeIndex === i ? 'border-accent ring-1 ring-accent scale-100 opacity-100' : 'border-line opacity-55 scale-95'
              }`}
            >
              <div className="aspect-square w-full overflow-hidden bg-panel">
                <img
                  src={weave.photo}
                  alt={`Textura de tela ${weave.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="font-mono text-[9px] text-muted block uppercase">{weave.gsm}</span>
                <h3 className="font-display text-base font-medium text-ink">{weave.name}</h3>
                <p className="text-[10px] font-sans font-light text-muted leading-relaxed mt-2 line-clamp-2">
                  {weave.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Position dots */}
        <div className="flex justify-center items-center gap-1.5 mt-5">
          {WEAVES.map((weave, i) => (
            <button
              id={`fabric-dot-${weave.name}`}
              key={weave.name}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ver tejido ${weave.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-5 bg-accent' : 'w-1.5 bg-line'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop / tablet: full grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-5 gap-4">
        {WEAVES.map((weave, i) => (
          <div
            id={`fabric-card-${weave.name}`}
            key={weave.name}
            onClick={() => setOpenIndex(i)}
            className="group flex flex-col bg-paper-soft border border-line overflow-hidden cursor-pointer hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out"
          >
            <div className="aspect-square w-full overflow-hidden bg-panel">
              <img
                src={weave.photo}
                alt={`Textura de tela ${weave.name}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col justify-between flex-1 p-5">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-muted block uppercase">{weave.gsm}</span>
                <h3 className="font-display text-base font-medium text-ink">{weave.name}</h3>
              </div>

              <p className="text-[10px] font-sans font-light text-muted leading-relaxed mt-4">
                {weave.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fabric detail modal */}
      {openWeave && (
        <div
          id="fabric-detail-overlay"
          className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setOpenIndex(null)}
        >
          <div
            id="fabric-detail-card"
            className="relative bg-paper-soft w-full max-w-sm max-h-[88vh] border border-line shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="fabric-detail-close-btn"
              onClick={() => setOpenIndex(null)}
              className="absolute top-3 right-3 z-10 bg-ink text-paper-soft p-1.5 hover:bg-accent transition-colors"
              aria-label="Cerrar detalle de tejido"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="overflow-y-auto">
              <div className="aspect-[4/3] w-full overflow-hidden bg-panel">
                <img
                  src={openWeave.photo}
                  alt={`Textura de tela ${openWeave.name}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest">{openWeave.gsm}</span>
                  <h3 className="font-display text-xl font-medium text-ink mt-0.5">{openWeave.name}</h3>
                </div>

                <p className="text-muted text-xs font-light leading-relaxed">
                  {openWeave.detail}
                </p>

                <div className="border-t border-line pt-3.5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-ink font-bold">Ideal para</span>
                    <p className="text-muted text-xs font-light leading-relaxed mt-1">{openWeave.idealFor}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-ink font-bold">Cuidados</span>
                    <p className="text-muted text-xs font-light leading-relaxed mt-1">{openWeave.care}</p>
                  </div>
                </div>

                <p className="text-[9px] font-mono text-muted uppercase tracking-wide border-t border-line pt-3.5">
                  Gramajes de hilado disponibles en todas nuestras telas:{' '}
                  <span className="text-ink font-bold">{YARN_COUNTS.join(' · ')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
