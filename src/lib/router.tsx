import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

/**
 * Small history router for the site.
 *
 * Every section used to live on one long page. Each one now has its own URL,
 * but the visual system and the section components are shared. This keeps the
 * bundle small and lets a host serve the built index for any page URL.
 */

interface RouteContextValue {
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouteContext = createContext<RouteContextValue | null>(null);

function normalizePath(pathname: string): string {
  if (pathname.length <= 1) return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function readPath(): string {
  return normalizePath(window.location.pathname);
}

/** Scroll after React has committed the page for the new URL. */
function scrollToHash(hash: string) {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'auto' });
    });
  });
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    // A direct load with a hash can arrive before React has rendered the target.
    scrollToHash(window.location.hash);

    const onPopState = () => {
      setPath(readPath());
      scrollToHash(window.location.hash);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const url = new URL(to, window.location.href);

    if (url.origin !== window.location.origin) {
      window.location.assign(url.href);
      return;
    }

    const nextPath = normalizePath(url.pathname);
    const changedPage = nextPath !== readPath();
    const state = options?.replace ? 'replaceState' : 'pushState';
    window.history[state]({}, '', `${url.pathname}${url.search}${url.hash}`);
    setPath(nextPath);

    if (url.hash) scrollToHash(url.hash);
    else if (changedPage) scrollToHash('');
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRoute(): RouteContextValue {
  const context = useContext(RouteContext);
  if (!context) throw new Error('useRoute must be used inside RouterProvider');
  return context;
}

export function useNavigate() {
  return useRoute().navigate;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};

/** Internal navigation without a full reload. External links stay untouched. */
export function Link({ href, onClick, target, download, ...rest }: LinkProps) {
  const { navigate } = useRoute();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === '_blank' ||
      download !== undefined
    ) {
      return;
    }

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(href);
  };

  return <a href={href} target={target} download={download} onClick={handleClick} {...rest} />;
}
