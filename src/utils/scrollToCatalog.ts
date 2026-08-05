export function scrollToCatalog() {
  const section = document.getElementById('catalog-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
