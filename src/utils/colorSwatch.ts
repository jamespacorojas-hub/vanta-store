// Spanish garment color name -> real hex value (shared by the color roulette and the detail modal's live simulator)
export const COLOR_HEX: Record<string, string> = {
  Azul: '#1e3a8a',
  Beige: '#d7ccc8',
  Botella: '#1b4332',
  Cemento: '#a1a1aa',
  Denim: '#4b5563',
  'Melange Oscuro': '#3f3f46',
  Negro: '#18181b',
  Pacay: '#2d5a27',
  'Palo Rosa': '#e8a5b8',
  Perla: '#f0efe9',
  Vino: '#581c24',
  Marrón: '#5c4033',
  Camote: '#b35d38',
  Topo: '#7e7c73',
  Plomo: '#71717a',
  Blanco: '#ffffff',
  Gris: '#cccccc',
  Lila: '#c8b6e2',
  Morado: '#5b3a8e',
};

export const LIGHT_COLOR_NAMES = ['Blanco', 'Perla', 'Beige', 'Gris'];

// Spanish garment color name -> real-color swatch classes (shared by all product card variants)
export function getColorClass(colorName: string): string {
  switch (colorName) {
    case 'Negro': return 'bg-zinc-900 border-zinc-700';
    case 'Blanco': return 'bg-zinc-50 border-zinc-200 text-zinc-800';
    case 'Azul': return 'bg-blue-950 border-blue-800';
    case 'Beige': return 'bg-[#eae3d2] border-[#d4caa8] text-zinc-800';
    case 'Botella': return 'bg-[#1b4332] border-[#2d6a4f]';
    case 'Cemento': return 'bg-zinc-400 border-zinc-500 text-zinc-900';
    case 'Denim': return 'bg-slate-600 border-slate-700';
    case 'Melange Oscuro': return 'bg-zinc-800 border-zinc-700';
    case 'Pacay': return 'bg-[#386641] border-[#6a994e]';
    case 'Palo Rosa': return 'bg-[#fbc4ab] border-[#f08080] text-zinc-900';
    case 'Perla': return 'bg-[#f0f0f5] border-[#d3d3e3] text-zinc-800';
    case 'Vino': return 'bg-[#5c0612] border-[#7d0b1a]';
    case 'Marrón': return 'bg-[#4e342e] border-[#5d4037]';
    case 'Camote': return 'bg-[#a04000] border-[#ba4a00]';
    case 'Topo': return 'bg-[#8d8c82] border-[#a09e95]';
    case 'Plomo': return 'bg-zinc-500 border-zinc-600';
    case 'Gris': return 'bg-zinc-300 border-zinc-400 text-zinc-900';
    case 'Lila': return 'bg-[#c8b6e2] border-[#b39ddb] text-zinc-900';
    case 'Morado': return 'bg-[#5b3a8e] border-[#4527a0]';
    default: return 'bg-zinc-900 border-zinc-800';
  }
}
