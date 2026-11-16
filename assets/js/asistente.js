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
