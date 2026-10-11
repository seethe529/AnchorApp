import { useContext } from 'react';
import { HeaderHeightContext } from '@react-navigation/elements';

/**
 * Safe replacement for React Navigation's useHeaderHeight.
 *
 * useHeaderHeight() THROWS ("Couldn't find the header height") when a component
 * is rendered outside a navigator screen that has a header — e.g. in unit tests,
 * or if a component is reused in a headerless context. Reading the underlying
 * HeaderHeightContext directly returns `undefined` instead of throwing, which
 * lets us fall back gracefully. This is also Rules-of-Hooks safe (a single
 * unconditional useContext call every render).
 *
 * @param {number} fallback - height to use when no header context is available
 * @returns {number} the header height, or the fallback
 */
export default function useSafeHeaderHeight(fallback = 0) {
  const headerHeight = useContext(HeaderHeightContext);
  return headerHeight ?? fallback;
}
