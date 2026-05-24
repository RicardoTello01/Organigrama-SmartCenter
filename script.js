function getLevelClass(node) {
  const role = normalizeText(node.puesto || '');

  if (role.includes('consejo')) {
    return 'level-1';
  }

  if (role.includes('director de site')) {
    return 'level-2';
  }

  if (
    role.includes('subdireccion') ||
    role.includes('subdirector')
  ) {
    return 'level-3';
  }

  if (
    role.includes('gerente') ||
    role.includes('gerencia')
  ) {
    return 'level-4';
  }

  if (
    role.includes('coordinador') ||
    role.includes('coordinadora')
  ) {
    return 'level-5';
  }

  return 'level-operativo';
}

function getCardWidth() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--card-width')
    .trim();

  return parseInt(value, 10) || 470;
}

function getChildGap() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--child-gap')
    .trim();

  return parseInt(value, 10) || 48;
}

function normalizeText(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderAssets(assets) {
  if (!Array.isArray(assets) || !assets.length) {
    return '<span class="asset-tag is-empty">Activos por definir</span>';
  }

  return assets
    .map(item => `<span class="asset-tag">${escapeHtml(item)}</span>`)
    .join('');
}

function getDirectButton(wrapper) {
  return wrapper.querySelector(':scope > .profile-card .toggle-btn');
}

function getDirectChildren(wrapper) {
  return wrapper.querySelector(':scope > .children-container');
}


function collapseDescendantBranches(container) {
  if (!container) return;

  const openDescendants = [...container.querySelectorAll('.children-container.open')]
    .sort((a, b) => b.querySelectorAll('.children-container.open').length - a.querySelectorAll('.children-container.open').length);

  openDescendants.forEach(childContainer => {
    const childWrapper = childContainer.parentElement;

    if (childWrapper) {
      childWrapper.classList.remove('children-open');
    }

    childContainer.classList.remove('open');
    childContainer.style.maxHeight = '0px';
    childContainer.style.opacity = '0';
    childContainer.style.overflow = 'hidden';
    childContainer.style.visibility = 'hidden';
    childContainer.style.pointerEvents = 'none';

    const button = childWrapper ? getDirectButton(childWrapper) : null;
    if (button) {
      const count = [...childContainer.children]
        .filter(el => el.classList.contains('node-wrapper')).length;
      button.textContent = `Ver equipo (${count})`;
    }
  });
}

function isElementActuallyVisibleInTree(element) {
  if (!element) return false;

  let current = element.parentElement;
  while (current && current.id !== 'org-root') {
    if (current.classList?.contains('children-container') && !current.classList.contains('open')) {
      return false;
    }
    current = current.parentElement;
  }

  return true;
}

function computeFootprint(wrapper) {
  const CARD_WIDTH = getCardWidth();
  const CHILD_GAP = getChildGap();

  const childrenContainer = getDirectChildren(wrapper);
  const isOpen = childrenContainer && childrenContainer.classList.contains('open');

  let footprint = CARD_WIDTH;

  if (childrenContainer && isOpen) {
    const childWrappers = [...childrenContainer.children].filter(el =>
      el.classList.contains('node-wrapper')
    );

    if (childWrappers.length) {
      const childrenWidth =
        childWrappers.reduce((sum, child) => sum + computeFootprint(child), 0) +
        (childWrappers.length - 1) * CHILD_GAP;

      footprint = Math.max(CARD_WIDTH, childrenWidth);
    }
  }

  wrapper.style.setProperty('--footprint', `${footprint}px`);
  return footprint;
}

function relayoutFrom(wrapper) {
  let current = wrapper;

  while (current) {
    computeFootprint(current);

    current =
      current.parentElement?.closest('.node-wrapper');
  }
}

function refreshOpenAncestors(fromElement) {
  let current =
    fromElement?.parentElement?.closest(
      '.children-container.open'
    );

  while (current) {
    current.style.maxHeight = `${current.scrollHeight}px`;

    current =
      current.parentElement?.closest(
        '.children-container.open'
      );
  }
}

function refreshBranchLayout(wrapper) {
  relayoutFrom(wrapper);

  const openContainers = [
    wrapper.querySelector(
      ':scope > .children-container.open'
    ),
    ...wrapper.querySelectorAll('.children-container.open')
  ].filter(Boolean);

  openContainers.forEach(container => {
    container.style.maxHeight = `${container.scrollHeight}px`;
  });

  refreshOpenAncestors(
    wrapper.querySelector(
      ':scope > .children-container.open'
    ) || wrapper
  );
}

function animateChildren(container, wrapper, open) {
  if (!container) return;

  wrapper.classList.toggle('children-open', open);

  container.classList.toggle('open', open);
  trackConnectorsDuringTransition(820);

  if (open) {
    container.style.visibility = 'visible';
    container.style.pointerEvents = 'auto';
    container.style.overflow = 'hidden';
    container.style.maxHeight = '0px';
    container.style.opacity = '0';

    relayoutFrom(wrapper);

    requestAnimationFrame(() => {
      container.style.maxHeight =
        `${container.scrollHeight}px`;

      container.style.opacity = '1';

      refreshOpenAncestors(container);

      relayoutFrom(wrapper);

      requestAnimationFrame(() => {
        refreshBranchLayout(wrapper);
        applyOffsetNivel();
        trackConnectorsDuringTransition(720);
        scheduleOverlayRedraw(120);
      });
    });
  } else {
    // Al cerrar un nodo padre, también se cierran todos sus descendientes.
    // Esto evita que queden contenedores internos con clase .open y que el
    // SVG siga dibujando líneas de ramas que ya no están visibles.
    collapseDescendantBranches(container);

    container.style.overflow = 'hidden';
    container.style.maxHeight =
      `${container.scrollHeight}px`;

    container.style.opacity = '1';

    refreshOpenAncestors(container);

    requestAnimationFrame(() => {
      container.style.maxHeight = '0px';
      container.style.opacity = '0';

      refreshOpenAncestors(container);

      relayoutFrom(wrapper);
      applyOffsetNivel();
      trackConnectorsDuringTransition(760);
      scheduleOverlayRedraw(40);
    });
  }
}


function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getFloatingToolbarHeight() {
  const toolbar = document.querySelector('.toolbar');
  return toolbar ? Math.ceil(toolbar.getBoundingClientRect().height) : 0;
}

let activeAutoScrollAnimation = null;

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getCardTopCenterTarget(wrapper) {
  if (!wrapper) return null;

  const card = wrapper.querySelector(':scope > .profile-card');
  if (!card) return null;

  const rect = card.getBoundingClientRect();
  const doc = document.documentElement;
  const body = document.body;

  const maxLeft = Math.max(0, doc.scrollWidth - window.innerWidth);
  const maxTop = Math.max(0, Math.max(doc.scrollHeight, body.scrollHeight) - window.innerHeight);

  const toolbarHeight = getFloatingToolbarHeight();
  const topPadding = toolbarHeight + 28;

  return {
    left: clampValue(
      window.scrollX + rect.left + (rect.width / 2) - (window.innerWidth / 2),
      0,
      maxLeft
    ),
    top: clampValue(
      window.scrollY + rect.top - topPadding,
      0,
      maxTop
    )
  };
}

function animateWindowScrollTo(getTarget, duration = 1350) {
  if (activeAutoScrollAnimation) {
    cancelAnimationFrame(activeAutoScrollAnimation);
    activeAutoScrollAnimation = null;
  }

  const startLeft = window.scrollX;
  const startTop = window.scrollY;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    const target = getTarget();

    if (!target) return;

    const nextLeft = startLeft + (target.left - startLeft) * eased;
    const nextTop = startTop + (target.top - startTop) * eased;

    window.scrollTo(nextLeft, nextTop);
    scheduleOverlayRedraw(20);

    if (progress < 1) {
      activeAutoScrollAnimation = requestAnimationFrame(step);
    } else {
      activeAutoScrollAnimation = null;
      window.scrollTo(target.left, target.top);
      scheduleOverlayRedraw(80);
    }
  }

  activeAutoScrollAnimation = requestAnimationFrame(step);
}

