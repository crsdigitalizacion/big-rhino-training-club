/* ==========================================================================
   BIG RHINO TRAINING CLUB · datos editables de la web
   --------------------------------------------------------------------------
   Todo lo que cambia (horarios, modalidades, precios, contacto, fotos, FAQ)
   está en este archivo. No hace falta tocar el HTML.

   Reglas:
   - null = todavía no hay dato. La web muestra «[PENDIENTE DE CONFIRMAR CON
     EL GIMNASIO]» o no enseña ese bloque.
   - confirmado: false = dato encontrado en fichas públicas que el propietario
     aún no ha confirmado. NO se publica; solo se ve en modo borrador, como
     nota para revisarlo con él.
   - modoBorrador: true = versión para revisar con el propietario. Muestra un
     aviso fijo y las notas de revisión. Antes de publicar: false (y quitar el
     <meta name="robots" content="noindex"> de index.html).
   ========================================================================== */
window.RHINO = {
  modoBorrador: true,

  nombre: 'Big Rhino Training Club',

  // Dominio definitivo, sin barra final. crossfitbigrhino.com redirigía a un
  // sitio ajeno el 14/11/2026: no usarlo hasta que el propietario confirme.
  dominio: null,

  telefono: {
    enlace: '+34651461045',
    visible: '651 46 10 45',
  },

  // WhatsApp solo si el propietario confirma que quiere ofrecer ese canal.
  // Ejemplo: { enlace: '34651461045', visible: '651 46 10 45' }
  whatsapp: null,

  correo: null, // p. ej. 'hola@dominio.com' cuando lo facilite el gimnasio

  direccion: {
    calle: 'C. Soto Galo, 14',
    codigoPostal: '26009',
    ciudad: 'Logroño',
    region: 'La Rioja',
  },

  enlaces: {
    // Ficha de Google Maps del gimnasio (comprobada el 14/11/2026).
    mapa: 'https://www.google.com/maps/place/Big+Rhino+Training+Club/@42.4685695,-2.4061715,17z/data=!3m1!4b1!4m6!3m5!1s0xd5aabbdd9b26483:0xaa2b7541906f826!8m2!3d42.4685695!4d-2.4061715!16s%2Fg%2F11dxm76lbl',
    // Abre Google Maps con la ruta hasta el gimnasio desde donde esté la persona.
    comoLlegar: 'https://www.google.com/maps/dir/?api=1&destination=Big+Rhino+Training+Club%2C+C.+Soto+Galo+14%2C+26009+Logro%C3%B1o',
    // Mapa incrustado: solo se carga si la persona pulsa «Mostrar mapa».
    mapaIncrustado: 'https://www.google.com/maps?q=Big+Rhino+Training+Club,+C.+Soto+Galo+14,+26009+Logro%C3%B1o&output=embed',
    instagram: 'https://www.instagram.com/bigrhinotrainingclub/',
    instagramUsuario: '@bigrhinotrainingclub',
    // Mensaje directo de Instagram (abre el chat con la cuenta).
    instagramMensaje: 'https://ig.me/m/bigrhinotrainingclub',
  },

  // Valoración de la ficha de Google. null la oculta.
  // Quitada de la portada a petición del cliente (15/11/2026). Para volver a mostrarla:
  // valoracion: { nota: '4,9', opiniones: 120, fuente: 'Google', fecha: 'noviembre de 2026' },
  valoracion: null,

  // Opiniones de la ficha de Google (consultada en noviembre de 2026). Fragmentos cortos,
  // con nombre e inicial del apellido tal como aparecen en Google; las destacadas por
  // Google sin autor visible van como «Opinión en Google». null oculta la sección.
  opiniones: {
    nota: '4,9',
    total: 120,
    url: 'https://www.google.com/maps/place/Big+Rhino+Training+Club/@42.4685695,-2.4061715,17z/data=!3m1!4b1!4m6!3m5!1s0xd5aabbdd9b26483:0xaa2b7541906f826!8m2!3d42.4685695!4d-2.4061715!16s%2Fg%2F11dxm76lbl',
    lista: [
      { texto: 'Un box espectacular, donde destaca el gran ambiente y la profesionalidad de los coaches.', autor: 'Javier B.' },
      { texto: 'Las instalaciones son muy amplias y con gran variedad de material.', autor: 'Sergio G.' },
      { texto: 'El mejor box de CrossFit de la zona… ¡con un ambiente inmejorable!', autor: 'Eloy M.' },
      { texto: 'Sitio perfecto para practicar CrossFit, muy buen ambiente, muy buenos coaches.', autor: null },
      { texto: 'Buena opción si trabajas a turnos, con varias opciones de horarios para entrenar.', autor: null },
      { texto: 'Profesionalidad y muy buena gente. Te engancha.', autor: null },
    ],
  },

  /* ---------------------------------------------------------------- HORARIOS
     Apertura: ficha de Google consultada el 14/11/2026. La ficha no indica
     cuándo se actualizó y otro directorio (Wellhub) da otro horario, así que
     queda sin publicar hasta que el gimnasio lo confirme. Para publicarlo:
     revisa las filas y pon confirmado: true.                                  */
  horarioApertura: {
    // Publicado a petición del cliente (15/11/2026). Es el «horario de atención» de la
    // ficha de Google (consultada el 14/11/2026). Las clases empiezan antes (6:45) y con
    // SmartKey se entra de 6:00 a 24:00: por eso se llama «de atención».
    confirmado: true,
    titulo: 'Horario de atención',
    fuente: 'Ficha de Google del gimnasio, consultada el 14/11/2026',
    // dias: 0 = domingo … 6 = sábado (para marcar «hoy» y «abierto ahora»).
    filas: [
      { dias: 'Lunes a viernes', horas: '9:30 a 22:00', numeros: [1, 2, 3, 4, 5], abre: '9:30', cierra: '22:00' },
      { dias: 'Sábado', horas: '10:30 a 15:00', numeros: [6], abre: '10:30', cierra: '15:00' },
      { dias: 'Domingo', horas: 'Cerrado', numeros: [0] },
    ],
    nota: 'Las clases empiezan desde las 6:45 y con Rhino SmartKey puedes entrenar de 6:00 a 24:00.',
  },

  /* ----------------------------------------------------------------- CLASES
     Fuente: calendario y tarifas públicas del propio gimnasio en AimHarder
     (https://crossfitbigrhino.aimharder.com), consultados el 15/11/2026.
     Las clases fijas salen de las 5 semanas anteriores; el horario es el de la
     semana del 16 al 22 de noviembre de 2026. Los textos de cada clase los
     ha redactado la agencia (textoProvisional) salvo los de Opositores,
     Entrenamiento personal y SmartKey, que resumen los del gimnasio.
     Fotos: stock de Pexels (ver CREDITS.md), no son de Big Rhino.            */
  reservasOnline: 'https://crossfitbigrhino.aimharder.com/schedule',
  fuenteClases: 'Calendario de reservas del gimnasio en AimHarder, semana del 16 al 22 de noviembre de 2026',

  categorias: [
    { id: 'box', nombre: 'En el box', texto: 'Clases en grupo con coach y horas libres para entrenar por tu cuenta.' },
    { id: 'lucha', nombre: 'Artes marciales', texto: 'Jiu-jitsu brasileño, grappling y lucha sobre el tatami del box.' },
    { id: 'servicios', nombre: 'Planes a tu medida', texto: 'Preparación de oposiciones y entrenamiento personal.' },
  ],

  clases: [
    {
      id: 'big-rhino-training', categoria: 'box', nombre: 'Big Rhino Training', etiqueta: 'CrossFit',
      nombresAimHarder: ['Big Rhino Training'],
      resumen: 'La clase principal del box: entrenamiento funcional en grupo con coach.',
      texto: 'Calentamiento, técnica y fuerza, y un WOD para terminar. Mezcla levantamientos con barra, ejercicios gimnásticos y trabajo cardiovascular, y cada movimiento tiene versiones más sencillas para que empieces desde tu nivel.',
      puntos: ['Con coach en toda la clase', 'Para todos los niveles', 'Mañanas, tardes y sábados'],
      textoProvisional: true,
      foto: 'assets/img/clases/clase-training', alt: 'Grupo descansando en el suelo de un box entre balones medicinales',
      tarifas: ['basic', 'start', 'ilimitada', 'bono10'],
    },
    {
      id: 'hybrid', categoria: 'box', nombre: 'Hybrid Training + Endurance', etiqueta: 'Fuerza + resistencia',
      nombresAimHarder: ['Hybrid Training + Endurance'],
      resumen: 'Fuerza y resistencia en la misma sesión, al estilo de las competiciones híbridas.',
      texto: 'Carrera, remo, trineo, zancadas o wall balls combinados con trabajo de fuerza. Pensada para mejorar tu motor y para quien prepara pruebas de fitness híbrido como HYROX.',
      puntos: ['Trabajo de motor y resistencia', 'Útil para preparar HYROX', 'Tardes entre semana'],
      textoProvisional: true,
      foto: 'assets/img/clases/clase-hybrid', alt: 'Hombre empujando un trineo cargado con discos en un gimnasio',
      tarifas: ['basic', 'start', 'ilimitada', 'bono10'],
    },
    {
      id: 'powerbuilding', categoria: 'box', nombre: 'PowerBuilding', etiqueta: 'Fuerza',
      nombresAimHarder: ['PowerBuilding'],
      resumen: 'Fuerza y masa muscular con los básicos de la barra.',
      texto: 'Sentadilla, press y peso muerto con cargas progresivas, más trabajo accesorio para ganar músculo. Sin prisas: técnica, series y descansos.',
      puntos: ['Básicos con barra', 'Progresión de cargas', 'Una sesión a la semana'],
      textoProvisional: true,
      foto: 'assets/img/clases/clase-powerbuilding', alt: 'Hombre haciendo una sentadilla con barra en un gimnasio oscuro',
      tarifas: ['basic', 'start', 'ilimitada', 'bono10'],
    },
    {
      id: 'cf-football', categoria: 'box', nombre: 'CF Football', etiqueta: 'Potencia',
      nombresAimHarder: ['CF Football'],
      resumen: 'Fuerza, potencia y velocidad para rendir más en tu deporte.',
      texto: 'Levantamientos pesados, saltos y sprints, con trabajo de acondicionamiento corto e intenso. Para deportistas y para quien quiere ser más explosivo.',
      puntos: ['Saltos y sprints', 'Levantamientos pesados', 'Martes, mañana y tarde'],
      textoProvisional: true,
      foto: 'assets/img/clases/clase-football', alt: 'Hombre saltando sobre un cajón de madera',
      tarifas: ['basic', 'start', 'ilimitada', 'bono10'],
    },
    {
      id: 'open-box', categoria: 'box', nombre: 'Open Box', etiqueta: 'Entreno libre',
      nombresAimHarder: ['Open Box', 'Open Box SmartKey'],
      resumen: 'El box a tu disposición para entrenar por tu cuenta.',
      texto: 'Horas para seguir tu propia programación, repasar técnica o recuperar un WOD. Con el servicio Rhino SmartKey se entra con cerradura inteligente de 6:00 a 24:00, también el fin de semana: se reserva en AimHarder y cada persona registra su entrada con la SmartKey.',
      puntos: ['Entre semana de 6:45 a 21:30', 'Con SmartKey: de 6:00 a 24:00 todos los días', 'Reserva en AimHarder'],
      textoProvisional: true,
      foto: 'assets/img/clases/clase-openbox', alt: 'Box vacío con estructura de barras, anillas y bicicleta de aire',
      tarifas: ['ilimitada', 'smartkey', 'bono10'],
    },
    {
      id: 'grappling', categoria: 'lucha', nombre: 'Grappling y lucha', etiqueta: 'Sin kimono',
      nombresAimHarder: ['Grappling', 'Lucha/Wrestling'],
      resumen: 'Control, derribos y sumisiones sin kimono.',
      texto: 'En Grappling se trabajan posiciones, controles y sumisiones; en Lucha/Wrestling, derribos y defensa de derribos. Clases de mañana y de tarde entre semana.',
      puntos: ['Grappling: mañanas y tardes', 'Lucha: lunes a jueves a las 18:00', 'Tarifas trimestrales de BJJ'],
      textoProvisional: true,
      foto: 'assets/img/clases/clase-grappling', alt: 'Dos luchadores trabajando en el suelo de un gimnasio',
      tarifas: ['bjj2', 'bjj3', 'bjjIlimitado', 'bono10'],
    },
    {
      id: 'bjj', categoria: 'lucha', nombre: 'BJJ con kimono y Open Mat', etiqueta: 'Jiu-jitsu brasileño',
      nombresAimHarder: ['Kimono-Sparring', 'Open Mat'],
      resumen: 'Sparring con kimono y tatami libre el sábado.',
      texto: 'Kimono-Sparring los viernes por la tarde para poner en práctica lo aprendido, y Open Mat el sábado por la mañana para rodar libremente con compañeros.',
      puntos: ['Kimono-Sparring: viernes 17:00-19:00', 'Open Mat: sábado 11:00', 'Tarifas trimestrales de BJJ'],
      textoProvisional: true,
      foto: 'assets/img/clases/clase-bjj', alt: 'Dos personas con kimono blanco agarradas en el tatami',
      tarifas: ['bjj2', 'bjj3', 'bjjIlimitado', 'bono10'],
    },
    {
      id: 'opositores', categoria: 'servicios', nombre: 'Pyramid Opositores', etiqueta: 'Oposiciones',
      nombresAimHarder: [],
      resumen: 'Preparación específica para las pruebas físicas de tu oposición.',
      texto: 'Un servicio especializado y personalizado para las pruebas físicas que tengas que superar. Incluye reservas ilimitadas, Open Box y Open Box SmartKey.',
      puntos: ['Plan según tus pruebas', 'Reservas ilimitadas', 'Open Box y SmartKey incluidos'],
      textoProvisional: false,
      foto: 'assets/img/clases/clase-opositores', alt: 'Hombre corriendo por una pista de atletismo',
      tarifas: ['opositores'],
    },
    {
      id: 'entrenamiento-personal', categoria: 'servicios', nombre: 'Pyramid Entrenamientos personales', etiqueta: 'Personal',
      nombresAimHarder: [],
      resumen: 'Tres sesiones a la semana con un entrenador solo para ti.',
      texto: 'Tú eliges la hora y el objetivo, y el entrenador te guía en cada sesión para conseguirlo lo antes posible. Si prefieres otro número de sesiones a la semana, se consulta sin compromiso.',
      puntos: ['3 sesiones a la semana', 'Horario y objetivo a tu elección', 'Otras frecuencias, a consultar'],
      textoProvisional: false,
      foto: 'assets/img/clases/clase-personal', alt: 'Entrenador ayudando a una mujer en una máquina de remo',
      tarifas: ['personal'],
    },
  ],

  /* ---------------------------------------------------------------- TARIFAS
     estado: 'publicada' = la publica el propio gimnasio en AimHarder (15/11/2026).
     estado: 'propuesto' = el plan existe pero el gimnasio no publica su precio:
       en borrador (maqueta para el dueño) se ve el precio inventado, sin aviso
       a petición del cliente; fuera del borrador sale «Consultar».
     estado: 'aprobado'  = propuesto que el propietario ya ha aprobado; se publica. */
  tarifas: [
    // Planes mensuales: nombres y condiciones de la publicación fijada «Tarifas» de su
    // Instagram (23/02/2025). El gimnasio no publica sus precios: los precios son propuestos.
    { id: 'basic', concepto: 'Plan Basic', precio: '55 €/mes', detalle: '8 créditos al mes para reservar clases', estado: 'propuesto' },
    { id: 'start', concepto: 'Plan Start', precio: '65 €/mes', detalle: '13 créditos al mes para reservar clases', estado: 'propuesto' },
    { id: 'ilimitada', concepto: 'Plan Ilimitada', precio: '75 €/mes', detalle: 'Créditos ilimitados y SmartKey incluida', estado: 'propuesto' },
    { id: 'bono10', concepto: 'Bono 10 sesiones', precio: '90 €', detalle: '10 reservas en cualquier clase del box, Open Box o artes marciales', estado: 'publicada' },
    { id: 'smartkey', concepto: 'Rhino SmartKey', precio: '15 €/mes', detalle: 'Acceso al box de 6:00 a 23:59, los 365 días del año', estado: 'propuesto' },
    { id: 'bjj2', concepto: 'BJJ 2 días a la semana · trimestre', precio: '159 €', detalle: '24 reservas en Grappling, Kimono-Sparring, Leg Locks, Lucha, Open Mat y Positional Sparring', estado: 'publicada' },
    { id: 'bjj3', concepto: 'BJJ 3 días a la semana · trimestre', precio: '199 €', detalle: '36 reservas en las mismas clases', estado: 'publicada' },
    { id: 'bjjIlimitado', concepto: 'BJJ ilimitado · trimestre', precio: '240 €', detalle: 'Reservas ilimitadas en las mismas clases', estado: 'publicada' },
    { id: 'opositores', concepto: 'Pyramid Opositores', precio: '85 €/mes', detalle: 'Reservas ilimitadas, Open Box y Open Box SmartKey', estado: 'publicada' },
    { id: 'personal', concepto: 'Pyramid Entrenamientos personales', precio: '120 €/mes', detalle: '3 entrenamientos personales a la semana', estado: 'publicada' },
  ],
  fuenteTarifas: 'Precios publicados por el gimnasio en AimHarder (15/11/2026). Planes Basic, Start, Ilimitada y SmartKey según su Instagram',

  /* ------------------------------------------------- HORARIO SEMANAL DE CLASES
     [inicio, fin, nombre en AimHarder, id de la clase]. Sin Open Box (se
     explica aparte). Para actualizarlo, copia el calendario de AimHarder.      */
  horarioSemana: [
    { dia: 'Lunes', clases: [
      ['9:30', '10:30', 'Big Rhino Training', 'big-rhino-training'], ['10:30', '11:30', 'Grappling', 'grappling'],
      ['16:30', '17:30', 'Big Rhino Training', 'big-rhino-training'], ['18:00', '19:00', 'Big Rhino Training', 'big-rhino-training'],
      ['18:00', '19:00', 'Lucha/Wrestling', 'grappling'], ['19:00', '20:00', 'Grappling', 'grappling'],
      ['19:30', '20:30', 'Hybrid Training + Endurance', 'hybrid'] ] },
    { dia: 'Martes', clases: [
      ['6:45', '7:45', 'Big Rhino Training', 'big-rhino-training'], ['9:30', '10:30', 'CF Football', 'cf-football'],
      ['16:30', '17:30', 'Big Rhino Training', 'big-rhino-training'], ['18:00', '19:00', 'CF Football', 'cf-football'],
      ['18:00', '19:00', 'Lucha/Wrestling', 'grappling'], ['19:00', '20:00', 'Grappling', 'grappling'],
      ['19:30', '20:30', 'Big Rhino Training', 'big-rhino-training'] ] },
    { dia: 'Miércoles', clases: [
      ['9:30', '10:30', 'Big Rhino Training', 'big-rhino-training'], ['10:30', '11:30', 'Grappling', 'grappling'],
      ['16:30', '17:30', 'Hybrid Training + Endurance', 'hybrid'], ['18:00', '19:00', 'Big Rhino Training', 'big-rhino-training'],
      ['18:00', '19:00', 'Lucha/Wrestling', 'grappling'], ['19:00', '20:00', 'Grappling', 'grappling'],
      ['19:30', '20:30', 'Hybrid Training + Endurance', 'hybrid'] ] },
    { dia: 'Jueves', clases: [
      ['6:45', '7:45', 'Big Rhino Training', 'big-rhino-training'], ['9:30', '10:30', 'Big Rhino Training', 'big-rhino-training'],
      ['16:30', '17:30', 'Big Rhino Training', 'big-rhino-training'], ['18:00', '19:00', 'PowerBuilding', 'powerbuilding'],
      ['18:00', '19:00', 'Lucha/Wrestling', 'grappling'], ['19:00', '20:00', 'Grappling', 'grappling'],
      ['19:30', '20:30', 'Big Rhino Training', 'big-rhino-training'] ] },
    { dia: 'Viernes', clases: [
      ['9:30', '10:30', 'Big Rhino Training', 'big-rhino-training'], ['10:30', '11:30', 'Grappling', 'grappling'],
      ['17:00', '18:00', 'Big Rhino Training', 'big-rhino-training'], ['17:00', '19:00', 'Kimono-Sparring', 'bjj'],
      ['18:00', '19:00', 'Hybrid Training + Endurance', 'hybrid'], ['19:00', '20:00', 'Big Rhino Training', 'big-rhino-training'] ] },
    { dia: 'Sábado', clases: [
      ['10:40', '11:40', 'Big Rhino Training', 'big-rhino-training'], ['11:00', '12:00', 'Open Mat', 'bjj'] ] },
  ],
  // Horas de Open Box (entreno libre), del mismo calendario de AimHarder.
  openBox: [
    {
      titulo: 'Open Box', etiqueta: 'Con el box abierto',
      filas: [
        { dias: 'Lunes a jueves', horas: '6:45 a 14:00 y 16:30 a 21:30' },
        { dias: 'Viernes', horas: '6:45 a 14:00 y 17:00 a 20:30' },
        { dias: 'Sábado', horas: '11:40 a 12:40' },
      ],
      texto: 'Horas para entrenar por tu cuenta: tu programación, técnica o recuperar un WOD. Se reservan en AimHarder.',
    },
    {
      titulo: 'Rhino SmartKey', etiqueta: 'Acceso con cerradura inteligente',
      filas: [{ dias: 'Todos los días', horas: '6:00 a 24:00' }],
      texto: 'Para clientes con el servicio Rhino SmartKey. Se reserva en AimHarder y cada persona registra su entrada con la SmartKey, aunque vayáis juntos.',
    },
  ],

  // Formulario de clase de prueba (prueba.html). Cómo llegan las solicitudes:
  // - endpoint: URL que recibe un POST con los campos (p. ej. un formulario de Formspree,
  //   Getform o un servidor propio). Con endpoint, la web confirma «Solicitud enviada».
  // - Sin endpoint y con whatsapp (aquí o en el `whatsapp` general): abre WhatsApp con
  //   el mensaje ya escrito con los datos; la persona solo pulsa enviar.
  // - Sin ninguno: la web prepara el mensaje y ofrece copiarlo y enviarlo por Instagram
  //   o llamar. Nunca dice que se ha enviado algo que no se ha enviado.
  formularioPrueba: {
    endpoint: null,
    // Número de WhatsApp que recibe las solicitudes (con prefijo 34, sin espacios).
    // AHORA: el número del responsable del proyecto, para enseñar la maqueta al cliente.
    // Cambiarlo por el del gimnasio antes de publicar. No se muestra en ninguna página.
    whatsapp: '34657719647',
  },

  // Clase de prueba: precio y condiciones. null = pendiente (no inventar).
  clasePrueba: {
    precio: null,      // p. ej. 'Gratis' o '10 €'
    condiciones: null, // p. ej. 'Una clase por persona. Reserva con un día de antelación.'
  },

  /* ---------------------------------------------------------------- GALERÍA
     Solo fotos del gimnasio o con permiso por escrito. Guarda cada foto en
     assets/img/ en dos tamaños: nombre-640.webp y nombre-1200.webp, y pon
     aquí src sin el sufijo. «encuadre» (opcional) elige qué parte se ve al recortar. Ejemplo:
     { src: 'assets/img/box/box-sala', encuadre: '50% 70%', alt: 'Sala principal con racks y barras' }   */
  galeria: [
    // Fotos del Instagram del gimnasio (@bigrhinotrainingclub). Ver CREDITS.md.
    { src: 'assets/img/box/box-comunidad-tatami', encuadre: '50% 78%', alt: 'Grupo entrenando de pie y sentado sobre el tatami gris del box, con la pared roja y el escudo de Big Rhino al fondo' },
    { src: 'assets/img/box/box-pared-logo', encuadre: '50% 40%', alt: 'Escudo de Big Rhino pintado sobre la pared de madera, con el rótulo Training Club debajo' },
    { src: 'assets/img/box/box-sala', encuadre: '50% 72%', alt: 'Vista general de la nave del box con varias parejas entrenando sobre el tatami' },
    { src: 'assets/img/box/box-grappling', encuadre: '50% 70%', alt: 'Dos personas haciendo grappling en el suelo junto a la pared roja con el escudo' },
    { src: 'assets/img/box/box-entreno-grupo', encuadre: '50% 72%', alt: 'Parejas practicando en el tatami bajo los lucernarios de la nave' },
    { src: 'assets/img/box/box-remo', encuadre: '50% 28%', alt: 'Una mujer entrenando en una máquina de remo en la zona de peso del box' },
  ],
  huecosGaleria: 6, // marcos vacíos que se ven en modo borrador

  /* -------------------------------------------------------------------- FAQ
     respuesta: null = pendiente. No se publica hasta tener respuesta.        */
  faq: [
    {
      pregunta: '¿Dónde está Big Rhino?',
      respuesta: 'En la calle Soto Galo, 14, 26009 Logroño. Pulsa «Cómo llegar» y Google Maps te marca la ruta desde donde estés.',
    },
    {
      pregunta: '¿Cómo pido una clase de prueba?',
      respuesta: 'Rellena el formulario de la página Clase de prueba, llama al 651 46 10 45, escribe a @bigrhinotrainingclub por Instagram o reserva en AimHarder, el sistema de reservas del box.',
    },
    { pregunta: '¿Puedo empezar si nunca he hecho CrossFit?', respuesta: null },
    {
      pregunta: '¿Cuánto cuesta entrenar?',
      respuesta: 'Hay planes mensuales por créditos (Basic, Start e Ilimitada), un bono de 10 sesiones a 90 €, tarifas trimestrales de BJJ desde 159 €, Pyramid Opositores a 85 €/mes y entrenamiento personal a 120 €/mes. Tienes todas en la página de clases.',
    },
    { pregunta: '¿Qué necesito llevar el primer día?', respuesta: null },
    { pregunta: '¿Hay vestuarios y duchas?', respuesta: null },
    { pregunta: '¿Hay aparcamiento cerca?', respuesta: null },
    { pregunta: '¿Se puede entrenar con Wellhub u otras plataformas?', respuesta: null },
  ],

  // Vídeo de portada: montaje de 15 s en blanco y negro, sin sonido. Para usar el vídeo
  // propio del gimnasio, cambia src, srcMovil y los pósteres, y pon stock: false.
  video: {
    src: 'assets/video/portada-1280.mp4',      // pantallas de 900 px o más (1280×720)
    srcMovil: 'assets/video/portada-movil.mp4', // móvil y tableta (540×960, vertical)
    stock: true,
    aviso: 'Vídeo de stock ilustrativo (Pexels). No es Big Rhino.',
  },


  legal: {
    titular: null, // razón social
    nif: null,
    domicilio: null,
  },
};
