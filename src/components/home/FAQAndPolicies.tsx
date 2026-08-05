import React, { useState } from 'react';
import { HelpCircle, ChevronRight, RotateCcw, ShieldCheck, Wallet } from 'lucide-react';
import { FAQS } from '../../data';
import PaymentInstructions from '../cart/PaymentInstructions';

export default function FAQAndPolicies() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'returns'>('faq');
  const [faqPaymentMethod, setFaqPaymentMethod] = useState<'agora' | 'oh'>('agora');

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section id="faq-and-policies" className="py-12 sm:py-20 bg-paper border-b border-line">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Selection */}
        <div className="flex justify-center border-b border-line mb-10 sm:mb-14">
          <button
            id="tab-faq-btn"
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-sans text-xs uppercase tracking-widest font-black transition-all border-b-2 -mb-[2px] ${
              activeTab === 'faq' ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            PREGUNTAS FRECUENTES
          </button>
          <button
            id="tab-returns-btn"
            onClick={() => setActiveTab('returns')}
            className={`px-6 py-3 font-sans text-xs uppercase tracking-widest font-black transition-all border-b-2 -mb-[2px] ${
              activeTab === 'returns' ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            CAMBIOS Y DEVOLUCIONES
          </button>
        </div>

        {/* Tab content: FAQ */}
        {activeTab === 'faq' && (
          <div id="faq-content-block" className="space-y-4 animate-in fade-in duration-300">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  id={`faq-item-${idx}`}
                  key={idx}
                  className="bg-paper-soft border border-line overflow-hidden"
                >
                  <button
                    id={`faq-toggle-btn-${idx}`}
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between transition-colors hover:bg-paper"
                  >
                    <span className="font-sans font-bold text-xs sm:text-sm text-ink uppercase tracking-wide">
                      {faq.question}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-muted transition-transform duration-300 ${
                        isOpen ? 'rotate-90 text-accent' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-[1200px] border-t border-line' : 'max-h-0'
                    }`}
                  >
                    <div className="p-4 sm:p-5 text-muted text-xs sm:text-sm leading-relaxed font-light space-y-4">
                      <p>{faq.answer}</p>

                      {idx === 1 && (
                        <div className="space-y-4 border-t border-line pt-4">
                          <span className="text-[9px] font-sans tracking-[0.2em] text-muted font-bold block uppercase">
                            VER CREDENCIALES & GUÍA DE TRANSFERENCIAS
                          </span>
                          <div className="flex gap-2">
                            <button
                              id="faq-payment-tab-agora"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFaqPaymentMethod('agora');
                              }}
                              className={`flex-1 py-2.5 text-[10px] font-sans tracking-widest uppercase transition-all border rounded-none cursor-pointer text-center ${
                                faqPaymentMethod === 'agora'
                                  ? 'bg-accent text-paper-soft border-accent font-black shadow-sm'
                                  : 'bg-panel text-muted border-line hover:text-ink hover:bg-paper-soft'
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
                              className={`flex-1 py-2.5 text-[10px] font-sans tracking-widest uppercase transition-all border rounded-none cursor-pointer text-center ${
                                faqPaymentMethod === 'oh'
                                  ? 'bg-red-600 text-white border-red-600 font-black shadow-sm'
                                  : 'bg-panel text-muted border-line hover:text-ink hover:bg-paper-soft'
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

        {/* Tab content: Returns Policy */}
        {activeTab === 'returns' && (
          <div id="returns-content-block" className="bg-paper-soft border border-line p-6 sm:p-8 space-y-6 font-sans animate-in fade-in duration-300">
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-full bg-panel border border-line flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4 text-ink" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-ink">
                  PLAZO Y CONDICIONES DEL PRODUCTO
                </h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                  Puedes realizar cambios de tus prendas compradas dentro de los primeros <b>7 días calendario</b> posteriores a la recepción de tu compra. Para que el cambio proceda, la prenda debe encontrarse exactamente en su estado de entrega original:
                </p>
                <ul className="list-disc pl-5 text-muted text-xs font-sans space-y-1">
                  <li>Completamente limpia, sin rastros de perfumes, manchas o desodorante.</li>
                  <li>Sin haber sido usada, lavada, modificada o planchada.</li>
                  <li>Con todas sus etiquetas de cartón, cierres plásticos y bolsas originales intactas.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 border-t border-line pt-6">
              <div className="w-8 h-8 rounded-full bg-panel border border-line flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-ink" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-ink">
                  COMO GESTIONAR EL CAMBIO
                </h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                  Contáctanos enviando un mensaje directo a nuestro WhatsApp corporativo con tu número de pedido o nombre del cliente. Envíanos fotos que validen el estado perfecto de las etiquetas y la prenda.
                </p>
                <p className="text-muted text-xs font-light leading-relaxed">
                  Los costos de mensajería de retorno y reenvío corren por cuenta del comprador, excepto en el improbable caso de que se trate de una falla explícita de fábrica, en cuyo caso MONT STORE cubrirá el total de los gastos de flete.
                </p>
                <p className="text-muted text-xs font-light leading-relaxed">
                  <b>Importante:</b> No se realizan devoluciones de dinero en efectivo bajo ningún concepto. Si decides no cambiar la prenda en el acto, se te entregará una nota de crédito/vale de compra virtual con validez ilimitada para compras futuras.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
