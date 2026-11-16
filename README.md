# Big Rhino Training Club · web

Web del box de CrossFit Big Rhino Training Club (C. Soto Galo, 14, 26009 Logroño).

**Encargo:** el propietario de Big Rhino Training Club ha encargado esta web. El desarrollador está autorizado a desarrollar el proyecto y preparar sus archivos para subirlos a GitHub. El encargo no incluye derechos sobre fotos, vídeos, música, logotipos de terceros ni datos personales: todos los recursos externos y sus licencias están en [CREDITS.md](CREDITS.md).

**Estado: maqueta para revisar con el propietario.** Publicada en GitHub Pages solo para que la vea: https://crsdigitalizacion.github.io/big-rhino-training-club/ . Tiene `noindex` (no sale en Google) y un aviso amarillo fijo de «Maqueta… No es la web oficial».

## Estructura

Web estática: HTML, CSS y JavaScript sin dependencias ni proceso de compilación.

```
index.html             Inicio: portada, presentación con tira de fotos, entrenamientos, «Hoy en Big Rhino»
                       (clases del día en directo), opiniones de Google, preguntas frecuentes y pie
clases.html            Clases: ficha de cada clase (foto que aparece al bajar, texto, cuándo, precio) y tarifas
horarios.html          Horarios: semana de clases con filtro y día de hoy, Open Box y SmartKey, horario del box
box.html               El box: galería del espacio y la comunidad, qué hay en el box
prueba.html            Clase de prueba: cómo funciona, tarifas y formulario de solicitud
contacto.html          Contacto: teléfono, Instagram, reservas en AimHarder (y WhatsApp/correo si se rellenan), cómo llegar y mapa
aviso-legal.html       Plantillas legales con los datos del titular pendientes
privacidad.html
cookies.html
favicon.png            Icono (escudo del logo oficial) + apple-touch-icon.png
robots.txt
material/              Logo original entregado por el gimnasio (no lo carga la web)
assets/js/config.js    DATOS EDITABLES: clases, tarifas, horario semanal, horarios, contacto, galería, FAQ, vídeo
assets/js/main.js      Pinta los datos de config.js en todas las páginas, menú, vídeo, mapa a demanda
assets/js/telon.js     Telón con el escudo al pasar de una página a otra (se carga en el <head> de todas)
assets/js/asistente.js Asistente virtual «¿Dudas?» (botón flotante y chat) en las páginas principales
assets/css/styles.css  Estilos (colores, tipografía y espacios al principio, como variables)
assets/fonts/          Archivo e IBM Plex Mono autoalojadas
assets/img/            Pósteres de portada (WebP + JPG) y logo/ (escudo y capas de la intro 3D)
assets/video/          Vídeo de portada: horizontal (escritorio) y vertical (móvil)
CREDITS.md             Recursos externos y licencias
```

## Ejecutar en local

Hace falta un servidor (el vídeo y algunos navegadores no funcionan abriendo el archivo con doble clic). Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

y abre http://localhost:8000. Cualquier otro servidor estático vale (`npx serve`, la extensión Live Server de VS Code, etc.).

## Cómo actualizar datos

Todo se cambia en `assets/js/config.js`. Reglas:

