/**
 * Tejiendo Redes — interacciones
 * 1. Menú adaptable (botón hamburguesa accesible)
 * 2. Filtro de servicios por nivel educativo
 * 3. Validación accesible del formulario de contacto (envía por WhatsApp)
 * Sin dependencias externas. Cada módulo se inicializa solo si
 * encuentra sus elementos, así un fallo en uno no rompe los demás.
 */
'use strict';

document.documentElement.classList.replace('no-js', 'js');

/* ---------------------------------------------------------
   1. Menú adaptable
   --------------------------------------------------------- */
function initMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu-principal');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Al elegir un enlace, se cierra el menú (en móvil)
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // Escape cierra el menú y devuelve el foco al botón
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------------------------------------------------------
   2. Filtro de servicios
   --------------------------------------------------------- */
function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#lista-servicios .card');
  const status = document.getElementById('estado-filtro');
  if (!buttons.length || !cards.length) return;

  const applyFilter = (nivel) => {
    let visibles = 0;
    cards.forEach((card) => {
      const niveles = card.dataset.nivel.split(' ');
      const show = nivel === 'todos' || niveles.includes(nivel);
      card.hidden = !show;
      if (show) visibles += 1;
    });
    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === nivel));
    });
    // Anuncio para lectores de pantalla
    if (status) {
      status.textContent = `Mostrando ${visibles} ${visibles === 1 ? 'servicio' : 'servicios'}.`;
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });
}

/* ---------------------------------------------------------
   3. Validación accesible del formulario
   --------------------------------------------------------- */
const MENSAJES = {
  nombre: {
    valueMissing: 'Escribe tu nombre.',
    tooShort: 'El nombre debe tener al menos 3 caracteres.',
  },
  telefono: {
    valueMissing: 'Escribe un número de celular.',
    patternMismatch: 'El celular debe tener 10 dígitos y empezar con 09.',
  },
  servicio: {
    valueMissing: 'Selecciona el servicio que te interesa.',
  },
};

/** Devuelve el mensaje de error de un campo o '' si es válido. */
function getErrorMessage(field) {
  const mensajes = MENSAJES[field.name];
  if (!mensajes || field.validity.valid) return '';
  const tipo = Object.keys(mensajes).find((key) => field.validity[key]);
  return tipo ? mensajes[tipo] : 'Revisa este campo.';
}

/** Muestra u oculta el error de un campo. Devuelve true si es válido. */
function validateField(field) {
  const message = getErrorMessage(field);
  const errorEl = document.getElementById(`${field.id}-error`);
  if (errorEl) errorEl.textContent = message;
  if (message) {
    field.setAttribute('aria-invalid', 'true');
  } else {
    field.removeAttribute('aria-invalid');
  }
  return message === '';
}

const WHATSAPP_NUMERO = '593984712983';

/** Arma el enlace wa.me con los datos del formulario. */
function buildWhatsAppUrl(campos) {
  const lineas = [
    `Hola, soy ${campos.nombre.value.trim()}.`,
    `Me interesa: ${campos.servicio.value}.`,
    `Mi celular: ${campos.telefono.value.trim()}.`,
  ];
  const extra = campos.mensaje.value.trim();
  if (extra) lineas.push(extra);
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(lineas.join('\n'))}`;
}

function initForm() {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  const summary = document.getElementById('resumen-errores');
  const success = document.getElementById('form-exito');
  const fields = Array.from(form.querySelectorAll('input, select'))
    .filter((field) => MENSAJES[field.name]);

  // Valida al salir del campo y vuelve a validar mientras se corrige
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    success.textContent = '';

    const invalid = fields.filter((field) => !validateField(field));

    if (invalid.length) {
      // Resumen con enlaces a cada campo con error; recibe el foco
      const items = invalid
        .map((f) => `<li><a href="#${f.id}">${getErrorMessage(f)}</a></li>`)
        .join('');
      summary.innerHTML = `<strong>Hay ${invalid.length} ${invalid.length === 1 ? 'error' : 'errores'} en el formulario:</strong><ul>${items}</ul>`;
      summary.hidden = false;
      summary.focus();
      return;
    }

    summary.hidden = true;
    summary.innerHTML = '';

    const url = buildWhatsAppUrl(form.elements);
    const nombre = form.elements.nombre.value.trim().split(' ')[0];
    // Si el navegador bloquea la ventana nueva, queda un enlace de respaldo
    success.innerHTML = '';
    success.append(`¡Gracias, ${nombre}! Tu mensaje está listo. `);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Abrir WhatsApp';
    success.append(link);
    window.open(url, '_blank', 'noopener');
    form.reset();
  });
}

initMenu();
initFilter();
initForm();
