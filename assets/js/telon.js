/* Big Rhino · telón entre páginas
   Al pulsar un enlace a otra página de la web sube un telón negro con el escudo;
   en la página nueva el telón se retira. Se carga en el <head> (sin defer) para
   que la página nueva empiece ya tapada y no se vea un parpadeo.
   - Nunca con «reducir movimiento».
   - Solo enlaces internos a otra página (no anclas de la misma página, ni enlaces
     externos, ni tel:/mailto:, ni pestañas nuevas, ni clic con Cmd/Ctrl).
   - Si algo falla, el CSS retira el telón solo: nunca deja la página tapada. */
(function () {
  var d = document.documentElement;
  var CLAVE = 'br-telon';
  var DURACION_CIERRE = 420; // ms que tarda en subir el telón antes de cambiar de página
  var reducir = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ¿Venimos de otra página de la web? Entonces empezamos tapados y abrimos el telón.
  var llega = false;
  try { llega = sessionStorage.getItem(CLAVE) === '1'; sessionStorage.removeItem(CLAVE); } catch (e) {}
  if (llega && !reducir) {
    d.classList.add('telon-entrada');
    setTimeout(function () { d.classList.remove('telon-entrada'); }, 1200);
  }

  // Al llegar a otra página, empezar arriba del todo. Algunos visores (p. ej. el de
  // los enlaces de Claude en el móvil) muestran la web dentro de un marco y conservan
  // la posición de la página anterior: scrollIntoView sube también ese contenedor.
  if (llega && !location.hash) {
    var arriba = function () {
      try { window.scrollTo(0, 0); } catch (e) {}
      try { d.scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (e) { try { d.scrollIntoView(true); } catch (e2) {} }
    };
    arriba();
    document.addEventListener('DOMContentLoaded', arriba);
    window.addEventListener('load', arriba);
  }

  // Bienvenida: al entrar a la web (una vez por visita, en cualquier página) se ve el
  // escudo sobre el telón y después se entra. En la primera visita al inicio no hace
  // falta: ya sale la intro 3D del logo.
  var SESION = 'br-visita';
  var nuevaVisita = false, introPendiente = false;
  try {
    nuevaVisita = !llega && sessionStorage.getItem(SESION) !== '1';
    sessionStorage.setItem(SESION, '1');
    var esInicio = /(^|\/)(index\.html)?$/.test(location.pathname);
    introPendiente = esInicio && localStorage.getItem('br-intro') !== '1';
  } catch (e) { nuevaVisita = false; }
  if (nuevaVisita && !introPendiente && !reducir) {
    d.classList.add('telon-inicio');
    var quitar = function () {
      d.classList.remove('telon-inicio');
      ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(function (t) { removeEventListener(t, saltar, true); });
    };
    var saltar = function () { d.classList.add('telon-inicio-fuera'); setTimeout(function () { d.classList.remove('telon-inicio-fuera'); quitar(); }, 260); };
    ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(function (t) { addEventListener(t, saltar, { capture: true, passive: true, once: true }); });
    setTimeout(quitar, 1850);
  }

  function esPaginaInterna(a) {
    if (a.target && a.target !== '_self') return null;
    if (a.hasAttribute('download')) return null;
    var url;
    try { url = new URL(a.getAttribute('href'), location.href); } catch (e) { return null; }
    if (url.protocol !== location.protocol || url.host !== location.host) return null;
    if (!/(\.html|\/)$/.test(url.pathname)) return null;
    if (url.pathname === location.pathname) return null; // misma página: anclas normales
    return url;
  }

  document.addEventListener('click', function (e) {
    if (reducir || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var url = esPaginaInterna(a);
    if (!url) return;
    e.preventDefault();
    try { sessionStorage.setItem(CLAVE, '1'); } catch (err) {}
    d.classList.remove('telon-entrada');
    d.classList.add('telon-cierra');
    setTimeout(function () { location.href = url.href; }, DURACION_CIERRE);
  });

  // Al volver con el botón «atrás», el navegador puede restaurar la página tal cual:
  // nos aseguramos de que no se quede tapada.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) d.classList.remove('telon-cierra', 'telon-entrada');
  });

  // Deja el escudo grande en caché para que el telón lo muestre al instante.
  window.addEventListener('load', function () {
    var img = new Image();
    img.src = 'assets/img/logo/logo-escudo-480.webp'; // todas las páginas están en la raíz
  });
})();
