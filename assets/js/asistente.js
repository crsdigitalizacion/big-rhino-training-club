/* Big Rhino · asistente virtual
   Botón flotante «¿Dudas?» que abre un chat con preguntas rápidas y un campo para
   escribir. Responde con los datos de config.js (horario, clases, tarifas, dirección,
   contacto) reconociendo palabras clave. No usa servicios externos ni inteligencia
   artificial: lo que no sabe lo deriva a llamar, Instagram o la clase de prueba. */
(function () {
  'use strict';
  var C = window.RHINO;
  if (!C || document.getElementById('asistente')) return;
  var borrador = !!C.modoBorrador;
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  function normal(t) { return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function enlace(texto, href, externo) {
    var a = el('a', { clase: 'asis__enlace', href: href, texto: texto });
    if (externo) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }
  var waEnlace = C.whatsapp ? 'https://wa.me/' + C.whatsapp.enlace + (C.whatsapp.mensaje ? '?text=' + encodeURIComponent(C.whatsapp.mensaje) : '') : null;
  var tarifas = {};
  (C.tarifas || []).forEach(function (t) { tarifas[t.id] = t; });
  function precio(t) { return t.estado === 'propuesto' && !borrador ? 'consultar' : t.precio; }
  var tel = C.telefono || { enlace: '', visible: '' };
  var E = C.enlaces || {};

  /* ------------------------------------------------------------ respuestas */
  function lista(items) { return el('ul', { clase: 'asis__lista' }, items.map(function (i) { return el('li', null, [i]); })); }

  var R = {
    saludo: function () {
      return ['¡Hola! Soy el asistente de Big Rhino. Pregúntame por horarios, clases, precios, la clase de prueba o cómo llegar.'];
    },
    gracias: function () { return ['¡A ti! Si te apetece probar, pide tu clase de prueba cuando quieras.', enlace('Pedir clase de prueba', 'prueba.html')]; },
    horario: function () {
      var A = C.horarioApertura || {}, filas = (A.filas || []).map(function (f) { return f.dias + ': ' + f.horas; });
      return [
        (A.titulo || 'Horario') + ' del box:', lista(filas),
        'Las clases empiezan desde las 6:45 y con Rhino SmartKey puedes entrenar de 6:00 a 24:00.',
        enlace('Ver el horario de clases', 'horarios.html'),
      ];
    },
    clases: function () {
      return [
        'Estas son las clases y planes del box:',
        lista((C.clases || []).map(function (c) { return el('span', null, [el('strong', { texto: c.nombre }), ' · ' + c.resumen]); })),
        enlace('Ver todas las clases', 'clases.html'),
      ];
    },
    precios: function () {
      var ids = ['basic', 'start', 'ilimitada', 'bono10', 'smartkey', 'bjj2', 'opositores', 'personal'];
      var filas = ids.map(function (id) { return tarifas[id]; }).filter(Boolean).map(function (t) { return t.concepto + ': ' + precio(t); });
      return ['Estas son las tarifas:', lista(filas), enlace('Ver todas las tarifas', 'clases.html#tarifas')];
    },
    prueba: function () {
      var P = C.clasePrueba || {};
      return [
        'Para tu clase de prueba, rellena el formulario con tus datos y la clase que quieres probar, y te contactamos para cerrar día y hora.',
        P.precio ? 'Precio: ' + P.precio + '.' : 'El precio y las condiciones te los confirmamos al reservar.',
        enlace('Pedir clase de prueba', 'prueba.html'),
      ];
    },
    principiantes: function () {
      return ['Sin problema: la clase de prueba sirve justo para eso. Cuéntanos en el formulario si nunca has entrenado y el coach te explica cómo empezar.', enlace('Pedir clase de prueba', 'prueba.html')];
    },
    ubicacion: function () {
      var d = C.direccion || {};
      return ['Estamos en ' + d.calle + ', ' + d.codigoPostal + ' ' + d.ciudad + '.', enlace('Cómo llegar con Google Maps', E.comoLlegar, true)];
    },
    contacto: function () {
      return [
        'Puedes hablar con el box así:',
        lista([
          el('span', null, ['Teléfono: ', el('a', { clase: 'asis__enlace-linea', href: 'tel:' + tel.enlace, texto: tel.visible })]),
          C.whatsapp ? el('span', null, ['WhatsApp: ', el('a', { clase: 'asis__enlace-linea', href: waEnlace, target: '_blank', rel: 'noopener', texto: C.whatsapp.visible })]) : null,
          el('span', null, ['Instagram: ', el('a', { clase: 'asis__enlace-linea', href: E.instagram, target: '_blank', rel: 'noopener', texto: E.instagramUsuario || 'Instagram' })]),
          el('span', null, ['Reservas: ', el('a', { clase: 'asis__enlace-linea', href: C.reservasOnline, target: '_blank', rel: 'noopener', texto: 'AimHarder' })]),
        ]),
      ];
    },
    openbox: function () {
      var filas = [];
      (C.openBox || []).forEach(function (o) { (o.filas || []).forEach(function (f) { filas.push(o.titulo + ' · ' + f.dias + ': ' + f.horas); }); });
      return ['Para entrenar por tu cuenta:', lista(filas), enlace('Ver Open Box y SmartKey', 'horarios.html#open-box')];
    },
    lucha: function () {
      var t = ['bjj2', 'bjj3', 'bjjIlimitado'].map(function (id) { return tarifas[id]; }).filter(Boolean);
      return [
        'Hay Grappling (mañanas y tardes), Lucha/Wrestling de lunes a jueves a las 18:00, Kimono-Sparring los viernes de 17:00 a 19:00 y Open Mat el sábado a las 11:00.',
        lista(t.map(function (x) { return x.concepto + ': ' + precio(x); })),
        enlace('Ver artes marciales', 'clases.html#lucha'),
      ];
    },
    opositores: function () {
      var t = tarifas.opositores;
      return ['Con Pyramid Opositores preparamos las pruebas físicas de tu oposición' + (t ? ' (' + precio(t) + ')' : '') + ', con reservas ilimitadas, Open Box y SmartKey.', enlace('Ver Pyramid Opositores', 'clases.html#opositores')];
    },
    personal: function () {
      var t = tarifas.personal;
      return ['Pyramid Entrenamientos personales: 3 sesiones a la semana con un entrenador para ti' + (t ? ' (' + precio(t) + ')' : '') + '. Tú eliges la hora y el objetivo.', enlace('Ver entrenamiento personal', 'clases.html#entrenamiento-personal')];
    },
    nose: function () {
      return [
        'Eso no lo sé responder yo. Mejor pregúntaselo directamente al box:',
        el('div', { clase: 'asis__acciones' }, [
          el('a', { clase: 'asis__boton', href: 'tel:' + tel.enlace, texto: 'Llamar al ' + tel.visible }),
          C.whatsapp ? el('a', { clase: 'asis__boton asis__boton--wa', href: waEnlace, target: '_blank', rel: 'noopener', texto: 'Escribir por WhatsApp' }) : null,
          el('a', { clase: 'asis__boton asis__boton--claro', href: E.instagramMensaje, target: '_blank', rel: 'noopener', texto: 'Escribir por Instagram' }),
        ]),
      ];
    },
  };

  // Palabras clave (sin tildes) → respuesta. El orden importa: lo más concreto primero.
  var CLAVES = [
    ['opositores', /oposi|policia|bombero|guardia civil|militar/],
    ['personal', /personal|entrenador para mi|a solas|individual/],
    ['lucha', /bjj|jiu|jitsu|grappling|lucha|wrestling|kimono|open mat|artes marciales|marcial/],
    ['openbox', /open box|smart ?key|llave|libre|por mi cuenta|24 ?h|madrugada/],
    ['prueba', /prueba|probar|primera clase|primer dia|gratis|apuntar|apunto|reservar/],
    ['principiantes', /principiante|nunca|empezar|empiezo|nivel|novato|sin experiencia|mayor|edad/],
    ['precios', /precio|cuesta|cuanto|tarifa|cuota|mensual|bono|pagar|euros|€|caro|barato|plan/],
    ['horario', /horario|hora|abr[ei]|cierra|abierto|domingo|sabado|festivo|cuando/],
    ['nose', /aparca|parking|ducha|vestuario|taquilla|toalla/],
    ['ubicacion', /donde|direccion|llegar|ubica|mapa|calle|soto galo|logrono/],
    ['clases', /clase|entren|crossfit|hyrox|hybrid|powerbuilding|football|wod|fuerza|actividad/],
    ['contacto', /telefono|llamar|contact|instagram|whatsapp|correo|email|mail/],
    ['gracias', /gracias|genial|perfecto|vale|ok\b/],
    ['saludo', /^(hola|buenas|buenos|hey|ey)\b/],
  ];
  function intencion(texto) {
    var t = normal(texto);
    for (var i = 0; i < CLAVES.length; i++) if (CLAVES[i][1].test(t)) return CLAVES[i][0];
    return 'nose';
  }

  var RAPIDAS = [
    ['¿Qué horario tenéis?', 'horario'],
    ['¿Cuánto cuesta?', 'precios'],
    ['Quiero una clase de prueba', 'prueba'],
    ['¿Qué clases hay?', 'clases'],
    ['¿Dónde estáis?', 'ubicacion'],
    ['Nunca he entrenado', 'principiantes'],
    ['Artes marciales', 'lucha'],
    ['Oposiciones', 'opositores'],
  ];

  /* ---------------------------------------------------------------- interfaz */
  var abierto = false, iniciado = false;
  var boton = el('button', { clase: 'asis-boton', id: 'asistente-boton', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'asistente' }, [
    el('span', { clase: 'asis-boton__icono', 'aria-hidden': 'true' }),
    el('span', { clase: 'asis-boton__texto', texto: '¿Dudas?' }),
  ]);
  var mensajes = el('div', { clase: 'asis__mensajes', role: 'log', 'aria-live': 'polite', 'aria-label': 'Conversación' });
  var rapidas = el('div', { clase: 'asis__rapidas', role: 'group', 'aria-label': 'Preguntas rápidas' });
  var entrada = el('input', { clase: 'asis__entrada', id: 'asistente-pregunta', type: 'text', autocomplete: 'off', maxlength: '200', placeholder: 'Escribe tu pregunta…', 'aria-label': 'Escribe tu pregunta' });
  var enviar = el('button', { clase: 'asis__enviar', type: 'submit', 'aria-label': 'Enviar pregunta' }, [el('span', { 'aria-hidden': 'true', texto: '➤' })]);
  var formulario = el('form', { clase: 'asis__form' }, [entrada, enviar]);
  var cerrar = el('button', { clase: 'asis__cerrar', type: 'button', 'aria-label': 'Cerrar el asistente' }, [el('span', { 'aria-hidden': 'true', texto: '×' })]);
  var panel = el('section', { clase: 'asis', id: 'asistente', role: 'dialog', 'aria-label': 'Asistente de Big Rhino', hidden: '' }, [
    el('header', { clase: 'asis__cabeza' }, [
      el('img', { clase: 'asis__avatar', src: 'assets/img/logo/logo-escudo-160.webp', alt: '', width: '40', height: '51' }),
      el('div', null, [el('p', { clase: 'asis__titulo', texto: 'Asistente Big Rhino' }), el('p', { clase: 'asis__sub', texto: 'Respuestas automáticas al momento' })]),
      cerrar,
    ]),
    mensajes, rapidas, formulario,
  ]);
  document.body.appendChild(panel);
  document.body.appendChild(boton);

  // Botón flotante de WhatsApp, encima de «¿Dudas?»: abre el chat del box.
  if (waEnlace) {
    var ns = 'http://www.w3.org/2000/svg';
    var icono = document.createElementNS(ns, 'svg');
    icono.setAttribute('viewBox', '0 0 32 32'); icono.setAttribute('aria-hidden', 'true'); icono.setAttribute('class', 'wa-flota__icono');
    var bocadillo = document.createElementNS(ns, 'path');
    bocadillo.setAttribute('d', 'M16 3.5C9.1 3.5 3.5 9 3.5 15.8c0 2.4.7 4.6 1.9 6.5L3.6 28.5l6.4-1.7c1.8 1 3.8 1.5 6 1.5 6.9 0 12.5-5.5 12.5-12.3S22.9 3.5 16 3.5z');
    bocadillo.setAttribute('fill', 'none'); bocadillo.setAttribute('stroke', 'currentColor'); bocadillo.setAttribute('stroke-width', '2.4'); bocadillo.setAttribute('stroke-linejoin', 'round');
    var auricular = document.createElementNS(ns, 'path');
    auricular.setAttribute('d', 'M11.6 9.6c.4 0 .7 0 .9.6l1.1 2.6c.1.3 0 .6-.1.8l-.8 1c-.2.2-.2.5 0 .8.6 1 1.4 1.9 2.4 2.6.5.3 1 .6 1.5.8.3.1.5 0 .7-.2l1-1.2c.2-.3.5-.3.8-.2l2.5 1.2c.3.2.5.3.5.6 0 1-.6 2.4-2.3 2.8-1.3.3-3.2-.2-5.4-1.7-2.3-1.6-3.9-3.9-4.3-5.4-.5-1.8.2-3.2.9-3.7.3-.2.6-.2.8-.2z');
    auricular.setAttribute('fill', 'currentColor');
    icono.appendChild(bocadillo); icono.appendChild(auricular);
    var wa = el('a', { clase: 'wa-flota', id: 'whatsapp-flotante', href: waEnlace, target: '_blank', rel: 'noopener', 'aria-label': 'Escríbenos por WhatsApp al ' + C.whatsapp.visible + ' (se abre WhatsApp)' }, [icono]);
    document.body.appendChild(wa);
  }

  function bajar() { mensajes.scrollTop = mensajes.scrollHeight; }
  function burbuja(quien, partes) {
    var b = el('div', { clase: 'asis__msg asis__msg--' + quien });
    partes.forEach(function (p) { b.appendChild(typeof p === 'string' ? el('p', { texto: p }) : p); });
    mensajes.appendChild(b); bajar();
    return b;
  }
  function pintarRapidas(excluir) {
    rapidas.textContent = '';
    RAPIDAS.filter(function (r) { return r[1] !== excluir; }).slice(0, excluir ? 4 : 8).forEach(function (r) {
      var c = el('button', { clase: 'asis__chip', type: 'button', texto: r[0] });
      c.addEventListener('click', function () { preguntar(r[0], r[1]); });
      rapidas.appendChild(c);
    });
  }
  function responder(clave) {
    var esc = el('div', { clase: 'asis__msg asis__msg--bot asis__escribiendo', 'aria-hidden': 'true' }, [el('span'), el('span'), el('span')]);
    mensajes.appendChild(esc); bajar();
    setTimeout(function () {
      esc.remove();
      burbuja('bot', R[clave]());
      pintarRapidas(clave);
    }, reducir ? 0 : 450);
  }
  function preguntar(texto, clave) {
    burbuja('yo', [texto]);
    responder(clave || intencion(texto));
  }
  formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = entrada.value.trim(); if (!t) return;
    entrada.value = '';
    preguntar(t);
  });

  function abrir() {
    abierto = true; panel.hidden = false; boton.setAttribute('aria-expanded', 'true'); boton.classList.add('asis-boton--abierto');
    document.documentElement.classList.add('asis-abierto');
    if (!iniciado) { iniciado = true; burbuja('bot', R.saludo()); pintarRapidas(); }
    setTimeout(function () { entrada.focus(); }, 50);
  }
  function cerrarPanel(devolverFoco) {
    abierto = false; panel.hidden = true; boton.setAttribute('aria-expanded', 'false'); boton.classList.remove('asis-boton--abierto');
    document.documentElement.classList.remove('asis-abierto');
    if (devolverFoco) boton.focus();
  }
  boton.addEventListener('click', function () { abierto ? cerrarPanel(false) : abrir(); });
  cerrar.addEventListener('click', function () { cerrarPanel(true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && abierto) cerrarPanel(true); });
})();
