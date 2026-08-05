import React, { useState } from 'react';
import { Copy, Check, QrCode, Smartphone, CreditCard, ChevronRight, HelpCircle, ArrowRight, Info } from 'lucide-react';

interface PaymentInstructionsProps {
  method: 'agora' | 'oh' | '';
}

export default function PaymentInstructions({ method }: PaymentInstructionsProps) {
  const [activeTab, setActiveTab] = useState<'qr' | 'number' | 'others'>('qr');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedOtherApp, setSelectedOtherApp] = useState<'yape' | 'plin' | 'banca'>('yape');

  if (!method) return null;

  // Official destination account — the same real account receives both Agora Pay and Oh! Pay transfers
  const paymentDetails = {
    agora: {
      name: 'AGORA PAY (Billetera Agora)',
      celular: '924 058 988',
      titular: 'BRYAN MICHAEL REQUENA AVILA',
      cci: '094-00141000636992-1-53',
      color: 'bg-accent text-paper-soft border-accent',
      textColor: 'text-accent',
      badgeColor: 'border-accent/30 bg-accent-soft text-accent',
      qrBorderColor: 'border-accent',
    },
    oh: {
      name: 'OH! PAY (Financiera Oh!)',
      celular: '924 058 988',
      titular: 'BRYAN MICHAEL REQUENA AVILA',
      cci: '094-00141000636992-1-53',
      color: 'bg-red-600 text-white border-red-500',
      textColor: 'text-red-600',
      badgeColor: 'border-red-500/30 bg-red-500/5 text-red-500',
      qrBorderColor: 'border-red-600',
    }
  };

  const details = paymentDetails[method];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Real payment QR — scans to the actual destination account for both Agora and Oh! transfers.
  // Sized large and framed prominently since this is the fastest path to pay.
  const renderQR = () => (
    <div className="flex flex-col items-center justify-center p-5 bg-panel border border-line relative overflow-hidden">
      <div className={`w-full max-w-[260px] border-2 shadow-lg overflow-hidden ${details.qrBorderColor}`}>
        <img
          src="/pagos/codigo-qr.jpeg"
          alt={`Código QR de pago a ${details.titular}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-4 text-center space-y-1 z-10">
        <span className="font-sans text-[8px] text-muted uppercase tracking-widest block">ESCANEA CON CUALQUIER APP</span>
        <p className="text-[10px] font-sans font-medium text-muted">
          Escanea desde <span className="text-accent font-bold">Yape, Plin</span> o tu banca favorita
        </p>
      </div>
    </div>
  );

  return (
    <div id={`payment-instructions-${method}`} className="bg-paper border border-line p-4 font-sans space-y-4 select-none animate-in fade-in duration-200">
      {/* Target Logo / Badge */}
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-0.5 font-sans text-[9px] font-black uppercase tracking-wider border ${details.color}`}>
            {method === 'agora' ? 'AGORA' : 'OH! PAY'}
          </div>
          <span className="font-sans text-[10px] text-muted uppercase tracking-wider font-semibold">INDICACIONES DE PAGO</span>
        </div>
        <span className="font-sans text-[8px] text-muted">PASO 1 DE 2</span>
      </div>

      {/* Internal Tabs Controller */}
      <div className="grid grid-cols-3 gap-1 bg-panel p-0.5">
        <button
          id={`pay-tab-qr-${method}`}
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`py-2 text-[9px] font-sans tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'qr'
              ? 'bg-paper-soft text-ink font-black shadow-xs'
              : 'text-muted hover:text-ink'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>POR QR</span>
        </button>
        <button
          id={`pay-tab-num-${method}`}
          type="button"
          onClick={() => setActiveTab('number')}
          className={`py-2 text-[9px] font-sans tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'number'
              ? 'bg-paper-soft text-ink font-black shadow-xs'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>POR NÚMERO</span>
        </button>
        <button
          id={`pay-tab-others-${method}`}
          type="button"
          onClick={() => setActiveTab('others')}
          className={`py-2 text-[9px] font-sans tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'others'
              ? 'bg-paper-soft text-ink font-black shadow-xs'
              : 'text-muted hover:text-ink'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>OTROS BANCOS</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-paper-soft border border-line p-3 min-h-[210px] flex flex-col justify-between">
        
        {/* 1. QR TAB */}
        {activeTab === 'qr' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {renderQR()}
            <div className="text-[9.5px] font-sans font-light text-muted leading-relaxed text-center px-1">
              Guarda o escanea este código QR usando la cámara de tu celular o la app de <b className="text-ink font-bold">Yape, Plin, Interbank, BCP, BBVA, etc.</b> para realizar tu transferencia directa.
            </div>
          </div>
        )}

        {/* 2. NUMBER TAB */}
        {activeTab === 'number' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="space-y-2">
              <span className="text-[8px] font-sans uppercase tracking-widest text-muted block font-bold">DATOS OFICIALES DE DESTINO</span>

              {/* Celular */}
              <div className="flex items-center justify-between bg-paper border border-line px-3 py-2">
                <div className="space-y-0.5">
                  <span className="text-[7.5px] font-sans text-muted block">NÚMERO DE CELULAR</span>
                  <span className="font-mono text-[11px] font-black text-ink tracking-widest">{details.celular}</span>
                </div>
                <button
                  id={`btn-copy-cel-${method}`}
                  type="button"
                  onClick={() => handleCopy(details.celular, 'celular')}
                  className="p-1 hover:bg-panel transition-colors text-muted hover:text-accent"
                  title="Copiar Celular"
                >
                  {copiedText === 'celular' ? (
                    <span className="text-[8.5px] font-sans text-accent font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> COPIADO
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Titular */}
              <div className="flex items-center justify-between bg-paper border border-line px-3 py-2">
                <div className="space-y-0.5">
                  <span className="text-[7.5px] font-sans text-muted block">TITULAR DE CUENTA</span>
                  <span className="font-mono text-[9.5px] font-black text-ink">{details.titular}</span>
                </div>
                <button
                  id={`btn-copy-tit-${method}`}
                  type="button"
                  onClick={() => handleCopy(details.titular, 'titular')}
                  className="p-1 hover:bg-panel transition-colors text-muted hover:text-accent"
                  title="Copiar Titular"
                >
                  {copiedText === 'titular' ? (
                    <span className="text-[8.5px] font-sans text-accent font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> COPIADO
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* CCI */}
              <div className="flex items-center justify-between bg-paper border border-line px-3 py-2">
                <div className="space-y-0.5">
                  <span className="text-[7.5px] font-sans text-muted block">CCI (CÓDIGO INTERBANCARIO)</span>
                  <span className="font-mono text-[10px] font-bold text-ink tracking-wider">{details.cci}</span>
                </div>
                <button
                  id={`btn-copy-cci-${method}`}
                  type="button"
                  onClick={() => handleCopy(details.cci, 'cci')}
                  className="p-1 hover:bg-panel transition-colors text-muted hover:text-accent"
                  title="Copiar CCI"
                >
                  {copiedText === 'cci' ? (
                    <span className="text-[8.5px] font-sans text-accent font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> COPIADO
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-1.5 bg-accent-soft border border-accent/25 p-2 text-[9px] text-ink leading-normal">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent" />
              <span>Puedes transferir directamente a este número o usar el CCI desde la banca móvil de cualquier entidad (BCP, BBVA, Interbank, etc.)</span>
            </div>
          </div>
        )}

        {/* 3. OTHERS TAB (Yape, Plin, Other bank apps setup guides) */}
        {activeTab === 'others' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Horizontal Sub-tabs */}
            <div className="flex border-b border-line">
              <button
                id={`others-subtab-yape-${method}`}
                type="button"
                onClick={() => setSelectedOtherApp('yape')}
                className={`flex-1 py-1 text-[8.5px] font-sans font-bold uppercase transition-all border-b-2 ${
                  selectedOtherApp === 'yape' ? 'border-purple-600 text-purple-600' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                DESDE YAPE
              </button>
              <button
                id={`others-subtab-plin-${method}`}
                type="button"
                onClick={() => setSelectedOtherApp('plin')}
                className={`flex-1 py-1 text-[8.5px] font-sans font-bold uppercase transition-all border-b-2 ${
                  selectedOtherApp === 'plin' ? 'border-cyan-500 text-cyan-500' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                DESDE PLIN
              </button>
              <button
                id={`others-subtab-banca-${method}`}
                type="button"
                onClick={() => setSelectedOtherApp('banca')}
                className={`flex-1 py-1 text-[8.5px] font-sans font-bold uppercase transition-all border-b-2 ${
                  selectedOtherApp === 'banca' ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                BANCA MÓVIL
              </button>
            </div>

            {/* Instruction content based on sub-tab selection */}
            <div className="text-[10px] font-sans text-muted leading-relaxed space-y-2.5 pt-1">

              {selectedOtherApp === 'yape' && (
                <>
                  <p className="font-semibold text-ink text-[10.5px]">Guía para Yapear a {details.name}:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-muted font-light text-[9.5px]">
                    <li>Abre tu aplicación <b className="text-purple-700 font-bold">Yape</b> en el celular.</li>
                    <li>Selecciona la opción de <b className="text-ink font-medium">"Yapear"</b> e ingresa el número: <span className="font-mono text-ink font-bold tracking-wider">{details.celular}</span>.</li>
                    <li>Te aparecerá la opción de <b className="text-purple-600">"Yapear a Otros Bancos"</b>. Elígela.</li>
                    <li>En la lista de entidades financieras/bancos, selecciona: <b className="text-ink font-semibold">{method === 'agora' ? 'AGORA' : 'FINANCIERA OH!'}</b>.</li>
                    <li>Completa el monto del pedido (S/. ), confirma el yapeo interbancario y ¡toma una captura del comprobante!</li>
                  </ol>
                </>
              )}

              {selectedOtherApp === 'plin' && (
                <>
                  <p className="font-semibold text-ink text-[10.5px]">Guía para pagar por Plin a {details.name}:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-muted font-light text-[9.5px]">
                    <li>Ingresa a <b className="text-cyan-600 font-bold">Plin</b> desde tu app bancaria (Interbank, Scotiabank, BBVA, BanBif, etc.).</li>
                    <li>Digita o selecciona el número celular de destino: <span className="font-mono text-ink font-bold tracking-wider">{details.celular}</span>.</li>
                    <li>El sistema detectará que está afiliado a otra billetera. Selecciona <b className="text-ink font-semibold">{method === 'agora' ? 'Agora' : 'Oh! Pay'}</b> como billetera de destino.</li>
                    <li>Ingresa el monto del total de tus compras y dale click a transferir.</li>
                    <li>Guarda tu comprobante de éxito para enviarlo por WhatsApp.</li>
                  </ol>
                </>
              )}

              {selectedOtherApp === 'banca' && (
                <>
                  <p className="font-semibold text-ink text-[10.5px]">Guía por Transferencia Interbancaria (BCP, Interbank, BBVA, etc.):</p>
                  <ol className="list-decimal pl-4 space-y-1 text-muted font-light text-[9.5px]">
                    <li>Copia el CCI: <span className="font-mono bg-panel p-0.5 border border-line text-ink font-bold tracking-wider text-[9px]">{details.cci}</span>.</li>
                    <li>Abre el aplicativo móvil de tu banco preferido (<b className="text-blue-900 font-bold">BCP, Interbank, BBVA, Scotiabank</b>).</li>
                    <li>Ingresa a <b className="text-ink font-medium">"Transferencias"</b> ➔ <b className="text-ink font-medium">"A otros bancos / Interbancarias"</b>.</li>
                    <li>Pega el código CCI, selecciona el banco de destino: <b className="text-ink font-semibold">{method === 'agora' ? 'AGORA' : 'COMPAÑÍA DE FINANCIAMIENTO OH (FINANCIERA OH!)'}</b>.</li>
                    <li>Confirma que el titular corresponda a <b className="text-ink font-semibold">{details.titular}</b> y finaliza la operación. ¡Guarda tu voucher!</li>
                  </ol>
                </>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Verification notice */}
      <div className="border border-line bg-paper-soft p-2.5 text-[9px] font-sans tracking-wide text-muted leading-normal flex items-center space-x-1.5">
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shrink-0" />
        <span>Una vez que finalices el pedido en WhatsApp, nos enviarás tu captura o voucher de pago para la validación manual.</span>
      </div>
    </div>
  );
}
