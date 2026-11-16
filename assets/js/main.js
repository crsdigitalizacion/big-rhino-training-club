/* Big Rhino Training Club · interacción y pintado de datos desde config.js
   Sirve para index.html y clases.html: cada bloque comprueba que su sitio existe. */
(function () {
  'use strict';
  var C = window.RHINO || {};
  var doc = document.documentElement;
  var PEND = '[PENDIENTE DE CONFIRMAR CON EL GIMNASIO]';
  var borrador = !!C.modoBorrador;
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)');

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, attrs, hijos) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'texto') n.textContent = attrs[k];
      else if (k === 'clase') n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (hijos || []).forEach(function (h) { if (h) n.appendChild(typeof h === 'string' ? document.createTextNode(h) : h); });
    return n;
  }
  function pendiente(texto) { return el('span', { clase: 'pendiente', texto: texto || PEND }); }

  /* Tarifas visibles: las publicadas por el gimnasio y las aprobadas siempre;
     las propuestas solo en modo borrador. */
  var tarifas = {};
  (C.tarifas || []).forEach(function (t) { tarifas[t.id] = t; });
  function visible(t) { return !!t; }
  // Precio que se enseña: el propuesto solo en borrador; fuera, «Consultar».
  function precioDe(t) { return t.estado === 'propuesto' && !borrador ? 'Consultar' : t.precio; }
  function filaTarifa(t, conDetalle) {
    return el('li', { clase: 'tarifa' }, [
      el('div', { clase: 'tarifa__fila' }, [el('span', { clase: 'tarifa__concepto', texto: t.concepto }), el('span', { clase: 'tarifa__precio' + (precioDe(t) === 'Consultar' ? ' tarifa__precio--consultar' : ''), texto: precioDe(t) })]),
      conDetalle && t.detalle ? el('span', { clase: 'tarifa__detalle', texto: t.detalle }) : null,
    ]);
  }
  function aMinutos(h) { var p = h.split(':'); return +p[0] * 60 + +p[1]; }

  /* ---------------------------------------------------- modo borrador */
  if (borrador) {
    doc.classList.add('borrador');
    if ($('#aviso-borrador')) $('#aviso-borrador').hidden = false;
  }

  /* ---------------------------------------------- enlaces y contacto */
  var E = C.enlaces || {};
  $$('[data-enlace]').forEach(function (a) { var k = a.getAttribute('data-enlace'); if (E[k]) a.href = E[k]; });
  if (C.reservasOnline) $$('[data-reservas]').forEach(function (a) { a.href = C.reservasOnline; });
  if (C.telefono) $$('[data-tel]').forEach(function (a) {
    a.href = 'tel:' + C.telefono.enlace;
    if (/^\s*(Llamar al )?[\d ]+\s*$/.test(a.textContent)) a.textContent = a.textContent.replace(/\d[\d ]{7,}\d/, C.telefono.visible);
  });
  if (C.direccion) $$('[data-direccion]').forEach(function (n) {
    var d = C.direccion; n.textContent = '';
    n.appendChild(document.createTextNode(d.calle)); n.appendChild(el('br'));
    n.appendChild(document.createTextNode(d.codigoPostal + ' ' + d.ciudad + ', ' + d.region));
  });
  if (C.whatsapp) {
    var wa = 'https://wa.me/' + C.whatsapp.enlace;
    var bw = $('#boton-whatsapp'); if (bw) { bw.href = wa; bw.hidden = false; }
    var dw = $('#dato-whatsapp'); if (dw) { dw.hidden = false; var aw = $('a', dw); aw.href = wa; aw.textContent = C.whatsapp.visible; }
    var cw = $('#canal-whatsapp'); if (cw) { cw.hidden = false; $$('a', cw).forEach(function (a) { a.href = wa; }); $('.canal__dato a', cw).textContent = C.whatsapp.visible; }
  }
  if (C.correo) {
    var dc = $('#dato-correo'); if (dc) { dc.hidden = false; var ac = $('a', dc); ac.href = 'mailto:' + C.correo; ac.textContent = C.correo; }
    var cc = $('#canal-correo'); if (cc) { cc.hidden = false; $$('a', cc).forEach(function (a) { a.href = 'mailto:' + C.correo; }); $('.canal__dato a', cc).textContent = C.correo; }
  }

  /* ------------------------------------------------------- valoración */
  var pv = $('#valoracion');
  if (C.valoracion && pv) {
    var v = C.valoracion;
    pv.appendChild(el('span', { clase: 'estrella', 'aria-hidden': 'true', texto: '★ ' }));
    pv.appendChild(el('strong', { texto: v.nota + ' en ' + v.fuente }));
    pv.appendChild(document.createTextNode(' · ' + v.opiniones + ' opiniones (' + v.fecha + ')'));
    pv.hidden = false;
  }

  /* ------------------------------------------------- horarios (inicio) */
  function tabla(filas) {
    var t = el('table', { clase: 'tabla-horario' }), tb = el('tbody');
    filas.forEach(function (f) { tb.appendChild(el('tr', null, [el('th', { scope: 'row', texto: f.dias }), el('td', { texto: f.horas })])); });
    t.appendChild(tb); return t;
  }
  var A = C.horarioApertura, cajaA = $('#horario-apertura');
  if (cajaA && A && A.confirmado && A.filas && A.filas.length) {
    // Hora de Logroño, aunque quien mire esté en otra zona horaria.
    var ahora = new Date(), diaHoy = ahora.getDay(), minutos = ahora.getHours() * 60 + ahora.getMinutes();
    try {
      var partes = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(ahora);
      var dato = function (t) { var x = partes.filter(function (q) { return q.type === t; })[0]; return x ? x.value : ''; };
      diaHoy = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'].indexOf(dato('weekday').replace('.', '').toLowerCase());
      minutos = (+dato('hour')) * 60 + (+dato('minute'));
    } catch (e) { /* sin Intl: hora del dispositivo */ }
    var filaDe = function (n) { return A.filas.filter(function (f) { return (f.numeros || []).indexOf(n) > -1; })[0]; };
    var hoy = filaDe(diaHoy), estado = null;
    if (hoy && hoy.abre) {
      var ab = aMinutos(hoy.abre), ci = aMinutos(hoy.cierra);
      if (minutos >= ab && minutos < ci) estado = { abierto: true, texto: 'Abierto ahora · hasta las ' + hoy.cierra };
      else if (minutos < ab) estado = { abierto: false, texto: 'Cerrado ahora · abre hoy a las ' + hoy.abre };
    }
    if (!estado) {
      for (var k = 1; k <= 7; k++) {
        var sig = filaDe((diaHoy + k) % 7);
        if (sig && sig.abre) {
          var nombreDia = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][(diaHoy + k) % 7];
          estado = { abierto: false, texto: 'Cerrado ahora · abre ' + (k === 1 ? 'mañana' : 'el ' + nombreDia) + ' a las ' + sig.abre };
          break;
        }
      }
    }
    cajaA.textContent = '';
    if (estado) cajaA.appendChild(el('p', { clase: 'apertura__estado' + (estado.abierto ? ' apertura__estado--abierto' : '') }, [
      el('span', { clase: 'apertura__punto', 'aria-hidden': 'true' }), estado.texto,
    ]));
    var lista = el('ul', { clase: 'apertura' });
    A.filas.forEach(function (f) {
      var esHoy = (f.numeros || []).indexOf(diaHoy) > -1;
      lista.appendChild(el('li', { clase: 'apertura__fila' + (esHoy ? ' apertura__fila--hoy' : '') + (f.abre ? '' : ' apertura__fila--cerrado') }, [
        el('span', { clase: 'apertura__dias' }, [f.dias, esHoy ? el('span', { clase: 'apertura__hoy', texto: 'Hoy' }) : null]),
        f.abre
          ? el('span', { clase: 'apertura__horas' }, [el('strong', { texto: f.abre }), el('span', { clase: 'apertura__guion', 'aria-hidden': 'true', texto: '—' }), el('span', { clase: 'sr-only', texto: ' a ' }), el('strong', { texto: f.cierra })])
          : el('span', { clase: 'apertura__horas apertura__horas--cerrado', texto: f.horas }),
      ]));
    });
    cajaA.appendChild(lista);
    if (A.nota) cajaA.appendChild(el('p', { clase: 'apertura__nota' }, [A.nota, ' ', el('a', { href: '#semana', texto: 'Ver clases' })]));
    var tit = $('#titulo-apertura'); if (tit && A.titulo) tit.textContent = A.titulo;
  }
  // Resumen del horario de clases: primera y última clase de cada día.
  var cajaC = $('#horario-clases'), HS = C.horarioSemana || [];
  if (cajaC && HS.length) {
    var filas = HS.map(function (d) {
      var ini = d.clases.map(function (k) { return k[0]; }).sort(function (a, b) { return aMinutos(a) - aMinutos(b); })[0];
      var fin = d.clases.map(function (k) { return k[1]; }).sort(function (a, b) { return aMinutos(b) - aMinutos(a); })[0];
      return { dias: d.dia, horas: ini + ' a ' + fin + ' · ' + d.clases.length + (d.clases.length === 1 ? ' clase' : ' clases') };
    });
    cajaC.textContent = '';
    cajaC.appendChild(tabla(filas));
    cajaC.appendChild(el('p', { clase: 'horario__nota' }, [
      'Primera y última clase con coach de cada día. ',
      el('a', { href: 'horarios.html', texto: 'Ver el horario completo' }), '.',
    ]));
  }

  /* -------------------------------------- entrenamientos (resumen inicio) */
  var cajaM = $('#modalidades');
  if (cajaM) (C.clases || []).forEach(function (c, i) {
    cajaM.appendChild(el('a', { clase: 'mini-clase aparece', href: 'clases.html#' + c.id }, [
      el('span', { clase: 'mini-clase__num', 'aria-hidden': 'true', texto: String(i + 1).padStart(2, '0') }),
      el('span', { clase: 'mini-clase__cuerpo' }, [
        el('span', { clase: 'mini-clase__etiqueta', texto: c.etiqueta }),
        el('span', { clase: 'mini-clase__nombre', texto: c.nombre }),
        el('span', { clase: 'mini-clase__resumen', texto: c.resumen }),
      ]),
      el('span', { clase: 'mini-clase__flecha', 'aria-hidden': 'true', texto: '→' }),
    ]));
  });
  var inst = (C.instalaciones || []).filter(function (i) { return !i.confirmado; });
  var ri = $('#instalaciones-revision');
  if (ri && borrador && inst.length) {
    ri.appendChild(el('h3', { texto: 'Instalaciones según Wellhub · pendientes de confirmar' }));
    var ul2 = el('ul', { clase: 'chips' }); inst.forEach(function (i) { ul2.appendChild(el('li', { texto: i.nombre })); });
    ri.appendChild(ul2);
  }

  /* ------------------------------------------------- clase de prueba */
  var P = C.clasePrueba || {};
  if (P.precio && $('#prueba-precio')) $('#prueba-precio').textContent = P.precio;
  if (P.condiciones && $('#prueba-condiciones')) $('#prueba-condiciones').textContent = P.condiciones;
  var lt = $('#lista-tarifas');
  if (lt) {
    var destacadas = ['basic', 'ilimitada', 'bono10'].map(function (id) { return tarifas[id]; }).filter(visible);
    destacadas.forEach(function (t) { lt.appendChild(filaTarifa(t, true)); });
    if (destacadas.length) $('#tarifas').hidden = false;
  }

  /* ------------------------------------------------------------ galería */
  var G = $('#galeria'), fotos = C.galeria || [];
  if (G) {
    if (fotos.length) {
      fotos.forEach(function (f, i) {
        var img = el('img', {
          src: f.src + '-640.webp', srcset: f.src + '-640.webp 640w, ' + f.src + '-1200.webp 1200w',
          sizes: i === 0 ? '(min-width: 720px) 66vw, 100vw' : '(min-width: 720px) 33vw, 50vw',
          alt: f.alt || '', loading: 'lazy', decoding: 'async', width: '640', height: '800',
        });
        if (f.encuadre) img.style.objectPosition = f.encuadre;
        G.appendChild(el('figure', { clase: 'aparece' }, [img]));
      });
    } else if (borrador) {
      for (var h = 0; h < (C.huecosGaleria || 6); h++) {
        G.appendChild(el('div', { clase: 'galeria__hueco', texto: h === 0 ? 'Foto del box, cedida por el gimnasio · pendiente' : 'Foto pendiente de entrega' }));
      }
    } else {
      G.hidden = true; if ($('#galeria-intro')) $('#galeria-intro').hidden = true;
    }
  }

  /* ---------------------------------------------------------------- FAQ */
  var F = $('#faq');
  if (F) (C.faq || []).forEach(function (q) {
    if (!q.respuesta && !borrador) return;
    var resp = el('div', { clase: 'faq__respuesta' }, [q.respuesta ? el('p', { texto: q.respuesta }) : pendiente()]);
    F.appendChild(el('details', null, [el('summary', { texto: q.pregunta }), resp]));
  });

  /* ===================================================== PÁGINA DE CLASES */
  var listaCat = $('#categorias');
  if (listaCat) {
    var porId = {};
    (C.clases || []).forEach(function (c) { porId[c.id] = c; });

    // Cuándo hay cada clase, sacado del horario semanal.
    var cuando = {};
    (C.horarioSemana || []).forEach(function (d) {
      d.clases.forEach(function (k) {
        (cuando[k[3]] = cuando[k[3]] || {});
        (cuando[k[3]][d.dia] = cuando[k[3]][d.dia] || []).push(k[0] + (k[2] !== porId[k[3]].nombre && porId[k[3]].nombresAimHarder.length > 1 ? ' ' + k[2] : ''));
      });
    });

    (C.categorias || []).forEach(function (cat) {
      var clasesCat = (C.clases || []).filter(function (c) { return c.categoria === cat.id; });
      if (!clasesCat.length) return;
      var sec = el('section', { clase: 'categoria categoria--' + cat.id, id: cat.id, 'aria-labelledby': 'cat-' + cat.id }, [
        el('header', { clase: 'categoria__cabeza contenedor' }, [
          el('h2', { id: 'cat-' + cat.id, texto: cat.nombre }),
          el('p', { texto: cat.texto }),
        ]),
      ]);
      var lista = el('div', { clase: 'contenedor categoria__lista' });
      clasesCat.forEach(function (c) {
        var fichaHorario = null, dias = cuando[c.id];
        if (dias) {
          var dl = el('dl', { clase: 'clase__horario' });
          Object.keys(dias).forEach(function (dia) {
            dl.appendChild(el('div', null, [el('dt', { texto: dia }), el('dd', { texto: dias[dia].join(' · ') })]));
          });
          fichaHorario = el('div', { clase: 'clase__bloque' }, [el('h4', { texto: 'Cuándo' }), dl]);
        } else if (c.categoria === 'servicios') {
          fichaHorario = el('div', { clase: 'clase__bloque' }, [el('h4', { texto: 'Cuándo' }), el('p', { clase: 'clase__nota', texto: 'Horario a convenir con el box.' })]);
        }
        var ts = (c.tarifas || []).map(function (id) { return tarifas[id]; }).filter(visible);
        var fichaPrecio = el('div', { clase: 'clase__bloque' }, [
          el('h4', { texto: 'Precio' }),
          ts.length ? el('ul', { clase: 'clase__tarifas' }, ts.map(function (t) { return filaTarifa(t, false); })) : pendiente(),
        ]);
        var img = el('img', {
          src: c.foto + '-640.webp', srcset: c.foto + '-640.webp 640w, ' + c.foto + '-1100.webp 1100w',
          sizes: '(min-width: 980px) 40vw, 100vw', alt: c.alt, loading: 'lazy', decoding: 'async', width: '640', height: '800',
        });
        lista.appendChild(el('article', { clase: 'clase aparece', id: c.id, 'aria-labelledby': 'n-' + c.id }, [
          el('figure', { clase: 'clase__foto' }, [img, borrador ? null : el('figcaption', { texto: 'Foto de stock ilustrativa' })]),
          el('div', { clase: 'clase__cuerpo' }, [
            el('p', { clase: 'clase__etiqueta', texto: c.etiqueta }),
            el('h3', { clase: 'clase__nombre', id: 'n-' + c.id, texto: c.nombre }),
            el('p', { clase: 'clase__texto', texto: c.texto }),
            el('ul', { clase: 'clase__puntos' }, (c.puntos || []).map(function (p) { return el('li', { texto: p }); })),
            el('div', { clase: 'clase__datos' }, [fichaHorario, fichaPrecio]),
            el('div', { clase: 'clase__acciones' }, [
              c.nombresAimHarder.length ? el('a', { clase: 'boton boton--rojo', href: C.reservasOnline, target: '_blank', rel: 'noopener', texto: 'Reservar en AimHarder' }) : null,
              el('a', { clase: 'boton boton--contorno', href: 'prueba.html#' + c.id, texto: 'Probar esta clase' }),
            ]),
          ]),
        ]));
      });
      sec.appendChild(lista);
      listaCat.appendChild(sec);
    });

    // Tabla completa de tarifas
    var tt = $('#tabla-tarifas');
    if (tt) (C.tarifas || []).filter(visible).forEach(function (t) { tt.appendChild(filaTarifa(t, true)); });
    if ($('#fuente-tarifas') && C.fuenteTarifas) $('#fuente-tarifas').textContent = C.fuenteTarifas + '.';
  }

  /* =================================================== PÁGINA DE HORARIOS */
  var rejilla = $('#rejilla-horario');
  if (rejilla) {
    var catDe = {};
    (C.clases || []).forEach(function (c) { catDe[c.id] = c.categoria; });
    var nombresDia = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    var hoy = nombresDia[new Date().getDay()];
    (C.horarioSemana || []).forEach(function (d) {
      var ul = el('ul');
      d.clases.slice().sort(function (a, b) { return aMinutos(a[0]) - aMinutos(b[0]); }).forEach(function (k) {
        var cat = catDe[k[3]] || 'box';
        ul.appendChild(el('li', { clase: 'turno turno--' + cat, 'data-cat': cat }, [
          el('span', { clase: 'turno__hora', texto: k[0] + '–' + k[1] }),
          el('a', { clase: 'turno__clase', href: 'clases.html#' + k[3], texto: k[2] }),
        ]));
      });
      var esHoy = d.dia === hoy;
      rejilla.appendChild(el('div', { clase: 'dia' + (esHoy ? ' dia--hoy' : '') }, [
        el('h3', null, [d.dia, esHoy ? el('span', { clase: 'dia__hoy', texto: 'Hoy' }) : null]),
        ul,
        el('p', { clase: 'dia__vacio', texto: 'Sin clases de este tipo.', hidden: '' }),
      ]));
    });
    if (hoy === 'Domingo' && $('#nota-domingo')) $('#nota-domingo').classList.add('nota-domingo--hoy');
    // Filtro por tipo de clase
    $$('[data-filtro]').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filtro');
        $$('[data-filtro]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        $$('.turno', rejilla).forEach(function (t) { t.hidden = f !== 'todas' && t.getAttribute('data-cat') !== f; });
        $$('.dia', rejilla).forEach(function (dia) {
          $('.dia__vacio', dia).hidden = $$('.turno', dia).some(function (t) { return !t.hidden; });
        });
      });
    });
    if ($('#fuente-clases') && C.fuenteClases) $('#fuente-clases').textContent = 'Fuente: ' + C.fuenteClases + '. Puede cambiar: consulta el calendario en AimHarder antes de venir.';
  }
  var cajaOB = $('#open-box-lista');
  if (cajaOB) (C.openBox || []).forEach(function (o) {
    cajaOB.appendChild(el('article', { clase: 'pizarra aparece' }, [
      el('p', { clase: 'pizarra__etiqueta', texto: o.etiqueta }),
      el('h3', { texto: o.titulo }),
      tabla(o.filas),
      el('p', { clase: 'horario__nota', texto: o.texto }),
    ]));
  });

  /* ============================================= FORMULARIO CLASE DE PRUEBA */
  var form = $('#form-prueba');
  if (form) {
    var sel = $('#f-clase');
    (C.clases || []).forEach(function (c) { sel.appendChild(el('option', { value: c.nombre, 'data-id': c.id, texto: c.nombre })); });
    sel.appendChild(el('option', { value: 'No lo sé, aconsejadme', texto: 'No lo sé, aconsejadme' }));
    // prueba.html#hybrid deja elegida esa clase
    var pre = location.hash.slice(1);
    if (pre) $$('option', sel).forEach(function (o) { if (o.getAttribute('data-id') === pre) sel.value = o.value; });

    var reglas = {
      nombre: function (v) { return v.trim().length >= 2; },
      telefono: function (v) {
        var pre = valor('prefijo') || '+34', n = v.replace(/[\s.\-()]/g, '');
        var err = $('#e-telefono');
        if (pre === '+34') { if (err) err.textContent = 'Escribe un teléfono de 9 cifras.'; return /^[6789]\d{8}$/.test(n.replace(/^(\+34|0034)/, '')); }
        if (pre === 'otro') { if (err) err.textContent = 'Escribe el número con su prefijo, por ejemplo +44 7700 900123.'; return /^(\+|00)\d{7,15}$/.test(n); }
        if (err) err.textContent = 'Escribe el número sin el prefijo del país.';
        return /^\d{6,14}$/.test(n.replace(new RegExp('^(\\' + pre + '|00' + pre.slice(1) + ')'), ''));
      },
      email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      clase: function (v) { return !!v; },
      privacidad: function (v, input) { return input.checked; },
    };
    function validar(nombre) {
      var input = form.elements[nombre], ok = !!reglas[nombre](input.value || '', input);
      var err = $('#e-' + nombre); if (err) err.hidden = ok;
      input.setAttribute('aria-invalid', String(!ok));
      return ok;
    }
    Object.keys(reglas).forEach(function (n) {
      var input = form.elements[n];
      input.addEventListener(input.type === 'checkbox' ? 'change' : 'blur', function () { if (input.getAttribute('aria-invalid') !== null || input.value) validar(n); });
    });
    function valor(n) { var x = form.elements[n]; return x ? (x.value || '').trim() : ''; }
    // Teléfono con su prefijo: «+34 612 345 678». Con «Otro país» va tal cual lo escribe.
    function telefonoCompleto() {
      var pre = valor('prefijo') || '+34', n = valor('telefono');
      if (pre === 'otro') return n;
      n = n.replace(new RegExp('^\\s*(\\' + pre + '|00' + pre.slice(1) + ')\\s*'), '');
      return pre + ' ' + n;
    }
    // Al cambiar de país, revisar de nuevo el número si ya se había marcado.
    var selPrefijo = $('#f-prefijo');
    if (selPrefijo) selPrefijo.addEventListener('change', function () {
      var tel = form.elements.telefono;
      tel.placeholder = selPrefijo.value === 'otro' ? '+44 7700 900123' : '';
      if (tel.value) validar('telefono');
    });
    function mensaje() {
      var lineas = [
        'Hola, quiero una clase de prueba en Big Rhino.',
        'Nombre: ' + valor('nombre'),
        'Teléfono: ' + telefonoCompleto(),
      ];
      if (valor('email')) lineas.push('Correo: ' + valor('email'));
      lineas.push('Clase: ' + valor('clase'));
      lineas.push('Mejor: ' + valor('cuando'));
      lineas.push('Experiencia: ' + valor('experiencia'));
      if (valor('mensaje')) lineas.push('Comentario: ' + valor('mensaje'));
      return lineas.join('\n');
    }
    var res = $('#f-resultado'), boton = $('#f-enviar');
    function mostrar(titulo, texto, extra, tipo) {
      res.textContent = '';
      res.className = 'formulario__resultado' + (tipo ? ' formulario__resultado--' + tipo : '');
      res.appendChild(el('p', { clase: 'formulario__resultado-titulo', texto: titulo }));
      if (texto) res.appendChild(el('p', { texto: texto }));
      (extra || []).forEach(function (n) { res.appendChild(n); });
      res.hidden = false;
      res.scrollIntoView({ block: 'nearest', behavior: reducir.matches ? 'auto' : 'smooth' });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = Object.keys(reglas).map(validar).every(Boolean);
      if (!ok) { var primero = $('[aria-invalid="true"]', form); if (primero) primero.focus(); return; }
      var cfg = C.formularioPrueba || {};
      if (cfg.endpoint) {
        boton.disabled = true; boton.textContent = 'Enviando…';
        var datos = new FormData(form); datos.append('resumen', mensaje());
        fetch(cfg.endpoint, { method: 'POST', body: datos, headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); })
          .then(function () {
            form.reset(); $$('.campo__error', form).forEach(function (x) { x.hidden = true; });
            mostrar('Solicitud enviada', 'Gracias. Te llamamos en breve para cerrar día y hora de tu clase de prueba.', null, 'ok');
          })
          .catch(function () {
            mostrar('No se ha podido enviar', 'Inténtalo de nuevo en un momento o llámanos al ' + C.telefono.visible + '.', [
              el('a', { clase: 'boton boton--negro', href: 'tel:' + C.telefono.enlace, texto: 'Llamar al ' + C.telefono.visible }),
            ], 'error');
          })
          .then(function () { boton.disabled = false; boton.textContent = 'Pedir mi clase de prueba'; });
        return;
      }
      var numeroWa = cfg.whatsapp || (C.whatsapp && C.whatsapp.enlace);
      if (numeroWa) {
        var wa = 'https://wa.me/' + String(numeroWa).replace(/\D/g, '') + '?text=' + encodeURIComponent(mensaje());
        // Se abre como un enlace normal (no con window.open): así funciona también en
        // visores que bloquean las ventanas emergentes, como el de los enlaces de Claude.
        var enlaceWa = el('a', { href: wa, target: '_blank', rel: 'noopener', hidden: '' });
        document.body.appendChild(enlaceWa);
        try { enlaceWa.click(); } catch (err) {}
        enlaceWa.remove();
        // Sin mensajes ni botones extra (a petición del cliente): solo se abre WhatsApp.
        // Si no se abriera, basta con volver a pulsar «Pedir mi clase de prueba».
        res.hidden = true;
        return;
      }
      // Sin envío conectado: preparar el mensaje para mandarlo por Instagram o llamar.
      var texto = mensaje();
      var copiar = el('button', { clase: 'boton boton--negro', type: 'button', texto: 'Copiar y abrir Instagram' });
      copiar.addEventListener('click', function () {
        var abrir = function () { window.open(C.enlaces.instagramMensaje, '_blank', 'noopener'); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(function () { copiar.textContent = 'Copiado. Pégalo en el chat'; abrir(); }, abrir);
        else abrir();
      });
      mostrar('Último paso: envíanos tu solicitud', 'Cópiala y pégala en un mensaje de Instagram, o llámanos y te apuntamos.', [
        el('pre', { clase: 'formulario__resumen', texto: texto }),
        el('div', { clase: 'formulario__acciones' }, [
          copiar,
          el('a', { clase: 'boton boton--contorno', href: 'tel:' + C.telefono.enlace, texto: 'Llamar al ' + C.telefono.visible }),
        ]),
      ]);
    });
  }

  /* ============================================ INICIO: TIRA DE FOTOS DEL BOX */
  var tira = $('#tira-fotos');
  if (tira) {
    (C.galeria || []).slice(0, 4).forEach(function (f, i) {
      var img = el('img', { src: f.src + '-640.webp', alt: f.alt || '', loading: 'lazy', decoding: 'async', width: '640', height: '800' });
      if (f.encuadre) img.style.objectPosition = f.encuadre;
      tira.appendChild(el('a', { clase: 'tira-box__foto', href: 'box.html', style: '--i:' + i, 'aria-label': 'Ver el box: ' + (f.alt || 'foto') }, [img]));
    });
    if (!tira.children.length) $('#tira-box').hidden = true;
  }

  /* ============================================== INICIO: HOY EN BIG RHINO */
  var cajaHoy = $('#hoy-clases');
  if (cajaHoy) {
    var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    var catHoy = {}; (C.clases || []).forEach(function (c) { catHoy[c.id] = c.categoria; });
    function ahoraMadrid() {
      var d = new Date(), r = { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes(), texto: '' };
      try {
        var partes = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d);
        var v = function (t) { var x = partes.filter(function (q) { return q.type === t; })[0]; return x ? x.value : ''; };
        r.dia = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(v('weekday').toLowerCase());
        r.min = (+v('hour')) * 60 + (+v('minute'));
        r.texto = v('weekday') + ' ' + v('day') + ' de ' + v('month');
      } catch (e) { r.texto = DIAS[r.dia].toLowerCase(); }
      return r;
    }
    function clasesDe(diaNum) {
      var d = (C.horarioSemana || []).filter(function (x) { return x.dia === DIAS[diaNum]; })[0];
      return d ? d.clases.slice().sort(function (a, b) { return aMinutos(a[0]) - aMinutos(b[0]); }) : [];
    }
    function enMin(n) { return n < 60 ? 'en ' + n + ' min' : 'en ' + Math.floor(n / 60) + ' h ' + (n % 60 ? (n % 60) + ' min' : ''); }
    function pintarHoy(primeraVez) {
      var t = ahoraMadrid(), hoy = clasesDe(t.dia);
      $('#hoy-fecha').textContent = t.texto.charAt(0).toUpperCase() + t.texto.slice(1);
      // Abierto / cerrado según el horario de atención
      var A = C.horarioApertura || {}, fila = (A.filas || []).filter(function (f) { return (f.numeros || []).indexOf(t.dia) > -1; })[0];
      var est = $('#hoy-estado'), abiertoAhora = fila && fila.abre && t.min >= aMinutos(fila.abre) && t.min < aMinutos(fila.cierra);
      est.textContent = '';
      est.className = 'hoy__estado' + (abiertoAhora ? ' hoy__estado--abierto' : '');
      est.appendChild(el('span', { clase: 'hoy__punto', 'aria-hidden': 'true' }));
      est.appendChild(document.createTextNode(abiertoAhora ? 'Abierto ahora · hasta las ' + fila.cierra : (fila && fila.abre && t.min < aMinutos(fila.abre) ? 'Abre hoy a las ' + fila.abre : 'Cerrado ahora')));
      est.hidden = false;

      cajaHoy.textContent = '';
      var siguienteMarcada = false;
      if (!hoy.length || hoy.every(function (k) { return aMinutos(k[1]) <= t.min; })) {
        var vacio = !hoy.length;
        // Próximo día con clases
        var k = 1, prox = [];
        while (k <= 7 && !(prox = clasesDe((t.dia + k) % 7)).length) k++;
        cajaHoy.appendChild(el('li', { clase: 'hoy__aviso', style: '--i:0' }, [
          el('strong', { texto: vacio ? 'Hoy no hay clases con coach.' : 'Las clases de hoy ya han terminado.' }),
          el('span', { texto: ' Con Rhino SmartKey puedes entrenar de 6:00 a 24:00.' }),
        ]));
        if (prox.length) {
          cajaHoy.appendChild(el('li', { clase: 'hoy__titulo-prox', style: '--i:1', texto: (k === 1 ? 'Mañana' : 'El ' + DIAS[(t.dia + k) % 7].toLowerCase()) }));
          prox.slice(0, 5).forEach(function (c, i) {
            cajaHoy.appendChild(el('li', { clase: 'hoy__clase hoy__clase--' + (catHoy[c[3]] || 'box'), style: '--i:' + (i + 2) }, [
              el('span', { clase: 'hoy__hora', texto: c[0] }),
              el('a', { clase: 'hoy__nombre', href: 'clases.html#' + c[3], texto: c[2] }),
            ]));
          });
        }
      } else {
        hoy.forEach(function (c, i) {
          var ini = aMinutos(c[0]), fin = aMinutos(c[1]), estado = 'futura', etiqueta = c[0] + '–' + c[1];
          if (fin <= t.min) estado = 'pasada';
          else if (ini <= t.min) estado = 'ahora';
          else if (!siguienteMarcada) { estado = 'siguiente'; siguienteMarcada = true; }
          var hijos = [
            el('span', { clase: 'hoy__hora', texto: etiqueta }),
            el('a', { clase: 'hoy__nombre', href: 'clases.html#' + c[3], texto: c[2] }),
          ];
          if (estado === 'ahora') {
            hijos.push(el('span', { clase: 'hoy__chip hoy__chip--ahora', texto: 'Ahora' }));
            var barra = el('span', { clase: 'hoy__progreso', 'aria-hidden': 'true' });
            barra.style.setProperty('--p', Math.round((t.min - ini) / (fin - ini) * 100) + '%');
            hijos.push(barra);
          }
          if (estado === 'siguiente') hijos.push(el('span', { clase: 'hoy__chip', texto: enMin(ini - t.min) }));
          cajaHoy.appendChild(el('li', { clase: 'hoy__clase hoy__clase--' + estado + ' hoy__clase--' + (catHoy[c[3]] || 'box'), style: '--i:' + i }, hijos));
        });
      }
      // Lateral: Open Box de hoy
      var lat = $('#hoy-lateral'); lat.textContent = '';
      lat.appendChild(el('h3', { texto: 'Para ir por libre' }));
      (C.openBox || []).forEach(function (o) {
        var f = (o.filas || []).filter(function (x) { return /todos/i.test(x.dias) || x.dias.toLowerCase().indexOf(DIAS[t.dia].toLowerCase()) > -1 || (/lunes a jueves/i.test(x.dias) && t.dia >= 1 && t.dia <= 4); })[0];
        lat.appendChild(el('p', null, [el('strong', { texto: o.titulo }), el('br'), f ? f.horas : 'Hoy no']));
      });
      if (primeraVez) cajaHoy.classList.add('hoy__clases--entra');
    }
    pintarHoy(true);
    setInterval(function () { pintarHoy(false); }, 60000);
  }

  /* ================================================= INICIO: OPINIONES */
  var O = C.opiniones, pista = $('#opiniones-pista');
  if (O && pista && O.lista && O.lista.length) {
    $('#opiniones').hidden = false;
    var nota = $('#opiniones-nota'); nota.href = O.url;
    nota.appendChild(el('span', { clase: 'opiniones__cifra', texto: O.nota }));
    nota.appendChild(el('span', { clase: 'opiniones__estrellas', 'aria-hidden': 'true', texto: '★★★★★' }));
    nota.appendChild(el('span', { clase: 'opiniones__total', texto: O.total + ' opiniones en Google →' }));
    function tarjeta(o, oculta) {
      var t = el('figure', { clase: 'opinion' }, [
        el('span', { clase: 'opinion__estrellas', 'aria-hidden': 'true', texto: '★★★★★' }),
        el('blockquote', null, [el('p', { texto: '«' + o.texto + '»' })]),
        el('figcaption', { texto: o.autor ? o.autor + ' · Google' : 'Opinión en Google' }),
      ]);
      if (oculta) t.setAttribute('aria-hidden', 'true');
      return t;
    }
    var fila = el('div', { clase: 'opiniones__fila' });
    O.lista.forEach(function (o) { fila.appendChild(tarjeta(o)); });
    // Copia para el desfile continuo (oculta a lectores de pantalla)
    if (!reducir.matches) O.lista.forEach(function (o) { fila.appendChild(tarjeta(o, true)); });
    pista.appendChild(fila);
  }

  /* ------------------------------------------------- créditos y avisos */
  var V = C.video || {};
  // El aviso de stock no se enseña en la maqueta (modo borrador) a petición del cliente;
  // al publicar vuelve a salir mientras el vídeo sea de stock (video.stock: true).
  var mostrarAvisoStock = V.stock && !borrador;
  if ($('#aviso-stock')) {
    if (!mostrarAvisoStock) { $('#portada-pie').hidden = true; if ($('#credito-video')) $('#credito-video').hidden = true; }
    else if (V.aviso) $('#aviso-stock').textContent = V.aviso;
  }

  /* ----------------------------------------------- vídeo de portada */
  (function video() {
    var medio = $('#portada-medio');
    if (!V.src || !medio) return;
    var grande = window.matchMedia('(min-width: 900px)').matches;
    var ahorro = navigator.connection && navigator.connection.saveData;
    if (reducir.matches || ahorro) return; // con «reducir movimiento» o ahorro de datos, solo el póster
    var src = grande || !V.srcMovil ? V.src : V.srcMovil;
    var poster = grande ? 'assets/img/portada-poster-1280.jpg' : 'assets/img/portada-poster-movil.jpg';
    var vid = el('video', { clase: 'portada__video', muted: '', autoplay: '', loop: '', playsinline: '', preload: 'auto', 'aria-hidden': 'true', poster: poster });
    vid.muted = true; vid.defaultMuted = true; vid.playsInline = true;
    vid.appendChild(el('source', { src: src, type: 'video/mp4' }));
    vid.addEventListener('playing', function () { vid.classList.add('portada__video--lista'); }, { once: true });
    vid.addEventListener('error', function () { vid.remove(); }, true); // si falla, queda el póster
    medio.appendChild(vid);
    var p = vid.play(); if (p && p.catch) p.catch(function () { /* autoplay bloqueado: se ve el póster */ });
    // Bucle continuo; solo se detiene cuando la portada no se ve, para ahorrar batería.
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) vid.play().catch(function () {}); else vid.pause(); });
    }).observe($('#inicio'));
  })();

  /* ------------------------------------------------------- mapa a demanda */
  var bMapa = $('#mapa-cargar');
  if (bMapa) bMapa.addEventListener('click', function () {
    var caja = $('#mapa');
    var f = el('iframe', { src: E.mapaIncrustado, title: 'Mapa de Google con la ubicación de Big Rhino Training Club', loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade', allowfullscreen: '' });
    caja.textContent = ''; caja.appendChild(f);
  });

  /* ------------------------------------------------------------- menú */
  var bm = $('#menu-boton'), menu = $('#menu');
  function cerrarMenu() { bm.setAttribute('aria-expanded', 'false'); menu.classList.remove('menu--abierto'); }
  if (bm && menu) {
    bm.addEventListener('click', function () {
      var abrir = bm.getAttribute('aria-expanded') !== 'true';
      bm.setAttribute('aria-expanded', String(abrir)); menu.classList.toggle('menu--abierto', abrir);
      if (abrir) { var p1 = $('a', menu); if (p1) p1.focus(); }
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', cerrarMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bm.getAttribute('aria-expanded') === 'true') { cerrarMenu(); bm.focus(); }
    });
  }

  /* ------------------------------------------- cabecera sólida al bajar */
  var cab = $('#cabecera');
  function alBajar() { cab.classList.toggle('cabecera--solida', window.scrollY > 40 || (menu && menu.classList.contains('menu--abierto'))); }
  if (cab) { window.addEventListener('scroll', alBajar, { passive: true }); if (bm) bm.addEventListener('click', alBajar); alBajar(); }

  /* ------------------------------------- sección activa en el menú (inicio)
     En el inicio se subraya «El box» mientras se ve esa sección y «Inicio» en el
     resto. En las demás páginas lo marca el HTML (aria-current="page"). */
  if ('IntersectionObserver' in window && $('#inicio')) {
    var enlacesMenu = $$('.menu li a');
    var marcar = function (href) {
      enlacesMenu.forEach(function (a) {
        if (a.getAttribute('href') === href) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) marcar(e.target.id === 'el-box' ? '#el-box' : '#inicio'); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section').forEach(function (sec) { io.observe(sec); });
  }

  /* ---------------------------------------------- aparición al bajar */
  var aparecen = $$('.seccion__cabeza, .box__texto, .box__opiniones, .pizarra, .pasos, .contacto__datos, .categoria__cabeza, .contacto-banda__in').concat($$('.aparece'), $$('.tira-box, .hoy__cabeza, .hoy__cuerpo, .opiniones__cabeza'));
  aparecen.forEach(function (n) { n.classList.add('aparece'); });
  if ('IntersectionObserver' in window && !reducir.matches) {
    var ia = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); ia.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    aparecen.forEach(function (n) { ia.observe(n); });
  } else aparecen.forEach(function (n) { n.classList.add('visible'); });

  // Avisos de fotos de stock: no salen en la maqueta (modo borrador); al publicar, sí.
  $$('[data-aviso-stock]').forEach(function (n) { n.hidden = borrador; });

  // Al llegar con #ancla desde otra página, la clase se ve sin esperar a la animación.
  if (location.hash) { var dest = document.getElementById(location.hash.slice(1)); if (dest) dest.classList.add('visible'); }
})();