- `null` = sin dato. La web muestra «[PENDIENTE DE CONFIRMAR CON EL GIMNASIO]» o no enseña el bloque.
- `confirmado: false` = dato de fichas públicas sin confirmar por el propietario. No se publica; en modo borrador aparece como nota de revisión.
- **Horario de atención (`horarioApertura`):** el de la ficha de Google, ya publicado. Cada fila lleva `numeros` (0 = domingo … 6 = sábado), `abre` y `cierra` para marcar «Hoy» y «Abierto ahora / Cerrado ahora» con la hora de Logroño.
- **Clases (`clases`):** cada una con su texto, puntos clave, foto y las tarifas que le corresponden. `textoProvisional: true` indica que el texto lo ha redactado la agencia y falta que lo apruebe el propietario (ya no se marca en pantalla, a petición del cliente).
- **Horario semanal (`horarioSemana`):** copiado del calendario de AimHarder (semana del 16 al 22/11/2026). Cada fila es `[inicio, fin, nombre en AimHarder, id de la clase]`. Se pinta en `horarios.html`; el «Cuándo» de cada clase se calcula solo.
- **Open Box (`openBox`):** horas de Open Box y de Rhino SmartKey que salen en `horarios.html`.
- **Tarifas (`tarifas`):** `estado: 'publicada'` = la publica el gimnasio en AimHarder; `'propuesto'` = el plan existe pero el precio es inventado: en borrador se ve sin aviso (maqueta para el dueño) y fuera del borrador sale «Consultar»; `'aprobado'` = el propietario ha aprobado el precio y se publica.
- **Clase de prueba:** `clasePrueba.precio` y `clasePrueba.condiciones`.
- **WhatsApp y correo:** rellena `whatsapp` / `correo` solo si el propietario quiere ofrecer ese canal; aparecen solos como tarjetas en `contacto.html`.
- **Galería:** guarda cada foto en `assets/img/` como `nombre-640.webp` y `nombre-1200.webp` y añade `{ src: 'assets/img/box/nombre', encuadre: '50% 70%', alt: '…' }` (`encuadre` elige qué parte se ve al recortar). Se cargan en diferido.
- **Vídeo propio:** sustituye `assets/video/portada-1280.mp4` (horizontal, 1280×720) y `portada-movil.mp4` (vertical, 540×960), y los pósteres de `assets/img/`; pon `video.stock: false` para quitar el aviso de stock. Ese aviso y el crédito del pie (y en `clases.html` el rótulo «Foto de stock ilustrativa», el aviso de la cabecera y el crédito de las fotos) no salen en modo borrador (maqueta para el cliente); al poner `modoBorrador: false` vuelven a salir mientras el vídeo sea de stock. El vídeo va en bucle continuo, sin botón de pausa; solo se detiene cuando la portada no está en pantalla. Recomendado: MP4 H.264, 10–15 s, sin audio, menos de 3 MB. El vídeo no se carga si el dispositivo tiene activado «reducir movimiento» o «ahorro de datos»: entonces se ve el póster.
- **Logo:** está en `assets/img/logo/`. Si cambia, hay que regenerar también las tres capas de la intro (`capa-*.webp`, mismo tamaño y encuadre).

## Animación de entrada (3D)

El escudo (con «CrossFit®» debajo) llega desde el fondo girando, con sus capas separadas en profundidad (borde rojo y negro, anillo amarillo, rinoceronte). Se ensambla y la cámara vuela hacia él: cada capa pasa por delante y la web aparece a través del anillo. Solo CSS 3D, sin librerías.

- Dura 2,3 s y nunca bloquea: no captura clics y se corta con cualquier tecla, clic, rueda o gesto (sin botón visible, a petición del cliente).
- Solo se ve en la primera visita (se guarda `br-intro` en el almacenamiento local) y nunca con «reducir movimiento» activado.
- Las capas y la palabra «CrossFit®» (≈135 KB) solo se descargan cuando hay animación. Si tardan más de 1 s, no se muestra.
- El código está en el `<script>` que sigue a `#intro` en `index.html`, y los tiempos en `styles.css` (`@keyframes intro-*`).
- Para volver a verla: borra el dato del sitio en el navegador o ejecuta `localStorage.removeItem('br-intro')` en la consola.

## Formulario de clase de prueba (`prueba.html`)

Pide nombre, teléfono, correo (opcional), la clase que quiere probar (lista sacada de `clases`), cuándo le viene mejor, su experiencia, un comentario y la aceptación de la política de privacidad. Valida en el navegador y lleva al primer campo con error. Desde cada ficha de clase, «Probar esta clase» abre el formulario con esa clase ya elegida (`prueba.html#id-de-la-clase`).

Cómo llegan las solicitudes (`formularioPrueba` en `config.js`):

