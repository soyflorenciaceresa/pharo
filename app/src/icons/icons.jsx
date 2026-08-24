// Approximations of Bootstrap Icons (bi-*), matching the shapes built in
// Figma's "Sidebar final" page. Each element carries its own fill/stroke —
// "currentColor" for the icon color, "var(--bg)" for cutout details so they
// blend with whatever background token a consumer binds "--bg" to.
export const ICONS = {
  'bi-cart': '<circle cx="4.8" cy="13.8" r="1.3" fill="currentColor"/><circle cx="10.8" cy="13.8" r="1.3" fill="currentColor"/><path d="M1 2L3 2L5 10L13 10L15 4L4.5 4L4.5 3L1 3Z" fill="currentColor"/>',
  'bi-pin-angle': '<path d="M6.5 2.5L9.5 5.5L8.5 8.5L11 11L10 12L7.5 9.5L4.5 10.5L4 10L5 7L2.5 4.5L3.5 3.5Z" fill="none" stroke="currentColor" stroke-width="1"/><path d="M4 10L2 13.5" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>',
  'bi-pin-fill': '<path d="M6.5 2.5L9.5 5.5L8.5 8.5L11 11L10 12L7.5 9.5L4.5 10.5L4 10L5 7L2.5 4.5L3.5 3.5Z" fill="currentColor"/><path d="M4 10L2 13.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
  'bi-archive-fill': '<rect x="1" y="2" width="14" height="3" rx="0.5" fill="currentColor"/><path d="M2 5L14 5L14 12.5L2 12.5Z" fill="currentColor"/><rect x="6" y="8" width="4" height="1" rx="0.5" fill="var(--bg)"/>',
  'bi-grid-1x2-fill': '<rect x="1" y="2" width="6" height="12" rx="1" fill="currentColor"/><rect x="9" y="2" width="6" height="12" rx="1" fill="currentColor"/>',
  'bi-building': '<rect x="3" y="1.5" width="10" height="13" rx="0.5" fill="currentColor"/><rect x="4.5" y="3.2" width="1.5" height="1.5" fill="var(--bg)"/><rect x="7" y="3.2" width="1.5" height="1.5" fill="var(--bg)"/><rect x="9.5" y="3.2" width="1.5" height="1.5" fill="var(--bg)"/><rect x="4.5" y="6.2" width="1.5" height="1.5" fill="var(--bg)"/><rect x="7" y="6.2" width="1.5" height="1.5" fill="var(--bg)"/><rect x="9.5" y="6.2" width="1.5" height="1.5" fill="var(--bg)"/><rect x="4.5" y="9.2" width="1.5" height="1.5" fill="var(--bg)"/><rect x="7" y="9.2" width="1.5" height="1.5" fill="var(--bg)"/><rect x="9.5" y="9.2" width="1.5" height="1.5" fill="var(--bg)"/><rect x="6.3" y="11.5" width="2.4" height="3" fill="var(--bg)"/>',
  'bi-box-seam': '<path d="M8 1L14.5 4L14.5 12L8 15L1.5 12L1.5 4Z" fill="currentColor"/><rect x="1.5" y="4" width="13" height="1.1" fill="var(--bg)"/><rect x="7.45" y="4" width="1.1" height="11" fill="var(--bg)"/>',
  'bi-house-door': '<path d="M8 1.5L15 7.5L13 7.5L13 9L3 9L3 7.5L1 7.5Z" fill="currentColor"/><rect x="3" y="9" width="10" height="5.5" fill="currentColor"/><rect x="6.7" y="10.5" width="2.6" height="4" fill="var(--bg)"/>',
  'bi-receipt': '<path d="M2 1L14 1L14 15L12.5 13.5L11 15L9.5 13.5L8 15L6.5 13.5L5 15L3.5 13.5L2 15Z" fill="currentColor"/><rect x="4" y="4" width="8" height="1" fill="var(--bg)"/><rect x="4" y="6.5" width="8" height="1" fill="var(--bg)"/><rect x="4" y="9" width="8" height="1" fill="var(--bg)"/>',
  'bi-inbox': '<path d="M2 3L6 3L7 6L9 6L10 3L14 3L15 8L15 12.5L1 12.5L1 8Z" fill="currentColor"/><rect x="7" y="6.4" width="2" height="1.2" fill="var(--bg)"/>',
  'bi-file-earmark-text': '<path d="M3 1L10 1L14 5L14 15L3 15Z" fill="currentColor"/><path d="M10 1L14 5L10 5Z" fill="var(--bg)"/><rect x="5" y="8" width="6" height="1" fill="var(--bg)"/><rect x="5" y="10.5" width="6" height="1" fill="var(--bg)"/><rect x="5" y="13" width="6" height="1" fill="var(--bg)"/>',
  'bi-box-arrow-up-right': '<path d="M3 6L3 13L10 13L10 9" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 2L13 2L13 8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 9.5L13 3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
  'bi-chevron-right': '<path d="M5 3L10.5 8L5 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  'bi-chevron-left': '<path d="M11 3L5.5 8L11 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  'bi-box-arrow-right': '<path d="M8 2.5L4 2.5L4 13.5L8 13.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 8L14 8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M11 5L14 8L11 11" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>',
  'bi-person-badge': '<rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.2"/><ellipse cx="8" cy="6.2" rx="1.7" ry="1.7" fill="currentColor"/><path d="M4.5 12C4.5 9.5 6 8.5 8 8.5C10 8.5 11.5 9.5 11.5 12Z" fill="currentColor"/>',
  // Not a Bootstrap icon — custom glyph from Figma ("App"), used as the
  // default badge icon for CardQuickAccess/CardModule when no icon prop is given.
  'app-window': '<rect x="3" y="3" width="10" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/>',
};

export function Icon({ name, size = 16, className }) {
  const markup = ICONS[name] || '';
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
