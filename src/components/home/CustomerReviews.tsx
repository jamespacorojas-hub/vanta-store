import React, { useEffect, useState } from 'react';
import { MessageCircle, CheckCircle2, Star } from 'lucide-react';

const REVIEW_POOL = [
  { id: 'r1', name: 'James R.', location: 'San Isidro, LIM', date: '12 jul. 2026', outfit: 'Polera con Cierre (Melange Oscuro) en tejido Waffer', review: 'La caída de la polera en tejido Waffer es increíblemente rígida. Mantiene la silueta boxy perfectamente incluso después de varios lavados.', rating: 5 },
  { id: 'r2', name: 'Sofía V.', location: 'Miraflores, LIM', date: '5 jul. 2026', outfit: 'Camisa (Beige) en tela Waffle', review: 'La textura tridimensional del nido de abeja le da un carácter único que no encuentras en camisas de lino común. El fit es bien holgado.', rating: 5 },
  { id: 'r3', name: 'Mateo V.', location: 'Surco, LIM', date: '28 jun. 2026', outfit: 'Notch (Botella) en tejido Piqué', review: 'El cuello Notch sin botones con la estructura pesada del piqué es ideal. Da un aspecto minimalista super refinado pero totalmente cómodo.', rating: 4 },
  { id: 'r4', name: 'Ale E.', location: 'La Molina, LIM', date: '19 jun. 2026', outfit: 'Camisero (Perla) en tela Neru', review: 'La textura rústica tipo lino grueso de la tela Neru es super fresca para la tarde y combina genial con pantalones negros anchos.', rating: 5 },
  { id: 'r5', name: 'Valentina R.', location: 'Barranco, LIM', date: '30 jun. 2026', outfit: 'Manga Larga (Denim) en tejido Waffer', review: 'El puño de rib y el cuello cerrado le dan un aire retro que me encanta. Se siente pesada y de calidad, no se transparenta nada.', rating: 5 },
  { id: 'r6', name: 'Diego M.', location: 'San Borja, LIM', date: '22 jun. 2026', outfit: 'Clásico (Vino) en tejido Piqué', review: 'Pedí talla L y calzó justo como esperaba. El color Vino es más bonito en persona que en las fotos de la web.', rating: 4 },
  { id: 'r7', name: 'Camila T.', location: 'Jesús María, LIM', date: '15 jun. 2026', outfit: 'Polera (Camote) en tejido Neru', review: 'Es mi segunda compra. El gramaje pesado de la tela hace que la polera no pierda forma ni después de varios lavados en frío.', rating: 5 },
  { id: 'r8', name: 'Sebastián P.', location: 'Pueblo Libre, LIM', date: '8 jun. 2026', outfit: 'Camisa (Cemento) en tela Clásica', review: 'Buena caída, tela gruesa de verdad. Lo único es que el envío tardó un día más de lo indicado, pero llegó perfecto.', rating: 4 },
  { id: 'r9', name: 'Andrea L.', location: 'Chorrillos, LIM', date: '2 jun. 2026', outfit: 'Polera c/ Cierre (Botella) en tejido Waffle', review: 'El cierre corre suave y la capucha tiene buen volumen. Se siente premium, muy por encima del precio que pagué.', rating: 5 },
  { id: 'r10', name: 'Rodrigo H.', location: 'San Miguel, LIM', date: '27 may. 2026', outfit: 'Manga Larga (Pacay) en tejido Piqué', review: 'El verde Pacay es un color que no se ve en otras tiendas. Combina bien con jeans oscuros y zapatillas blancas.', rating: 5 },
  { id: 'r11', name: 'Fernanda B.', location: 'Magdalena, LIM', date: '20 may. 2026', outfit: 'Notch (Marrón) en tejido Jersey', review: 'Tela suave al tacto, nada áspera. El cuello Notch queda elegante incluso sin plancharlo mucho.', rating: 4 },
  { id: 'r12', name: 'Nicolás Q.', location: 'Lince, LIM', date: '14 may. 2026', outfit: 'Clásico (Topo) en tejido Waffle', review: 'Confirmaron mi pedido por WhatsApp al toque y llegó en dos días a Lince. La prenda tal cual se veía en la web.', rating: 5 },
  { id: 'r13', name: 'Gabriela S.', location: 'Los Olivos, LIM', date: '9 may. 2026', outfit: 'Camisero (Plomo) en tejido Waffer', review: 'El bolsillo frontal es más útil de lo que pensé y la caída relajada no se siente ancha de más.', rating: 4 },
  { id: 'r14', name: 'Joaquín D.', location: 'Comas, LIM', date: '30 abr. 2026', outfit: 'Polera (Negro) en tejido Piqué', review: 'Clásico que nunca falla. El negro no destiñe ni se pone grisáceo después de varios lavados, cosa rara de conseguir.', rating: 5 },
  { id: 'r15', name: 'Luciana F.', location: 'San Juan de Lurigancho, LIM', date: '24 abr. 2026', outfit: 'Camisa (Azul) en tela Waffer', review: 'Pesada de verdad, se nota la diferencia con camisas normales de otras tiendas. El azul es un poco más oscuro que en la foto pero me gustó igual.', rating: 4 },
  { id: 'r16', name: 'Bruno C.', location: 'Ate, LIM', date: '18 abr. 2026', outfit: 'Manga Larga (Gris) en tejido Jersey', review: 'Buen fit oversized sin quedar como saco de papas. El gris combina con todo mi clóset.', rating: 5 },
  { id: 'r17', name: 'Antonella G.', location: 'Villa El Salvador, LIM', date: '10 abr. 2026', outfit: 'Notch (Perla) en tejido Waffle', review: 'El color Perla es precioso para el día, se ve limpio y elegante. Pedí talla M y me quedó perfecto.', rating: 5 },
  { id: 'r18', name: 'Renzo A.', location: 'Callao', date: '3 abr. 2026', outfit: 'Polera c/ Cierre (Camote) en tejido Piqué', review: 'Llegó a Callao sin ningún problema, bien empacada. La sudadera pesa lo justo, ni muy delgada ni exagerada.', rating: 4 },
  { id: 'r19', name: 'Isabella N.', location: 'Surquillo, LIM', date: '27 mar. 2026', outfit: 'Clásico (Beige) en tejido Clásico', review: 'El beige es más cálido en persona, se ve premium. Muy buena relación calidad-precio comparado con otras marcas de streetwear.', rating: 5 },
  { id: 'r20', name: 'Emilio Z.', location: 'La Victoria, LIM', date: '20 mar. 2026', outfit: 'Camisero (Melange Oscuro) en tejido Jersey', review: 'Se siente gruesa apenas la tocas. El melange oscuro disimula bien las arrugas del día.', rating: 4 },
  { id: 'r21', name: 'Milagros K.', location: 'Independencia, LIM', date: '14 mar. 2026', outfit: 'Camisa (Palo Rosa) en tela Piqué', review: 'Nunca había comprado una camisa en este color y quedé encantada. El piqué le da textura sin verse informal.', rating: 5 },
  { id: 'r22', name: 'Franco I.', location: 'San Martín de Porres, LIM', date: '6 mar. 2026', outfit: 'Polera (Blanco) en tejido Waffle', review: 'El blanco no se ve transparente como en otras poleras baratas. Tela gruesa de verdad, se lava bien.', rating: 5 },
  { id: 'r23', name: 'Daniela O.', location: 'Breña, LIM', date: '27 feb. 2026', outfit: 'Manga Larga (Camote) en tejido Waffle', review: 'El puño acanalado ajusta bien la muñeca. Muy cómoda para el frío de las noches en Lima.', rating: 4 },
  { id: 'r24', name: 'Cristian Y.', location: 'Rímac, LIM', date: '19 feb. 2026', outfit: 'Notch (Denim) en tejido Waffer', review: 'De las prendas más pesadas que tengo, se nota el gramaje alto. El color Denim es un azul grisáceo bien logrado.', rating: 5 },
];