function scrollCardToTopCenter(wrapper, duration = 1350) {
  animateWindowScrollTo(() => getCardTopCenterTarget(wrapper), duration);
}

function focusExpandedCard(wrapper) {
  // Movimiento más lento y progresivo: el destino se recalcula durante
  // la animación para acompañar el reacomodo del árbol sin saltos bruscos.
  requestAnimationFrame(() => scrollCardToTopCenter(wrapper, 1450));
}

function createNode(node) {
  const wrapper = document.createElement('div');

  wrapper.className = 'node-wrapper';

  if (node.id) {
    wrapper.dataset.nodeId = node.id;
  }
  if (node.offsetNivel && node.offsetNivel > 0) {
    wrapper.classList.add(`offset-nivel-${node.offsetNivel}`);
  }
  if (node.alignTo) {
    wrapper.dataset.alignTo = node.alignTo;
  }

  wrapper.dataset.search = normalizeText(
    [node.nombre, node.puesto, node.area]
      .filter(Boolean)
      .join(' ')
  );

  const card = document.createElement('article');

  const levelClass = getLevelClass(node);

  card.className =
    `profile-card ${levelClass}`;

  const side = document.createElement('div');

  side.className = 'card-side';

  side.innerHTML = `
    <span class="card-accent"></span>

    <div class="photo-glow">
      <img
        class="node-photo"
        src="${escapeHtml(node.foto || PLACEHOLDER_PHOTO)}"
        alt="${escapeHtml(node.nombre || node.puesto || 'Foto')}"
      />
    </div>

    <div class="role-pill">
      ${escapeHtml(node.area || 'Área')}
    </div>
  `;

  const main = document.createElement('div');

  main.className = 'card-main';

  main.innerHTML = `
    <div>
      <h3 class="node-name">
        ${escapeHtml(node.nombre || 'Sin nombre')}
      </h3>

      <p class="node-role">
        ${escapeHtml(node.puesto || 'Sin puesto')}
      </p>
    </div>

    <button class="description-toggle" type="button">
      Descripción
    </button>

    <div class="card-description is-collapsed">
      ${escapeHtml(node.descripcion || 'Agregar descripción del puesto.')}
    </div>

    <div class="asset-tags">
      ${renderAssets(node.activos)}
    </div>

    <div class="card-meta">
      <span class="meta-item">
        <span class="meta-icon">✉</span>
        <span>
          ${escapeHtml(node.contactos?.correo || 'Por definir')}
        </span>
      </span>

      <span class="meta-item">
        <span class="meta-icon">☎</span>
        <span>
          ${escapeHtml(node.contactos?.telefono || 'Por definir')}
        </span>
      </span>

      <span class="meta-item salary-item">
        <span class="salary-currency">$</span>

        <span class="node-salary is-hidden">
          ${escapeHtml(node.sueldo || 'Por definir')}
        </span>

        <button
          class="salary-toggle"
          type="button"
          aria-label="Mostrar u ocultar sueldo"
        >
          👁
        </button>
      </span>
    </div>
  `;

  const footer = document.createElement('div');

  footer.className = 'node-footer';

  const childrenContainer =
    document.createElement('div');

  childrenContainer.className =
    'children-container';

  if (
    Array.isArray(node.hijos) &&
    node.hijos.length
  ) {
    wrapper.classList.add('has-children');

    const toggleBtn =
      document.createElement('button');

    toggleBtn.className = 'toggle-btn';

    const syncState = open => {
      animateChildren(
        childrenContainer,
        wrapper,
        open
      );

      toggleBtn.textContent = open
        ? `Ocultar equipo (${node.hijos.length})`
        : `Ver equipo (${node.hijos.length})`;
    };

    node.hijos.forEach(child => {
      childrenContainer.appendChild(
        createNode(child)
      );
    });

    syncState(Boolean(node.expanded));

    toggleBtn.addEventListener('click', () => {
      const willOpen = !childrenContainer.classList.contains(
        'open'
      );

      syncState(willOpen);

      if (willOpen) {
        focusExpandedCard(wrapper);
      }

      trackConnectorsDuringTransition(900);
      setTimeout(() => {
        applyOffsetNivel();
        refreshAllOpenContainers();
        redrawOverlay();

        if (willOpen) {
          focusExpandedCard(wrapper);
        }
      }, 620);
    });

    footer.appendChild(toggleBtn);
  }

  const salaryToggle =
    main.querySelector('.salary-toggle');

  const salaryValue =
    main.querySelector('.node-salary');

  const descriptionToggle =
  main.querySelector('.description-toggle');

  const descriptionBox =
  main.querySelector('.card-description');

  descriptionToggle.addEventListener('click', () => {
    descriptionBox.classList.toggle('is-collapsed');

    descriptionToggle.textContent =
      descriptionBox.classList.contains('is-collapsed')
        ? 'Descripción'
        : 'Ocultar descripción';

    const wrapper = descriptionToggle.closest('.node-wrapper');

    if (wrapper) {
      // La descripción cambia la altura de la tarjeta. Redibujamos durante
      // toda la transición para que las líneas bajen/suban suavemente junto
      // con los hijos, sin desaparecer ni reaparecer de golpe.
      trackConnectorsDuringTransition(920);
      trackCardResizeLayout(wrapper, 920);
    }
  });

  salaryToggle.addEventListener('click', () => {
    salaryValue.classList.toggle('is-hidden');

    salaryToggle.textContent =
      salaryValue.classList.contains('is-hidden')
        ? '👁'
        : '🙈';
  });

  card.appendChild(side);

  card.appendChild(main);

  if (footer.children.length) {
    main.appendChild(footer);
  }

  wrapper.appendChild(card);

  if (childrenContainer.children.length) {
    wrapper.appendChild(childrenContainer);
  }

  return wrapper;
}

