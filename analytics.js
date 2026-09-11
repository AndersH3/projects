/* Privacy-conscious analytics for projects.hellstrom.pw. */
(() => {
  "use strict";

  const GOATCOUNTER_CODE = "miym6tbsng";
  const SITE_PREFIX = "/projects";
  const endpoint = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;

  const pagePath = () => {
    const path = location.pathname || "/";
    return SITE_PREFIX + (path === "/" ? "/" : path);
  };

  window.goatcounter = {
    path: pagePath,
    referrer: () => {
      const params = new URLSearchParams(location.search);
      return (
        params.get("ref") ||
        params.get("utm_campaign") ||
        params.get("utm_source") ||
        document.referrer ||
        undefined
      );
    },
  };

  const tracker = document.createElement("script");
  tracker.async = true;
  tracker.src = "https://gc.zgo.at/count.js";
  tracker.dataset.goatcounter = endpoint;

  tracker.addEventListener("load", () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url;
      try { url = new URL(href, location.href); } catch (_) { return; }

      const isOutbound = url.origin !== location.origin;
      if (!isOutbound || !window.goatcounter || typeof window.goatcounter.count !== "function") return;

      window.goatcounter.count({
        path: `${SITE_PREFIX}/outbound-${url.hostname}`,
        title: (link.textContent || link.getAttribute("aria-label") || href).trim().slice(0, 200),
        event: true,
        no_session: true,
      });
    });
  });

  document.head.appendChild(tracker);
})();