const REVIEWS_PER_BATCH = 4;
const ROTATION_INTERVAL_MS = 5 * 60 * 1000;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function CustomerReviews() {
  const [visibleReviews, setVisibleReviews] = useState(() => shuffle(REVIEW_POOL).slice(0, REVIEWS_PER_BATCH));

  useEffect(() => {
    // A shuffled "deck" of the whole pool — draw 4 at a time so every review appears
    // once before any repeat, then reshuffle for the next full pass.
    let deck = shuffle(REVIEW_POOL);
    let cursor = REVIEWS_PER_BATCH;

    const timer = setInterval(() => {
      if (cursor + REVIEWS_PER_BATCH > deck.length) {
        deck = shuffle(REVIEW_POOL);
        cursor = 0;
      }
      setVisibleReviews(deck.slice(cursor, cursor + REVIEWS_PER_BATCH));
      cursor += REVIEWS_PER_BATCH;
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const reviewWhatsAppUrl = `https://wa.me/51904536406?text=${encodeURIComponent(
    'Hola! Quisiera dejar una reseña de mi pedido ya entregado.'
  )}`;

  return (
    <section id="social-integration" className="py-12 sm:py-20 bg-paper border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-2 mb-10 sm:mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold block">
            RESEÑAS VERIFICADAS
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-ink tracking-tight uppercase">
            Clientes con pedido entregado
          </h2>
          <p className="text-muted text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
            Reseñas enviadas por WhatsApp después de cada entrega confirmada. Sin filtros, solo la palabra de quien ya recibió su pedido.
          </p>
          <div className="pt-2">
            <a
              id="review-whatsapp-btn"
              href={reviewWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 border border-accent px-4 py-2 text-xs tracking-widest text-accent hover:bg-accent hover:text-paper-soft transition-colors uppercase font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>DEJA TU RESEÑA POR WHATSAPP</span>
            </a>
          </div>
        </div>

        {/* Reviews Grid — rotates to a fresh batch every 5 minutes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleReviews.map((post) => (
            <div
              id={`review-card-${post.id}`}
              key={post.id}
              className="relative aspect-square p-5 bg-panel border border-line flex flex-col justify-between text-ink transition-all duration-500 hover:border-accent group"
            >
              {/* Header with name and location */}
              <div className="flex justify-between items-start z-10">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-ink font-bold block">{post.name}</span>
                  <span className="text-[7px] text-muted block">{post.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-accent" title="Pedido entregado">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Quote Review */}
              <div className="z-10 my-auto py-2">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < post.rating ? 'text-accent fill-current' : 'text-line fill-current'}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs font-light text-ink leading-relaxed italic">
                  "{post.review}"
                </p>
                <div className="mt-3 pt-2 border-t border-line text-[8px] text-accent uppercase tracking-wider">
                  FIT: {post.outfit}
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="flex items-center justify-between z-10 border-t border-line pt-2 text-muted font-mono text-[9px]">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3 text-muted" />
                  <span>Vía WhatsApp</span>
                </div>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
