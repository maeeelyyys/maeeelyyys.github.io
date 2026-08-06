// Mark JS as running — CSS only hides .reveal elements when this class
// is present, so a script error never leaves content permanently hidden.
document.documentElement.classList.add('js');

// Always start at the top of the page on a fresh load — stops the browser
// from restoring a previous scroll position or jumping to a stray #hash.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));

// Scroll-reveal for elements with the .reveal class
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal');

  // Safety net: if something goes wrong with the observer below, force
  // everything visible after 2s instead of leaving it hidden forever.
  const forceRevealTimeout = setTimeout(() => {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }, 2000);

  const revealObserver = new IntersectionObserver(
    (entries) => {
      clearTimeout(forceRevealTimeout);
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // Stagger children inside grids/timelines that carry [data-stagger]
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 90}ms`;
    });
  });

  // Flip project cards on click / Enter / Space
  document.querySelectorAll('.project-card:not(.is-placeholder)').forEach((card) => {
    const toggle = () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    };
    card.addEventListener('click', toggle);
    card.querySelectorAll('.card-link').forEach((link) => {
      link.addEventListener('click', (e) => e.stopPropagation());
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Lightbox — click a project screenshot to see it enlarged, centered
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  };

  document.querySelectorAll('.shot-placeholder img').forEach((img) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // don't also flip the card back over
      openLightbox(img.src, img.alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox(); // click on the dark backdrop
  });

  // Embed modal — for Canva presentations / other iframe demos
  const embedModal = document.getElementById('embed-modal');
  const embedPanel = document.getElementById('embed-modal-panel');
  const embedModalClose = document.getElementById('embed-modal-close');

  const openEmbedModal = (templateId) => {
    const template = document.getElementById(templateId);
    if (!template) return;
    embedPanel.innerHTML = '';
    embedPanel.appendChild(template.content.cloneNode(true));
    embedModal.classList.add('is-open');
    embedModal.setAttribute('aria-hidden', 'false');
  };

  const closeEmbedModal = () => {
    embedModal.classList.remove('is-open');
    embedModal.setAttribute('aria-hidden', 'true');
    embedPanel.innerHTML = ''; // stop the iframe/video once closed
  };

  document.querySelectorAll('[data-embed]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation(); // don't also flip the card back over
      openEmbedModal(`embed-${trigger.dataset.embed}`);
    });
  });

  embedModalClose.addEventListener('click', closeEmbedModal);
  embedModal.addEventListener('click', (e) => {
    if (e.target === embedModal) closeEmbedModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeEmbedModal();
    }
  });

  // Highlight the active nav link based on which section is in view
  const navLinks = document.querySelectorAll('nav ul li a');
  const sections = document.querySelectorAll('main section[id], .name[id], footer[id]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));
});