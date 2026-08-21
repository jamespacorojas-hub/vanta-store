import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  FileText,
  Truck,
  Lock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { FAQS } from '../../data';
import PaymentInstructions from '../cart/PaymentInstructions';

type TabType = 'faq' | 'returns' | 'terms' | 'shipping' | 'privacy';

export default function FAQAndPolicies() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('faq');
  const [faqPaymentMethod, setFaqPaymentMethod] = useState<'agora' | 'oh'>('agora');

  // Handle hash changes to open specific policy tab directly from footer or links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('terminos')) setActiveTab('terms');
      else if (hash.includes('cambios') || hash.includes('devolucion')) setActiveTab('returns');
      else if (hash.includes('envios')) setActiveTab('shipping');
      else if (hash.includes('privacidad') || hash.includes('politica')) setActiveTab('privacy');
      else if (hash.includes('faq') || hash.includes('preguntas')) setActiveTab('faq');
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'faq', label: 'Preguntas Frecuentes', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'returns', label: 'Cambios y Garantía', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'terms', label: 'Términos y Condiciones', icon: <FileText className="w-4 h-4" /> },
    { id: 'shipping', label: 'Política de Envíos', icon: <Truck className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacidad y Datos', icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <section id="faq-and-policies" className="py-12 sm:py-20 bg-paper text-ink border-b border-line scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[9.5px] sm:text-[10px] font-mono tracking-[0.3em] text-muted font-bold uppercase block">
            ✦ INFORMACIÓN OFICIAL // VANTA ATELIER ✦
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-ink tracking-tight uppercase">
            Políticas & Términos
          </h2>
          <p className="text-muted text-xs sm:text-sm font-light">
            Transparencia, seguridad en cada pedido y respaldo de calidad en cada prenda.
          </p>
        </div>

        {/* Tab Navigation (Responsive Horizontal Slider on Mobile) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 pb-4 mb-8 border-b border-line">
          {tabs.map((tab) => {
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}-btn`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 font-mono text-[10.5px] sm:text-xs uppercase tracking-wider font-bold transition-all rounded-xs border flex items-center gap-1.5 cursor-pointer ${
                  isSel
                    ? 'bg-ink text-paper border-ink shadow-sm'
                    : 'bg-panel text-muted border-line hover:text-ink hover:border-ink/40'
                }`}
              >
                <span className={isSel ? 'text-accent' : 'text-muted'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: PREGUNTAS FRECUENTES (FAQ) ── */}
        {activeTab === 'faq' && (
          <div id="faq-content-block" className="space-y-3.5 animate-in fade-in duration-300">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  id={`faq-item-${idx}`}
                  key={idx}
                  className="bg-panel border border-line rounded-xs overflow-hidden transition-all hover:border-ink/40"
                >
                  <button
                    id={`faq-toggle-btn-${idx}`}
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between transition-colors hover:bg-paper-soft cursor-pointer gap-3"
                  >
                    <span className="font-mono font-bold text-xs sm:text-sm text-ink uppercase tracking-wide">
                      {faq.question}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-muted transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-90 text-accent' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-[1200px] border-t border-line' : 'max-h-0'
                    }`}
                  >
                    <div className="p-4 sm:p-5 text-muted text-xs sm:text-sm leading-relaxed font-light space-y-4 bg-paper/50">
                      <p>{faq.answer}</p>

                      {idx === 1 && (
                        <div className="space-y-4 border-t border-line pt-4 mt-2">
                          <span className="text-[9px] font-mono tracking-[0.2em] text-ink font-bold block uppercase">
                            GUÍA OFICIAL DE TRANSFERENCIAS & QR
                          </span>
                          <div className="flex gap-2">
                            <button
                              id="faq-payment-tab-agora"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFaqPaymentMethod('agora');
                              }}
                              className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase transition-all border rounded-xs cursor-pointer text-center font-bold ${
                                faqPaymentMethod === 'agora'
                                  ? 'bg-ink text-paper border-ink shadow-xs'
                                  : 'bg-panel text-muted border-line hover:text-ink'
                              }`}
                            >
                              AGORA PAY
                            </button>
                            <button
                              id="faq-payment-tab-oh"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFaqPaymentMethod('oh');
                              }}
                              className={`flex-1 py-2 text-[10px] font-mono tracking-widest uppercase transition-all border rounded-xs cursor-pointer text-center font-bold ${
                                faqPaymentMethod === 'oh'
                                  ? 'bg-ink text-paper border-ink shadow-xs'
                                  : 'bg-panel text-muted border-line hover:text-ink'
                              }`}
                            >
                              OH! PAY
                            </button>
                          </div>

                          <PaymentInstructions method={faqPaymentMethod} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 2: CAMBIOS Y GARANTÍA ── */}
        {activeTab === 'returns' && (
          <div
            id="returns-content-block"
            className="bg-panel border border-line rounded-sm p-6 sm:p-8 space-y-6 font-sans animate-in fade-in duration-300 text-ink"
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-full bg-paper border border-line flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-ink font-mono">
                  1. PLAZO Y CONDICIONES DE CAMBIO
                </h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                  Puedes solicitar el cambio de tu prenda dentro de los primeros <b>7 días calendario</b> posteriores a la recepción del pedido. Para que el cambio sea aprobado, la prenda debe cumplir con los siguientes requisitos indispensables:
                </p>
                <ul className="list-disc pl-5 text-muted text-xs font-sans space-y-1.5 pt-1">
                  <li>Completamente limpia, sin manchas, olores a perfumes, desodorante o humedad.</li>
                  <li>Sin haber sido usada, lavada, modificada o planchada.</li>
                  <li>Con todas sus etiquetas de cartón, marchamos de seguridad y empaque original intactos.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 border-t border-line pt-6">
              <div className="w-9 h-9 rounded-full bg-paper border border-line flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-ink font-mono">
                  2. CÓMO SOLICITAR EL CAMBIO
                </h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                  Escríbenos directamente a nuestro WhatsApp oficial (<strong>+51 904 536 406</strong>) adjuntando tu comprobante de compra o número de pedido, junto con fotos de la prenda y sus etiquetas.
                </p>
                <p className="text-muted text-xs font-light leading-relaxed">
                  Los costos logísticos de retorno y reenvío corren por cuenta del cliente. En caso de una falla comprobada de confección o envío de talla equivocada por nuestra parte, <strong>VANTA asumirá el 100% de los costos de transporte</strong>.
                </p>
                <div className="p-3 bg-paper border border-line rounded-xs text-[11px] text-muted space-y-1">
                  <strong className="text-ink font-mono block uppercase">Nota sobre reembolsos:</strong>
                  <span>
                    No se efectúan devoluciones de dinero en efectivo. Si el modelo o talla deseada no está disponible al momento del cambio, se emitirá una <strong>Nota de Crédito Virtual</strong> sin fecha de caducidad para usar en cualquier producto del catálogo.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: TÉRMINOS Y CONDICIONES ── */}
        {activeTab === 'terms' && (
          <div
            id="terms-content-block"
            className="bg-panel border border-line rounded-sm p-6 sm:p-8 space-y-6 font-sans animate-in fade-in duration-300 text-ink"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide font-mono">
                  1. GENERALIDADES Y ACEPTACIÓN
                </h3>
              </div>
              <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                Al navegar, consultar o realizar un pedido a través de la plataforma web de <strong>VANTA STREETWEAR</strong>, el usuario acepta de forma plena y sin reservas los presentes Términos y Condiciones. Todas las compras son validadas y formalizadas a través de nuestros canales oficiales de atención.
              </p>
            </div>

            <div className="space-y-3 border-t border-line pt-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide font-mono">
                  2. PRECIOS, MONEDA Y DISPONIBILIDAD DE STOCK
                </h3>
              </div>
              <ul className="list-disc pl-5 text-muted text-xs sm:text-sm space-y-1.5 font-light">
                <li>Todos los precios están expresados en <strong>Soles Peruanos (S/)</strong> e incluyen los impuestos de ley aplicables en Perú.</li>
                <li>Los precios publicados no incluyen los costos de envío a domicilio, salvo promociones expresas debidamente señaladas.</li>
                <li>Debido a que nuestras colecciones se confeccionan en tirajes limitados (Drop System), el stock mostrado en la web es referencial y se confirma de manera definitiva al momento de coordinar el pago vía WhatsApp.</li>
              </ul>
            </div>

            <div className="space-y-3 border-t border-line pt-5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide font-mono">
                  3. PROPIEDAD INTELECTUAL Y DERECHOS DE MARCA
                </h3>
              </div>
              <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                Todos los diseños, patronajes, tipografías, logotipos, imágenes, texturas y material audiovisual publicados en este sitio web son propiedad exclusiva de <strong>VANTA ATELIER / STREETWEAR GOLD</strong>. Queda terminantemente prohibida su reproducción, copia o comercialización no autorizada.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 4: POLÍTICA DE ENVÍOS ── */}
        {activeTab === 'shipping' && (
          <div
            id="shipping-content-block"
            className="bg-panel border border-line rounded-sm p-6 sm:p-8 space-y-6 font-sans animate-in fade-in duration-300 text-ink"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide font-mono">
                  1. COBERTURA Y TIEMPOS DE ENTREGA
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 bg-paper border border-line rounded-xs space-y-1">
                  <strong className="text-xs font-mono uppercase text-ink block">📍 Lima Metropolitana</strong>
                  <span className="text-xs text-accent font-bold font-mono">24 a 48 horas hábiles</span>
                  <p className="text-[11px] text-muted font-light pt-1">
                    Despachos express mediante motorizado privado con confirmación previa y seguimiento en tiempo real.
                  </p>
                </div>

                <div className="p-4 bg-paper border border-line rounded-xs space-y-1">
                  <strong className="text-xs font-mono uppercase text-ink block">📦 Provincias a Nivel Nacional</strong>
                  <span className="text-xs text-accent font-bold font-mono">48 a 72 horas hábiles</span>
                  <p className="text-[11px] text-muted font-light pt-1">
                    Envíos certificados a través de <strong>Olva Courier</strong> (a domicilio) o <strong>Shalom</strong> (recojo en agencia).
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-line pt-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide font-mono">
                  2. CÓDIGO DE RASTREO Y ENTREGA SEGURA
                </h3>
              </div>
              <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                Una vez depositado tu paquete en la agencia o asignado al motorizado, te enviaremos por WhatsApp tu <strong>número de guía / remito de seguimiento</strong> para que puedas monitorear el trayecto de tu compra hasta la puerta de tu casa.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 5: PRIVACIDAD Y PROTECCIÓN DE DATOS ── */}
        {activeTab === 'privacy' && (
          <div
            id="privacy-content-block"
            className="bg-panel border border-line rounded-sm p-6 sm:p-8 space-y-6 font-sans animate-in fade-in duration-300 text-ink"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide font-mono">
                  1. TRATAMIENTO Y CONFIDENCIALIDAD DE DATOS
                </h3>
              </div>
              <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                En cumplimiento de la Ley N.º 29733 (Ley de Protección de Datos Personales del Perú), <strong>VANTA</strong> garantiza que la información personal proporcionada por nuestros clientes (nombre, teléfono, dirección y correo) es tratada con estricta confidencialidad.
              </p>
            </div>

            <div className="space-y-3 border-t border-line pt-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide font-mono">
                  2. SEGURIDAD Y PAGOS
                </h3>
              </div>
              <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                Nuestra plataforma no almacena números de tarjetas de crédito ni contraseñas bancarias. Todas las transacciones se realizan directamente a través de las pasarelas seguras y aplicaciones oficiales autorizadas (Agora, Oh! Pay, Yape, Plin y transferencias interbancarias).
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
