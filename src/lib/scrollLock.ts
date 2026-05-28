// Scroll lock without layout shift.
//
// The page keeps a permanent scrollbar (`html { overflow-y: scroll }`), so
// the scrollport width is constant during normal browsing. When something
// needs to lock scrolling (mega menu, preloader) it sets `overflow: hidden`,
// which removes that scrollbar and would free its width — shifting the whole
// page sideways. To prevent that we measure the scrollbar width *before*
// hiding it and add an equal `padding-right`, so the content box never
// changes width. Reference-counted so nested locks stay balanced.

let locks = 0;
let prevOverflow = '';
let prevPaddingRight = '';

export function lockScroll() {
  if (locks === 0 && typeof document !== 'undefined') {
    const el = document.documentElement;
    // measure while the scrollbar is still present
    const scrollbarWidth = window.innerWidth - el.clientWidth;
    prevOverflow = el.style.overflow;
    prevPaddingRight = el.style.paddingRight;
    el.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      el.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  locks += 1;
}

export function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks === 0 && typeof document !== 'undefined') {
    const el = document.documentElement;
    el.style.overflow = prevOverflow;
    el.style.paddingRight = prevPaddingRight;
  }
}