- **`endpoint`** (recomendado): la URL de un servicio de formularios (Formspree, Getform, Basin…) o de un servidor propio. Recibe un POST con todos los campos y un `resumen` en texto. La web solo dice «Solicitud enviada» si el servicio responde bien; si falla, ofrece llamar.
- **Sin endpoint pero con `formularioPrueba.whatsapp`** (situación actual): abre WhatsApp con el mensaje ya escrito con todos los datos y la persona solo pulsa enviar. **Ahora apunta al número del responsable del proyecto (657 719 647) para la demo: cambiarlo por el del gimnasio antes de publicar.**
- **Sin ninguno**: prepara el mensaje y ofrece «Copiar y abrir Instagram» o llamar. No dice nunca que se haya enviado.

Antes de publicar hay que completar la política de privacidad con quién recibe los datos y cuánto tiempo se guardan.

## Fotos que van apareciendo (`clases.html`)

Al bajar por la página, cada foto de clase aparece cuando llega a la pantalla: una franja roja (amarilla en artes marciales) barre su hueco y, al retirarse, deja la foto descubierta, que se asienta con un ligero zoom. Las de la izquierda salen desde la izquierda y las de la derecha desde la derecha. No se activa con «reducir movimiento». Estilos al final de `styles.css` («CLASES: las fotos van apareciendo al bajar»).

## Asistente virtual (`assets/js/asistente.js`)

Botón flotante «¿Dudas?» abajo a la derecha que abre un chat con preguntas rápidas (horario, precios, clase de prueba, clases, ubicación, principiantes, artes marciales, oposiciones) y un campo para escribir. Reconoce palabras clave y responde con los datos de `config.js`, así que se actualiza solo al cambiarlos. No usa inteligencia artificial ni servicios externos. Lo que no sabe (aparcamiento, duchas…) lo deriva a llamar o a Instagram. Para añadir respuestas: objeto `R` y lista `CLAVES` del archivo.

## Inicio: «Hoy en Big Rhino» y opiniones

- **Hoy en Big Rhino:** muestra la fecha, si el box está abierto ahora (según el horario de atención), las clases de hoy sacadas de `horarioSemana` (las pasadas atenuadas, la que está en curso con barra de progreso y la siguiente con «en X min») y las horas de Open Box y SmartKey del día. Se actualiza cada minuto con la hora de Logroño. Si hoy no hay clases o ya han terminado, enseña las del próximo día.
- **Opiniones:** `opiniones` en `config.js` (nota, total, enlace a Google y fragmentos cortos con nombre e inicial). Desfilan en bucle y se paran al pasar el ratón. Antes de publicar, confirmar con el propietario que quiere mostrar estas reseñas.

## Telón entre páginas

Al pulsar un enlace a otra página de la web sube un telón negro con la franja roja y amarilla y el escudo; la página nueva empieza tapada y el telón se retira hacia arriba (unos 0,4 s al salir y 0,8 s al entrar). Lo controla `assets/js/telon.js` y los estilos están al final de `styles.css` (`telon-*`).

- No salta con anclas de la misma página, enlaces externos, teléfono, pestañas nuevas ni clic con Cmd/Ctrl.
- No sale con «reducir movimiento». Si algo falla, el CSS retira el telón solo.
- Si se llega al inicio desde otra página con el telón, no se repite la intro 3D.
- **Bienvenida:** al entrar a la web (una vez por visita, en cualquier página) el escudo aparece sobre negro, aguanta un instante y la cámara hace zoom a través de él mientras la página se abre (unos 1,7 s; se corta con cualquier tecla, clic o gesto). Tiempos en `@keyframes telon-zoom-logo` de `styles.css`. En la primera visita al inicio sale la intro 3D en su lugar. Para volver a verla, cierra la pestaña o borra el almacenamiento de sesión.

Tras cambiar CSS o JS, sube el número `?v=` de los enlaces en `index.html` para que los navegadores no usen la versión en caché.

## Antes de publicar