// ── Offset connector overlay ────────────────────────────────────────────────
// A single SVG that lives inside #org-root and redraws all offset-nivel
// connector lines on demand. It fades out lines for collapsed branches and
// redraws/fades them in for open ones.
// ────────────────────────────────────────────────────────────────────────────

let _overlayScheduled = false;
let _connectorAnimationFrame = null;
let _connectorAnimationUntil = 0;

function getOrCreateOverlay() {
  const root = document.getElementById('org-root');
  let svg = root.querySelector(':scope > .org-connector-overlay');

  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('org-connector-overlay');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.id = 'cleanConnectorGradient';
    grad.setAttribute('x1', '0');
    grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0');
    grad.setAttribute('y2', '1');

    const s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    s1.setAttribute('offset', '0%');
    s1.setAttribute('stop-color', 'rgba(91,224,255,0.9)');

    const s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    s2.setAttribute('offset', '100%');
    s2.setAttribute('stop-color', 'rgba(91,224,255,0.25)');

    grad.appendChild(s1);
    grad.appendChild(s2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    root.style.position = 'relative';
    root.insertBefore(svg, root.firstChild);
  }

  return svg;
}

function svgLinePath(points) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`)
    .join(' ');
}

function addPath(svg, d, opacity = '0.9') {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#5be0ff');
  path.setAttribute('stroke-opacity', opacity);
  path.setAttribute('stroke-width', '2.2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
}

function addDot(svg, x, y) {
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.setAttribute('cx', x);
  dot.setAttribute('cy', y);
  dot.setAttribute('r', '3.5');
  dot.setAttribute('fill', '#5be0ff');
  svg.appendChild(dot);
}

function redrawOverlay() {
  const svg = getOrCreateOverlay();

  // On mobile: hide overlay and skip drawing — no offsets active
  if (isMobileView()) {
    svg.style.display = 'none';
    return;
  }
  svg.style.display = '';

  const rootEl = document.getElementById('org-root');
  const rootRect = rootEl.getBoundingClientRect();

  // El SVG debe cubrir el área real desplazable del organigrama, no solo
  // el viewport visible. Sin estas medidas, algunos navegadores dejan el
  // overlay en 0px/100% del contenedor y las líneas desaparecen.
  const width = Math.max(rootEl.scrollWidth, rootEl.offsetWidth, Math.ceil(rootRect.width));
  const height = Math.max(rootEl.scrollHeight, rootEl.offsetHeight, Math.ceil(rootRect.height));
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.style.width = `${width}px`;
  svg.style.height = `${height}px`;

  Array.from(svg.children).forEach(child => {
    if (child.tagName.toLowerCase() !== 'defs') child.remove();
  });

  document.querySelectorAll('.children-container.open').forEach(container => {
    if (!isElementActuallyVisibleInTree(container)) return;

    const parentWrapper = container.parentElement;
    const parentCard = parentWrapper?.querySelector(':scope > .profile-card');
    if (!parentCard) return;

    const childCards = [...container.children]
      .filter(child => child.classList.contains('node-wrapper') && !child.classList.contains('hidden-by-search'))
      .map(child => child.querySelector(':scope > .profile-card'))
      .filter(Boolean);

    if (!childCards.length) return;

    const parentRect = parentCard.getBoundingClientRect();
    const childRects = childCards.map(card => card.getBoundingClientRect());

    const parentX = parentRect.left + parentRect.width / 2 - rootRect.left;
    const parentY = parentRect.bottom - rootRect.top;

    const childPoints = childRects.map(rect => ({
      x: rect.left + rect.width / 2 - rootRect.left,
      y: rect.top - rootRect.top
    }));

    const minChildTop = Math.min(...childPoints.map(p => p.y));
    const busY = Math.max(parentY + 24, minChildTop - 20);

    // Troncal padre → carril superior de hijos.
    addPath(svg, svgLinePath([[parentX, parentY], [parentX, busY]]));

    // Barra horizontal única por cada grupo de hijos. Esta se coloca arriba de
    // las tarjetas, no sobre ellas, para evitar cruces visuales.
    if (childPoints.length > 1) {
      const xs = childPoints.map(p => p.x);
      addPath(svg, svgLinePath([[Math.min(...xs), busY], [Math.max(...xs), busY]]));
    }

    // Bajantes independientes hacia cada tarjeta. Siempre terminan en el borde
    // superior de la tarjeta, por lo que no atraviesan el cuerpo de la tarjeta.
    childPoints.forEach(point => {
      addPath(svg, svgLinePath([[point.x, busY], [point.x, point.y]]));
      addDot(svg, point.x, point.y);
    });
  });
}

function trackConnectorsDuringTransition(duration = 760) {
  // Redibuja los conectores en cada frame mientras las tarjetas se mueven.
  // Así las líneas acompañan la animación del layout y no aparecen de golpe
  // cuando las tarjetas ya terminaron de desplazarse.
  _connectorAnimationUntil = Math.max(
    _connectorAnimationUntil,
    performance.now() + duration
  );

  if (_connectorAnimationFrame) return;

  const tick = () => {
    redrawOverlay();

    if (performance.now() < _connectorAnimationUntil) {
      _connectorAnimationFrame = requestAnimationFrame(tick);
    } else {
      _connectorAnimationFrame = null;
      redrawOverlay();
    }
  };

  _connectorAnimationFrame = requestAnimationFrame(tick);
}

function scheduleOverlayRedraw(delay = 60) {
  if (_overlayScheduled) return;
  _overlayScheduled = true;
  setTimeout(() => {
    _overlayScheduled = false;
    redrawOverlay();
  }, delay);
}


function trackCardResizeLayout(wrapper, duration = 820) {
  // Mantiene las líneas sincronizadas cuando cambia la altura de una tarjeta
  // (por ejemplo al abrir/cerrar "Descripción"). Sin esto, el SVG conserva
  // por unos frames la posición anterior y después salta a la nueva.
  const startedAt = performance.now();

  const tick = () => {
    if (wrapper) {
      relayoutFrom(wrapper);
      refreshOpenAncestors(wrapper);
      refreshAllOpenContainers();
      applyOffsetNivel();
    }

    redrawOverlay();

    if (performance.now() - startedAt < duration) {
      requestAnimationFrame(tick);
    } else {
      if (wrapper) {
        refreshBranchLayout(wrapper);
        applyOffsetNivel();
      }
      redrawOverlay();
    }
  };

  requestAnimationFrame(tick);
}

// ── Offset nivel system ───────────────────────────────────────────────────
// Nodes with class offset-nivel-1 (set via data-node-id lookup) are pushed
// down so their card top aligns with a target reference node's card bottom.
//
// Two modes (set via data.js node fields, stored as data-* on the wrapper):
//   offsetNivel:1            → push below tallest sibling card in same container
//   offsetNivel:1, alignTo:"some-id" → push until card top >= reference card bottom
//
// IMPORTANT: only node-wrapper margin-top is ever modified. children-container
// styles are never touched, avoiding infinite transitionend loops.
// ─────────────────────────────────────────────────────────────────────────


function refreshAllOpenContainers() {
  const openContainers = [...document.querySelectorAll('.children-container.open')];

  // Refresh from the deepest branch to the root so parent scrollHeight
  // already includes the final height of its descendants.
  openContainers
    .sort((a, b) => b.querySelectorAll('.children-container.open').length - a.querySelectorAll('.children-container.open').length)
    .forEach(container => {
      container.style.maxHeight = `${container.scrollHeight}px`;
    });
}

function isMobileView() {
  return window.innerWidth <= 760;
}

function applyOffsetNivel() {
  // ══════════════════════════════════════════════════════════════════════════
  // UNIFIED OFFSET SYSTEM
  //
  // Two types of nodes are handled:
  //
  //  A) offset-nivel-N (no data-align-to)
  //     Pushed down N × (ref card height + SPACING) within their container.
  //     Ref card = tallest sibling card with no offset-nivel-* class,
  //     or the parent card if all siblings are offset nodes.
  //
  //  B) data-align-to="<id>"  (may also have offset-nivel-N as a first nudge)
  //     After Phase A nudge, card top is aligned to the BOTTOM of the target
  //     card. Measurement uses getBoundingClientRect so it is pixel-perfect.
  //     Because the target may not be expanded, we temporarily force-show it
  //     for measurement then restore its state.
  //
  // Order: reset ALL → Phase A (sorted by level) → Phase B.
  // No loops: margin-top is set once per pass; transitionend only fires on
  // children-container max-height, never on node-wrapper margin-top.
  // ══════════════════════════════════════════════════════════════════════════

  const SPACING = 44 + 38 + 18; // cc margin-top + cc padding-top + nw margin

  // ── Reset ────────────────────────────────────────────────────────────────
  document.querySelectorAll(
    '.node-wrapper[class*="offset-nivel-"], .node-wrapper[data-align-to]'
  ).forEach(n => { n.style.marginTop = ''; });

  // ── Mobile guard: skip all offset calculations on small screens ──────────
  // On mobile, flex-wrap stacks cards vertically — manual margin-top offsets
  // would overlap cards. Let the natural flex flow handle layout instead.
  if (isMobileView()) {
    scheduleOverlayRedraw(80);
    return;
  }

  // ── Phase A ──────────────────────────────────────────────────────────────
  const allOffsetNodes = Array.from(
    document.querySelectorAll('.node-wrapper[class*="offset-nivel-"]')
  ).map(el => {
    const lvl = [...el.classList]
      .map(c => { const m = c.match(/^offset-nivel-(\d+)$/); return m ? +m[1] : 0; })
      .find(n => n > 0) || 0;
    return { el, lvl };
  }).sort((a, b) => a.lvl - b.lvl);

  allOffsetNodes.forEach(({ el: node, lvl }) => {
    const container = node.parentElement;
    if (!container) return;

    const refSiblings = Array.from(container.children).filter(s => {
      if (!s.classList.contains('node-wrapper')) return false;
      return ![...s.classList].some(c => /^offset-nivel-\d+$/.test(c));
    });

    let refH;
    if (refSiblings.length) {
      refH = refSiblings.reduce((max, s) => {
        const card = s.querySelector(':scope > .profile-card');
        return Math.max(max, card ? card.getBoundingClientRect().height : 288);
      }, 0);
    } else {
      const parentCard = container.closest('.node-wrapper')
        ?.querySelector(':scope > .profile-card');
      refH = parentCard ? parentCard.getBoundingClientRect().height : 288;
    }

    node.style.marginTop = `${(refH + SPACING) * lvl}px`;
  });

  // ── Phase B ──────────────────────────────────────────────────────────────
  // Run after a paint so Phase A margins are reflected in layout geometry.
  requestAnimationFrame(() => {
    document.querySelectorAll('.node-wrapper[data-align-to]').forEach(alignNode => {
      const targetId = alignNode.dataset.alignTo;
      const targetWrapper = document.querySelector(
        `.node-wrapper[data-node-id="${targetId}"]`
      );
      if (!targetWrapper) return;

      const targetCard = targetWrapper.querySelector(':scope > .profile-card');
      const myCard     = alignNode.querySelector(':scope > .profile-card');
      if (!targetCard || !myCard) return;

      // If the target is inside a collapsed container, temporarily make it
      // layout-visible (visibility:hidden keeps it out of flow minimally).
      const closedContainers = [];
      let cur = targetCard.parentElement;
      while (cur) {
        if (cur.classList.contains('children-container') &&
            !cur.classList.contains('open')) {
          closedContainers.push({ el: cur, prev: cur.style.cssText });
          cur.style.maxHeight = '99999px';
          cur.style.overflow  = 'visible';
          cur.style.opacity   = '0';
        }
        cur = cur.parentElement;
      }

      const targetBottom = targetCard.getBoundingClientRect().bottom;
      const myTop        = myCard.getBoundingClientRect().top;
      const delta        = targetBottom - myTop;

      // Restore closed containers
      closedContainers.forEach(({ el, prev }) => { el.style.cssText = prev; });

      if (delta > 1) {
        const curMt = parseFloat(alignNode.style.marginTop) || 0;
        alignNode.style.marginTop = `${Math.max(0, curMt + delta)}px`;
      }
    });

    refreshAllOpenContainers();
    scheduleOverlayRedraw(80);
  });

  refreshAllOpenContainers();
}

function renderTree(data) {
  const root =
    document.getElementById('org-root');

  root.innerHTML = '';

  const tree = document.createElement('div');

  tree.className = 'org-tree';

  const rootNode = createNode(data);

  tree.appendChild(rootNode);

  root.appendChild(tree);

  computeFootprint(rootNode);

  requestAnimationFrame(() => {
    refreshBranchLayout(rootNode);
    applyOffsetNivel();
    scheduleOverlayRedraw(120);
  });
}

function setAllExpanded(expanded) {
  document
    .querySelectorAll('.children-container')
    .forEach(container => {
      const wrapper =
        container.parentElement;

      animateChildren(
        container,
        wrapper,
        expanded
      );

      const button =
        getDirectButton(wrapper);

      if (button) {
        const count =
          container.children.length;

        button.textContent = expanded
          ? `Ocultar equipo (${count})`
          : `Ver equipo (${count})`;
      }
    });

  const rootNode =
    document.querySelector(
      '.org-tree > .node-wrapper'
    );

  if (rootNode) {
    computeFootprint(rootNode);

    requestAnimationFrame(() => {
      refreshBranchLayout(rootNode);
      applyOffsetNivel();
      scheduleOverlayRedraw(140);
    });
  }
}

function applySearch(term) {
  const query = normalizeText(term);
  const allNodes = [...document.querySelectorAll('.node-wrapper')];

  function closeContainerInstant(container) {
    if (!container) return;

    const wrapper = container.parentElement;

    wrapper.classList.remove('children-open');
    container.classList.remove('open');

    container.style.maxHeight = '0px';
    container.style.opacity = '0';
    container.style.overflow = 'hidden';
    container.style.visibility = 'hidden';
    container.style.pointerEvents = 'none';

    const button = getDirectButton(wrapper);
    if (button) {
      button.textContent = `Ver equipo (${container.children.length})`;
    }
  }

  function openContainerInstant(container) {
    if (!container) return;

    const wrapper = container.parentElement;

    wrapper.classList.add('children-open');
    container.classList.add('open');

    container.style.visibility = 'visible';
    container.style.pointerEvents = 'auto';
    container.style.opacity = '1';
    container.style.maxHeight = `${container.scrollHeight}px`;
    container.style.overflow = 'visible';

    const button = getDirectButton(wrapper);
    if (button) {
      button.textContent = `Ocultar equipo (${container.children.length})`;
    }
  }

  allNodes.forEach(node => {
    const card = node.querySelector(':scope > .profile-card');

    node.classList.remove('hidden-by-search');

    if (card) {
      card.classList.remove('match');
    }

    const childrenContainer = node.querySelector(':scope > .children-container');
    closeContainerInstant(childrenContainer);
  });

  if (!query) {
    const rootNode = document.querySelector('.org-tree > .node-wrapper');

    if (rootNode) {
      computeFootprint(rootNode);
      refreshBranchLayout(rootNode);
    }

    return;
  }

  allNodes.forEach(node => {
    node.classList.add('hidden-by-search');
  });

  allNodes.forEach(node => {
    const isMatch = node.dataset.search.includes(query);

    if (!isMatch) return;

    node.classList.remove('hidden-by-search');

    const card = node.querySelector(':scope > .profile-card');

    if (card) {
      card.classList.add('match');
    }

    let parent = node.parentElement?.closest('.node-wrapper');

    while (parent) {
      parent.classList.remove('hidden-by-search');

      const childrenContainer = parent.querySelector(':scope > .children-container');

      openContainerInstant(childrenContainer);

      parent = parent.parentElement?.closest('.node-wrapper');
    }
  });

  const rootNode = document.querySelector('.org-tree > .node-wrapper');

  if (rootNode) {
    computeFootprint(rootNode);
    refreshBranchLayout(rootNode);
  }
}

renderTree(orgData);

const orgRoot =
  document.getElementById('org-root');

orgRoot.addEventListener(
  'transitionend',
  event => {
    if (
      !event.target.classList.contains(
        'children-container'
      )
    ) {
      return;
    }

    const container = event.target;

    const wrapper =
      container.parentElement;

    if (event.propertyName === 'max-height') {
      if (
        container.classList.contains('open')
      ) {
        container.style.maxHeight =
          `${container.scrollHeight}px`;
        container.style.overflow = 'visible';

        refreshOpenAncestors(container);
        refreshAllOpenContainers();

        refreshBranchLayout(wrapper);
      } else {
        container.style.visibility = 'hidden';
        container.style.pointerEvents = 'none';
        scheduleOverlayRedraw(20);
      }

      relayoutFrom(wrapper);
    }
  }
);

window.addEventListener('resize', () => {
  const rootNode =
    document.querySelector(
      '.org-tree > .node-wrapper'
    );

  if (rootNode) {
    computeFootprint(rootNode);

    refreshBranchLayout(rootNode);
  }
});

document
  .getElementById('expandAllBtn')
  .addEventListener('click', () => {
    setAllExpanded(true);
    setTimeout(applyOffsetNivel, 620);
  });

document
  .getElementById('collapseAllBtn')
  .addEventListener('click', () => {
    setAllExpanded(false);
    setTimeout(applyOffsetNivel, 620);
  });

document
  .getElementById('searchInput')
  .addEventListener('input', e =>
    applySearch(e.target.value)
  );

// Redraw overlay on resize — also handles mobile/desktop breakpoint crossing
let _lastWasMobile = isMobileView();
window.addEventListener('resize', () => {
  clearTimeout(window._offsetResizeTimer);
  window._offsetResizeTimer = setTimeout(() => {
    const nowMobile = isMobileView();
    // Always re-apply: either recalculate offsets (desktop) or reset them (mobile)
    applyOffsetNivel();
    _lastWasMobile = nowMobile;
  }, 150);
});

// Redraw overlay after every expand/collapse transition completes.
// Using 'max-height' on children-container is the canonical signal that
// the layout has settled — works for individual toggles AND expand/collapse-all.
document.getElementById('org-root').addEventListener('transitionend', e => {
  // Only react to children-container max-height transitions (expand/collapse toggles).
  // margin-top transitions on node-wrapper cards are NOT re-triggers.
  if (e.target.classList.contains('children-container') && e.propertyName === 'max-height') {
    scheduleOverlayRedraw(50);
    // Re-apply offsets once layout has settled after the toggle
    applyOffsetNivel();
  }
});