import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const observeAll = () => {
      // Find stagger children
      document.querySelectorAll('.reveal-stagger').forEach((container) => {
        Array.from(container.children).forEach((child) => {
          if (!child.classList.contains('reveal')) {
            child.classList.add('reveal');
          }
        });
      });

      // Observe all reveal elements that are not yet visible
      document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)').forEach((el) => {
        obs.observe(el);
      });
    };

    observeAll();

    // Listen for tab changes or dynamic DOM updates
    const mutObs = new MutationObserver(() => {
      observeAll();
    });

    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      mutObs.disconnect();
    };
  }, []);
}