1. Revisar con el propietario todo lo marcado en amarillo (lista abajo).
2. `modoBorrador: false` en `config.js`.
3. Quitar `<meta name="robots" content="noindex, nofollow">` de `index.html`.
4. Con el dominio confirmado: rellenar `dominio`, añadir `<link rel="canonical">`, `og:url`, `og:image` y `Sitemap:` en `robots.txt`.
5. Completar las páginas legales con los datos del titular.
6. Añadir a `CREDITS.md` cualquier foto o vídeo nuevo con su permiso.

Para subirlo a GitHub (cuando se decida, no está hecho):

```bash
git init && git add . && git commit -m "Web Big Rhino Training Club (borrador)"
```

## Pendiente del propietario

| Dato o material | Estado en la web |
|---|---|
| Vídeo propio del box y permiso | Vídeo de stock de Pexels con aviso «No es Big Rhino» |
| Permiso para las fotos de la galería (sacadas de su Instagram) y consentimiento de las personas que salen | Galería con 6 fotos de su Instagram |
| Horario de atención (ficha de Google, 14/11/2026: L–V 9:30–22:00, sáb 10:30–15:00, dom cerrado) | Publicado a petición del cliente en `horarios.html`. Confirmar que sigue vigente: AimHarder tiene clases desde las 6:45 y Wellhub da otro horario |
| Horario de clases | Publicado desde el calendario de AimHarder (semana del 16 al 22/11/2026). Confirmar que es el horario habitual |
| Teléfono: AimHarder da 661 151 932 y Google 651 46 10 45 | La web usa el de Google. Confirmar cuál publicar |
| Correo: AimHarder publica coachcrossfitbigrhino@gmail.com | No publicado; confirmar si se quiere mostrar |
| Textos de cada clase (redactados por la agencia, salvo Opositores, Personal y SmartKey) | Borrador, pendiente de aprobación |
| Fotos de las clases | Stock de Pexels con aviso; sustituir por fotos del box |
| Precios de los planes Basic (8 créditos/mes), Start (13), Ilimitada (con SmartKey) y Rhino SmartKey. Los planes salen de su Instagram (publicación fijada «Tarifas», 23/02/2025); confirmar que siguen vigentes | En borrador, precios propuestos: 55, 65, 75 y 15 €/mes. Fuera del borrador salen con «Consultar» |
| Clases que aparecen en AimHarder pero sin sesiones en las últimas 5 semanas: Jiu Jitsu, Escuela de Halterofilia, Gimnásticos, Fundamentos, EMOM 40, Interval WOD, Leg Locks, Positional Sparring, Lecciones, WOD San Mateo, yoga y Kids | No publicadas |
| Instalaciones (Wellhub: zona funcional y zona de peso libre) | No publicadas |
| Texto de presentación y de la modalidad CrossFit | Borrador, pendiente de aprobación |
| Titular «Aquí no entrenas solo.» y frase de portada | Propuesta, pendiente de aprobación |
| Precio y condiciones de la clase de prueba | Pendiente (no se ha inventado) |
| ¿Acepta Wellhub u otras plataformas? (Wellhub lo lista desde el plan Gold) | Pregunta sin responder en la FAQ |
| Respuestas de FAQ: principiantes, qué llevar, vestuarios y duchas, aparcamiento | Sin publicar |
| WhatsApp (¿se ofrece este canal?) y correo | Ocultos |
| Dominio: crossfitbigrhino.com redirigía el 14/11/2026 a un sitio ajeno (advocaatturkije.nl) | Sin dominio; no conectar hasta confirmar quién lo controla |
| Datos legales del titular (razón social, NIF, domicilio, correo) | Plantillas con aviso |
| Número de WhatsApp del gimnasio para el formulario de clase de prueba | Para la demo llega al 657 719 647 (responsable del proyecto). Cambiar `formularioPrueba.whatsapp` antes de publicar |
| Precio y condiciones de la clase de prueba | La página dice «Te lo confirmamos al reservar» |
