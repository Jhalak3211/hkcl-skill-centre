import { useEffect } from 'react';
import { siteConfig } from '../data/siteConfig.js';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Sets the page title, description, canonical URL and Open Graph tags.
 * Updates existing tags from index.html instead of adding duplicates.
 * Renders nothing.
 */
export default function Seo({ title, description, path = '/', noindex = false }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${siteConfig.name}`
      : `${siteConfig.name} | ${siteConfig.tagline}`;
    const desc = description ?? siteConfig.description;
    const url = `${siteConfig.siteUrl.replace(/\/$/, '')}${path === '/' ? '/' : path}`;

    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setCanonical(url);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
  }, [title, description, path, noindex]);

  return null;
}
