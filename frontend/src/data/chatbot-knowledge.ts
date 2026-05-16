export interface KnowledgeEntry {
  id: number;
  category: string;
  keywords: string[];
  question: string;
  answer: string;
}

export const knowledgeBase: KnowledgeEntry[] = [
  // ============================================================
  // CATEGORÍA: PEDIDOS (70 entries, IDs 1-70)
  // ============================================================
  {
    id: 1,
    category: 'pedidos',
    keywords: ['hacer', 'pedido', 'comprar', 'compra', 'realizar', 'orden', 'pedir'],
    question: '¿Cómo hago un pedido en UrbanThread AI?',
    answer: 'Para hacer un pedido, navega por nuestro catálogo, selecciona los productos que te gusten, elige talla y color, y agrégalos al carrito. Luego haz clic en "Finalizar compra" y sigue los pasos de pago. ¡Soy Zyla y estoy aquí para ayudarte en cada paso!'
  },
  {
    id: 2,
    category: 'pedidos',
    keywords: ['estado', 'pedido', 'rastrear', 'seguimiento', 'donde', 'esta', 'mi', 'orden'],
    question: '¿Cómo puedo ver el estado de mi pedido?',
    answer: 'Puedes consultar el estado de tu pedido ingresando a tu Portal Cliente en la sección "Mis Pedidos". Allí verás el estado actualizado en tiempo real, desde la confirmación hasta la entrega.'
  },
  {
    id: 3,
    category: 'pedidos',
    keywords: ['tiempo', 'entrega', 'demora', 'tarda', 'llegar', 'dias', 'cuando', 'envio', 'cuanto'],
    question: '¿Cuánto tarda en llegar mi pedido?',
    answer: 'Los pedidos dentro de las principales ciudades de Colombia se entregan en 3 a 5 días hábiles. Para municipios y zonas rurales, el tiempo puede ser de 5 a 8 días hábiles.'
  },
  {
    id: 4,
    category: 'pedidos',
    keywords: ['cancelar', 'pedido', 'anular', 'cancelacion', 'cancelar orden'],
    question: '¿Puedo cancelar mi pedido?',
    answer: 'Sí, puedes cancelar tu pedido dentro de las primeras 2 horas después de realizado, siempre que no haya sido despachado. Ingresa a tu Portal Cliente, ve a "Mis Pedidos" y selecciona "Cancelar pedido".'
  },
  {
    id: 5,
    category: 'pedidos',
    keywords: ['modificar', 'cambiar', 'pedido', 'editar', 'direccion', 'talla'],
    question: '¿Puedo modificar mi pedido después de realizarlo?',
    answer: 'Puedes modificar la dirección de entrega o datos de contacto dentro de las primeras 2 horas. Para cambios de talla o producto, te recomendamos cancelar el pedido y realizar uno nuevo.'
  },
  {
    id: 6,
    category: 'pedidos',
    keywords: ['numero', 'pedido', 'orden', 'referencia', 'codigo', 'confirmacion'],
    question: '¿Dónde encuentro el número de mi pedido?',
    answer: 'Tu número de pedido se envía al correo electrónico registrado justo después de confirmar la compra. También lo puedes encontrar en tu Portal Cliente, sección "Mis Pedidos".'
  },
  {
    id: 7,
    category: 'pedidos',
    keywords: ['pedido', 'minimo', 'monto', 'compra', 'minima', 'valor', 'mayor', 'menor'],
    question: '¿Hay un monto mínimo de compra?',
    answer: 'No hay monto mínimo de compra en UrbanThread AI. Puedes comprar desde un solo artículo. Sin embargo, para envío gratis el pedido debe superar los $149.900 COP.'
  },
  {
    id: 8,
    category: 'pedidos',
    keywords: ['pedido', 'no', 'llego', 'llega', 'perdido', 'extraviado', 'no llega'],
    question: '¿Qué hago si mi pedido no ha llegado?',
    answer: 'Si tu pedido supera el tiempo estimado de entrega, por favor comunícate con nosotros por WhatsApp al 300 509 1114 o crea una radicación en tu Portal Cliente. Zyla te ayudará a rastrear tu envío.'
  },
  {
    id: 9,
    category: 'pedidos',
    keywords: ['pedido', 'equivocado', 'error', 'producto', 'incorrecto', 'otro'],
    question: '¿Qué hago si recibí un producto equivocado?',
    answer: 'Lamentamos el inconveniente. Crea una radicación en tu Portal Cliente seleccionando "Producto incorrecto" y adjunta fotos del artículo recibido. Gestionaremos el cambio sin costo adicional en 3 a 5 días hábiles.'
  },
  {
    id: 10,
    category: 'pedidos',
    keywords: ['regalo', 'envolver', 'empaque', 'obsequio', 'dedicatoria', 'tarjeta'],
    question: '¿Puedo enviar mi pedido como regalo?',
    answer: 'Sí, al finalizar tu compra puedes seleccionar la opción "Enviar como regalo" por $9.900 COP adicionales. Incluye empaque especial y una tarjeta con dedicatoria personalizada.'
  },
  {
    id: 11,
    category: 'pedidos',
    keywords: ['factura', 'pedido', 'comprobante', 'recibo', 'factura electronica'],
    question: '¿Cómo obtengo la factura de mi pedido?',
    answer: 'La factura electrónica se envía automáticamente a tu correo una vez confirmado el pago. También puedes descargarla desde tu Portal Cliente en la sección "Documentos".'
  },
  {
    id: 12,
    category: 'pedidos',
    keywords: ['varios', 'pedidos', 'multiples', 'juntar', 'unir', 'combinar'],
    question: '¿Puedo combinar varios pedidos en uno solo?',
    answer: 'Actualmente no es posible combinar pedidos ya realizados. Te recomendamos agregar todos los productos al carrito antes de finalizar la compra para ahorrar en costos de envío.'
  },
  {
    id: 13,
    category: 'pedidos',
    keywords: ['pedido', 'telefono', 'llamada', 'telefonico', 'por telefono'],
    question: '¿Puedo hacer un pedido por teléfono?',
    answer: 'Por el momento, los pedidos solo se pueden realizar a través de nuestra página web o app. Si necesitas ayuda durante el proceso, Zyla está disponible en el chat para guiarte paso a paso.'
  },
  {
    id: 14,
    category: 'pedidos',
    keywords: ['historial', 'pedidos', 'anteriores', 'compras', 'pasadas', 'historial compras'],
    question: '¿Dónde veo mi historial de pedidos?',
    answer: 'Ingresa a tu Portal Cliente y dirígete a "Mis Pedidos". Allí encontrarás el historial completo de todas tus compras, con detalles de cada pedido, estado y factura.'
  },
  {
    id: 15,
    category: 'pedidos',
    keywords: ['recompra', 'repetir', 'volver', 'comprar', 'mismo', 'otra vez'],
    question: '¿Puedo repetir un pedido anterior?',
    answer: 'Sí, desde tu historial de pedidos puedes seleccionar "Volver a pedir" en cualquier orden anterior. Los productos se agregarán al carrito automáticamente, sujeto a disponibilidad.'
  },
  {
    id: 16,
    category: 'pedidos',
    keywords: ['confirmacion', 'correo', 'email', 'notificacion', 'pedido confirmado'],
    question: '¿Recibiré una confirmación de mi pedido?',
    answer: 'Sí, recibirás un correo de confirmación inmediatamente después de realizar tu compra con el resumen del pedido, número de orden y tiempo estimado de entrega.'
  },
  {
    id: 17,
    category: 'pedidos',
    keywords: ['pedido', 'pendiente', 'procesando', 'en proceso', 'preparacion'],
    question: '¿Qué significa que mi pedido está "en proceso"?',
    answer: 'Significa que tu pago fue confirmado y estamos preparando tu pedido en nuestro centro de distribución. Recibirás una notificación cuando sea despachado con el número de guía.'
  },
  {
    id: 18,
    category: 'pedidos',
    keywords: ['guia', 'numero guia', 'tracking', 'rastreo', 'transportadora'],
    question: '¿Cómo obtengo el número de guía de mi pedido?',
    answer: 'El número de guía se envía a tu correo electrónico una vez despachado el pedido. También lo encuentras en tu Portal Cliente en los detalles del pedido, junto con el enlace de rastreo de la transportadora.'
  },
  {
    id: 19,
    category: 'pedidos',
    keywords: ['pedido', 'grande', 'mayorista', 'cantidad', 'al por mayor', 'corporativo'],
    question: '¿Puedo hacer pedidos al por mayor o corporativos?',
    answer: 'Sí, manejamos pedidos corporativos y al por mayor con precios especiales. Escríbenos a corporativo@urbanthread.co o por WhatsApp al 300 509 1114 para recibir una cotización personalizada.'
  },
  {
    id: 20,
    category: 'pedidos',
    keywords: ['direccion', 'envio', 'cambiar direccion', 'otra direccion', 'domicilio'],
    question: '¿Puedo enviar mi pedido a una dirección diferente?',
    answer: 'Sí, durante el proceso de compra puedes ingresar cualquier dirección de entrega en Colombia. También puedes guardar múltiples direcciones en tu perfil para futuras compras.'
  },
  {
    id: 21,
    category: 'pedidos',
    keywords: ['pedido', 'despachado', 'enviado', 'salio', 'despacho'],
    question: '¿Cómo sé si mi pedido ya fue despachado?',
    answer: 'Recibirás un correo y una notificación push cuando tu pedido sea despachado. En tu Portal Cliente el estado cambiará a "Enviado" con la información de la transportadora.'
  },
  {
    id: 22,
    category: 'pedidos',
    keywords: ['pedido', 'incompleto', 'falta', 'producto', 'faltante'],
    question: '¿Qué hago si mi pedido llegó incompleto?',
    answer: 'Si falta algún producto en tu pedido, crea una radicación en tu Portal Cliente seleccionando "Pedido incompleto". Adjunta fotos del paquete y los productos recibidos. Resolveremos tu caso en máximo 48 horas.'
  },
  {
    id: 23,
    category: 'pedidos',
    keywords: ['programar', 'entrega', 'fecha', 'agendar', 'dia especifico'],
    question: '¿Puedo programar la fecha de entrega de mi pedido?',
    answer: 'Actualmente no ofrecemos programación de fecha exacta de entrega. Los pedidos se entregan en el rango de 3 a 5 días hábiles según la zona. Estamos trabajando para ofrecer esta opción pronto.'
  },
  {
    id: 24,
    category: 'pedidos',
    keywords: ['pedido', 'devuelto', 'rechazado', 'no recibido', 'devolucion transportadora'],
    question: '¿Qué pasa si la transportadora devuelve mi pedido?',
    answer: 'Si la transportadora no pudo entregar tu pedido, se realizarán hasta 3 intentos de entrega. Si no se logra, el pedido regresa a nuestro centro y te contactaremos para coordinar un nuevo envío.'
  },
  {
    id: 25,
    category: 'pedidos',
    keywords: ['costo', 'envio', 'gratis', 'gratuito', 'flete', 'domicilio', 'precio envio'],
    question: '¿Cuánto cuesta el envío de mi pedido?',
    answer: 'El envío estándar tiene un costo de $12.900 COP para las principales ciudades. Para compras superiores a $149.900 COP, el envío es totalmente gratis. Zonas rurales pueden tener un costo adicional.'
  },
  {
    id: 26,
    category: 'pedidos',
    keywords: ['pedido', 'express', 'rapido', 'urgente', 'mismo dia', 'hoy'],
    question: '¿Tienen envío express o para el mismo día?',
    answer: 'Sí, ofrecemos envío express en Bogotá, Medellín y Cali con entrega en 24 horas por $19.900 COP adicionales. El pedido debe realizarse antes de las 12:00 p.m. para garantizar la entrega al día siguiente.'
  },
  {
    id: 27,
    category: 'pedidos',
    keywords: ['cupon', 'descuento', 'codigo', 'promocional', 'aplicar', 'cupon pedido'],
    question: '¿Cómo aplico un cupón de descuento a mi pedido?',
    answer: 'En el carrito de compras encontrarás el campo "Código de descuento". Ingresa tu cupón y haz clic en "Aplicar". El descuento se reflejará automáticamente en el total antes de proceder al pago.'
  },
  {
    id: 28,
    category: 'pedidos',
    keywords: ['pedido', 'reembolso', 'devolucion dinero', 'plata', 'reintegro'],
    question: '¿Cuánto tarda el reembolso de un pedido cancelado?',
    answer: 'El reembolso por cancelación se procesa en 5 a 10 días hábiles dependiendo de tu entidad bancaria. Si pagaste con tarjeta de crédito, puede reflejarse en tu siguiente estado de cuenta.'
  },
  {
    id: 29,
    category: 'pedidos',
    keywords: ['pedido', 'otra persona', 'tercero', 'recibir', 'autorizar'],
    question: '¿Puede otra persona recibir mi pedido?',
    answer: 'Sí, cualquier persona mayor de edad que se encuentre en la dirección de entrega puede recibir el pedido presentando su documento de identidad. No se requiere autorización previa.'
  },
  {
    id: 30,
    category: 'pedidos',
    keywords: ['peso', 'pedido', 'limite', 'maximo', 'cantidad productos'],
    question: '¿Hay un límite de productos por pedido?',
    answer: 'No hay un límite estricto de productos por pedido. Sin embargo, para pedidos superiores a 20 unidades, te recomendamos contactar a nuestro equipo corporativo para obtener mejores condiciones.'
  },
  {
    id: 31,
    category: 'pedidos',
    keywords: ['pedido', 'whatsapp', 'chat', 'mensaje', 'pedir por whatsapp'],
    question: '¿Puedo hacer un pedido por WhatsApp?',
    answer: 'Actualmente los pedidos se realizan exclusivamente por nuestra página web. Sin embargo, por WhatsApp al 300 509 1114 puedes recibir asesoría de Zyla para elegir tus productos y resolver dudas.'
  },
  {
    id: 32,
    category: 'pedidos',
    keywords: ['nota', 'pedido', 'instrucciones', 'comentario', 'observacion'],
    question: '¿Puedo agregar notas o instrucciones a mi pedido?',
    answer: 'Sí, durante el checkout encontrarás un campo de "Notas del pedido" donde puedes agregar instrucciones especiales de entrega o comentarios para nuestro equipo.'
  },
  {
    id: 33,
    category: 'pedidos',
    keywords: ['pedido', 'fin semana', 'sabado', 'domingo', 'festivo'],
    question: '¿Procesan pedidos los fines de semana?',
    answer: 'Los pedidos realizados los fines de semana y festivos se procesan el siguiente día hábil. El tiempo de entrega se cuenta a partir de ese momento.'
  },
  {
    id: 34,
    category: 'pedidos',
    keywords: ['stock', 'agotado', 'disponibilidad', 'sin stock', 'no hay'],
    question: '¿Qué pasa si un producto se agota después de hacer mi pedido?',
    answer: 'En el caso poco probable de que un producto se agote después de tu compra, te contactaremos para ofrecerte un producto similar o realizar el reembolso del artículo no disponible.'
  },
  {
    id: 35,
    category: 'pedidos',
    keywords: ['lista', 'deseos', 'guardar', 'favoritos', 'wishlist', 'despues'],
    question: '¿Puedo guardar productos para comprar después?',
    answer: 'Sí, usa nuestra función de Lista de Deseos haciendo clic en el ícono de corazón en cada producto. Podrás acceder a tu lista desde tu perfil y agregar los productos al carrito cuando quieras.'
  },
  {
    id: 36,
    category: 'pedidos',
    keywords: ['carrito', 'vacio', 'productos', 'desaparecieron', 'perdieron'],
    question: '¿Por qué se vació mi carrito de compras?',
    answer: 'El carrito se mantiene activo por 72 horas. Si los productos desaparecieron, puede ser porque expiró la sesión o los artículos se agotaron. Te recomendamos iniciar sesión para que tu carrito se guarde permanentemente.'
  },
  {
    id: 37,
    category: 'pedidos',
    keywords: ['preventa', 'reserva', 'proximamente', 'nueva coleccion', 'lanzamiento'],
    question: '¿Puedo reservar productos de nuevas colecciones?',
    answer: 'Sí, algunos productos de nuevas colecciones están disponibles en preventa. Puedes reservarlos con un pago anticipado y serán enviados en la fecha de lanzamiento indicada en la ficha del producto.'
  },
  {
    id: 38,
    category: 'pedidos',
    keywords: ['pedido', 'internacional', 'fuera', 'colombia', 'exterior', 'otro pais'],
    question: '¿Puedo hacer pedidos desde fuera de Colombia?',
    answer: 'Actualmente realizamos envíos dentro de Colombia. Para envíos internacionales, estamos trabajando en habilitarlos próximamente. Puedes suscribirte a nuestro newsletter para enterarte cuando esté disponible.'
  },
  {
    id: 39,
    category: 'pedidos',
    keywords: ['verificar', 'pago', 'pedido', 'aprobado', 'rechazado', 'transaccion'],
    question: '¿Cómo sé si mi pago fue aprobado?',
    answer: 'Recibirás un correo de confirmación inmediato si tu pago fue aprobado. Si fue rechazado, verás un mensaje en pantalla indicando el motivo. Puedes intentar con otro medio de pago.'
  },
  {
    id: 40,
    category: 'pedidos',
    keywords: ['doble', 'cobro', 'duplicado', 'cobraron dos veces', 'doble cargo'],
    question: '¿Me cobraron dos veces por el mismo pedido?',
    answer: 'Si ves un doble cobro, no te preocupes. Puede ser una retención temporal de tu banco que se libera en 24-48 horas. Si persiste, contáctanos por WhatsApp con el comprobante y lo solucionamos de inmediato.'
  },
  {
    id: 41,
    category: 'pedidos',
    keywords: ['empaque', 'paquete', 'caja', 'bolsa', 'presentacion'],
    question: '¿Cómo llega empacado mi pedido?',
    answer: 'Tu pedido llega en una caja de cartón reciclable con el logo de UrbanThread AI. Cada prenda viene en una bolsa de tela reutilizable. Para regalos, ofrecemos empaque premium por $9.900 COP.'
  },
  {
    id: 42,
    category: 'pedidos',
    keywords: ['pedido', 'dañado', 'roto', 'maltratado', 'golpeado'],
    question: '¿Qué hago si mi pedido llegó dañado?',
    answer: 'Lamentamos mucho eso. Toma fotos del empaque y del producto dañado, y crea una radicación en tu Portal Cliente. Gestionaremos el reenvío o reembolso sin costo en un plazo de 3 a 5 días hábiles.'
  },
  {
    id: 43,
    category: 'pedidos',
    keywords: ['cambiar', 'metodo', 'pago', 'despues', 'pedido', 'forma pago'],
    question: '¿Puedo cambiar el método de pago después de hacer el pedido?',
    answer: 'No es posible cambiar el método de pago una vez confirmado el pedido. Si necesitas usar otro medio, puedes cancelar el pedido dentro de las 2 horas y realizar uno nuevo.'
  },
  {
    id: 44,
    category: 'pedidos',
    keywords: ['notificaciones', 'pedido', 'alertas', 'avisos', 'actualizaciones'],
    question: '¿Recibiré notificaciones sobre mi pedido?',
    answer: 'Sí, te enviamos notificaciones por correo electrónico en cada etapa: confirmación, despacho y entrega. También puedes activar notificaciones push desde tu Portal Cliente para seguimiento en tiempo real.'
  },
  {
    id: 45,
    category: 'pedidos',
    keywords: ['pedido', 'recogida', 'tienda', 'recoger', 'punto', 'pickup'],
    question: '¿Puedo recoger mi pedido en tienda?',
    answer: 'Actualmente no contamos con opción de recogida en tienda física. Todos los pedidos se entregan a domicilio a través de nuestras transportadoras aliadas en todo Colombia.'
  },
  {
    id: 46,
    category: 'pedidos',
    keywords: ['seguro', 'pedido', 'garantia', 'proteccion', 'asegurar'],
    question: '¿Mi pedido tiene seguro de envío?',
    answer: 'Todos los pedidos de UrbanThread AI incluyen seguro de envío sin costo adicional. Si tu paquete se pierde o daña durante el transporte, te reenviamos los productos o realizamos el reembolso completo.'
  },
  {
    id: 47,
    category: 'pedidos',
    keywords: ['horario', 'entrega', 'hora', 'rango', 'cuando entregan'],
    question: '¿En qué horario entregan los pedidos?',
    answer: 'Las entregas se realizan de lunes a sábado entre las 8:00 a.m. y las 6:00 p.m. La transportadora te contactará el día de la entrega para coordinar la hora aproximada.'
  },
  {
    id: 48,
    category: 'pedidos',
    keywords: ['pedido', 'apartado', 'separar', 'reservar', 'apartar'],
    question: '¿Puedo apartar un producto sin pagar?',
    answer: 'No manejamos sistema de apartado. Los productos se reservan únicamente al completar el pago. Te recomendamos agregarlos a tu Lista de Deseos para no perderlos de vista.'
  },
  {
    id: 49,
    category: 'pedidos',
    keywords: ['primera', 'compra', 'nuevo', 'cliente', 'descuento', 'bienvenida'],
    question: '¿Hay descuento para mi primera compra?',
    answer: '¡Sí! Los nuevos clientes reciben un 15% de descuento en su primera compra al registrarse. El código de bienvenida se envía automáticamente a tu correo electrónico al crear tu cuenta.'
  },
  {
    id: 50,
    category: 'pedidos',
    keywords: ['pedido', 'app', 'aplicacion', 'movil', 'celular'],
    question: '¿Puedo hacer pedidos desde la app móvil?',
    answer: 'Nuestra plataforma web está optimizada para dispositivos móviles, así que puedes comprar cómodamente desde tu celular. Estamos desarrollando la app nativa que estará disponible próximamente.'
  },
  {
    id: 51,
    category: 'pedidos',
    keywords: ['pedido', 'empresa', 'nit', 'factura empresa', 'razon social'],
    question: '¿Puedo facturar mi pedido a nombre de una empresa?',
    answer: 'Sí, durante el checkout puedes seleccionar "Facturación empresarial" e ingresar el NIT y razón social de tu empresa. La factura electrónica se generará con los datos corporativos.'
  },
  {
    id: 52,
    category: 'pedidos',
    keywords: ['puntos', 'acumular', 'fidelidad', 'recompensas', 'programa'],
    question: '¿Acumulo puntos con mis pedidos?',
    answer: 'Sí, con cada compra acumulas puntos UrbanThread que puedes redimir en futuras compras. Por cada $1.000 COP gastados, recibes 1 punto. Cada 100 puntos equivalen a $5.000 COP de descuento.'
  },
  {
    id: 53,
    category: 'pedidos',
    keywords: ['pedido', 'tarjeta', 'regalo', 'gift card', 'bono', 'vale'],
    question: '¿Puedo pagar mi pedido con una tarjeta de regalo?',
    answer: 'Sí, aceptamos tarjetas de regalo UrbanThread AI. Ingresa el código de tu tarjeta en el campo "Tarjeta de regalo" durante el checkout. Puedes combinarla con otro medio de pago si el saldo no cubre el total.'
  },
  {
    id: 54,
    category: 'pedidos',
    keywords: ['pedido', 'talla', 'equivocada', 'error talla', 'me equivoque'],
    question: '¿Qué hago si pedí la talla equivocada?',
    answer: 'No te preocupes, puedes solicitar un cambio de talla dentro de los 30 días siguientes a la entrega. El producto debe estar sin uso y con etiquetas. Crea una radicación de cambio en tu Portal Cliente.'
  },
  {
    id: 55,
    category: 'pedidos',
    keywords: ['pedido', 'sorpresa', 'discreto', 'sin logo', 'privado'],
    question: '¿Pueden enviar mi pedido en empaque discreto?',
    answer: 'Sí, puedes solicitar empaque discreto sin logo visible en las notas del pedido durante el checkout. Es ideal para regalos sorpresa. No tiene costo adicional.'
  },
  {
    id: 56,
    category: 'pedidos',
    keywords: ['split', 'dividir', 'pedido', 'envios separados', 'parcial'],
    question: '¿Mi pedido puede llegar en envíos separados?',
    answer: 'Sí, si los productos de tu pedido se encuentran en diferentes centros de distribución, pueden llegar en envíos separados. Recibirás un número de guía por cada envío sin costo adicional.'
  },
  {
    id: 57,
    category: 'pedidos',
    keywords: ['pedido', 'navidad', 'diciembre', 'temporada', 'demora temporada'],
    question: '¿Los pedidos tardan más en temporada de diciembre?',
    answer: 'En temporada alta (noviembre-diciembre) los tiempos de entrega pueden extenderse 1-2 días adicionales. Te recomendamos hacer tus compras con anticipación para garantizar la entrega a tiempo.'
  },
  {
    id: 58,
    category: 'pedidos',
    keywords: ['contraentrega', 'pago entrega', 'pagar al recibir', 'contra entrega'],
    question: '¿Puedo pagar contra entrega?',
    answer: 'Sí, ofrecemos pago contra entrega en las principales ciudades de Colombia con un recargo de $5.900 COP. El pago se realiza en efectivo al momento de recibir tu pedido.'
  },
  {
    id: 59,
    category: 'pedidos',
    keywords: ['pedido', 'reemplazo', 'sustituir', 'alternativa', 'similar'],
    question: '¿Pueden enviarme un producto alternativo si el mío está agotado?',
    answer: 'No enviamos productos sustitutos sin tu autorización. Si un artículo se agota, te contactaremos para ofrecerte alternativas similares o proceder con el reembolso de ese producto.'
  },
  {
    id: 60,
    category: 'pedidos',
    keywords: ['pedido', 'verificacion', 'identidad', 'documento', 'cedula'],
    question: '¿Necesito presentar documento al recibir mi pedido?',
    answer: 'Sí, la persona que reciba el pedido debe presentar un documento de identidad vigente. Esto es por seguridad y para confirmar la entrega exitosa.'
  },
  {
    id: 61,
    category: 'pedidos',
    keywords: ['pedido', 'casillero', 'porteria', 'recepcion', 'edificio', 'conjunto'],
    question: '¿Pueden dejar mi pedido en la portería?',
    answer: 'Sí, la transportadora puede dejar el pedido en la portería o recepción del edificio. La persona que reciba debe firmar y presentar documento. Puedes indicar esta preferencia en las notas del pedido.'
  },
  {
    id: 62,
    category: 'pedidos',
    keywords: ['pedido', 'zona rural', 'vereda', 'pueblo', 'municipio'],
    question: '¿Hacen envíos a zonas rurales?',
    answer: 'Sí, realizamos envíos a la mayoría de municipios y zonas rurales de Colombia. El tiempo de entrega es de 5 a 8 días hábiles y puede tener un costo adicional de $8.900 COP según la ubicación.'
  },
  {
    id: 63,
    category: 'pedidos',
    keywords: ['pedido', 'isla', 'san andres', 'providencia', 'insular'],
    question: '¿Envían pedidos a San Andrés y Providencia?',
    answer: 'Sí, realizamos envíos a San Andrés y Providencia con un tiempo de entrega de 7 a 10 días hábiles. El costo de envío es de $24.900 COP debido a la logística aérea requerida.'
  },
  {
    id: 64,
    category: 'pedidos',
    keywords: ['pedido', 'black friday', 'cyber', 'oferta', 'descuento especial'],
    question: '¿Tienen ofertas especiales en Black Friday?',
    answer: 'Sí, en Black Friday y Cyber Monday ofrecemos descuentos de hasta el 50% en colecciones seleccionadas. Suscríbete a nuestro newsletter para recibir acceso anticipado a las ofertas.'
  },
  {
    id: 65,
    category: 'pedidos',
    keywords: ['pedido', 'error', 'pagina', 'fallo', 'no funciona', 'bug'],
    question: '¿Qué hago si la página falla al hacer mi pedido?',
    answer: 'Si experimentas problemas técnicos, intenta limpiar la caché de tu navegador o usar otro navegador. Si el problema persiste, contáctanos por WhatsApp al 300 509 1114 y Zyla te ayudará a completar tu compra.'
  },
  {
    id: 66,
    category: 'pedidos',
    keywords: ['pedido', 'impuestos', 'iva', 'incluido', 'precio final'],
    question: '¿Los precios incluyen IVA?',
    answer: 'Sí, todos los precios publicados en UrbanThread AI incluyen IVA. El precio que ves es el precio final que pagas, sin cargos ocultos. Solo se suma el costo de envío si aplica.'
  },
  {
    id: 67,
    category: 'pedidos',
    keywords: ['pedido', 'multiples', 'direcciones', 'diferentes', 'enviar a varios'],
    question: '¿Puedo enviar productos de un mismo pedido a diferentes direcciones?',
    answer: 'Actualmente cada pedido se envía a una sola dirección. Si necesitas enviar a diferentes direcciones, te recomendamos realizar pedidos separados para cada destino.'
  },
  {
    id: 68,
    category: 'pedidos',
    keywords: ['pedido', 'urgente', 'prioridad', 'acelerar', 'rapido'],
    question: '¿Puedo acelerar el envío de un pedido ya realizado?',
    answer: 'Si tu pedido aún no ha sido despachado, contáctanos por WhatsApp y podemos intentar cambiar a envío express por $19.900 COP adicionales (disponible en Bogotá, Medellín y Cali).'
  },
  {
    id: 69,
    category: 'pedidos',
    keywords: ['pedido', 'recurrente', 'suscripcion', 'automatico', 'mensual'],
    question: '¿Tienen opción de pedidos recurrentes o suscripción?',
    answer: 'Actualmente no ofrecemos suscripciones de productos recurrentes. Sin embargo, puedes usar la función "Volver a pedir" desde tu historial para repetir compras fácilmente.'
  },
  {
    id: 70,
    category: 'pedidos',
    keywords: ['pedido', 'ayuda', 'asesoria', 'valentina', 'chatbot', 'asistente'],
    question: '¿Zyla puede ayudarme a hacer un pedido?',
    answer: 'Soy Zyla, tu asistente virtual de UrbanThread AI. Puedo ayudarte a encontrar productos, resolver dudas sobre tallas, verificar disponibilidad y guiarte en el proceso de compra. ¡Pregúntame lo que necesites!'
  },
  // ============================================================
  // CATEGORÍA: ENVÍOS (50 entries, IDs 71-120)
  // ============================================================
  {
    id: 71,
    category: 'envios',
    keywords: ['metodos', 'envio', 'tipos', 'opciones', 'formas envio'],
    question: '¿Qué métodos de envío tienen disponibles?',
    answer: 'Ofrecemos envío estándar (3-5 días hábiles, $12.900 COP), envío express en ciudades principales (24 horas, $19.900 COP) y envío gratis en compras superiores a $149.900 COP.'
  },
  {
    id: 72,
    category: 'envios',
    keywords: ['transportadora', 'empresa', 'envio', 'mensajeria', 'paqueteria'],
    question: '¿Qué transportadoras utilizan?',
    answer: 'Trabajamos con las principales transportadoras de Colombia: Servientrega, Coordinadora y Envia. La asignación depende de tu ubicación para garantizar el mejor tiempo de entrega.'
  },
  {
    id: 73,
    category: 'envios',
    keywords: ['rastrear', 'envio', 'seguimiento', 'tracking', 'donde esta'],
    question: '¿Cómo rastreo mi envío?',
    answer: 'Una vez despachado tu pedido, recibirás un correo con el número de guía y un enlace directo al rastreo de la transportadora. También puedes consultarlo en tu Portal Cliente en "Mis Pedidos".'
  },
  {
    id: 74,
    category: 'envios',
    keywords: ['envio', 'gratis', 'gratuito', 'sin costo', 'free shipping', 'aplica', 'tienen'],
    question: '¿Cuándo aplica el envío gratis?',
    answer: 'El envío gratis aplica automáticamente en compras iguales o superiores a $149.900 COP antes de descuentos. Es válido para envío estándar a cualquier destino dentro de Colombia.'
  },
  {
    id: 75,
    category: 'envios',
    keywords: ['envio', 'internacional', 'exterior', 'fuera colombia', 'otro pais'],
    question: '¿Realizan envíos internacionales?',
    answer: 'Actualmente solo realizamos envíos dentro de Colombia. Estamos trabajando para habilitar envíos internacionales a Latinoamérica y Estados Unidos próximamente. ¡Mantente atento a nuestras novedades!'
  },
  {
    id: 76,
    category: 'envios',
    keywords: ['empaque', 'sostenible', 'ecologico', 'reciclable', 'packaging'],
    question: '¿El empaque de envío es ecológico?',
    answer: 'Sí, en UrbanThread AI usamos empaques 100% reciclables y biodegradables. Nuestras cajas son de cartón certificado FSC y las bolsas internas son de tela reutilizable. ¡Cuidamos el planeta contigo!'
  },
  {
    id: 77,
    category: 'envios',
    keywords: ['envio', 'bogota', 'capital', 'ciudad', 'urbano'],
    question: '¿Cuánto tarda el envío en Bogotá?',
    answer: 'En Bogotá el envío estándar tarda de 1 a 3 días hábiles. Con envío express, tu pedido llega en 24 horas si lo realizas antes de las 12:00 p.m.'
  },
  {
    id: 78,
    category: 'envios',
    keywords: ['envio', 'medellin', 'antioquia', 'cali', 'valle'],
    question: '¿Cuánto tarda el envío a Medellín y Cali?',
    answer: 'Los envíos a Medellín y Cali tardan de 2 a 4 días hábiles con envío estándar. También está disponible el envío express con entrega en 24 horas por $19.900 COP.'
  },
  {
    id: 79,
    category: 'envios',
    keywords: ['envio', 'costa', 'barranquilla', 'cartagena', 'caribe'],
    question: '¿Cuánto tarda el envío a la Costa Caribe?',
    answer: 'Los envíos a Barranquilla, Cartagena y Santa Marta tardan de 3 a 5 días hábiles. Para otros municipios de la Costa, el tiempo puede ser de 5 a 7 días hábiles.'
  },
  {
    id: 80,
    category: 'envios',
    keywords: ['envio', 'cobertura', 'ciudades', 'donde', 'envian', 'destinos'],
    question: '¿A qué ciudades envían?',
    answer: 'Enviamos a todas las ciudades y la mayoría de municipios de Colombia. Nuestra cobertura incluye más de 1.100 destinos en todo el país. Ingresa tu código postal en el checkout para verificar disponibilidad.'
  },
  {
    id: 81,
    category: 'envios',
    keywords: ['envio', 'demora', 'retraso', 'tarde', 'no llega', 'atrasado'],
    question: '¿Qué hago si mi envío está retrasado?',
    answer: 'Si tu envío supera el tiempo estimado, verifica el estado con el número de guía. Si no hay actualización en 48 horas, crea una radicación en tu Portal Cliente y nuestro equipo investigará con la transportadora.'
  },
  {
    id: 82,
    category: 'envios',
    keywords: ['envio', 'fragil', 'delicado', 'cuidado', 'proteccion'],
    question: '¿Cómo protegen los productos frágiles durante el envío?',
    answer: 'Los productos delicados como accesorios y fragancias se empaquetan con protección adicional: papel burbuja, separadores de cartón y etiqueta de "Frágil" para que la transportadora los maneje con cuidado.'
  },
  {
    id: 83,
    category: 'envios',
    keywords: ['envio', 'peso', 'volumen', 'grande', 'pesado', 'dimensiones'],
    question: '¿El costo de envío varía según el peso del paquete?',
    answer: 'El costo de envío estándar es fijo de $12.900 COP independientemente del peso para pedidos regulares. Solo para pedidos muy voluminosos (más de 10 kg) puede aplicar un cargo adicional.'
  },
  {
    id: 84,
    category: 'envios',
    keywords: ['envio', 'cambiar', 'direccion', 'redirigir', 'modificar destino'],
    question: '¿Puedo cambiar la dirección de envío después del despacho?',
    answer: 'Una vez despachado el pedido, no es posible cambiar la dirección. Si la transportadora no puede entregar, se realizarán hasta 3 intentos. Contáctanos por WhatsApp para coordinar una solución.'
  },
  {
    id: 85,
    category: 'envios',
    keywords: ['envio', 'apartado', 'aereo', 'po box', 'casilla'],
    question: '¿Envían a apartados aéreos o casillas postales?',
    answer: 'No realizamos envíos a apartados aéreos ni casillas postales. Necesitamos una dirección física completa para garantizar la entrega exitosa de tu pedido.'
  },
  {
    id: 86,
    category: 'envios',
    keywords: ['envio', 'intentos', 'entrega', 'no estaba', 'ausente'],
    question: '¿Cuántos intentos de entrega realizan?',
    answer: 'La transportadora realiza hasta 3 intentos de entrega en días hábiles diferentes. Si no se logra la entrega, el paquete regresa a nuestro centro de distribución y te contactaremos para coordinar un nuevo envío.'
  },
  {
    id: 87,
    category: 'envios',
    keywords: ['envio', 'festivo', 'puente', 'feriado', 'dias habiles'],
    question: '¿Realizan envíos en días festivos?',
    answer: 'Las transportadoras no realizan entregas en domingos ni festivos. Los tiempos de entrega se calculan en días hábiles (lunes a sábado). Los pedidos en festivos se procesan el siguiente día hábil.'
  },
  {
    id: 88,
    category: 'envios',
    keywords: ['envio', 'asegurado', 'seguro', 'perdida', 'robo'],
    question: '¿Los envíos están asegurados?',
    answer: 'Sí, todos los envíos de UrbanThread AI incluyen seguro contra pérdida, robo y daño durante el transporte sin costo adicional. En caso de siniestro, gestionamos el reenvío o reembolso completo.'
  },
  {
    id: 89,
    category: 'envios',
    keywords: ['envio', 'notificacion', 'aviso', 'sms', 'correo', 'alerta'],
    question: '¿Me notifican cuando mi envío está en camino?',
    answer: 'Sí, recibirás notificaciones por correo electrónico cuando tu pedido sea despachado, esté en tránsito y cuando esté próximo a ser entregado. Activa las notificaciones push para alertas en tiempo real.'
  },
  {
    id: 90,
    category: 'envios',
    keywords: ['envio', 'mismo', 'dia', 'hoy', 'inmediato', 'ya'],
    question: '¿Tienen envío para el mismo día?',
    answer: 'El envío express en Bogotá, Medellín y Cali garantiza entrega al día siguiente hábil. Para pedidos realizados antes de las 10:00 a.m. en Bogotá, en algunos casos la entrega puede ser el mismo día.'
  },
  {
    id: 91,
    category: 'envios',
    keywords: ['envio', 'oficina', 'trabajo', 'empresa', 'comercial'],
    question: '¿Puedo recibir mi envío en mi lugar de trabajo?',
    answer: 'Sí, puedes indicar la dirección de tu oficina o lugar de trabajo como dirección de entrega. Asegúrate de incluir el nombre de la empresa y piso/oficina para facilitar la entrega.'
  },
  {
    id: 92,
    category: 'envios',
    keywords: ['envio', 'multiple', 'varios', 'paquetes', 'cajas'],
    question: '¿Mi pedido puede llegar en varios paquetes?',
    answer: 'Sí, si tu pedido incluye productos de diferentes categorías o centros de distribución, puede llegar en paquetes separados. Cada uno tendrá su propio número de guía y podrás rastrearlo independientemente.'
  },
  {
    id: 93,
    category: 'envios',
    keywords: ['envio', 'devolucion', 'retorno', 'costo devolucion', 'envio devolucion'],
    question: '¿Quién paga el envío de devolución?',
    answer: 'Si la devolución es por error nuestro (producto incorrecto o defectuoso), el envío de retorno es gratis. Para devoluciones por cambio de opinión, el costo del envío de retorno es de $9.900 COP.'
  },
  {
    id: 94,
    category: 'envios',
    keywords: ['envio', 'verificar', 'codigo postal', 'cobertura', 'disponible'],
    question: '¿Cómo verifico si envían a mi zona?',
    answer: 'En el proceso de checkout, ingresa tu dirección completa y código postal. El sistema verificará automáticamente la cobertura y te mostrará las opciones de envío disponibles para tu zona.'
  },
  {
    id: 95,
    category: 'envios',
    keywords: ['envio', 'lluvias', 'clima', 'invierno', 'temporada lluvias'],
    question: '¿El clima afecta los tiempos de envío?',
    answer: 'En temporada de lluvias intensas o emergencias climáticas, los tiempos de entrega pueden extenderse en algunas zonas. Te notificaremos si tu pedido se ve afectado y el nuevo tiempo estimado.'
  },
  {
    id: 96,
    category: 'envios',
    keywords: ['envio', 'nocturno', 'noche', 'tarde', 'horario extendido'],
    question: '¿Realizan entregas en horario nocturno?',
    answer: 'Las entregas se realizan en horario de 8:00 a.m. a 6:00 p.m. de lunes a sábado. No ofrecemos entregas nocturnas. La transportadora te contactará para coordinar dentro de este horario.'
  },
  {
    id: 97,
    category: 'envios',
    keywords: ['envio', 'reclamar', 'queja', 'problema', 'inconveniente'],
    question: '¿Cómo reporto un problema con mi envío?',
    answer: 'Puedes reportar cualquier problema con tu envío creando una radicación en tu Portal Cliente o contactándonos por WhatsApp al 300 509 1114. Zyla te guiará para resolver tu caso lo antes posible.'
  },
  {
    id: 98,
    category: 'envios',
    keywords: ['envio', 'segunda', 'vez', 'reenvio', 'nuevo envio'],
    question: '¿Cobran por un segundo intento de envío?',
    answer: 'Los 3 intentos de entrega de la transportadora no tienen costo adicional. Si el paquete regresa a nuestro centro y necesitas un nuevo envío, se cobrará el costo de envío estándar de $12.900 COP.'
  },
  {
    id: 99,
    category: 'envios',
    keywords: ['envio', 'regalo', 'otra persona', 'sorpresa', 'tercero'],
    question: '¿Puedo enviar un pedido como regalo a otra persona?',
    answer: 'Sí, simplemente ingresa la dirección del destinatario durante el checkout. Puedes agregar empaque de regalo por $9.900 COP y una tarjeta con mensaje personalizado. No incluimos factura en el paquete.'
  },
  {
    id: 100,
    category: 'envios',
    keywords: ['envio', 'confirmacion', 'entrega', 'entregado', 'recibido'],
    question: '¿Cómo confirman que mi envío fue entregado?',
    answer: 'La transportadora registra la entrega con firma y documento del receptor. Recibirás un correo de confirmación de entrega y el estado en tu Portal Cliente se actualizará a "Entregado".'
  },
  {
    id: 101,
    category: 'envios',
    keywords: ['envio', 'caja', 'tamaño', 'discreto', 'sin marca'],
    question: '¿El paquete tiene el logo de UrbanThread AI visible?',
    answer: 'Nuestros paquetes llevan el logo de UrbanThread AI en la caja. Si prefieres un envío discreto sin marca visible, puedes solicitarlo en las notas del pedido sin costo adicional.'
  },
  {
    id: 102,
    category: 'envios',
    keywords: ['envio', 'amazonas', 'choco', 'dificil acceso', 'remoto'],
    question: '¿Envían a zonas de difícil acceso como Amazonas o Chocó?',
    answer: 'Sí, llegamos a zonas de difícil acceso, aunque los tiempos de entrega pueden ser de 8 a 12 días hábiles. El costo de envío puede variar entre $19.900 y $34.900 COP según el destino.'
  },
  {
    id: 103,
    category: 'envios',
    keywords: ['envio', 'punto', 'recogida', 'recoger', 'centro', 'acopio'],
    question: '¿Tienen puntos de recogida?',
    answer: 'Estamos implementando una red de puntos de recogida en alianza con tiendas locales en las principales ciudades. Próximamente podrás seleccionar esta opción durante el checkout.'
  },
  {
    id: 104,
    category: 'envios',
    keywords: ['envio', 'programar', 'fecha', 'dia', 'especifico', 'agendar'],
    question: '¿Puedo elegir el día de entrega de mi envío?',
    answer: 'Actualmente no es posible seleccionar un día específico de entrega. La transportadora entrega dentro del rango de días hábiles estimado. Estamos trabajando para ofrecer esta funcionalidad pronto.'
  },
  {
    id: 105,
    category: 'envios',
    keywords: ['envio', 'unidad', 'residencial', 'conjunto', 'cerrado'],
    question: '¿Cómo funciona la entrega en conjuntos residenciales?',
    answer: 'La transportadora entrega en la portería o recepción del conjunto residencial. Asegúrate de incluir el nombre del conjunto, torre y apartamento en la dirección para facilitar la entrega.'
  },
  {
    id: 106,
    category: 'envios',
    keywords: ['envio', 'perecedero', 'perfume', 'fragancia', 'liquido'],
    question: '¿Cómo envían productos como fragancias?',
    answer: 'Las fragancias y productos líquidos se envían con empaque especial reforzado y protección anti-derrames. Cada frasco va sellado individualmente y protegido con material amortiguante.'
  },
  {
    id: 107,
    category: 'envios',
    keywords: ['envio', 'rapido', 'urgente', 'prioritario', 'premium'],
    question: '¿Cuál es la opción de envío más rápida?',
    answer: 'Nuestra opción más rápida es el envío express disponible en Bogotá, Medellín y Cali con entrega en 24 horas hábiles por $19.900 COP. El pedido debe realizarse antes de las 12:00 p.m.'
  },
  {
    id: 108,
    category: 'envios',
    keywords: ['envio', 'economico', 'barato', 'mas barato', 'menor costo'],
    question: '¿Cuál es la opción de envío más económica?',
    answer: 'La opción más económica es el envío estándar por $12.900 COP con entrega en 3-5 días hábiles. Recuerda que en compras superiores a $149.900 COP el envío estándar es completamente gratis.'
  },
  {
    id: 109,
    category: 'envios',
    keywords: ['envio', 'calculadora', 'calcular', 'costo', 'cotizar'],
    question: '¿Cómo calculo el costo de envío antes de comprar?',
    answer: 'Agrega los productos al carrito y en la página del carrito ingresa tu ciudad o código postal. El sistema calculará automáticamente el costo de envío antes de que procedas al pago.'
  },
  {
    id: 110,
    category: 'envios',
    keywords: ['envio', 'contrato', 'corporativo', 'empresa', 'tarifa especial'],
    question: '¿Tienen tarifas especiales de envío para empresas?',
    answer: 'Sí, ofrecemos tarifas corporativas con descuentos en envío para empresas con compras recurrentes. Contáctanos en corporativo@urbanthread.co para conocer nuestros planes empresariales.'
  },
  {
    id: 111,
    category: 'envios',
    keywords: ['envio', 'temperatura', 'calor', 'frio', 'condiciones'],
    question: '¿Los productos se dañan por las condiciones de transporte?',
    answer: 'Nuestros empaques están diseñados para proteger los productos durante el transporte. Las prendas van en bolsas selladas y los productos de belleza en empaques térmicos cuando es necesario.'
  },
  {
    id: 112,
    category: 'envios',
    keywords: ['envio', 'sabado', 'fin semana', 'entregan sabado'],
    question: '¿Entregan pedidos los sábados?',
    answer: 'Sí, las transportadoras realizan entregas los sábados en horario de 8:00 a.m. a 1:00 p.m. en las principales ciudades. Los domingos y festivos no se realizan entregas.'
  },
  {
    id: 113,
    category: 'envios',
    keywords: ['envio', 'piso', 'apartamento', 'subir', 'escaleras'],
    question: '¿La transportadora sube el pedido a mi apartamento?',
    answer: 'La entrega se realiza en la portería o recepción del edificio. Si necesitas que suban el paquete, puedes coordinarlo directamente con el mensajero al momento de la entrega.'
  },
  {
    id: 114,
    category: 'envios',
    keywords: ['envio', 'etiqueta', 'guia', 'imprimir', 'devolucion etiqueta'],
    question: '¿Necesito imprimir una etiqueta para devoluciones?',
    answer: 'No necesitas imprimir nada. Al crear una radicación de devolución en tu Portal Cliente, la transportadora recogerá el paquete en tu dirección con la guía de retorno ya generada.'
  },
  {
    id: 115,
    category: 'envios',
    keywords: ['envio', 'recogida', 'domicilio', 'devolucion', 'recoger casa'],
    question: '¿Recogen las devoluciones a domicilio?',
    answer: 'Sí, al crear una radicación de devolución, programamos la recogida a domicilio sin costo cuando la devolución es por error nuestro. Para otros casos, el costo de recogida es de $9.900 COP.'
  },
  {
    id: 116,
    category: 'envios',
    keywords: ['envio', 'venezuela', 'ecuador', 'peru', 'frontera'],
    question: '¿Envían a países vecinos como Ecuador o Venezuela?',
    answer: 'Actualmente solo realizamos envíos dentro de Colombia. Estamos evaluando la expansión a Ecuador, Perú y otros países de la región. Suscríbete a nuestro newsletter para enterarte de novedades.'
  },
  {
    id: 117,
    category: 'envios',
    keywords: ['envio', 'cambio', 'transportadora', 'otra empresa', 'preferencia'],
    question: '¿Puedo elegir la transportadora de mi envío?',
    answer: 'La transportadora se asigna automáticamente según tu ubicación para garantizar el mejor servicio. En este momento no es posible seleccionar una transportadora específica.'
  },
  {
    id: 118,
    category: 'envios',
    keywords: ['envio', 'covid', 'protocolo', 'bioseguridad', 'contacto'],
    question: '¿Qué protocolos de seguridad manejan en los envíos?',
    answer: 'Nuestros centros de distribución y transportadoras aliadas cumplen con todos los protocolos de seguridad vigentes. Los paquetes se manipulan con cuidado y se desinfectan antes del despacho.'
  },
  {
    id: 119,
    category: 'envios',
    keywords: ['envio', 'casillero', 'locker', 'automatico', 'autoservicio'],
    question: '¿Tienen lockers o casilleros de entrega?',
    answer: 'Estamos implementando una red de lockers inteligentes en centros comerciales de Bogotá y Medellín. Próximamente podrás seleccionar esta opción para recoger tu pedido cuando te convenga.'
  },
  {
    id: 120,
    category: 'envios',
    keywords: ['envio', 'huella', 'carbono', 'impacto', 'ambiental', 'neutro'],
    question: '¿Los envíos son carbono neutro?',
    answer: 'Estamos comprometidos con reducir nuestra huella de carbono. Compensamos las emisiones de CO2 de nuestros envíos mediante programas de reforestación en Colombia. Cada envío incluye una contribución ambiental.'
  },
  // ============================================================
  // CATEGORÍA: DEVOLUCIONES (50 entries, IDs 121-170)
  // ============================================================
  {
    id: 121,
    category: 'devoluciones',
    keywords: ['devolver', 'devolucion', 'regresar', 'retornar', 'producto'],
    question: '¿Cómo puedo devolver un producto?',
    answer: 'Ingresa a tu Portal Cliente, ve a "Mis Pedidos", selecciona el producto y haz clic en "Solicitar devolución". Crea una radicación indicando el motivo y programaremos la recogida a domicilio.'
  },
  {
    id: 122,
    category: 'devoluciones',
    keywords: ['plazo', 'tiempo', 'devolucion', 'dias', 'limite', 'vencimiento'],
    question: '¿Cuánto tiempo tengo para devolver un producto?',
    answer: 'Tienes 30 días calendario desde la fecha de entrega para solicitar una devolución. El producto debe estar sin uso, con etiquetas originales y en su empaque original.'
  },
  {
    id: 123,
    category: 'devoluciones',
    keywords: ['reembolso', 'devolucion', 'dinero', 'plata', 'tiempo reembolso'],
    question: '¿Cuánto tarda el reembolso de una devolución?',
    answer: 'Una vez recibido y verificado el producto en nuestro centro, el reembolso se procesa en 5 a 10 días hábiles. El tiempo puede variar según tu entidad bancaria o medio de pago original.'
  },
  {
    id: 124,
    category: 'devoluciones',
    keywords: ['cambio', 'talla', 'color', 'producto', 'intercambio'],
    question: '¿Puedo cambiar un producto por otra talla o color?',
    answer: 'Sí, puedes solicitar un cambio de talla o color dentro de los 30 días. Crea una radicación de cambio en tu Portal Cliente y te enviaremos el nuevo producto una vez recibamos el original.'
  },
  {
    id: 125,
    category: 'devoluciones',
    keywords: ['devolucion', 'condiciones', 'requisitos', 'estado', 'etiquetas'],
    question: '¿Qué condiciones debe cumplir el producto para devolverlo?',
    answer: 'El producto debe estar sin uso, sin lavar, con todas las etiquetas originales y en su empaque. No se aceptan devoluciones de productos con signos de uso, manchas, olores o alteraciones.'
  },
  {
    id: 126,
    category: 'devoluciones',
    keywords: ['devolucion', 'costo', 'gratis', 'pagar', 'envio retorno'],
    question: '¿La devolución tiene algún costo?',
    answer: 'Si la devolución es por error nuestro (producto defectuoso, incorrecto o dañado), es completamente gratis. Para devoluciones por cambio de opinión o talla, el envío de retorno cuesta $9.900 COP.'
  },
  {
    id: 127,
    category: 'devoluciones',
    keywords: ['devolucion', 'defectuoso', 'falla', 'defecto', 'mal estado'],
    question: '¿Qué hago si recibí un producto defectuoso?',
    answer: 'Crea una radicación en tu Portal Cliente seleccionando "Producto defectuoso" y adjunta fotos claras del defecto. Gestionaremos el cambio o reembolso sin costo en 3 a 5 días hábiles.'
  },
  {
    id: 128,
    category: 'devoluciones',
    keywords: ['devolucion', 'parcial', 'algunos', 'productos', 'no todos'],
    question: '¿Puedo devolver solo algunos productos de mi pedido?',
    answer: 'Sí, puedes devolver productos individuales de un pedido. En la radicación de devolución, selecciona únicamente los artículos que deseas devolver. El reembolso será proporcional.'
  },
  {
    id: 129,
    category: 'devoluciones',
    keywords: ['devolucion', 'radicacion', 'proceso', 'solicitud', 'tramite'],
    question: '¿Qué es una radicación de devolución?',
    answer: 'Una radicación es la solicitud formal de devolución que creas en tu Portal Cliente. Incluye el motivo, fotos si aplica, y genera un número de seguimiento para que puedas monitorear el proceso.'
  },
  {
    id: 130,
    category: 'devoluciones',
    keywords: ['devolucion', 'estado', 'seguimiento', 'donde va', 'proceso'],
    question: '¿Cómo sigo el estado de mi devolución?',
    answer: 'En tu Portal Cliente, sección "Radicaciones", puedes ver el estado actualizado de tu devolución: recibida, en revisión, aprobada o reembolsada. También recibirás notificaciones por correo en cada etapa.'
  },
  {
    id: 131,
    category: 'devoluciones',
    keywords: ['devolucion', 'rechazada', 'no aceptada', 'negada', 'denegada'],
    question: '¿Por qué rechazaron mi devolución?',
    answer: 'Las devoluciones pueden rechazarse si el producto muestra signos de uso, no tiene etiquetas, pasaron más de 30 días o es un producto no retornable (ropa interior, trajes de baño). Puedes apelar contactándonos por WhatsApp.'
  },
  {
    id: 132,
    category: 'devoluciones',
    keywords: ['devolucion', 'ropa interior', 'traje baño', 'no retornable', 'excepcion'],
    question: '¿Qué productos no se pueden devolver?',
    answer: 'Por higiene, no aceptamos devoluciones de ropa interior, trajes de baño, productos de belleza abiertos/usados y accesorios para el cabello. Estos productos solo se cambian si llegan defectuosos.'
  },
  {
    id: 133,
    category: 'devoluciones',
    keywords: ['devolucion', 'tarjeta credito', 'reembolso tarjeta', 'visa', 'mastercard'],
    question: '¿Cómo recibo el reembolso si pagué con tarjeta de crédito?',
    answer: 'El reembolso se realiza a la misma tarjeta de crédito con la que pagaste. Puede reflejarse en tu siguiente estado de cuenta o en un plazo de 5 a 15 días hábiles según tu banco.'
  },
  {
    id: 134,
    category: 'devoluciones',
    keywords: ['devolucion', 'pse', 'transferencia', 'cuenta bancaria', 'reembolso banco'],
    question: '¿Cómo recibo el reembolso si pagué por PSE?',
    answer: 'Si pagaste por PSE, el reembolso se realiza mediante transferencia a la cuenta bancaria desde la que hiciste el pago. El proceso toma de 5 a 10 días hábiles una vez aprobada la devolución.'
  },
  {
    id: 135,
    category: 'devoluciones',
    keywords: ['devolucion', 'efectivo', 'contraentrega', 'reembolso efectivo'],
    question: '¿Cómo recibo el reembolso si pagué contra entrega?',
    answer: 'Para pagos contra entrega, el reembolso se realiza mediante transferencia bancaria. Necesitaremos tus datos bancarios (banco, tipo de cuenta y número) al crear la radicación de devolución.'
  },
  {
    id: 136,
    category: 'devoluciones',
    keywords: ['devolucion', 'bono', 'credito', 'saldo', 'favor', 'vale'],
    question: '¿Puedo recibir un bono en lugar de reembolso?',
    answer: 'Sí, puedes elegir recibir un bono de crédito por el valor del producto en lugar del reembolso. El bono se acredita inmediatamente a tu cuenta y tiene validez de 6 meses para usar en cualquier compra.'
  },
  {
    id: 137,
    category: 'devoluciones',
    keywords: ['devolucion', 'recogida', 'domicilio', 'recoger', 'transportadora'],
    question: '¿Cómo funciona la recogida a domicilio para devoluciones?',
    answer: 'Al aprobar tu radicación, programamos la recogida en tu dirección. La transportadora te contactará para coordinar fecha y hora. Empaca el producto en su empaque original y tenlo listo.'
  },
  {
    id: 138,
    category: 'devoluciones',
    keywords: ['devolucion', 'enviar', 'yo mismo', 'por mi cuenta', 'llevar'],
    question: '¿Puedo enviar la devolución por mi cuenta?',
    answer: 'Te recomendamos usar nuestra recogida programada para garantizar el seguimiento. Si prefieres enviarlo por tu cuenta, usa Servientrega o Coordinadora y envía la guía a soporte@urbanthread.co.'
  },
  {
    id: 139,
    category: 'devoluciones',
    keywords: ['devolucion', 'regalo', 'otra persona', 'compro', 'obsequio'],
    question: '¿Puedo devolver un producto que me regalaron?',
    answer: 'Sí, pero la devolución debe gestionarla la persona que realizó la compra desde su Portal Cliente. El reembolso se hará al medio de pago original del comprador.'
  },
  {
    id: 140,
    category: 'devoluciones',
    keywords: ['devolucion', 'promocion', 'descuento', 'oferta', 'rebaja'],
    question: '¿Puedo devolver un producto comprado en promoción?',
    answer: 'Sí, los productos en promoción tienen las mismas condiciones de devolución. El reembolso será por el valor efectivamente pagado (precio con descuento), no por el precio original.'
  },
  {
    id: 141,
    category: 'devoluciones',
    keywords: ['cambio', 'otro producto', 'diferente', 'distinto', 'intercambiar'],
    question: '¿Puedo cambiar un producto por uno diferente?',
    answer: 'Sí, puedes cambiar por un producto diferente. Si hay diferencia de precio, te cobraremos o reembolsaremos la diferencia. Crea una radicación de cambio indicando el nuevo producto deseado.'
  },
  {
    id: 142,
    category: 'devoluciones',
    keywords: ['devolucion', 'fotos', 'evidencia', 'prueba', 'adjuntar'],
    question: '¿Necesito enviar fotos para la devolución?',
    answer: 'Las fotos son obligatorias para devoluciones por producto defectuoso, dañado o incorrecto. Para cambios de talla o color, no son necesarias pero ayudan a agilizar el proceso.'
  },
  {
    id: 143,
    category: 'devoluciones',
    keywords: ['devolucion', 'garantia', 'producto', 'falla', 'despues uso'],
    question: '¿Qué garantía tienen los productos?',
    answer: 'Todos nuestros productos tienen garantía de 30 días por defectos de fabricación. Si el producto presenta fallas después de este período, contáctanos y evaluaremos tu caso de forma individual.'
  },
  {
    id: 144,
    category: 'devoluciones',
    keywords: ['devolucion', 'lavado', 'usado', 'sin etiqueta', 'modificado'],
    question: '¿Puedo devolver un producto que ya lavé o usé?',
    answer: 'No aceptamos devoluciones de productos usados o lavados, excepto si presentan defectos de fabricación. El producto debe estar en las mismas condiciones en que lo recibiste.'
  },
  {
    id: 145,
    category: 'devoluciones',
    keywords: ['devolucion', 'multiples', 'varios', 'productos', 'misma radicacion'],
    question: '¿Puedo devolver varios productos en una sola radicación?',
    answer: 'Sí, puedes incluir varios productos del mismo pedido en una sola radicación de devolución. Esto facilita el proceso y la recogida se hace en un solo viaje.'
  },
  {
    id: 146,
    category: 'devoluciones',
    keywords: ['devolucion', 'demora', 'tarda', 'lento', 'cuando', 'tiempo total'],
    question: '¿Cuánto tarda todo el proceso de devolución?',
    answer: 'El proceso completo toma aproximadamente 10 a 15 días hábiles: 2-3 días para recogida, 3-5 días para verificación en nuestro centro, y 5-10 días para el reembolso según tu banco.'
  },
  {
    id: 147,
    category: 'devoluciones',
    keywords: ['devolucion', 'empacar', 'embalar', 'como empacar', 'preparar'],
    question: '¿Cómo debo empacar el producto para la devolución?',
    answer: 'Empaca el producto en su empaque original o en una bolsa/caja que lo proteja durante el transporte. Incluye todas las etiquetas, accesorios y documentos que venían con el producto.'
  },
  {
    id: 148,
    category: 'devoluciones',
    keywords: ['devolucion', 'accesorio', 'joya', 'bolso', 'zapatos'],
    question: '¿Puedo devolver accesorios como bolsos o zapatos?',
    answer: 'Sí, los accesorios tienen las mismas condiciones de devolución: 30 días, sin uso y con empaque original. Los zapatos deben devolverse con su caja original y sin marcas de uso en la suela.'
  },
  {
    id: 149,
    category: 'devoluciones',
    keywords: ['devolucion', 'perfume', 'fragancia', 'belleza', 'cosmetico'],
    question: '¿Puedo devolver productos de belleza o fragancias?',
    answer: 'Los productos de belleza y fragancias solo se aceptan para devolución si están sellados y sin abrir. Productos abiertos o usados no son retornables, excepto si presentan defectos de fábrica.'
  },
  {
    id: 150,
    category: 'devoluciones',
    keywords: ['devolucion', 'cupon', 'codigo', 'descuento', 'reembolso cupon'],
    question: '¿Me devuelven el cupón de descuento si devuelvo el producto?',
    answer: 'Si devuelves todos los productos del pedido, el cupón de descuento se reactiva automáticamente para que puedas usarlo en otra compra. Si es devolución parcial, el cupón no se restaura.'
  },
  {
    id: 151,
    category: 'devoluciones',
    keywords: ['devolucion', 'tienda', 'fisica', 'presencial', 'llevar'],
    question: '¿Puedo devolver en una tienda física?',
    answer: 'Actualmente UrbanThread AI opera exclusivamente en línea, por lo que las devoluciones se gestionan mediante recogida a domicilio o envío por transportadora desde tu Portal Cliente.'
  },
  {
    id: 152,
    category: 'devoluciones',
    keywords: ['devolucion', 'internacional', 'fuera', 'pais', 'exterior'],
    question: '¿Puedo hacer una devolución desde fuera de Colombia?',
    answer: 'Actualmente solo procesamos devoluciones dentro de Colombia. Si te encuentras en el exterior, contáctanos por correo a soporte@urbanthread.co para evaluar opciones.'
  },
  {
    id: 153,
    category: 'devoluciones',
    keywords: ['retracto', 'derecho', 'arrepentimiento', 'ley', 'consumidor'],
    question: '¿Tengo derecho de retracto?',
    answer: 'Sí, según la ley colombiana de protección al consumidor, tienes derecho de retracto dentro de los 5 días hábiles siguientes a la entrega, sin necesidad de justificar el motivo. Nosotros ampliamos este plazo a 30 días.'
  },
  {
    id: 154,
    category: 'devoluciones',
    keywords: ['devolucion', 'talla', 'no queda', 'grande', 'pequeño', 'ajuste'],
    question: '¿Puedo devolver si la talla no me queda bien?',
    answer: 'Por supuesto, puedes solicitar un cambio de talla sin costo dentro de los 30 días. Te recomendamos consultar nuestra guía de tallas antes de tu próxima compra para encontrar el ajuste perfecto.'
  },
  {
    id: 155,
    category: 'devoluciones',
    keywords: ['devolucion', 'color', 'diferente', 'no es igual', 'pantalla'],
    question: '¿Puedo devolver si el color no es como se veía en la pantalla?',
    answer: 'Entendemos que los colores pueden variar ligeramente según la pantalla. Aceptamos devoluciones por diferencia de color dentro de los 30 días. Te recomendamos revisar las fotos de detalle del producto.'
  },
  {
    id: 156,
    category: 'devoluciones',
    keywords: ['devolucion', 'material', 'calidad', 'textura', 'no esperaba'],
    question: '¿Puedo devolver si el material no es lo que esperaba?',
    answer: 'Sí, si el producto no cumple tus expectativas de calidad o material, puedes devolverlo dentro de los 30 días. Nos importa tu satisfacción. Crea una radicación indicando el motivo.'
  },
  {
    id: 157,
    category: 'devoluciones',
    keywords: ['devolucion', 'segunda', 'vez', 'otra', 'nueva', 'repetida'],
    question: '¿Puedo hacer múltiples devoluciones?',
    answer: 'Sí, no hay límite en el número de devoluciones. Sin embargo, un patrón excesivo de devoluciones puede ser revisado por nuestro equipo. Te recomendamos usar la guía de tallas para reducir cambios.'
  },
  {
    id: 158,
    category: 'devoluciones',
    keywords: ['devolucion', 'contactar', 'ayuda', 'soporte', 'atencion'],
    question: '¿Con quién me comunico para una devolución?',
    answer: 'Puedes gestionar tu devolución directamente desde tu Portal Cliente o contactarnos por WhatsApp al 300 509 1114. Zyla también puede guiarte en el proceso desde el chat.'
  },
  {
    id: 159,
    category: 'devoluciones',
    keywords: ['devolucion', 'politica', 'normas', 'reglas', 'terminos'],
    question: '¿Dónde encuentro la política completa de devoluciones?',
    answer: 'Nuestra política completa de devoluciones está disponible en el pie de página de nuestro sitio web, sección "Políticas de devolución". También puedes consultarla en tu Portal Cliente.'
  },
  {
    id: 160,
    category: 'devoluciones',
    keywords: ['devolucion', 'aprobacion', 'automatica', 'revision', 'manual'],
    question: '¿Las devoluciones se aprueban automáticamente?',
    answer: 'Las devoluciones por cambio de talla o color se aprueban automáticamente. Las devoluciones por defecto o daño requieren revisión de las fotos adjuntas, lo cual toma máximo 24 horas hábiles.'
  },
  {
    id: 161,
    category: 'devoluciones',
    keywords: ['devolucion', 'sin', 'factura', 'comprobante', 'recibo perdido'],
    question: '¿Puedo devolver sin la factura?',
    answer: 'No necesitas la factura física. Toda la información de tu compra está en tu Portal Cliente. Solo necesitas iniciar sesión y crear la radicación desde el pedido correspondiente.'
  },
  {
    id: 162,
    category: 'devoluciones',
    keywords: ['devolucion', 'outlet', 'liquidacion', 'ultima unidad', 'final'],
    question: '¿Puedo devolver productos de outlet o liquidación?',
    answer: 'Los productos de outlet y liquidación tienen devolución limitada: solo se aceptan cambios o reembolsos por defectos de fabricación. No aplica devolución por cambio de opinión en estos artículos.'
  },
  {
    id: 163,
    category: 'devoluciones',
    keywords: ['devolucion', 'personalizado', 'bordado', 'estampado', 'custom'],
    question: '¿Puedo devolver productos personalizados?',
    answer: 'Los productos con personalización (bordados, estampados a medida) no son retornables excepto por defectos de fabricación. Te recomendamos verificar bien los detalles antes de confirmar la personalización.'
  },
  {
    id: 164,
    category: 'devoluciones',
    keywords: ['devolucion', 'set', 'combo', 'kit', 'conjunto', 'paquete'],
    question: '¿Puedo devolver solo una pieza de un set o combo?',
    answer: 'Los sets y combos deben devolverse completos para obtener el reembolso total. Si devuelves solo una pieza, el reembolso será proporcional al valor individual del artículo.'
  },
  {
    id: 165,
    category: 'devoluciones',
    keywords: ['devolucion', 'monto minimo', 'afecta', 'pierdo'],
    question: '¿Si devuelvo un producto, pierdo el envío gratis?',
    answer: 'Si al devolver un producto el total del pedido queda por debajo de $149.900 COP, se descontará el costo de envío estándar ($12.900 COP) del reembolso.'
  },
  {
    id: 166,
    category: 'devoluciones',
    keywords: ['devolucion', 'puntos', 'fidelidad', 'acumulados', 'descuentan'],
    question: '¿Qué pasa con mis puntos si devuelvo un producto?',
    answer: 'Los puntos UrbanThread acumulados por la compra se descontarán de tu saldo al procesar la devolución. Si ya usaste esos puntos, el valor equivalente se descontará del reembolso.'
  },
  {
    id: 167,
    category: 'devoluciones',
    keywords: ['devolucion', 'tarjeta regalo', 'gift card', 'bono regalo'],
    question: '¿Cómo funciona la devolución si pagué con tarjeta de regalo?',
    answer: 'Si pagaste con tarjeta de regalo, el reembolso se acredita como saldo en una nueva tarjeta de regalo digital enviada a tu correo electrónico con la misma vigencia.'
  },
  {
    id: 168,
    category: 'devoluciones',
    keywords: ['devolucion', 'cambio opinion', 'no me gusto', 'arrepenti', 'no quiero'],
    question: '¿Puedo devolver simplemente porque no me gustó?',
    answer: 'Sí, aceptamos devoluciones por cambio de opinión dentro de los 30 días. El producto debe estar sin uso y con etiquetas. El costo del envío de retorno ($9.900 COP) corre por tu cuenta.'
  },
  {
    id: 169,
    category: 'devoluciones',
    keywords: ['devolucion', 'rapida', 'express', 'urgente', 'acelerar'],
    question: '¿Puedo acelerar el proceso de devolución?',
    answer: 'El proceso estándar toma 10-15 días hábiles. Para agilizarlo, asegúrate de adjuntar fotos claras, empacar correctamente y tener el producto listo para la recogida. Esto evita demoras por revisiones adicionales.'
  },
  {
    id: 170,
    category: 'devoluciones',
    keywords: ['devolucion', 'satisfaccion', 'garantia satisfaccion', 'contento', 'feliz'],
    question: '¿Tienen garantía de satisfacción?',
    answer: 'Sí, en UrbanThread AI tu satisfacción es nuestra prioridad. Si no estás 100% conforme con tu compra, tienes 30 días para devolver o cambiar el producto. Queremos que ames cada prenda que elijas.'
  },
  // ============================================================
  // CATEGORÍA: PAGOS (40 entries, IDs 171-210)
  // ============================================================
  {
    id: 171,
    category: 'pagos',
    keywords: ['metodos', 'pago', 'formas', 'como pagar', 'medios pago'],
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PSE, Nequi, Daviplata, pago contra entrega, tarjetas de regalo UrbanThread y pagos en efectivo en puntos Efecty y Baloto.'
  },
  {
    id: 172,
    category: 'pagos',
    keywords: ['tarjeta', 'credito', 'debito', 'visa', 'mastercard', 'amex'],
    question: '¿Aceptan todas las tarjetas de crédito?',
    answer: 'Aceptamos Visa, Mastercard y American Express, tanto de crédito como de débito. Las tarjetas internacionales también son aceptadas siempre que estén habilitadas para compras en línea.'
  },
  {
    id: 173,
    category: 'pagos',
    keywords: ['cuotas', 'financiacion', 'diferido', 'meses', 'sin intereses'],
    question: '¿Puedo pagar en cuotas?',
    answer: 'Sí, ofrecemos pago en hasta 36 cuotas con tarjeta de crédito. Para compras superiores a $199.900 COP, puedes acceder a cuotas sin interés con bancos aliados. Las condiciones dependen de tu entidad bancaria.'
  },
  {
    id: 174,
    category: 'pagos',
    keywords: ['pse', 'transferencia', 'banco', 'debito', 'cuenta'],
    question: '¿Cómo pago por PSE?',
    answer: 'Al seleccionar PSE como método de pago, elige tu banco y serás redirigido a la plataforma de tu entidad para autorizar la transferencia. El pago se confirma en minutos y tu pedido se procesa de inmediato.'
  },
  {
    id: 175,
    category: 'pagos',
    keywords: ['nequi', 'daviplata', 'billetera', 'digital', 'movil'],
    question: '¿Puedo pagar con Nequi o Daviplata?',
    answer: 'Sí, aceptamos pagos con Nequi y Daviplata. Selecciona la opción en el checkout, ingresa tu número de celular y aprueba el pago desde tu app. La confirmación es inmediata.'
  },
  {
    id: 176,
    category: 'pagos',
    keywords: ['efectivo', 'efecty', 'baloto', 'pagar efectivo', 'punto pago'],
    question: '¿Puedo pagar en efectivo?',
    answer: 'Sí, puedes pagar en efectivo en puntos Efecty y Baloto a nivel nacional. Al seleccionar esta opción, recibirás un código de pago con 24 horas de vigencia. Tu pedido se procesa al confirmar el pago.'
  },
  {
    id: 177,
    category: 'pagos',
    keywords: ['seguridad', 'pago', 'seguro', 'datos', 'proteccion', 'fraude'],
    question: '¿Es seguro pagar en UrbanThread AI?',
    answer: 'Absolutamente. Utilizamos encriptación SSL de 256 bits y cumplimos con el estándar PCI DSS. Tus datos de pago nunca se almacenan en nuestros servidores. Además, contamos con sistema antifraude en tiempo real.'
  },
  {
    id: 178,
    category: 'pagos',
    keywords: ['factura', 'electronica', 'dian', 'tributaria', 'fiscal'],
    question: '¿Emiten factura electrónica?',
    answer: 'Sí, emitimos factura electrónica validada por la DIAN con cada compra. Se envía automáticamente a tu correo y puedes descargarla en cualquier momento desde tu Portal Cliente, sección "Documentos".'
  },
  {
    id: 179,
    category: 'pagos',
    keywords: ['descuento', 'promocion', 'oferta', 'rebaja', 'sale'],
    question: '¿Cómo me entero de las promociones y descuentos?',
    answer: 'Suscríbete a nuestro newsletter para recibir ofertas exclusivas. También publicamos promociones en nuestras redes sociales y en la sección "Ofertas" de la página. ¡Zyla te avisará de las mejores ofertas!'
  },
  {
    id: 180,
    category: 'pagos',
    keywords: ['cupon', 'codigo', 'descuento', 'aplicar', 'donde', 'ingresar'],
    question: '¿Dónde ingreso mi código de descuento?',
    answer: 'En la página del carrito de compras encontrarás el campo "Código de descuento" debajo del resumen. Ingresa el código y haz clic en "Aplicar". El descuento se reflejará en el total antes del pago.'
  },
  {
    id: 181,
    category: 'pagos',
    keywords: ['cupon', 'no funciona', 'invalido', 'error', 'vencido', 'expirado'],
    question: '¿Por qué mi cupón de descuento no funciona?',
    answer: 'Verifica que el cupón no haya expirado, que cumpla el monto mínimo de compra y que aplique para los productos en tu carrito. Algunos cupones no son acumulables con otras promociones. Si persiste el error, contáctanos.'
  },
  {
    id: 182,
    category: 'pagos',
    keywords: ['pago', 'rechazado', 'declinado', 'no paso', 'fallo', 'error pago'],
    question: '¿Por qué fue rechazado mi pago?',
    answer: 'El rechazo puede deberse a fondos insuficientes, tarjeta no habilitada para compras en línea, datos incorrectos o bloqueo del banco. Verifica con tu entidad bancaria o intenta con otro medio de pago.'
  },
  {
    id: 183,
    category: 'pagos',
    keywords: ['pago', 'pendiente', 'procesando', 'verificando', 'espera'],
    question: '¿Qué significa que mi pago está pendiente?',
    answer: 'Un pago pendiente significa que estamos esperando la confirmación de tu entidad bancaria o del punto de pago. Para PSE y transferencias, puede tomar hasta 30 minutos. Para pagos en efectivo, hasta 24 horas.'
  },
  {
    id: 184,
    category: 'pagos',
    keywords: ['iva', 'impuesto', 'incluido', 'precio', 'sin iva'],
    question: '¿Los precios incluyen IVA?',
    answer: 'Sí, todos los precios en UrbanThread AI incluyen IVA (19%). El precio que ves en cada producto es el precio final. No hay cargos ocultos ni impuestos adicionales al momento del pago.'
  },
  {
    id: 185,
    category: 'pagos',
    keywords: ['moneda', 'dolares', 'pesos', 'cop', 'divisa', 'cambio'],
    question: '¿En qué moneda están los precios?',
    answer: 'Todos nuestros precios están en Pesos Colombianos (COP). Si pagas con tarjeta internacional, tu banco realizará la conversión a tu moneda local según la tasa de cambio vigente.'
  },
  {
    id: 186,
    category: 'pagos',
    keywords: ['guardar', 'tarjeta', 'datos', 'recordar', 'almacenar'],
    question: '¿Puedo guardar mi tarjeta para futuras compras?',
    answer: 'Sí, puedes guardar tus tarjetas de forma segura en tu perfil. Utilizamos tokenización para proteger tus datos: nunca almacenamos el número completo de tu tarjeta. Puedes eliminarlas en cualquier momento.'
  },
  {
    id: 187,
    category: 'pagos',
    keywords: ['doble', 'cobro', 'duplicado', 'dos veces', 'cargo doble'],
    question: '¿Me hicieron un cobro duplicado, qué hago?',
    answer: 'Si ves un cobro duplicado, puede ser una retención temporal del banco que se libera en 24-48 horas. Si después de 48 horas persiste, contáctanos por WhatsApp con el comprobante y gestionaremos la reversión.'
  },
  {
    id: 188,
    category: 'pagos',
    keywords: ['retencion', 'temporal', 'banco', 'bloqueo', 'fondos'],
    question: '¿Qué es una retención temporal en mi tarjeta?',
    answer: 'Es un bloqueo preventivo que hace tu banco al intentar un pago. Si la transacción no se completa, la retención se libera automáticamente en 24-72 horas según tu entidad bancaria.'
  },
  {
    id: 189,
    category: 'pagos',
    keywords: ['comprobante', 'pago', 'recibo', 'voucher', 'constancia'],
    question: '¿Cómo obtengo un comprobante de pago?',
    answer: 'El comprobante de pago se envía a tu correo junto con la confirmación del pedido. También puedes descargarlo desde tu Portal Cliente en la sección "Documentos" de cada pedido.'
  },
  {
    id: 190,
    category: 'pagos',
    keywords: ['tarjeta', 'regalo', 'gift card', 'bono', 'comprar', 'regalar'],
    question: '¿Cómo compro una tarjeta de regalo UrbanThread?',
    answer: 'Puedes comprar tarjetas de regalo desde $50.000 hasta $500.000 COP en nuestra sección "Tarjetas de Regalo". Se envían por correo electrónico al destinatario con un código único y tienen vigencia de 12 meses.'
  },
  {
    id: 191,
    category: 'pagos',
    keywords: ['tarjeta', 'regalo', 'saldo', 'consultar', 'cuanto queda'],
    question: '¿Cómo consulto el saldo de mi tarjeta de regalo?',
    answer: 'Ingresa a tu Portal Cliente, sección "Tarjetas de regalo" e ingresa el código de tu tarjeta para ver el saldo disponible. También puedes verificarlo durante el checkout al aplicar el código.'
  },
  {
    id: 192,
    category: 'pagos',
    keywords: ['pago', 'parcial', 'combinar', 'dos tarjetas', 'mixto'],
    question: '¿Puedo pagar con dos métodos de pago diferentes?',
    answer: 'Puedes combinar una tarjeta de regalo con otro medio de pago (tarjeta, PSE, Nequi). Sin embargo, no es posible dividir el pago entre dos tarjetas de crédito o débito diferentes.'
  },
  {
    id: 193,
    category: 'pagos',
    keywords: ['contraentrega', 'pago entrega', 'efectivo entrega', 'cod'],
    question: '¿Cómo funciona el pago contra entrega?',
    answer: 'Selecciona "Pago contra entrega" en el checkout. Tiene un recargo de $5.900 COP. Al recibir tu pedido, pagas en efectivo al mensajero. Disponible en las principales ciudades de Colombia.'
  },
  {
    id: 194,
    category: 'pagos',
    keywords: ['descuento', 'primera', 'compra', 'nuevo', 'registro', 'bienvenida'],
    question: '¿Cuál es el descuento de bienvenida?',
    answer: 'Al registrarte en UrbanThread AI recibes un 15% de descuento en tu primera compra. El código se envía automáticamente a tu correo y es válido por 30 días. No es acumulable con otras promociones.'
  },
  {
    id: 195,
    category: 'pagos',
    keywords: ['black friday', 'cyber monday', 'hot sale', 'descuentos especiales'],
    question: '¿Qué descuentos ofrecen en fechas especiales?',
    answer: 'En Black Friday, Cyber Monday y Hot Sale ofrecemos descuentos de hasta 50% en colecciones seleccionadas. También tenemos promociones especiales en Día de la Madre, Amor y Amistad, y Navidad.'
  },
  {
    id: 196,
    category: 'pagos',
    keywords: ['newsletter', 'suscripcion', 'correo', 'ofertas', 'exclusivas'],
    question: '¿Cómo me suscribo al newsletter de ofertas?',
    answer: 'Ingresa tu correo electrónico en el campo de suscripción al pie de nuestra página web. Recibirás un 10% de descuento adicional por suscribirte y acceso anticipado a todas nuestras promociones.'
  },
  {
    id: 197,
    category: 'pagos',
    keywords: ['puntos', 'redimir', 'canjear', 'usar', 'programa fidelidad'],
    question: '¿Cómo redimo mis puntos UrbanThread?',
    answer: 'En el checkout, verás la opción "Usar puntos UrbanThread". Cada 100 puntos equivalen a $5.000 COP de descuento. Puedes usar todos o parte de tus puntos en cualquier compra.'
  },
  {
    id: 198,
    category: 'pagos',
    keywords: ['precio', 'cambio', 'bajo', 'garantia precio', 'diferencia'],
    question: '¿Qué pasa si el precio baja después de mi compra?',
    answer: 'Si el precio de un producto baja dentro de los 7 días siguientes a tu compra, puedes solicitar un ajuste de precio. Contáctanos por WhatsApp con tu número de pedido y te reembolsaremos la diferencia.'
  },
  {
    id: 199,
    category: 'pagos',
    keywords: ['pago', 'internacional', 'extranjero', 'tarjeta internacional', 'exterior'],
    question: '¿Puedo pagar con tarjeta internacional?',
    answer: 'Sí, aceptamos tarjetas Visa y Mastercard internacionales. El cobro se realizará en COP y tu banco aplicará la tasa de cambio vigente. Asegúrate de que tu tarjeta esté habilitada para compras internacionales.'
  },
  {
    id: 200,
    category: 'pagos',
    keywords: ['3ds', 'verificacion', 'codigo', 'sms', 'autenticacion', 'otp pago'],
    question: '¿Por qué me piden un código de verificación al pagar?',
    answer: 'Es la autenticación 3D Secure de tu banco para proteger tu compra. Recibirás un código por SMS o en tu app bancaria que debes ingresar para confirmar que eres el titular de la tarjeta.'
  },
  {
    id: 201,
    category: 'pagos',
    keywords: ['devolucion', 'dinero', 'reembolso', 'cuando', 'demora'],
    question: '¿Cuánto tarda un reembolso en reflejarse?',
    answer: 'Los reembolsos a tarjeta de crédito tardan 5-15 días hábiles. Para PSE y transferencias, 5-10 días hábiles. Nequi y Daviplata, 3-5 días hábiles. El tiempo depende de tu entidad financiera.'
  },
  {
    id: 202,
    category: 'pagos',
    keywords: ['limite', 'compra', 'maximo', 'tope', 'monto maximo'],
    question: '¿Hay un monto máximo de compra?',
    answer: 'No tenemos un monto máximo de compra en nuestra plataforma. Sin embargo, tu banco puede tener límites de transacción en línea. Para compras superiores a $2.000.000 COP, te recomendamos verificar con tu banco.'
  },
  {
    id: 203,
    category: 'pagos',
    keywords: ['bitcoin', 'cripto', 'criptomoneda', 'ethereum', 'crypto'],
    question: '¿Aceptan criptomonedas?',
    answer: 'Actualmente no aceptamos pagos con criptomonedas. Estamos evaluando esta opción para el futuro. Por ahora, puedes pagar con tarjeta, PSE, Nequi, Daviplata, efectivo o contra entrega.'
  },
  {
    id: 204,
    category: 'pagos',
    keywords: ['paypal', 'mercadopago', 'stripe', 'pasarela', 'plataforma pago'],
    question: '¿Aceptan PayPal o MercadoPago?',
    answer: 'Actualmente no aceptamos PayPal ni MercadoPago. Nuestra pasarela de pago soporta tarjetas Visa, Mastercard, American Express, PSE, Nequi, Daviplata y pagos en efectivo.'
  },
  {
    id: 205,
    category: 'pagos',
    keywords: ['cuotas', 'sin interes', 'meses sin intereses', 'financiar'],
    question: '¿Cuántas cuotas sin interés ofrecen?',
    answer: 'Ofrecemos hasta 12 cuotas sin interés en compras superiores a $199.900 COP con tarjetas de crédito de bancos aliados (Bancolombia, Davivienda, BBVA). Las condiciones pueden variar según promociones vigentes.'
  },
  {
    id: 206,
    category: 'pagos',
    keywords: ['factura', 'empresa', 'nit', 'razon social', 'corporativa'],
    question: '¿Puedo solicitar factura a nombre de mi empresa?',
    answer: 'Sí, durante el checkout selecciona "Facturación empresarial" e ingresa el NIT, razón social y dirección fiscal de tu empresa. La factura electrónica se generará con estos datos.'
  },
  {
    id: 207,
    category: 'pagos',
    keywords: ['nota', 'credito', 'ajuste', 'correccion', 'factura'],
    question: '¿Cómo solicito una nota crédito?',
    answer: 'Las notas crédito se generan automáticamente al procesar una devolución o ajuste de precio. Puedes descargarla desde tu Portal Cliente en la sección "Documentos" una vez procesado el reembolso.'
  },
  {
    id: 208,
    category: 'pagos',
    keywords: ['descuento', 'acumular', 'combinar', 'sumar', 'varios cupones'],
    question: '¿Puedo acumular varios descuentos en una compra?',
    answer: 'Los cupones de descuento no son acumulables entre sí. Sin embargo, puedes combinar un cupón con tus puntos UrbanThread o con una tarjeta de regalo para maximizar tu ahorro.'
  },
  {
    id: 209,
    category: 'pagos',
    keywords: ['pago', 'seguro', 'ssl', 'encriptacion', 'proteccion datos'],
    question: '¿Cómo protegen mis datos de pago?',
    answer: 'Utilizamos encriptación SSL de 256 bits, cumplimos con PCI DSS nivel 1 y no almacenamos datos de tarjeta en nuestros servidores. Además, todas las transacciones pasan por verificación antifraude en tiempo real.'
  },
  {
    id: 210,
    category: 'pagos',
    keywords: ['pago', 'qr', 'codigo qr', 'escanear', 'bancolombia'],
    question: '¿Puedo pagar escaneando un código QR?',
    answer: 'Sí, al seleccionar Nequi o Bancolombia como método de pago, puedes escanear el código QR que aparece en pantalla desde tu app bancaria para completar el pago de forma rápida y segura.'
  },
  // ============================================================
  // CATEGORÍA: PRODUCTOS-MUJER (40 entries, IDs 211-250)
  // ============================================================
  {
    id: 211,
    category: 'productos-mujer',
    keywords: ['vestido', 'vestidos', 'mujer', 'dama', 'femenino', 'dress'],
    question: '¿Qué vestidos tienen disponibles para mujer?',
    answer: 'Tenemos una amplia colección de vestidos: el Vestido Floral Primavera ($129.900), Vestido Cocktail Noche ($189.900), Vestido Casual Urbano ($99.900) y el Vestido Maxi Bohemio ($149.900), entre muchos más.'
  },
  {
    id: 212,
    category: 'productos-mujer',
    keywords: ['blusa', 'blusas', 'top', 'camisa', 'mujer', 'camiseta'],
    question: '¿Qué blusas tienen para mujer?',
    answer: 'Nuestra colección de blusas incluye la Blusa Seda Elegante ($89.900), Blusa Crop Top Trendy ($59.900), Blusa Manga Larga Office ($79.900) y la Blusa Estampada Tropical ($69.900). Disponibles en tallas XS a XL.'
  },
  {
    id: 213,
    category: 'productos-mujer',
    keywords: ['falda', 'faldas', 'minifalda', 'midi', 'larga', 'mujer'],
    question: '¿Qué faldas ofrecen?',
    answer: 'Ofrecemos faldas en todos los estilos: Falda Midi Plisada ($89.900), Falda Lápiz Ejecutiva ($79.900), Falda Denim Casual ($69.900) y Falda Maxi Fluida ($99.900). Perfectas para cualquier ocasión.'
  },
  {
    id: 214,
    category: 'productos-mujer',
    keywords: ['chaqueta', 'jacket', 'blazer', 'mujer', 'abrigo', 'saco'],
    question: '¿Qué chaquetas tienen para mujer?',
    answer: 'Encuentra la Chaqueta Denim Clásica ($149.900), Blazer Oversize Trendy ($179.900), Chaqueta Cuero Sintético ($199.900) y la Chaqueta Puffer Ligera ($169.900). Ideales para complementar cualquier outfit.'
  },
  {
    id: 215,
    category: 'productos-mujer',
    keywords: ['pantalon', 'pantalones', 'jean', 'jeans', 'mujer', 'leggins'],
    question: '¿Qué pantalones tienen para mujer?',
    answer: 'Nuestra línea incluye Jean Skinny High Rise ($109.900), Pantalón Wide Leg ($99.900), Pantalón Palazzo Elegante ($119.900) y Leggins Deportivos Premium ($79.900). Todos con ajuste perfecto.'
  },
  {
    id: 216,
    category: 'productos-mujer',
    keywords: ['talla', 'tallas', 'mujer', 'guia', 'medidas', 'tabla'],
    question: '¿Qué tallas manejan para mujer?',
    answer: 'Manejamos tallas de la XS a la XXL en ropa de mujer. Cada producto tiene una guía de tallas detallada con medidas en centímetros de busto, cintura y cadera. Consulta la guía en la ficha de cada producto.'
  },
  {
    id: 217,
    category: 'productos-mujer',
    keywords: ['talla', 'grande', 'plus', 'curvy', 'xl', 'xxl', 'mujer'],
    question: '¿Tienen tallas grandes para mujer?',
    answer: 'Sí, nuestra línea Curvy Collection ofrece tallas XL y XXL en la mayoría de nuestros diseños. Estamos comprometidos con la inclusión y trabajamos para ampliar constantemente nuestra oferta de tallas.'
  },
  {
    id: 218,
    category: 'productos-mujer',
    keywords: ['vestido', 'floral', 'primavera', 'estampado', 'flores'],
    question: '¿Tienen el Vestido Floral Primavera disponible?',
    answer: 'El Vestido Floral Primavera ($129.900) es uno de nuestros bestsellers. Está disponible en tallas S, M, L y XL, en colores rosa pastel y azul cielo. Fabricado en viscosa con estampado exclusivo.'
  },
  {
    id: 219,
    category: 'productos-mujer',
    keywords: ['material', 'tela', 'composicion', 'algodon', 'poliester', 'mujer'],
    question: '¿De qué materiales están hechas las prendas de mujer?',
    answer: 'Usamos materiales de alta calidad: algodón orgánico, viscosa, lino, seda sintética y mezclas premium. Cada ficha de producto detalla la composición exacta. Priorizamos telas suaves, duraderas y sostenibles.'
  },
  {
    id: 220,
    category: 'productos-mujer',
    keywords: ['cuidado', 'lavar', 'lavado', 'planchar', 'secado', 'mujer'],
    question: '¿Cómo debo cuidar mis prendas de mujer?',
    answer: 'Cada prenda incluye instrucciones de cuidado en la etiqueta. En general, recomendamos lavar a máquina en ciclo delicado con agua fría, no usar blanqueador y secar a la sombra. Las prendas de seda requieren lavado a mano.'
  },
  {
    id: 221,
    category: 'productos-mujer',
    keywords: ['conjunto', 'set', 'outfit', 'coordinado', 'look', 'mujer'],
    question: '¿Venden conjuntos o sets coordinados para mujer?',
    answer: 'Sí, tenemos sets coordinados como el Set Blazer + Pantalón Power ($249.900), Set Crop Top + Falda Summer ($139.900) y el Set Pijama Seda ($119.900). Comprar el set tiene un 15% de descuento vs. piezas individuales.'
  },
  {
    id: 222,
    category: 'productos-mujer',
    keywords: ['vestido', 'noche', 'fiesta', 'gala', 'elegante', 'cocktail'],
    question: '¿Tienen vestidos para ocasiones especiales?',
    answer: 'Nuestra línea Evening Collection incluye el Vestido Cocktail Noche ($189.900), Vestido Gala Lentejuelas ($249.900) y el Vestido Slip Dress Satinado ($159.900). Perfectos para fiestas y eventos especiales.'
  },
  {
    id: 223,
    category: 'productos-mujer',
    keywords: ['ropa', 'oficina', 'trabajo', 'formal', 'ejecutiva', 'mujer'],
    question: '¿Tienen ropa formal para oficina?',
    answer: 'Nuestra línea Office Chic incluye blazers, pantalones de vestir, faldas ejecutivas y blusas formales desde $79.900. El Blazer Ejecutivo Slim ($179.900) y el Pantalón Recto Clásico ($109.900) son los más populares.'
  },
  {
    id: 224,
    category: 'productos-mujer',
    keywords: ['ropa', 'deportiva', 'gym', 'ejercicio', 'sport', 'mujer'],
    question: '¿Tienen ropa deportiva para mujer?',
    answer: 'Nuestra línea Active Wear incluye Leggins Deportivos Premium ($79.900), Top Deportivo Soporte ($49.900), Conjunto Gym Completo ($119.900) y Chaqueta Running ($89.900). Telas con tecnología dry-fit.'
  },
  {
    id: 225,
    category: 'productos-mujer',
    keywords: ['lenceria', 'ropa interior', 'pijama', 'dormir', 'intima', 'mujer'],
    question: '¿Tienen lencería y pijamas para mujer?',
    answer: 'Sí, nuestra línea Intimate incluye pijamas de seda ($119.900), sets de lencería ($89.900) y batas de dormir ($99.900). Recuerda que la ropa interior solo se cambia por defectos de fabricación.'
  },
  {
    id: 226,
    category: 'productos-mujer',
    keywords: ['nueva', 'coleccion', 'temporada', 'tendencia', 'moda', 'mujer'],
    question: '¿Cuándo lanzan nuevas colecciones de mujer?',
    answer: 'Lanzamos 4 colecciones principales al año (primavera, verano, otoño, invierno) más cápsulas especiales mensuales. Suscríbete al newsletter para ser la primera en conocer los nuevos lanzamientos.'
  },
  {
    id: 227,
    category: 'productos-mujer',
    keywords: ['vestido', 'casual', 'diario', 'comodo', 'basico', 'mujer'],
    question: '¿Tienen vestidos casuales para el día a día?',
    answer: 'Sí, el Vestido Casual Urbano ($99.900), Vestido T-Shirt Básico ($69.900) y el Vestido Lino Relax ($109.900) son perfectos para el uso diario. Cómodos, versátiles y fáciles de combinar.'
  },
  {
    id: 228,
    category: 'productos-mujer',
    keywords: ['sueter', 'sweater', 'cardigan', 'tejido', 'lana', 'mujer'],
    question: '¿Tienen suéteres y cardigans para mujer?',
    answer: 'Nuestra colección de punto incluye el Suéter Oversize Cozy ($109.900), Cardigan Largo Elegante ($129.900) y el Sweater Crop Tejido ($89.900). Fabricados en mezcla de algodón y lana para máxima suavidad.'
  },
  {
    id: 229,
    category: 'productos-mujer',
    keywords: ['short', 'shorts', 'bermuda', 'corto', 'verano', 'mujer'],
    question: '¿Tienen shorts para mujer?',
    answer: 'Sí, ofrecemos Short Denim Clásico ($69.900), Short Lino Playa ($59.900), Short Deportivo Running ($49.900) y Bermuda Casual ($79.900). Disponibles en tallas XS a XL en varios colores.'
  },
  {
    id: 230,
    category: 'productos-mujer',
    keywords: ['maternidad', 'embarazo', 'premama', 'gestante', 'mujer'],
    question: '¿Tienen ropa de maternidad?',
    answer: 'Actualmente no contamos con una línea de maternidad específica. Sin embargo, nuestros vestidos fluidos y pantalones con cintura elástica son opciones cómodas. Estamos evaluando lanzar esta línea próximamente.'
  },
  {
    id: 231,
    category: 'productos-mujer',
    keywords: ['color', 'colores', 'disponible', 'opciones', 'tonos', 'mujer'],
    question: '¿En qué colores están disponibles las prendas de mujer?',
    answer: 'Cada producto está disponible en diferentes colores que puedes ver en la ficha del producto. Los colores más populares son negro, blanco, beige, rosa pastel y azul marino. La disponibilidad varía por talla.'
  },
  {
    id: 232,
    category: 'productos-mujer',
    keywords: ['overol', 'enterizo', 'jumpsuit', 'mono', 'mujer'],
    question: '¿Tienen enterizos o jumpsuits para mujer?',
    answer: 'Sí, el Jumpsuit Elegante Noche ($169.900), Enterizo Casual Lino ($129.900) y el Overol Denim Vintage ($139.900) son parte de nuestra colección. Prendas versátiles que resuelven un outfit completo.'
  },
  {
    id: 233,
    category: 'productos-mujer',
    keywords: ['traje', 'baño', 'bikini', 'vestido baño', 'playa', 'mujer'],
    question: '¿Tienen trajes de baño para mujer?',
    answer: 'Nuestra línea Beach incluye Bikini Tropical ($89.900), Traje de Baño Entero Elegante ($99.900) y Pareo Playa ($49.900). Recuerda que los trajes de baño solo se cambian por defectos de fabricación.'
  },
  {
    id: 234,
    category: 'productos-mujer',
    keywords: ['camisa', 'camiseta', 'basica', 't-shirt', 'polo', 'mujer'],
    question: '¿Tienen camisetas básicas para mujer?',
    answer: 'Nuestra línea Basics incluye Camiseta Algodón Orgánico ($39.900), T-Shirt Oversize ($49.900) y Polo Clásico ($59.900). Disponibles en 10 colores básicos, perfectas para combinar con todo.'
  },
  {
    id: 235,
    category: 'productos-mujer',
    keywords: ['abrigo', 'gabardina', 'trench', 'impermeable', 'lluvia', 'mujer'],
    question: '¿Tienen abrigos o gabardinas para mujer?',
    answer: 'Sí, el Trench Coat Clásico ($229.900), Gabardina Impermeable ($199.900) y el Abrigo Lana Premium ($279.900) son ideales para temporada de lluvias. Elegantes y funcionales.'
  },
  {
    id: 236,
    category: 'productos-mujer',
    keywords: ['sostenible', 'ecologico', 'organico', 'eco', 'verde', 'mujer'],
    question: '¿Tienen ropa sostenible para mujer?',
    answer: 'Nuestra línea Eco Collection está fabricada con algodón orgánico certificado GOTS y materiales reciclados. Incluye camisetas ($49.900), vestidos ($119.900) y jeans ($129.900) eco-friendly.'
  },
  {
    id: 237,
    category: 'productos-mujer',
    keywords: ['vestido', 'boda', 'matrimonio', 'invitada', 'ceremonia', 'mujer'],
    question: '¿Tienen vestidos para bodas o ceremonias?',
    answer: 'Nuestra colección Ceremony incluye vestidos elegantes ideales para bodas: Vestido Midi Satinado ($179.900), Vestido Largo Gasa ($219.900) y Vestido Encaje Romántico ($199.900). Perfectos para ser la invitada más elegante.'
  },
  {
    id: 238,
    category: 'productos-mujer',
    keywords: ['crop', 'top', 'ombliguera', 'corto', 'tendencia', 'mujer'],
    question: '¿Tienen crop tops?',
    answer: 'Sí, nuestra selección incluye Crop Top Ribbed ($49.900), Crop Top Estampado ($59.900) y Crop Top Manga Larga ($54.900). Son tendencia y combinan perfecto con jeans de tiro alto o faldas midi.'
  },
  {
    id: 239,
    category: 'productos-mujer',
    keywords: ['body', 'bodysuit', 'enterizo', 'ceñido', 'mujer'],
    question: '¿Tienen bodysuits para mujer?',
    answer: 'Sí, el Bodysuit Básico ($59.900), Bodysuit Encaje ($79.900) y Bodysuit Manga Larga ($69.900) son prendas versátiles que puedes usar como top con jeans, faldas o debajo de blazers.'
  },
  {
    id: 240,
    category: 'productos-mujer',
    keywords: ['kimono', 'bata', 'cover', 'playa', 'salida', 'mujer'],
    question: '¿Tienen kimonos o salidas de playa?',
    answer: 'Nuestra línea Resort incluye Kimono Estampado ($89.900), Salida de Playa Crochet ($79.900) y Cover Up Transparente ($69.900). Perfectos para la playa o como complemento de un outfit casual.'
  },
  {
    id: 241,
    category: 'productos-mujer',
    keywords: ['chaleco', 'vest', 'sin mangas', 'mujer', 'prenda'],
    question: '¿Tienen chalecos para mujer?',
    answer: 'Sí, ofrecemos el Chaleco Acolchado Ligero ($119.900), Chaleco Tejido Boho ($99.900) y Chaleco Sastre Formal ($109.900). Son prendas versátiles que añaden estilo a cualquier look.'
  },
  {
    id: 242,
    category: 'productos-mujer',
    keywords: ['talla', 'pequeña', 'xs', 'petite', 'chica', 'mujer'],
    question: '¿Tienen tallas pequeñas o petite?',
    answer: 'Sí, manejamos talla XS que corresponde a tallas 4-6 colombianas. Algunos estilos también están disponibles en versión Petite con largo ajustado para mujeres de menor estatura.'
  },
  {
    id: 243,
    category: 'productos-mujer',
    keywords: ['tendencia', '2024', 'moda', 'trending', 'popular', 'mujer'],
    question: '¿Cuáles son las tendencias actuales en moda mujer?',
    answer: 'Las tendencias destacadas incluyen el estilo quiet luxury con tonos neutros, pantalones wide leg, blazers oversize, vestidos midi y el regreso del denim. Encuentra todas estas tendencias en nuestra colección actual.'
  },
  {
    id: 244,
    category: 'productos-mujer',
    keywords: ['bestseller', 'mas vendido', 'popular', 'favorito', 'top', 'mujer'],
    question: '¿Cuáles son los productos más vendidos de mujer?',
    answer: 'Nuestros bestsellers de mujer son: Vestido Floral Primavera ($129.900), Jean Skinny High Rise ($109.900), Blazer Oversize Trendy ($179.900) y la Blusa Seda Elegante ($89.900). ¡Los favoritos de nuestras clientas!'
  },
  {
    id: 245,
    category: 'productos-mujer',
    keywords: ['look', 'combinar', 'outfit', 'estilismo', 'como vestir', 'mujer'],
    question: '¿Me pueden ayudar a armar un outfit?',
    answer: 'Soy Zyla y me encanta ayudarte con estilismo. Cuéntame la ocasión (casual, oficina, fiesta) y tu estilo preferido, y te sugeriré combinaciones perfectas de nuestra colección. ¡Pregúntame!'
  },
  {
    id: 246,
    category: 'productos-mujer',
    keywords: ['jean', 'denim', 'vaquero', 'mezclilla', 'mujer'],
    question: '¿Qué tipos de jeans tienen para mujer?',
    answer: 'Ofrecemos Jean Skinny High Rise ($109.900), Jean Mom Fit ($99.900), Jean Wide Leg ($109.900), Jean Straight Clásico ($99.900) y Jean Boyfriend Relajado ($94.900). Todos en denim premium con elasticidad.'
  },
  {
    id: 247,
    category: 'productos-mujer',
    keywords: ['camisa', 'oversize', 'boyfriend', 'holgada', 'amplia', 'mujer'],
    question: '¿Tienen camisas oversize para mujer?',
    answer: 'Sí, la Camisa Oversize Lino ($89.900), Camisa Boyfriend Denim ($99.900) y la Camisa Oversize Rayas ($79.900) son perfectas para un look relajado y moderno. Combínalas con leggins o jeans ajustados.'
  },
  {
    id: 248,
    category: 'productos-mujer',
    keywords: ['vestido', 'largo', 'maxi', 'piso', 'fluido', 'mujer'],
    question: '¿Tienen vestidos largos o maxi?',
    answer: 'Nuestra colección incluye el Vestido Maxi Bohemio ($149.900), Vestido Largo Gasa ($219.900), Vestido Maxi Estampado ($139.900) y Vestido Largo Playa ($119.900). Elegantes y cómodos para cualquier ocasión.'
  },
  {
    id: 249,
    category: 'productos-mujer',
    keywords: ['encaje', 'bordado', 'detalle', 'romantico', 'delicado', 'mujer'],
    question: '¿Tienen prendas con encaje o bordados?',
    answer: 'Sí, nuestra línea Romantic incluye blusas, vestidos y lencería con detalles de encaje y bordados artesanales. El Vestido Encaje Romántico ($199.900) y la Blusa Bordada Artesanal ($109.900) son los más destacados.'
  },
  {
    id: 250,
    category: 'productos-mujer',
    keywords: ['estampado', 'print', 'patron', 'diseño', 'animal print', 'mujer'],
    question: '¿Qué estampados tienen disponibles?',
    answer: 'Ofrecemos estampados florales, geométricos, animal print, rayas, lunares y diseños abstractos exclusivos. Cada temporada lanzamos estampados nuevos diseñados por artistas colombianos.'
  },
  // ============================================================
  // CATEGORÍA: PRODUCTOS-HOMBRE (40 entries, IDs 251-290)
  // ============================================================
  {
    id: 251,
    category: 'productos-hombre',
    keywords: ['camisa', 'camisas', 'hombre', 'masculino', 'caballero'],
    question: '¿Qué camisas tienen para hombre?',
    answer: 'Nuestra colección incluye Camisa Oxford Clásica ($89.900), Camisa Lino Casual ($99.900), Camisa Slim Fit Formal ($109.900) y Camisa Estampada Resort ($79.900). Disponibles en tallas S a XXL.'
  },
  {
    id: 252,
    category: 'productos-hombre',
    keywords: ['pantalon', 'pantalones', 'hombre', 'chino', 'vestir', 'formal'],
    question: '¿Qué pantalones tienen para hombre?',
    answer: 'Ofrecemos Pantalón Chino Slim ($99.900), Pantalón Formal Ejecutivo ($119.900), Pantalón Cargo Casual ($89.900) y Pantalón Jogger Urbano ($79.900). Cortes modernos con telas de alta calidad.'
  },
  {
    id: 253,
    category: 'productos-hombre',
    keywords: ['jean', 'jeans', 'denim', 'hombre', 'vaquero', 'mezclilla'],
    question: '¿Qué jeans tienen para hombre?',
    answer: 'Nuestra línea denim masculina incluye Jean Slim Fit ($109.900), Jean Straight Clásico ($99.900), Jean Skinny Stretch ($104.900) y Jean Relaxed Vintage ($114.900). Denim premium con diferentes lavados.'
  },
  {
    id: 254,
    category: 'productos-hombre',
    keywords: ['blazer', 'saco', 'chaqueta', 'formal', 'hombre', 'traje'],
    question: '¿Tienen blazers para hombre?',
    answer: 'Sí, el Blazer Smart Casual ($199.900), Blazer Ejecutivo Slim ($229.900), Blazer Lino Verano ($179.900) y la Chaqueta Smart Casual ($189.900) son nuestros más vendidos. Perfectos para oficina y eventos.'
  },
  {
    id: 255,
    category: 'productos-hombre',
    keywords: ['camiseta', 't-shirt', 'polo', 'basica', 'hombre', 'remera'],
    question: '¿Tienen camisetas básicas para hombre?',
    answer: 'Nuestra línea Essentials incluye Camiseta Algodón Premium ($39.900), T-Shirt V-Neck ($44.900), Polo Piqué Clásico ($69.900) y Camiseta Henley ($54.900). Disponibles en 12 colores básicos.'
  },
  {
    id: 256,
    category: 'productos-hombre',
    keywords: ['talla', 'tallas', 'hombre', 'guia', 'medidas', 'tabla'],
    question: '¿Qué tallas manejan para hombre?',
    answer: 'Manejamos tallas de la S a la XXL en ropa de hombre. Cada producto incluye guía de tallas con medidas de pecho, cintura y largo en centímetros. Consulta la guía en la ficha del producto para encontrar tu talla ideal.'
  },
  {
    id: 257,
    category: 'productos-hombre',
    keywords: ['chaqueta', 'jacket', 'bomber', 'hombre', 'abrigo'],
    question: '¿Qué chaquetas tienen para hombre?',
    answer: 'Ofrecemos Chaqueta Bomber Urbana ($169.900), Chaqueta Cuero Sintético ($219.900), Chaqueta Denim Clásica ($149.900) y Chaqueta Puffer Invierno ($189.900). Estilos para cada ocasión y clima.'
  },
  {
    id: 258,
    category: 'productos-hombre',
    keywords: ['traje', 'vestido', 'formal', 'completo', 'hombre', 'suit'],
    question: '¿Venden trajes completos para hombre?',
    answer: 'Sí, nuestros trajes incluyen saco y pantalón: Traje Slim Fit Moderno ($399.900), Traje Ejecutivo Clásico ($449.900) y Traje Lino Casual ($349.900). Disponibles en azul marino, negro y gris.'
  },
  {
    id: 259,
    category: 'productos-hombre',
    keywords: ['sueter', 'sweater', 'hoodie', 'buzo', 'hombre', 'capucha'],
    question: '¿Tienen suéteres y hoodies para hombre?',
    answer: 'Nuestra colección incluye Hoodie Urbano Premium ($99.900), Suéter Cuello Redondo ($89.900), Sweater Cuello V ($94.900) y Hoodie Zip-Up ($109.900). Fabricados en algodón french terry de alta calidad.'
  },
  {
    id: 260,
    category: 'productos-hombre',
    keywords: ['bermuda', 'short', 'shorts', 'corto', 'hombre', 'playa'],
    question: '¿Tienen shorts para hombre?',
    answer: 'Sí, ofrecemos Short Chino Casual ($69.900), Bermuda Cargo ($79.900), Short Deportivo ($54.900) y Short Playa Estampado ($64.900). Perfectos para el clima cálido colombiano.'
  },
  {
    id: 261,
    category: 'productos-hombre',
    keywords: ['ropa', 'deportiva', 'gym', 'ejercicio', 'sport', 'hombre'],
    question: '¿Tienen ropa deportiva para hombre?',
    answer: 'Nuestra línea Sport incluye Camiseta Dry-Fit ($49.900), Pantaloneta Running ($54.900), Conjunto Gym Completo ($109.900) y Sudadera Training ($89.900). Telas con tecnología de secado rápido.'
  },
  {
    id: 262,
    category: 'productos-hombre',
    keywords: ['ropa', 'interior', 'boxer', 'calzoncillo', 'hombre', 'intima'],
    question: '¿Tienen ropa interior para hombre?',
    answer: 'Sí, ofrecemos Boxer Brief Premium ($29.900), Pack 3 Boxers ($79.900), Camisilla Algodón ($24.900) y Medias Ejecutivas Pack 5 ($49.900). Algodón premium con elasticidad y comodidad todo el día.'
  },
  {
    id: 263,
    category: 'productos-hombre',
    keywords: ['material', 'tela', 'calidad', 'composicion', 'hombre'],
    question: '¿De qué materiales están hechas las prendas de hombre?',
    answer: 'Utilizamos algodón premium, lino, mezclas de poliéster-algodón, denim de alta calidad y telas técnicas para ropa deportiva. Cada ficha de producto detalla la composición exacta del material.'
  },
  {
    id: 264,
    category: 'productos-hombre',
    keywords: ['cuidado', 'lavar', 'lavado', 'planchar', 'hombre', 'mantenimiento'],
    question: '¿Cómo cuido mis prendas de hombre?',
    answer: 'Recomendamos lavar a máquina en agua fría, voltear las prendas al revés, no usar blanqueador y secar a temperatura baja. Los trajes y blazers requieren lavado en seco para mantener su forma.'
  },
  {
    id: 265,
    category: 'productos-hombre',
    keywords: ['smart', 'casual', 'chaqueta', 'hombre', 'semiformal'],
    question: '¿Qué es la Chaqueta Smart Casual?',
    answer: 'La Chaqueta Smart Casual ($189.900) es una de nuestras prendas estrella. Combina la elegancia de un blazer con la comodidad de una chaqueta casual. Disponible en azul marino, gris y beige, tallas S a XXL.'
  },
  {
    id: 266,
    category: 'productos-hombre',
    keywords: ['camisa', 'lino', 'verano', 'fresca', 'hombre', 'tropical'],
    question: '¿Tienen camisas de lino para hombre?',
    answer: 'Sí, la Camisa Lino Casual ($99.900) y la Camisa Lino Manga Corta ($89.900) son perfectas para el clima colombiano. 100% lino natural, frescas y elegantes. Disponibles en blanco, beige, azul y verde oliva.'
  },
  {
    id: 267,
    category: 'productos-hombre',
    keywords: ['polo', 'cuello', 'pique', 'clasico', 'hombre'],
    question: '¿Tienen polos para hombre?',
    answer: 'Nuestra línea de polos incluye Polo Piqué Clásico ($69.900), Polo Slim Fit ($74.900) y Polo Manga Larga ($79.900). Fabricados en algodón piqué premium con bordado discreto del logo UrbanThread.'
  },
  {
    id: 268,
    category: 'productos-hombre',
    keywords: ['corbata', 'accesorio', 'formal', 'hombre', 'complemento'],
    question: '¿Venden corbatas y accesorios formales para hombre?',
    answer: 'Sí, ofrecemos Corbata Seda Premium ($59.900), Corbatín Elegante ($49.900), Pañuelo de Bolsillo ($29.900) y Gemelos Clásicos ($39.900). Complementos perfectos para completar tu look formal.'
  },
  {
    id: 269,
    category: 'productos-hombre',
    keywords: ['talla', 'grande', 'xl', 'xxl', 'hombre', 'plus'],
    question: '¿Tienen tallas grandes para hombre?',
    answer: 'Sí, manejamos tallas hasta XXL en la mayoría de nuestras prendas masculinas. Estamos ampliando nuestra oferta de tallas grandes para garantizar que todos encuentren su ajuste perfecto.'
  },
  {
    id: 270,
    category: 'productos-hombre',
    keywords: ['bestseller', 'mas vendido', 'popular', 'hombre', 'favorito'],
    question: '¿Cuáles son los productos más vendidos de hombre?',
    answer: 'Los bestsellers masculinos son: Chaqueta Smart Casual ($189.900), Jean Slim Fit ($109.900), Camisa Oxford Clásica ($89.900) y Polo Piqué Clásico ($69.900). ¡Los favoritos de nuestros clientes!'
  },
  {
    id: 271,
    category: 'productos-hombre',
    keywords: ['pijama', 'dormir', 'descanso', 'hombre', 'casa'],
    question: '¿Tienen pijamas para hombre?',
    answer: 'Sí, ofrecemos Pijama Algodón Clásico ($89.900), Pijama Short Verano ($69.900) y Set Pijama Premium ($109.900). Fabricados en algodón suave para máximo confort durante el descanso.'
  },
  {
    id: 272,
    category: 'productos-hombre',
    keywords: ['chaleco', 'vest', 'sin mangas', 'hombre', 'formal'],
    question: '¿Tienen chalecos para hombre?',
    answer: 'Sí, el Chaleco Formal Ejecutivo ($119.900), Chaleco Acolchado Outdoor ($139.900) y Chaleco Tejido Casual ($99.900) son opciones versátiles para diferentes estilos y ocasiones.'
  },
  {
    id: 273,
    category: 'productos-hombre',
    keywords: ['gabardina', 'trench', 'abrigo', 'impermeable', 'hombre'],
    question: '¿Tienen abrigos para hombre?',
    answer: 'Nuestra línea de abrigos incluye Trench Coat Ejecutivo ($249.900), Abrigo Lana Clásico ($299.900) y Parka Impermeable ($219.900). Ideales para temporada de lluvias con estilo.'
  },
  {
    id: 274,
    category: 'productos-hombre',
    keywords: ['outfit', 'combinar', 'look', 'estilo', 'hombre', 'como vestir'],
    question: '¿Me ayudan a armar un outfit de hombre?',
    answer: 'Soy Zyla y puedo ayudarte a crear el look perfecto. Dime la ocasión (casual, oficina, cita, evento) y tu estilo preferido, y te sugeriré combinaciones de nuestra colección masculina. ¡Cuéntame!'
  },
  {
    id: 275,
    category: 'productos-hombre',
    keywords: ['tendencia', 'moda', 'hombre', 'trending', 'actual'],
    question: '¿Cuáles son las tendencias en moda masculina?',
    answer: 'Las tendencias actuales incluyen el estilo smart casual, tonos tierra y neutros, pantalones wide leg, camisas de lino, sneakers con traje y el regreso del chaleco. Todo disponible en nuestra colección.'
  },
  {
    id: 276,
    category: 'productos-hombre',
    keywords: ['nueva', 'coleccion', 'temporada', 'lanzamiento', 'hombre'],
    question: '¿Cuándo lanzan nuevas colecciones de hombre?',
    answer: 'Lanzamos colecciones masculinas cada temporada (4 al año) más cápsulas especiales. La próxima colección se anuncia en nuestro newsletter y redes sociales con acceso anticipado para suscriptores.'
  },
  {
    id: 277,
    category: 'productos-hombre',
    keywords: ['camisa', 'manga', 'corta', 'verano', 'hombre', 'fresca'],
    question: '¿Tienen camisas de manga corta para hombre?',
    answer: 'Sí, la Camisa Manga Corta Resort ($79.900), Camisa Hawaiana Moderna ($84.900) y Camisa Lino Manga Corta ($89.900) son perfectas para el clima cálido. Frescas, cómodas y con estilo.'
  },
  {
    id: 278,
    category: 'productos-hombre',
    keywords: ['jogger', 'pantalon', 'casual', 'comodo', 'hombre', 'elastico'],
    question: '¿Tienen joggers para hombre?',
    answer: 'Sí, el Jogger Urbano Premium ($79.900), Jogger Tech Deportivo ($89.900) y Jogger Cargo Casual ($84.900) combinan comodidad y estilo. Fabricados en french terry con cintura elástica y puños ajustados.'
  },
  {
    id: 279,
    category: 'productos-hombre',
    keywords: ['guayabera', 'tipica', 'colombiana', 'tradicional', 'hombre'],
    question: '¿Tienen guayaberas o camisas típicas?',
    answer: 'Sí, nuestra Guayabera Moderna ($109.900) reinventa la prenda tradicional con corte contemporáneo. Disponible en blanco, beige y azul claro. Perfecta para eventos y el día a día en clima cálido.'
  },
  {
    id: 280,
    category: 'productos-hombre',
    keywords: ['sudadera', 'sweatshirt', 'crew', 'hombre', 'casual'],
    question: '¿Tienen sudaderas para hombre?',
    answer: 'Ofrecemos Sudadera Crew Neck Básica ($79.900), Sudadera Oversize Urban ($89.900) y Sudadera Half-Zip ($94.900). Algodón french terry premium, perfectas para un look casual y cómodo.'
  },
  {
    id: 281,
    category: 'productos-hombre',
    keywords: ['traje', 'baño', 'pantaloneta', 'playa', 'hombre', 'piscina'],
    question: '¿Tienen trajes de baño para hombre?',
    answer: 'Sí, ofrecemos Pantaloneta Playa Estampada ($64.900), Short Baño Liso ($54.900) y Bermuda Playa Premium ($74.900). Tela de secado rápido con bolsillos laterales y cordón ajustable.'
  },
  {
    id: 282,
    category: 'productos-hombre',
    keywords: ['color', 'colores', 'disponible', 'opciones', 'hombre'],
    question: '¿En qué colores están disponibles las prendas de hombre?',
    answer: 'Los colores más populares en nuestra línea masculina son azul marino, negro, blanco, gris, beige y verde oliva. Cada producto muestra los colores disponibles en su ficha con fotos reales.'
  },
  {
    id: 283,
    category: 'productos-hombre',
    keywords: ['camisa', 'cuadros', 'rayas', 'estampada', 'hombre'],
    question: '¿Tienen camisas estampadas o a cuadros?',
    answer: 'Sí, ofrecemos Camisa Cuadros Flannel ($89.900), Camisa Rayas Ejecutiva ($94.900), Camisa Estampada Tropical ($79.900) y Camisa Micro Print ($84.900). Estampados modernos y versátiles.'
  },
  {
    id: 284,
    category: 'productos-hombre',
    keywords: ['sostenible', 'ecologico', 'organico', 'hombre', 'eco'],
    question: '¿Tienen ropa sostenible para hombre?',
    answer: 'Nuestra línea Eco Man incluye camisetas de algodón orgánico ($49.900), jeans de denim reciclado ($129.900) y chaquetas de materiales sostenibles ($179.900). Moda responsable sin sacrificar estilo.'
  },
  {
    id: 285,
    category: 'productos-hombre',
    keywords: ['overol', 'mono', 'trabajo', 'utility', 'hombre'],
    question: '¿Tienen overoles o prendas utility para hombre?',
    answer: 'Sí, el Overol Denim Utility ($159.900) y la Chaqueta Utility Multi-bolsillos ($149.900) son parte de nuestra línea Workwear. Prendas robustas con diseño moderno inspirado en la ropa de trabajo.'
  },
  {
    id: 286,
    category: 'productos-hombre',
    keywords: ['conjunto', 'set', 'coordinado', 'hombre', 'pack'],
    question: '¿Venden conjuntos coordinados para hombre?',
    answer: 'Sí, ofrecemos Set Camisa + Short Playa ($129.900), Set Sudadera + Jogger ($159.900) y Set Pijama Completo ($109.900). Los sets tienen un 15% de descuento comparado con las piezas individuales.'
  },
  {
    id: 287,
    category: 'productos-hombre',
    keywords: ['cinturon', 'correa', 'cuero', 'hombre', 'accesorio'],
    question: '¿Venden cinturones para hombre?',
    answer: 'Sí, ofrecemos Cinturón Cuero Clásico ($69.900), Cinturón Reversible ($79.900) y Cinturón Casual Tejido ($59.900). Cuero genuino con hebillas de alta calidad. Disponibles en negro y café.'
  },
  {
    id: 288,
    category: 'productos-hombre',
    keywords: ['medias', 'calcetines', 'hombre', 'ejecutivas', 'deportivas'],
    question: '¿Venden medias para hombre?',
    answer: 'Sí, ofrecemos Pack 5 Medias Ejecutivas ($49.900), Pack 3 Medias Deportivas ($34.900) y Medias Estampadas Fun ($14.900 c/u). Algodón premium con refuerzo en talón y puntera.'
  },
  {
    id: 289,
    category: 'productos-hombre',
    keywords: ['regalo', 'hombre', 'obsequio', 'papa', 'novio', 'esposo'],
    question: '¿Qué puedo regalar a un hombre?',
    answer: 'Nuestros regalos más populares para hombre son: Chaqueta Smart Casual ($189.900), Set Perfume + Billetera ($179.900), Camisa Lino Premium ($99.900) o una Tarjeta de Regalo desde $50.000 COP.'
  },
  {
    id: 290,
    category: 'productos-hombre',
    keywords: ['descuento', 'oferta', 'promocion', 'hombre', 'rebaja'],
    question: '¿Tienen ofertas en ropa de hombre?',
    answer: 'Sí, visita nuestra sección "Ofertas Hombre" donde encontrarás descuentos de hasta 40% en prendas seleccionadas. También puedes usar tu cupón de bienvenida del 15% en tu primera compra.'
  },
  // ============================================================
  // CATEGORÍA: PRODUCTOS-NIÑOS (25 entries, IDs 291-315)
  // ============================================================
  {
    id: 291,
    category: 'productos-ninos',
    keywords: ['niño', 'niños', 'infantil', 'kids', 'hijo', 'hija', 'nino'],
    question: '¿Tienen ropa para niños?',
    answer: 'Sí, nuestra línea UrbanThread Kids tiene ropa para niños y niñas de 0 a 14 años. Prendas cómodas, divertidas y de alta calidad diseñadas para acompañar cada etapa de crecimiento.'
  },
  {
    id: 292,
    category: 'productos-ninos',
    keywords: ['bebe', 'recien nacido', 'baby', '0 meses', 'lactante', 'neonato'],
    question: '¿Tienen ropa para bebés recién nacidos?',
    answer: 'Sí, nuestra línea Baby (0-24 meses) incluye Bodies Algodón Orgánico ($29.900), Set Recién Nacido 5 piezas ($89.900), Pijamas Enterizos ($34.900) y Gorros y Manoplas ($19.900). Todo en algodón hipoalergénico.'
  },
  {
    id: 293,
    category: 'productos-ninos',
    keywords: ['talla', 'edad', 'niño', 'medida', 'guia tallas', 'infantil'],
    question: '¿Cómo elijo la talla correcta para niños?',
    answer: 'Nuestras tallas infantiles van por edad: 0-3M, 3-6M, 6-12M, 12-18M, 18-24M, 2-3 años, 4-5, 6-7, 8-9, 10-11 y 12-14 años. Cada producto tiene guía de medidas en centímetros para mayor precisión.'
  },
  {
    id: 294,
    category: 'productos-ninos',
    keywords: ['conjunto', 'set', 'niño', 'niña', 'outfit', 'coordinado'],
    question: '¿Venden conjuntos para niños?',
    answer: 'Sí, ofrecemos Set Casual Niño ($69.900), Conjunto Vestido + Cardigan Niña ($79.900), Set Deportivo Kids ($59.900) y Pijama Set Estampado ($49.900). Los sets son más económicos que las piezas por separado.'
  },
  {
    id: 295,
    category: 'productos-ninos',
    keywords: ['vestido', 'niña', 'princesa', 'fiesta', 'elegante', 'infantil'],
    question: '¿Tienen vestidos para niñas?',
    answer: 'Nuestra colección incluye Vestido Floral Niña ($59.900), Vestido Fiesta Princesa ($79.900), Vestido Casual Denim ($54.900) y Vestido Tutú ($69.900). Diseños encantadores para todas las ocasiones.'
  },
  {
    id: 296,
    category: 'productos-ninos',
    keywords: ['uniforme', 'colegio', 'escolar', 'escuela', 'niño'],
    question: '¿Venden uniformes escolares?',
    answer: 'No vendemos uniformes escolares específicos, pero nuestras camisetas básicas, pantalones y faldas en colores neutros son perfectos como complemento. Prendas duraderas que resisten el uso diario.'
  },
  {
    id: 297,
    category: 'productos-ninos',
    keywords: ['material', 'algodon', 'hipoalergenico', 'piel', 'sensible', 'niño'],
    question: '¿La ropa de niños es hipoalergénica?',
    answer: 'Toda nuestra línea infantil está fabricada con algodón orgánico certificado GOTS, libre de químicos nocivos y tintes tóxicos. Ideal para pieles sensibles de bebés y niños.'
  },
  {
    id: 298,
    category: 'productos-ninos',
    keywords: ['pijama', 'dormir', 'niño', 'niña', 'enterizo', 'noche'],
    question: '¿Tienen pijamas para niños?',
    answer: 'Sí, ofrecemos Pijama Enterizo Bebé ($34.900), Pijama Set Estampado ($49.900), Pijama Dinosaurios ($44.900) y Pijama Unicornio ($44.900). Algodón suave con estampados divertidos.'
  },
  {
    id: 299,
    category: 'productos-ninos',
    keywords: ['deportivo', 'sport', 'niño', 'actividad', 'jugar'],
    question: '¿Tienen ropa deportiva para niños?',
    answer: 'Nuestra línea Kids Active incluye Conjunto Deportivo ($59.900), Camiseta Dry-Fit Kids ($29.900), Pantaloneta Sport ($24.900) y Sudadera con Capucha ($49.900). Telas resistentes y cómodas para jugar.'
  },
  {
    id: 300,
    category: 'productos-ninos',
    keywords: ['jean', 'pantalon', 'niño', 'niña', 'denim', 'infantil'],
    question: '¿Tienen jeans para niños?',
    answer: 'Sí, ofrecemos Jean Slim Kids ($54.900), Jean Jogger Niño ($49.900), Jean Skinny Niña ($54.900) y Jean Overol ($64.900). Denim suave con elasticidad para máxima comodidad y libertad de movimiento.'
  },
  {
    id: 301,
    category: 'productos-ninos',
    keywords: ['camiseta', 'estampada', 'divertida', 'niño', 'dibujo'],
    question: '¿Tienen camisetas estampadas para niños?',
    answer: 'Nuestra colección incluye camisetas con estampados de dinosaurios, unicornios, astronautas, animales y diseños abstractos desde $24.900. Algodón 100% orgánico con estampados que no se decoloran.'
  },
  {
    id: 302,
    category: 'productos-ninos',
    keywords: ['chaqueta', 'abrigo', 'niño', 'frio', 'invierno', 'infantil'],
    question: '¿Tienen chaquetas para niños?',
    answer: 'Sí, ofrecemos Chaqueta Puffer Kids ($89.900), Chaqueta Denim Niño ($79.900), Cardigan Tejido Niña ($69.900) y Rompevientos Impermeable ($74.900). Prendas abrigadas y resistentes.'
  },
  {
    id: 303,
    category: 'productos-ninos',
    keywords: ['regalo', 'baby shower', 'nacimiento', 'canastilla', 'bebe'],
    question: '¿Tienen sets de regalo para bebés?',
    answer: 'Sí, nuestros sets de regalo incluyen Set Bienvenida Bebé 7 piezas ($129.900), Canastilla Premium ($179.900) y Set Body + Gorro + Manoplas ($59.900). Vienen en empaque de regalo especial.'
  },
  {
    id: 304,
    category: 'productos-ninos',
    keywords: ['crecimiento', 'rapido', 'durabilidad', 'niño', 'crece'],
    question: '¿La ropa de niños es durable?',
    answer: 'Nuestras prendas infantiles están diseñadas para resistir el uso intenso: costuras reforzadas, telas pre-encogidas y colores que no se decoloran. Además, muchas prendas tienen dobladillos ajustables para crecer con tu hijo.'
  },
  {
    id: 305,
    category: 'productos-ninos',
    keywords: ['short', 'bermuda', 'niño', 'niña', 'verano', 'corto'],
    question: '¿Tienen shorts para niños?',
    answer: 'Sí, ofrecemos Short Denim Kids ($39.900), Bermuda Cargo Niño ($44.900), Short Deportivo ($29.900) y Short Estampado Niña ($34.900). Cómodos y frescos para el día a día.'
  },
  {
    id: 306,
    category: 'productos-ninos',
    keywords: ['body', 'bodies', 'bebe', 'enterizo', 'mameluco', 'onesie'],
    question: '¿Tienen bodies para bebé?',
    answer: 'Sí, ofrecemos Body Manga Corta ($19.900), Body Manga Larga ($24.900), Pack 3 Bodies Básicos ($49.900) y Body Estampado ($22.900). Algodón orgánico con broches a presión para fácil cambio de pañal.'
  },
  {
    id: 307,
    category: 'productos-ninos',
    keywords: ['falda', 'tutu', 'niña', 'princesa', 'tul'],
    question: '¿Tienen faldas para niñas?',
    answer: 'Sí, ofrecemos Falda Tutú ($39.900), Falda Denim Niña ($44.900), Falda Plisada Escolar ($34.900) y Falda Estampada ($37.900). Diseños divertidos y cómodos para las pequeñas de la casa.'
  },
  {
    id: 308,
    category: 'productos-ninos',
    keywords: ['adolescente', 'teen', 'juvenil', 'joven', '12', '14', 'años'],
    question: '¿Tienen ropa para adolescentes?',
    answer: 'Nuestra línea Teen (10-14 años) incluye prendas con estilo juvenil y moderno. Jeans, camisetas gráficas, hoodies y vestidos casuales diseñados para los gustos de los adolescentes. Tallas 10-11 y 12-14 años.'
  },
  {
    id: 309,
    category: 'productos-ninos',
    keywords: ['gemelos', 'hermanos', 'matching', 'igual', 'combinado', 'familia'],
    question: '¿Tienen ropa combinada para hermanos o familia?',
    answer: 'Sí, nuestra línea Family Match tiene diseños coordinados para toda la familia: mamá, papá y niños. Sets desde $199.900 para familia de 3. Perfectos para fotos familiares y ocasiones especiales.'
  },
  {
    id: 310,
    category: 'productos-ninos',
    keywords: ['gorro', 'accesorio', 'niño', 'bufanda', 'guantes', 'bebe'],
    question: '¿Tienen accesorios para niños?',
    answer: 'Sí, ofrecemos Gorro Tejido ($19.900), Set Gorro + Bufanda ($34.900), Diademas Niña Pack 3 ($24.900) y Mochilas Infantiles ($49.900). Accesorios divertidos y funcionales para los pequeños.'
  },
  {
    id: 311,
    category: 'productos-ninos',
    keywords: ['bautizo', 'primera comunion', 'ceremonia', 'especial', 'niño'],
    question: '¿Tienen ropa para bautizos o ceremonias infantiles?',
    answer: 'Sí, nuestra línea Ceremony Kids incluye Vestido Bautizo ($89.900), Conjunto Ceremonia Niño ($99.900) y Vestido Primera Comunión ($119.900). Prendas elegantes para momentos especiales.'
  },
  {
    id: 312,
    category: 'productos-ninos',
    keywords: ['lavado', 'cuidado', 'niño', 'bebe', 'mantenimiento', 'ropa infantil'],
    question: '¿Cómo debo lavar la ropa de niños?',
    answer: 'Recomendamos lavar con detergente suave para bebés, agua tibia, ciclo delicado y secar a la sombra. Evita suavizantes con fragancias fuertes. Nuestras prendas mantienen su forma y color lavado tras lavado.'
  },
  {
    id: 313,
    category: 'productos-ninos',
    keywords: ['oferta', 'descuento', 'niño', 'promocion', 'kids', 'rebaja'],
    question: '¿Tienen ofertas en ropa de niños?',
    answer: 'Sí, visita nuestra sección "Ofertas Kids" con descuentos de hasta 30%. Además, en la compra de 3 o más prendas infantiles obtienes un 10% de descuento adicional automáticamente.'
  },
  {
    id: 314,
    category: 'productos-ninos',
    keywords: ['zapatos', 'calzado', 'niño', 'tenis', 'sandalias', 'infantil'],
    question: '¿Venden calzado para niños?',
    answer: 'Actualmente no vendemos calzado infantil, pero estamos trabajando en lanzar una línea de zapatos para niños próximamente. Por ahora, te recomendamos complementar con nuestros accesorios infantiles.'
  },
  {
    id: 315,
    category: 'productos-ninos',
    keywords: ['halloween', 'disfraz', 'navidad', 'diciembre', 'niño', 'temporada'],
    question: '¿Tienen ropa temática de temporada para niños?',
    answer: 'Sí, lanzamos colecciones temáticas para Halloween, Navidad y otras fechas especiales. Pijamas navideños ($49.900), camisetas temáticas ($29.900) y conjuntos festivos. Disponibles por tiempo limitado.'
  },
  // ============================================================
  // CATEGORÍA: PRODUCTOS-BEAUTY (25 entries, IDs 316-340)
  // ============================================================
  {
    id: 316,
    category: 'productos-beauty',
    keywords: ['perfume', 'fragancia', 'colonia', 'aroma', 'olor'],
    question: '¿Qué fragancias tienen disponibles?',
    answer: 'Nuestra línea de fragancias incluye Urban Bloom EDP Mujer ($149.900), Night Edition EDT Hombre ($139.900), Fresh Citrus Unisex ($119.900) y Mini Set Descubrimiento 4x15ml ($99.900).'
  },
  {
    id: 317,
    category: 'productos-beauty',
    keywords: ['perfume', 'mujer', 'femenino', 'dama', 'fragancia mujer'],
    question: '¿Qué perfumes tienen para mujer?',
    answer: 'Para mujer ofrecemos Urban Bloom EDP ($149.900) con notas florales, Rose Garden EDP ($169.900) con rosa y jazmín, y Midnight Glam EDP ($159.900) con notas orientales. Fragancias de larga duración.'
  },
  {
    id: 318,
    category: 'productos-beauty',
    keywords: ['perfume', 'hombre', 'masculino', 'caballero', 'fragancia hombre'],
    question: '¿Qué perfumes tienen para hombre?',
    answer: 'Para hombre ofrecemos Night Edition EDT ($139.900) con notas amaderadas, Urban Sport EDT ($119.900) fresco y energético, y Executive EDP ($159.900) elegante y sofisticado. Ideales para el día y la noche.'
  },
  {
    id: 319,
    category: 'productos-beauty',
    keywords: ['skincare', 'cuidado', 'piel', 'rostro', 'facial', 'crema'],
    question: '¿Tienen productos de cuidado facial?',
    answer: 'Nuestra línea Skincare incluye Sérum Vitamina C ($79.900), Crema Hidratante SPF30 ($69.900), Limpiador Facial Suave ($49.900) y Mascarilla Nocturna ($59.900). Formulados con ingredientes naturales.'
  },
  {
    id: 320,
    category: 'productos-beauty',
    keywords: ['crema', 'hidratante', 'humectante', 'piel', 'seca', 'rostro'],
    question: '¿Tienen cremas hidratantes?',
    answer: 'Sí, ofrecemos Crema Hidratante SPF30 ($69.900), Crema Nocturna Regeneradora ($79.900) y Gel Hidratante Oil-Free ($59.900). Para todo tipo de piel, con ingredientes naturales y sin parabenos.'
  },
  {
    id: 321,
    category: 'productos-beauty',
    keywords: ['serum', 'vitamina', 'antiarrugas', 'antiedad', 'rejuvenecimiento'],
    question: '¿Tienen sérums faciales?',
    answer: 'Nuestra línea incluye Sérum Vitamina C Iluminador ($79.900), Sérum Ácido Hialurónico ($89.900) y Sérum Retinol Nocturno ($94.900). Fórmulas concentradas para resultados visibles en 4 semanas.'
  },
  {
    id: 322,
    category: 'productos-beauty',
    keywords: ['protector', 'solar', 'spf', 'bloqueador', 'sol', 'uv'],
    question: '¿Tienen protector solar?',
    answer: 'Sí, ofrecemos Protector Solar Facial SPF50 ($59.900), Protector Solar Corporal SPF30 ($49.900) y BB Cream con SPF30 ($69.900). Fórmulas ligeras, no grasosas y aptas para uso diario bajo maquillaje.'
  },
  {
    id: 323,
    category: 'productos-beauty',
    keywords: ['maquillaje', 'cosmetico', 'labial', 'base', 'sombras'],
    question: '¿Venden maquillaje?',
    answer: 'Actualmente no vendemos maquillaje de color (bases, labiales, sombras). Nuestra línea beauty se enfoca en skincare, fragancias y cuidado personal. Estamos evaluando ampliar a maquillaje próximamente.'
  },
  {
    id: 324,
    category: 'productos-beauty',
    keywords: ['set', 'regalo', 'beauty', 'kit', 'estuche', 'obsequio'],
    question: '¿Tienen sets de regalo de belleza?',
    answer: 'Sí, ofrecemos Set Fragancia + Body Lotion ($199.900), Kit Skincare Completo ($189.900), Set Mini Fragancias Descubrimiento ($99.900) y Estuche Premium Perfume + Crema ($229.900). Empaque de regalo incluido.'
  },
  {
    id: 325,
    category: 'productos-beauty',
    keywords: ['body', 'lotion', 'crema', 'cuerpo', 'corporal', 'hidratante'],
    question: '¿Tienen cremas corporales?',
    answer: 'Sí, ofrecemos Body Lotion Urban Bloom ($59.900), Crema Corporal Manteca de Karité ($54.900) y Aceite Corporal Nutritivo ($64.900). Hidratación profunda con fragancias que complementan nuestros perfumes.'
  },
  {
    id: 326,
    category: 'productos-beauty',
    keywords: ['limpiador', 'limpieza', 'facial', 'jabon', 'gel', 'espuma'],
    question: '¿Tienen limpiadores faciales?',
    answer: 'Ofrecemos Limpiador Facial Suave ($49.900), Gel Limpiador Purificante ($54.900), Agua Micelar ($44.900) y Espuma Limpiadora ($47.900). Para todo tipo de piel, sin sulfatos ni parabenos.'
  },
  {
    id: 327,
    category: 'productos-beauty',
    keywords: ['mascarilla', 'facial', 'tratamiento', 'spa', 'cuidado'],
    question: '¿Tienen mascarillas faciales?',
    answer: 'Sí, ofrecemos Mascarilla Nocturna Reparadora ($59.900), Mascarilla Arcilla Purificante ($49.900), Sheet Mask Hidratante Pack 5 ($39.900) y Mascarilla Iluminadora ($54.900).'
  },
  {
    id: 328,
    category: 'productos-beauty',
    keywords: ['cabello', 'pelo', 'shampoo', 'acondicionador', 'capilar'],
    question: '¿Tienen productos para el cabello?',
    answer: 'Nuestra línea capilar incluye Shampoo Reparador ($39.900), Acondicionador Hidratante ($39.900), Mascarilla Capilar ($49.900) y Aceite de Argán ($54.900). Fórmulas sin sulfatos ni siliconas.'
  },
  {
    id: 329,
    category: 'productos-beauty',
    keywords: ['natural', 'organico', 'vegano', 'cruelty free', 'sin parabenos'],
    question: '¿Los productos de belleza son naturales?',
    answer: 'Nuestra línea beauty es cruelty-free y la mayoría de productos son veganos. Utilizamos ingredientes naturales, sin parabenos, sin sulfatos y sin fragancias artificiales. Certificados por PETA.'
  },
  {
    id: 330,
    category: 'productos-beauty',
    keywords: ['exfoliante', 'scrub', 'peeling', 'renovacion', 'piel muerta'],
    question: '¿Tienen exfoliantes?',
    answer: 'Sí, ofrecemos Exfoliante Facial Enzimático ($54.900), Scrub Corporal Café ($49.900) y Exfoliante Labial ($24.900). Fórmulas suaves que renuevan la piel sin irritar. Uso recomendado 2-3 veces por semana.'
  },
  {
    id: 331,
    category: 'productos-beauty',
    keywords: ['contorno', 'ojos', 'ojeras', 'bolsas', 'arrugas', 'mirada'],
    question: '¿Tienen contorno de ojos?',
    answer: 'Sí, nuestro Contorno de Ojos Anti-fatiga ($69.900) con cafeína y vitamina K reduce ojeras y bolsas. También ofrecemos Parches de Ojos Hidrogel Pack 5 ($34.900) para resultados inmediatos.'
  },
  {
    id: 332,
    category: 'productos-beauty',
    keywords: ['tonico', 'toner', 'agua', 'rosas', 'preparacion', 'piel'],
    question: '¿Tienen tónicos faciales?',
    answer: 'Ofrecemos Tónico Agua de Rosas ($44.900), Tónico Ácido Glicólico ($54.900) y Tónico Calmante Aloe Vera ($39.900). Esenciales para preparar la piel antes del sérum y la hidratante.'
  },
  {
    id: 333,
    category: 'productos-beauty',
    keywords: ['labios', 'balsamo', 'labial', 'hidratante', 'lip'],
    question: '¿Tienen productos para labios?',
    answer: 'Sí, ofrecemos Bálsamo Labial SPF15 ($19.900), Exfoliante Labial Azúcar ($24.900) y Mascarilla Labial Nocturna ($29.900). Hidratación y protección para labios suaves todo el día.'
  },
  {
    id: 334,
    category: 'productos-beauty',
    keywords: ['desodorante', 'antitranspirante', 'natural', 'aluminio'],
    question: '¿Tienen desodorantes naturales?',
    answer: 'Sí, nuestro Desodorante Natural ($29.900) está libre de aluminio, parabenos y alcohol. Disponible en fragancias de lavanda, cítricos y sin fragancia. Protección efectiva de hasta 24 horas.'
  },
  {
    id: 335,
    category: 'productos-beauty',
    keywords: ['aceite', 'esencial', 'aromaterapia', 'relajacion', 'bienestar'],
    question: '¿Tienen aceites esenciales?',
    answer: 'Ofrecemos Set Aceites Esenciales 3 piezas ($59.900) con lavanda, eucalipto y naranja. También Aceite de Rosa Mosqueta ($44.900) y Aceite de Argán Puro ($54.900) para cuidado de piel y cabello.'
  },
  {
    id: 336,
    category: 'productos-beauty',
    keywords: ['miniatura', 'mini', 'viaje', 'travel', 'tamaño', 'muestra'],
    question: '¿Tienen productos en tamaño de viaje?',
    answer: 'Sí, ofrecemos Kit Viaje Skincare ($49.900) con 5 miniaturas, Mini Fragancias 15ml ($39.900) y Set Travel Beauty ($59.900). Perfectos para llevar en tu equipaje de mano sin exceder los límites de líquidos.'
  },
  {
    id: 337,
    category: 'productos-beauty',
    keywords: ['hombre', 'grooming', 'barba', 'afeitado', 'masculino beauty'],
    question: '¿Tienen productos de grooming para hombre?',
    answer: 'Sí, nuestra línea Men\'s Grooming incluye Aceite de Barba ($44.900), Bálsamo After Shave ($39.900), Crema Hidratante Hombre ($54.900) y Gel de Afeitar ($34.900). Cuidado masculino premium.'
  },
  {
    id: 338,
    category: 'productos-beauty',
    keywords: ['vencimiento', 'caducidad', 'expiracion', 'duracion', 'beauty'],
    question: '¿Cuál es la vida útil de los productos de belleza?',
    answer: 'Nuestros productos de belleza tienen una vida útil de 12 a 36 meses sin abrir. Una vez abiertos, recomendamos usarlos dentro de 6-12 meses. La fecha de vencimiento está impresa en cada producto.'
  },
  {
    id: 339,
    category: 'productos-beauty',
    keywords: ['piel', 'grasa', 'seca', 'mixta', 'sensible', 'tipo piel'],
    question: '¿Cómo elijo productos según mi tipo de piel?',
    answer: 'En cada producto indicamos el tipo de piel recomendado. Para piel grasa, elige fórmulas oil-free. Para piel seca, busca ingredientes como ácido hialurónico. Zyla puede ayudarte a elegir la rutina ideal para ti.'
  },
  {
    id: 340,
    category: 'productos-beauty',
    keywords: ['rutina', 'skincare', 'pasos', 'orden', 'cuidado diario'],
    question: '¿Cuál es la rutina de skincare recomendada?',
    answer: 'Recomendamos: 1) Limpiador, 2) Tónico, 3) Sérum, 4) Contorno de ojos, 5) Hidratante y 6) Protector solar (de día). De noche, reemplaza el protector por una crema nocturna. Nuestro Kit Rutina Completa cuesta $189.900.'
  },
  // ============================================================
  // CATEGORÍA: PRODUCTOS-ACCESORIOS (30 entries, IDs 341-370)
  // ============================================================
  {
    id: 341,
    category: 'productos-accesorios',
    keywords: ['bolso', 'cartera', 'bolsa', 'bag', 'maletin', 'morral'],
    question: '¿Qué bolsos tienen disponibles?',
    answer: 'Nuestra colección incluye Bolso Tote Clásico ($149.900), Bolso Crossbody Urbano ($99.900), Mochila Cuero Sintético ($129.900), Clutch Noche ($79.900) y Maletín Ejecutivo ($179.900). Diseños versátiles y duraderos.'
  },
  {
    id: 342,
    category: 'productos-accesorios',
    keywords: ['gafas', 'sol', 'lentes', 'sunglasses', 'anteojos', 'uv'],
    question: '¿Qué gafas de sol tienen?',
    answer: 'Ofrecemos Gafas Aviador Clásicas ($89.900), Gafas Cat Eye Retro ($79.900), Gafas Oversize Glam ($94.900) y Gafas Sport Polarizadas ($99.900). Todas con protección UV400 y estuche incluido.'
  },
  {
    id: 343,
    category: 'productos-accesorios',
    keywords: ['joya', 'joyas', 'collar', 'pulsera', 'anillo', 'arete'],
    question: '¿Qué joyas tienen disponibles?',
    answer: 'Nuestra línea de joyería incluye Collar Cadena Dorada ($49.900), Aretes Argolla ($39.900), Pulsera Charm ($44.900) y Anillo Minimalista ($34.900). Acero inoxidable bañado en oro 18k, hipoalergénico.'
  },
  {
    id: 344,
    category: 'productos-accesorios',
    keywords: ['zapatos', 'calzado', 'tenis', 'sneakers', 'tacones', 'botas'],
    question: '¿Qué calzado tienen disponible?',
    answer: 'Ofrecemos Sneakers Urbanos ($159.900), Botines Chelsea ($179.900), Sandalias Plataforma ($99.900), Mocasines Clásicos ($129.900) y Tacones Block ($119.900). Calzado cómodo con diseño contemporáneo.'
  },
  {
    id: 345,
    category: 'productos-accesorios',
    keywords: ['cinturon', 'correa', 'cuero', 'accesorio', 'hebilla'],
    question: '¿Qué cinturones tienen?',
    answer: 'Ofrecemos Cinturón Cuero Clásico ($69.900), Cinturón Trenzado ($59.900), Cinturón Cadena Dorada ($54.900) y Cinturón Reversible Negro/Café ($79.900). Cuero genuino con acabados premium.'
  },
  {
    id: 346,
    category: 'productos-accesorios',
    keywords: ['reloj', 'relojes', 'watch', 'tiempo', 'pulsera reloj'],
    question: '¿Venden relojes?',
    answer: 'Sí, ofrecemos Reloj Minimalista Acero ($199.900), Reloj Cuero Clásico ($179.900), Reloj Deportivo Digital ($149.900) y Reloj Dorado Elegante ($219.900). Mecanismos de cuarzo japonés con garantía de 2 años.'
  },
  {
    id: 347,
    category: 'productos-accesorios',
    keywords: ['bufanda', 'pañuelo', 'scarf', 'cuello', 'pashmina'],
    question: '¿Tienen bufandas y pañuelos?',
    answer: 'Sí, ofrecemos Bufanda Lana Suave ($59.900), Pañuelo Seda Estampado ($49.900), Pashmina Cashmere ($89.900) y Pañuelo Bandana ($29.900). Accesorios versátiles que transforman cualquier outfit.'
  },
  {
    id: 348,
    category: 'productos-accesorios',
    keywords: ['sombrero', 'gorra', 'hat', 'cap', 'boina', 'cabeza'],
    question: '¿Tienen sombreros y gorras?',
    answer: 'Ofrecemos Gorra Baseball Urbana ($39.900), Sombrero Bucket ($44.900), Sombrero Fedora ($69.900), Boina Francesa ($49.900) y Gorra Dad Hat ($34.900). Protección solar con estilo.'
  },
  {
    id: 349,
    category: 'productos-accesorios',
    keywords: ['billetera', 'monedero', 'wallet', 'tarjetero', 'porta'],
    question: '¿Tienen billeteras y tarjeteros?',
    answer: 'Sí, ofrecemos Billetera Cuero Clásica ($79.900), Tarjetero Slim ($49.900), Monedero Mini ($39.900) y Billetera Larga Mujer ($89.900). Cuero genuino con protección RFID para tus tarjetas.'
  },
  {
    id: 350,
    category: 'productos-accesorios',
    keywords: ['mochila', 'backpack', 'morral', 'espalda', 'laptop'],
    question: '¿Tienen mochilas?',
    answer: 'Ofrecemos Mochila Urbana Cuero ($129.900), Mochila Laptop 15" ($149.900), Mochila Mini Casual ($89.900) y Mochila Deportiva ($99.900). Diseños funcionales con compartimentos organizadores.'
  },
  {
    id: 351,
    category: 'productos-accesorios',
    keywords: ['tenis', 'sneakers', 'zapatillas', 'deportivos', 'casual'],
    question: '¿Qué sneakers tienen?',
    answer: 'Nuestra línea incluye Sneakers Classic White ($159.900), Sneakers Platform ($169.900), Sneakers Running ($149.900) y Sneakers Retro Color ($154.900). Suela de goma, plantilla memory foam.'
  },
  {
    id: 352,
    category: 'productos-accesorios',
    keywords: ['botas', 'botines', 'boots', 'chelsea', 'combat', 'lluvia'],
    question: '¿Qué botas y botines tienen?',
    answer: 'Ofrecemos Botines Chelsea ($179.900), Botas Combat ($189.900), Botines Tacón Block ($159.900) y Botas Lluvia ($99.900). Materiales resistentes al agua con diseños modernos.'
  },
  {
    id: 353,
    category: 'productos-accesorios',
    keywords: ['sandalia', 'sandalias', 'plana', 'plataforma', 'verano'],
    question: '¿Tienen sandalias?',
    answer: 'Sí, ofrecemos Sandalias Plataforma ($99.900), Sandalias Planas Minimalistas ($69.900), Sandalias Tiras Elegantes ($89.900) y Chanclas Playa ($39.900). Cómodas y perfectas para el clima cálido.'
  },
  {
    id: 354,
    category: 'productos-accesorios',
    keywords: ['talla', 'calzado', 'zapato', 'numero', 'pie', 'medida'],
    question: '¿Cómo elijo la talla de calzado correcta?',
    answer: 'Nuestro calzado usa tallas colombianas (35-42 mujer, 38-45 hombre). Cada producto tiene guía de tallas con medidas en centímetros del pie. Te recomendamos medir tu pie al final del día para mayor precisión.'
  },
  {
    id: 355,
    category: 'productos-accesorios',
    keywords: ['collar', 'cadena', 'gargantilla', 'choker', 'cuello joya'],
    question: '¿Qué collares tienen?',
    answer: 'Ofrecemos Collar Cadena Eslabones ($49.900), Gargantilla Choker ($39.900), Collar Largo Pendiente ($54.900) y Collar Perlas ($59.900). Acero inoxidable bañado en oro 18k, resistente al agua.'
  },
  {
    id: 356,
    category: 'productos-accesorios',
    keywords: ['arete', 'aretes', 'pendiente', 'oreja', 'argolla', 'ear'],
    question: '¿Qué aretes tienen?',
    answer: 'Nuestra colección incluye Aretes Argolla Dorada ($39.900), Aretes Perla Clásica ($34.900), Aretes Colgantes ($44.900), Ear Cuff Moderno ($29.900) y Aretes Huggies ($37.900). Hipoalergénicos.'
  },
  {
    id: 357,
    category: 'productos-accesorios',
    keywords: ['pulsera', 'brazalete', 'tobillera', 'muñeca', 'charm'],
    question: '¿Qué pulseras tienen?',
    answer: 'Ofrecemos Pulsera Charm Personalizable ($44.900), Brazalete Rígido Dorado ($49.900), Pulsera Tejida ($29.900), Tobillera Cadena ($24.900) y Set 3 Pulseras ($59.900). Acero inoxidable premium.'
  },
  {
    id: 358,
    category: 'productos-accesorios',
    keywords: ['anillo', 'sortija', 'dedo', 'banda', 'sello'],
    question: '¿Qué anillos tienen?',
    answer: 'Ofrecemos Anillo Minimalista ($34.900), Anillo Sello ($39.900), Set 5 Anillos Midi ($49.900), Anillo Piedra Natural ($44.900) y Anillo Banda Gruesa ($37.900). Tallas 5 a 10, acero bañado en oro 18k.'
  },
  {
    id: 359,
    category: 'productos-accesorios',
    keywords: ['maleta', 'viaje', 'equipaje', 'trolley', 'carry on'],
    question: '¿Tienen maletas de viaje?',
    answer: 'Sí, ofrecemos Maleta Carry-On ($249.900), Maleta Mediana ($299.900), Set 2 Maletas ($449.900) y Neceser Viaje ($69.900). Material resistente, ruedas 360° y cerradura TSA incluida.'
  },
  {
    id: 360,
    category: 'productos-accesorios',
    keywords: ['paraguas', 'sombrilla', 'lluvia', 'proteccion', 'plegable'],
    question: '¿Venden paraguas?',
    answer: 'Sí, ofrecemos Paraguas Plegable Compacto ($34.900), Paraguas Automático Grande ($49.900) y Paraguas Transparente Fashion ($39.900). Resistentes al viento con diseños elegantes.'
  },
  {
    id: 361,
    category: 'productos-accesorios',
    keywords: ['llavero', 'keychain', 'accesorio', 'bolso', 'charm bolso'],
    question: '¿Tienen llaveros y charms para bolso?',
    answer: 'Sí, ofrecemos Llavero Cuero Premium ($24.900), Charm Bolso Dorado ($29.900), Llavero Inicial Personalizado ($19.900) y Pompón Peluche ($14.900). Detalles que marcan la diferencia.'
  },
  {
    id: 362,
    category: 'productos-accesorios',
    keywords: ['cuidado', 'cuero', 'mantenimiento', 'limpiar', 'accesorio'],
    question: '¿Cómo cuido mis accesorios de cuero?',
    answer: 'Recomendamos limpiar con paño húmedo suave, aplicar crema hidratante para cuero cada 2-3 meses y guardar en bolsa de tela. Evita exposición prolongada al sol y contacto con perfumes o químicos.'
  },
  {
    id: 363,
    category: 'productos-accesorios',
    keywords: ['garantia', 'accesorio', 'joya', 'reloj', 'defecto'],
    question: '¿Qué garantía tienen los accesorios?',
    answer: 'Nuestros accesorios tienen garantía de 6 meses por defectos de fabricación. Los relojes tienen garantía extendida de 2 años. La joyería incluye garantía de baño de oro por 12 meses con uso normal.'
  },
  {
    id: 364,
    category: 'productos-accesorios',
    keywords: ['tacones', 'stiletto', 'plataforma', 'alto', 'mujer zapato'],
    question: '¿Tienen tacones para mujer?',
    answer: 'Sí, ofrecemos Tacón Block Elegante ($119.900), Stiletto Clásico ($129.900), Tacón Plataforma ($134.900) y Mule Tacón Bajo ($99.900). Diseños cómodos con plantilla acolchada para uso prolongado.'
  },
  {
    id: 365,
    category: 'productos-accesorios',
    keywords: ['mocasin', 'loafer', 'plano', 'comodo', 'clasico', 'zapato'],
    question: '¿Tienen mocasines?',
    answer: 'Ofrecemos Mocasín Clásico Cuero ($129.900), Loafer Plataforma ($139.900), Mocasín Borla ($134.900) y Mocasín Casual Suede ($119.900). Disponibles para hombre y mujer, cómodos para todo el día.'
  },
  {
    id: 366,
    category: 'productos-accesorios',
    keywords: ['estuche', 'funda', 'celular', 'phone case', 'tecnologia'],
    question: '¿Venden fundas para celular?',
    answer: 'Sí, ofrecemos Funda Cuero Premium ($39.900), Funda Silicona Colores ($24.900) y Funda Crossbody con Cadena ($49.900). Disponibles para iPhone y Samsung Galaxy en los modelos más recientes.'
  },
  {
    id: 367,
    category: 'productos-accesorios',
    keywords: ['cinturon', 'mujer', 'cadena', 'elastico', 'fino'],
    question: '¿Tienen cinturones para mujer?',
    answer: 'Sí, ofrecemos Cinturón Cadena Dorada ($54.900), Cinturón Fino Cuero ($49.900), Cinturón Elástico Trenzado ($44.900) y Cinturón Ancho Statement ($64.900). Complementos perfectos para definir la cintura.'
  },
  {
    id: 368,
    category: 'productos-accesorios',
    keywords: ['bestseller', 'popular', 'mas vendido', 'accesorio', 'favorito'],
    question: '¿Cuáles son los accesorios más vendidos?',
    answer: 'Nuestros accesorios bestsellers son: Bolso Tote Clásico ($149.900), Gafas Aviador ($89.900), Sneakers Classic White ($159.900) y Collar Cadena Dorada ($49.900). ¡Los favoritos de nuestros clientes!'
  },
  {
    id: 369,
    category: 'productos-accesorios',
    keywords: ['clutch', 'sobre', 'noche', 'fiesta', 'evento', 'bolso pequeño'],
    question: '¿Tienen clutches para eventos?',
    answer: 'Sí, ofrecemos Clutch Satinado Noche ($79.900), Clutch Metalizado ($89.900), Sobre Cuero Elegante ($94.900) y Mini Bag Cadena ($69.900). Perfectos para fiestas, bodas y eventos especiales.'
  },
  {
    id: 370,
    category: 'productos-accesorios',
    keywords: ['cuidado', 'joya', 'limpiar', 'brillo', 'mantenimiento joya'],
    question: '¿Cómo cuido mis joyas?',
    answer: 'Guarda tus joyas en la bolsa de tela incluida, evita contacto con agua, perfumes y cremas. Limpia con paño suave seco. Para mantener el brillo del baño de oro, retira las joyas antes de dormir y bañarte.'
  },
  // ============================================================
  // CATEGORÍA: CUENTA (30 entries, IDs 371-400)
  // ============================================================
  {
    id: 371,
    category: 'cuenta',
    keywords: ['crear', 'cuenta', 'registro', 'registrar', 'nueva', 'abrir'],
    question: '¿Cómo creo una cuenta en UrbanThread AI?',
    answer: 'Haz clic en "Registrarse" en la esquina superior derecha. Ingresa tu correo electrónico, nombre completo y crea una contraseña. Recibirás un código OTP en tu correo para verificar tu cuenta. ¡Listo en menos de 2 minutos!'
  },
  {
    id: 372,
    category: 'cuenta',
    keywords: ['iniciar', 'sesion', 'login', 'entrar', 'acceder', 'ingresar'],
    question: '¿Cómo inicio sesión en mi cuenta?',
    answer: 'Haz clic en "Iniciar sesión", ingresa tu correo electrónico y contraseña. Si tienes activada la verificación en dos pasos, recibirás un código OTP en tu correo o celular para confirmar tu identidad.'
  },
  {
    id: 373,
    category: 'cuenta',
    keywords: ['contraseña', 'olvidé', 'recuperar', 'restablecer', 'password', 'clave'],
    question: '¿Cómo recupero mi contraseña?',
    answer: 'Haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña. El enlace es válido por 24 horas.'
  },
  {
    id: 374,
    category: 'cuenta',
    keywords: ['otp', 'codigo', 'verificacion', 'dos pasos', 'autenticacion'],
    question: '¿Qué es el código OTP?',
    answer: 'El OTP (One-Time Password) es un código de verificación de 6 dígitos que enviamos a tu correo o celular para confirmar tu identidad. Es una capa adicional de seguridad para proteger tu cuenta.'
  },
  {
    id: 375,
    category: 'cuenta',
    keywords: ['otp', 'no llega', 'codigo', 'no recibo', 'verificacion', 'demora'],
    question: '¿Qué hago si no recibo el código OTP?',
    answer: 'Verifica tu carpeta de spam o correo no deseado. Si no llega en 2 minutos, haz clic en "Reenviar código". Si el problema persiste, verifica que tu correo esté bien escrito o contáctanos por WhatsApp.'
  },
  {
    id: 376,
    category: 'cuenta',
    keywords: ['perfil', 'editar', 'actualizar', 'datos', 'informacion', 'personal'],
    question: '¿Cómo actualizo mis datos personales?',
    answer: 'Ingresa a tu Portal Cliente, ve a "Mi Perfil" y haz clic en "Editar". Puedes actualizar tu nombre, teléfono, dirección y preferencias. El correo electrónico no se puede cambiar por seguridad.'
  },
  {
    id: 377,
    category: 'cuenta',
    keywords: ['cambiar', 'contraseña', 'nueva', 'password', 'actualizar clave'],
    question: '¿Cómo cambio mi contraseña?',
    answer: 'En tu Portal Cliente, ve a "Mi Perfil" > "Seguridad" > "Cambiar contraseña". Ingresa tu contraseña actual y la nueva contraseña. Recomendamos usar al menos 8 caracteres con letras, números y símbolos.'
  },
  {
    id: 378,
    category: 'cuenta',
    keywords: ['eliminar', 'borrar', 'cuenta', 'cerrar', 'desactivar', 'baja'],
    question: '¿Cómo elimino mi cuenta?',
    answer: 'Puedes solicitar la eliminación de tu cuenta en "Mi Perfil" > "Privacidad" > "Eliminar cuenta". El proceso toma 30 días durante los cuales puedes reactivarla. Todos tus datos serán eliminados permanentemente.'
  },
  {
    id: 379,
    category: 'cuenta',
    keywords: ['direccion', 'agregar', 'guardar', 'domicilio', 'envio', 'nueva direccion'],
    question: '¿Cómo agrego una dirección de envío?',
    answer: 'En tu Portal Cliente, ve a "Mis Direcciones" y haz clic en "Agregar dirección". Puedes guardar múltiples direcciones y seleccionar una como predeterminada para agilizar tus futuras compras.'
  },
  {
    id: 380,
    category: 'cuenta',
    keywords: ['notificaciones', 'correo', 'email', 'preferencias', 'comunicaciones'],
    question: '¿Cómo configuro mis notificaciones?',
    answer: 'En tu Portal Cliente, ve a "Mi Perfil" > "Notificaciones". Puedes activar o desactivar notificaciones por correo, SMS y push para pedidos, promociones, nuevas colecciones y novedades.'
  },
  {
    id: 381,
    category: 'cuenta',
    keywords: ['cuenta', 'bloqueada', 'suspendida', 'no puedo entrar', 'acceso'],
    question: '¿Por qué está bloqueada mi cuenta?',
    answer: 'Tu cuenta puede bloquearse por múltiples intentos fallidos de inicio de sesión. Espera 30 minutos e intenta de nuevo, o usa "¿Olvidaste tu contraseña?" para restablecerla. Si persiste, contáctanos por WhatsApp.'
  },
  {
    id: 382,
    category: 'cuenta',
    keywords: ['privacidad', 'datos', 'proteccion', 'informacion', 'seguridad datos'],
    question: '¿Cómo protegen mis datos personales?',
    answer: 'Cumplimos con la Ley 1581 de 2012 de Protección de Datos Personales de Colombia. Tus datos están encriptados, nunca los compartimos con terceros sin tu consentimiento y puedes solicitar su eliminación en cualquier momento.'
  },
  {
    id: 383,
    category: 'cuenta',
    keywords: ['suscripcion', 'newsletter', 'correos', 'cancelar', 'desuscribir'],
    question: '¿Cómo me desuscribo del newsletter?',
    answer: 'En cualquier correo de newsletter encontrarás el enlace "Desuscribirse" al final. También puedes desactivar las comunicaciones promocionales en tu Portal Cliente > "Notificaciones".'
  },
  {
    id: 384,
    category: 'cuenta',
    keywords: ['cuenta', 'beneficios', 'ventajas', 'registrado', 'por que'],
    question: '¿Qué beneficios tiene crear una cuenta?',
    answer: 'Con tu cuenta obtienes: 15% de descuento en tu primera compra, acumulación de puntos, historial de pedidos, lista de deseos, direcciones guardadas, acceso al Portal Cliente y ofertas exclusivas.'
  },
  {
    id: 385,
    category: 'cuenta',
    keywords: ['comprar', 'sin', 'cuenta', 'invitado', 'guest', 'sin registro'],
    question: '¿Puedo comprar sin crear una cuenta?',
    answer: 'Sí, puedes comprar como invitado ingresando tus datos de envío y pago. Sin embargo, no podrás acumular puntos, guardar direcciones ni acceder al Portal Cliente para seguimiento de pedidos.'
  },
  {
    id: 386,
    category: 'cuenta',
    keywords: ['correo', 'cambiar', 'email', 'nuevo correo', 'actualizar email'],
    question: '¿Puedo cambiar el correo electrónico de mi cuenta?',
    answer: 'Por seguridad, el correo electrónico principal no se puede cambiar directamente. Si necesitas actualizarlo, contáctanos por WhatsApp al 300 509 1114 con tu documento de identidad para verificar tu identidad.'
  },
  {
    id: 387,
    category: 'cuenta',
    keywords: ['telefono', 'celular', 'cambiar', 'numero', 'actualizar telefono'],
    question: '¿Cómo actualizo mi número de teléfono?',
    answer: 'En tu Portal Cliente, ve a "Mi Perfil" y actualiza tu número de celular. Recibirás un código OTP en el nuevo número para verificarlo. Es importante mantenerlo actualizado para recibir notificaciones de envío.'
  },
  {
    id: 388,
    category: 'cuenta',
    keywords: ['sesion', 'abierta', 'cerrar', 'logout', 'salir', 'dispositivo'],
    question: '¿Cómo cierro sesión en todos los dispositivos?',
    answer: 'En tu Portal Cliente, ve a "Mi Perfil" > "Seguridad" > "Cerrar todas las sesiones". Esto cerrará tu sesión en todos los dispositivos donde hayas iniciado sesión. Deberás volver a ingresar tu contraseña.'
  },
  {
    id: 389,
    category: 'cuenta',
    keywords: ['verificar', 'cuenta', 'confirmar', 'email', 'activar'],
    question: '¿Cómo verifico mi cuenta?',
    answer: 'Al registrarte, enviamos un código OTP a tu correo electrónico. Ingresa el código de 6 dígitos para verificar tu cuenta. Si no lo recibiste, haz clic en "Reenviar código" o revisa tu carpeta de spam.'
  },
  {
    id: 390,
    category: 'cuenta',
    keywords: ['tarjeta', 'guardada', 'eliminar', 'borrar', 'metodo pago'],
    question: '¿Cómo elimino una tarjeta guardada?',
    answer: 'En tu Portal Cliente, ve a "Métodos de pago", selecciona la tarjeta que deseas eliminar y haz clic en "Eliminar". La tarjeta se removerá inmediatamente y no se usará en futuras compras.'
  },
  {
    id: 391,
    category: 'cuenta',
    keywords: ['historial', 'actividad', 'movimientos', 'registro', 'cuenta'],
    question: '¿Puedo ver el historial de actividad de mi cuenta?',
    answer: 'Sí, en tu Portal Cliente > "Mi Perfil" > "Actividad" puedes ver el registro de inicios de sesión, cambios de datos, pedidos realizados y radicaciones. Esto te ayuda a monitorear la seguridad de tu cuenta.'
  },
  {
    id: 392,
    category: 'cuenta',
    keywords: ['foto', 'perfil', 'avatar', 'imagen', 'cambiar foto'],
    question: '¿Puedo agregar una foto de perfil?',
    answer: 'Sí, en tu Portal Cliente > "Mi Perfil" haz clic en el ícono de cámara sobre tu avatar. Puedes subir una foto en formato JPG o PNG de hasta 5 MB. Tu foto aparecerá en tu perfil y en el chat con Zyla.'
  },
  {
    id: 393,
    category: 'cuenta',
    keywords: ['puntos', 'saldo', 'consultar', 'cuantos', 'acumulados'],
    question: '¿Cómo consulto mis puntos UrbanThread?',
    answer: 'En tu Portal Cliente verás tu saldo de puntos en el dashboard principal. También puedes ir a "Mis Puntos" para ver el detalle de puntos acumulados, redimidos y por vencer.'
  },
  {
    id: 394,
    category: 'cuenta',
    keywords: ['puntos', 'vencer', 'expirar', 'caducar', 'vigencia'],
    question: '¿Los puntos UrbanThread tienen fecha de vencimiento?',
    answer: 'Sí, los puntos UrbanThread tienen vigencia de 12 meses desde la fecha de acumulación. Te enviaremos un recordatorio por correo 30 días antes de que expiren para que puedas usarlos.'
  },
  {
    id: 395,
    category: 'cuenta',
    keywords: ['nivel', 'categoria', 'vip', 'gold', 'premium', 'fidelidad'],
    question: '¿Tienen niveles de membresía o programa VIP?',
    answer: 'Sí, nuestro programa tiene 3 niveles: Classic (0-499 puntos), Gold (500-999 puntos) y VIP (1000+ puntos). Cada nivel ofrece beneficios exclusivos como descuentos adicionales, envío gratis y acceso anticipado a colecciones.'
  },
  {
    id: 396,
    category: 'cuenta',
    keywords: ['referido', 'invitar', 'amigo', 'compartir', 'referral'],
    question: '¿Tienen programa de referidos?',
    answer: 'Sí, en tu Portal Cliente encontrarás tu código de referido único. Por cada amigo que se registre y haga su primera compra, ambos reciben $20.000 COP de descuento. ¡Sin límite de referidos!'
  },
  {
    id: 397,
    category: 'cuenta',
    keywords: ['cumpleaños', 'fecha', 'nacimiento', 'regalo', 'descuento cumple'],
    question: '¿Recibo algo por mi cumpleaños?',
    answer: 'Sí, registra tu fecha de nacimiento en tu perfil y recibirás un cupón especial de cumpleaños con 20% de descuento válido por 7 días. Además, los miembros Gold y VIP reciben un regalo sorpresa.'
  },
  {
    id: 398,
    category: 'cuenta',
    keywords: ['idioma', 'lenguaje', 'español', 'ingles', 'configuracion'],
    question: '¿Puedo cambiar el idioma de la plataforma?',
    answer: 'Actualmente nuestra plataforma está disponible en español. Estamos trabajando en la versión en inglés para nuestros clientes internacionales. Próximamente estará disponible.'
  },
  {
    id: 399,
    category: 'cuenta',
    keywords: ['multiples', 'cuentas', 'dos', 'varias', 'duplicada'],
    question: '¿Puedo tener más de una cuenta?',
    answer: 'Cada persona puede tener una sola cuenta asociada a un correo electrónico único. Si creaste una cuenta duplicada por error, contáctanos para unificar tus datos y puntos acumulados.'
  },
  {
    id: 400,
    category: 'cuenta',
    keywords: ['seguridad', 'cuenta', 'hackeo', 'sospechoso', 'no autorizado'],
    question: '¿Qué hago si creo que hackearon mi cuenta?',
    answer: 'Cambia tu contraseña inmediatamente desde "¿Olvidaste tu contraseña?". Luego cierra todas las sesiones activas y contáctanos por WhatsApp. Revisaremos la actividad reciente y aseguraremos tu cuenta.'
  },
  // ============================================================
  // CATEGORÍA: SOSTENIBILIDAD (20 entries, IDs 401-420)
  // ============================================================
  {
    id: 401,
    category: 'sostenibilidad',
    keywords: ['sostenible', 'sostenibilidad', 'ecologico', 'medio ambiente', 'verde'],
    question: '¿Qué hace UrbanThread AI por la sostenibilidad?',
    answer: 'En UrbanThread AI estamos comprometidos con la moda sostenible. Usamos materiales orgánicos y reciclados, empaques biodegradables, compensamos emisiones de CO2 y trabajamos con proveedores certificados en prácticas éticas.'
  },
  {
    id: 402,
    category: 'sostenibilidad',
    keywords: ['algodon', 'organico', 'gots', 'certificado', 'natural'],
    question: '¿Qué es el algodón orgánico certificado GOTS?',
    answer: 'El algodón orgánico GOTS (Global Organic Textile Standard) se cultiva sin pesticidas ni químicos tóxicos. Nuestra línea Eco Collection usa 100% algodón orgánico certificado, más suave y amigable con el planeta.'
  },
  {
    id: 403,
    category: 'sostenibilidad',
    keywords: ['reciclado', 'reciclaje', 'material', 'reutilizado', 'pet'],
    question: '¿Usan materiales reciclados?',
    answer: 'Sí, parte de nuestra colección utiliza poliéster reciclado de botellas PET y denim reciclado. Cada prenda de nuestra línea Eco indica el porcentaje de material reciclado en su composición.'
  },
  {
    id: 404,
    category: 'sostenibilidad',
    keywords: ['empaque', 'biodegradable', 'plastico', 'packaging', 'cero plastico'],
    question: '¿Los empaques son biodegradables?',
    answer: 'Sí, nuestras cajas son de cartón reciclado certificado FSC, las bolsas internas son de tela reutilizable y usamos cinta de papel kraft. Hemos eliminado el 95% del plástico de nuestros empaques.'
  },
  {
    id: 405,
    category: 'sostenibilidad',
    keywords: ['carbono', 'huella', 'emisiones', 'co2', 'neutro', 'compensar'],
    question: '¿Compensan las emisiones de carbono?',
    answer: 'Sí, compensamos el 100% de las emisiones de CO2 de nuestros envíos mediante programas de reforestación en la Amazonía colombiana. Cada pedido contribuye a la siembra de árboles nativos.'
  },
  {
    id: 406,
    category: 'sostenibilidad',
    keywords: ['proveedores', 'etico', 'trabajo', 'justo', 'condiciones', 'fabrica'],
    question: '¿Sus proveedores cumplen con prácticas éticas?',
    answer: 'Todos nuestros proveedores están certificados en prácticas laborales éticas. Garantizamos salarios justos, condiciones de trabajo seguras y prohibición de trabajo infantil. Realizamos auditorías anuales.'
  },
  {
    id: 407,
    category: 'sostenibilidad',
    keywords: ['agua', 'ahorro', 'consumo', 'hidrico', 'produccion'],
    question: '¿Cómo reducen el consumo de agua en la producción?',
    answer: 'Nuestros procesos de teñido utilizan tecnología de bajo consumo de agua, ahorrando hasta un 50% comparado con métodos tradicionales. El denim de nuestra línea Eco usa técnicas de lavado con ozono.'
  },
  {
    id: 408,
    category: 'sostenibilidad',
    keywords: ['tintes', 'quimicos', 'toxico', 'colorante', 'natural'],
    question: '¿Usan tintes tóxicos en las prendas?',
    answer: 'No, utilizamos tintes certificados OEKO-TEX Standard 100, libres de sustancias nocivas. Nuestra línea Eco Collection usa tintes naturales derivados de plantas. Todas nuestras prendas son seguras para la piel.'
  },
  {
    id: 409,
    category: 'sostenibilidad',
    keywords: ['reciclaje', 'ropa', 'vieja', 'donar', 'segunda vida', 'circular'],
    question: '¿Tienen programa de reciclaje de ropa?',
    answer: 'Sí, nuestro programa "Segunda Vida" te permite enviar ropa usada (de cualquier marca) y recibir un cupón de $15.000 COP por cada prenda. La ropa se dona a fundaciones o se recicla responsablemente.'
  },
  {
    id: 410,
    category: 'sostenibilidad',
    keywords: ['certificacion', 'sello', 'eco', 'ambiental', 'norma'],
    question: '¿Qué certificaciones ambientales tienen?',
    answer: 'Contamos con certificaciones GOTS para algodón orgánico, OEKO-TEX Standard 100 para tintes seguros, FSC para empaques de cartón y certificación B Corp en proceso. Transparencia total en nuestras prácticas.'
  },
  {
    id: 411,
    category: 'sostenibilidad',
    keywords: ['fast fashion', 'moda rapida', 'consumo', 'responsable', 'consciente'],
    question: '¿UrbanThread AI es fast fashion?',
    answer: 'No, nos diferenciamos del fast fashion. Producimos colecciones limitadas con materiales de calidad para que las prendas duren más. Priorizamos la durabilidad sobre la cantidad y fomentamos el consumo consciente.'
  },
  {
    id: 412,
    category: 'sostenibilidad',
    keywords: ['vegano', 'animal', 'cruelty free', 'cuero', 'piel'],
    question: '¿Sus productos son veganos y cruelty-free?',
    answer: 'Nuestra línea de belleza es 100% cruelty-free certificada por PETA. En moda, usamos cuero sintético de alta calidad en lugar de cuero animal. Nuestras prendas no contienen materiales de origen animal.'
  },
  {
    id: 413,
    category: 'sostenibilidad',
    keywords: ['energia', 'renovable', 'solar', 'limpia', 'oficina'],
    question: '¿Usan energía renovable?',
    answer: 'Nuestras oficinas y centro de distribución principal funcionan con 60% de energía solar. Estamos en proceso de alcanzar el 100% de energía renovable para 2025 en todas nuestras operaciones.'
  },
  {
    id: 414,
    category: 'sostenibilidad',
    keywords: ['comunidad', 'social', 'impacto', 'fundacion', 'responsabilidad'],
    question: '¿Tienen programas de responsabilidad social?',
    answer: 'Sí, apoyamos a comunidades artesanales colombianas, donamos ropa a fundaciones, ofrecemos becas de formación en moda sostenible y destinamos el 1% de nuestras ventas a proyectos ambientales.'
  },
  {
    id: 415,
    category: 'sostenibilidad',
    keywords: ['transparencia', 'cadena', 'suministro', 'origen', 'trazabilidad'],
    question: '¿De dónde provienen sus materiales?',
    answer: 'Publicamos información sobre el origen de nuestros materiales en cada ficha de producto. Trabajamos con proveedores en Colombia, Perú y Portugal, todos certificados en prácticas sostenibles y éticas.'
  },
  {
    id: 416,
    category: 'sostenibilidad',
    keywords: ['microplastico', 'sintetico', 'poliester', 'contaminacion', 'lavado'],
    question: '¿Qué hacen respecto a los microplásticos?',
    answer: 'Estamos reduciendo el uso de fibras sintéticas y recomendamos usar bolsas de lavado especiales (disponibles en nuestra tienda por $19.900) que capturan microplásticos durante el lavado de prendas sintéticas.'
  },
  {
    id: 417,
    category: 'sostenibilidad',
    keywords: ['meta', 'objetivo', 'futuro', 'plan', 'sostenibilidad 2025'],
    question: '¿Cuáles son sus metas de sostenibilidad?',
    answer: 'Para 2025: 100% energía renovable, 100% empaques sin plástico, 50% de colección con materiales reciclados, certificación B Corp y programa de economía circular completo. Publicamos nuestro progreso anualmente.'
  },
  {
    id: 418,
    category: 'sostenibilidad',
    keywords: ['reforestacion', 'arboles', 'siembra', 'bosque', 'amazonia'],
    question: '¿Cuántos árboles han sembrado?',
    answer: 'A través de nuestro programa de compensación de carbono, hemos sembrado más de 10.000 árboles nativos en la Amazonía colombiana. Cada pedido contribuye a la siembra de un nuevo árbol.'
  },
  {
    id: 419,
    category: 'sostenibilidad',
    keywords: ['informe', 'reporte', 'sostenibilidad', 'impacto', 'anual'],
    question: '¿Publican un informe de sostenibilidad?',
    answer: 'Sí, publicamos un informe anual de sostenibilidad disponible en nuestra página web, sección "Sostenibilidad". Incluye métricas de impacto ambiental, social y nuestro progreso hacia las metas establecidas.'
  },
  {
    id: 420,
    category: 'sostenibilidad',
    keywords: ['consumidor', 'contribuir', 'sostenibilidad', 'aportar', 'eco', 'ecologico', 'ayudar planeta'],
    question: '¿Cómo puedo contribuir a la sostenibilidad como cliente?',
    answer: 'Puedes elegir productos de nuestra línea Eco, participar en el programa "Segunda Vida" de reciclaje, usar la bolsa de tela reutilizable que incluimos, lavar en frío y cuidar tus prendas para que duren más.'
  },
  // ============================================================
  // CATEGORÍA: PLATAFORMA (25 entries, IDs 421-445)
  // ============================================================
  {
    id: 421,
    category: 'plataforma',
    keywords: ['pagina', 'web', 'sitio', 'navegar', 'usar', 'como funciona'],
    question: '¿Cómo funciona la página web de UrbanThread AI?',
    answer: 'Nuestra plataforma es intuitiva: navega por categorías (Mujer, Hombre, Niños, Beauty, Accesorios), usa filtros para encontrar lo que buscas, agrega al carrito y finaliza tu compra en pocos clics. Zyla está en el chat para ayudarte.'
  },
  {
    id: 422,
    category: 'plataforma',
    keywords: ['filtros', 'buscar', 'busqueda', 'encontrar', 'producto'],
    question: '¿Cómo uso los filtros de búsqueda?',
    answer: 'En cada categoría encontrarás filtros por talla, color, precio, material y estilo. Puedes combinar varios filtros para encontrar exactamente lo que buscas. También puedes ordenar por precio, popularidad o novedades.'
  },
  {
    id: 423,
    category: 'plataforma',
    keywords: ['wishlist', 'lista', 'deseos', 'favoritos', 'guardar', 'corazon'],
    question: '¿Cómo funciona la lista de deseos?',
    answer: 'Haz clic en el ícono de corazón en cualquier producto para agregarlo a tu Lista de Deseos. Necesitas tener una cuenta para guardarla. Desde tu lista puedes agregar productos al carrito directamente.'
  },
  {
    id: 424,
    category: 'plataforma',
    keywords: ['colecciones', 'categorias', 'secciones', 'catalogo', 'explorar', 'productos', 'venden', 'vender', 'ofrecen', 'tienen'],
    question: '¿Qué productos venden y cómo están organizadas las colecciones?',
    answer: 'En UrbanThread AI ofrecemos moda premium sostenible organizada en 5 colecciones principales: Mujer (vestidos, blusas, faldas, chaquetas), Hombre (camisetas, camisas, pantalones, chaquetas), Niños (ropa de 0 a 14 años), Beauty (fragancias, cuidado facial y corporal, maquillaje) y Accesorios (bolsos, gafas, joyería, cinturones). También tenemos secciones especiales: Novedades, Ofertas y Eco Collection. Puedes explorar todo desde "Nuestras Colecciones" en la página principal.'
  },
  {
    id: 425,
    category: 'plataforma',
    keywords: ['talla', 'guia', 'medidas', 'como medir', 'tabla tallas'],
    question: '¿Dónde encuentro la guía de tallas?',
    answer: 'Cada producto tiene un enlace "Guía de tallas" en su ficha. Haz clic para ver la tabla de medidas en centímetros. También tenemos una guía general en el pie de página con instrucciones de cómo medirte correctamente.'
  },
  {
    id: 426,
    category: 'plataforma',
    keywords: ['carrito', 'compras', 'agregar', 'quitar', 'modificar'],
    question: '¿Cómo funciona el carrito de compras?',
    answer: 'Agrega productos haciendo clic en "Agregar al carrito". En el carrito puedes modificar cantidades, eliminar productos, aplicar cupones y ver el total con envío. El carrito se guarda por 72 horas si tienes cuenta.'
  },
  {
    id: 427,
    category: 'plataforma',
    keywords: ['movil', 'celular', 'responsive', 'telefono', 'tablet'],
    question: '¿La página funciona bien en celular?',
    answer: 'Sí, nuestra plataforma está 100% optimizada para dispositivos móviles. Puedes navegar, comprar y gestionar tu cuenta cómodamente desde tu celular o tablet con la misma experiencia que en computador.'
  },
  {
    id: 428,
    category: 'plataforma',
    keywords: ['fotos', 'imagenes', 'producto', 'zoom', 'detalle', 'ver'],
    question: '¿Puedo ver fotos detalladas de los productos?',
    answer: 'Sí, cada producto tiene múltiples fotos de alta resolución: frente, espalda, detalle de tela y modelo. Puedes hacer zoom para ver texturas y acabados. Algunos productos también tienen video de 360°.'
  },
  {
    id: 429,
    category: 'plataforma',
    keywords: ['reseña', 'opinion', 'comentario', 'calificacion', 'review', 'estrella'],
    question: '¿Puedo ver reseñas de otros clientes?',
    answer: 'Sí, cada producto muestra las reseñas y calificaciones de clientes verificados. Puedes filtrar por calificación y ver fotos reales de otros compradores. Después de tu compra, te invitamos a dejar tu reseña.'
  },
  {
    id: 430,
    category: 'plataforma',
    keywords: ['comparar', 'productos', 'versus', 'diferencias', 'lado a lado'],
    question: '¿Puedo comparar productos?',
    answer: 'Sí, selecciona hasta 3 productos y haz clic en "Comparar" para ver sus características lado a lado: precio, material, tallas disponibles, colores y calificaciones. Ideal para tomar la mejor decisión.'
  },
  {
    id: 431,
    category: 'plataforma',
    keywords: ['notificacion', 'stock', 'disponible', 'avisar', 'agotado'],
    question: '¿Me avisan cuando un producto agotado vuelva a estar disponible?',
    answer: 'Sí, en productos agotados verás el botón "Avisarme cuando esté disponible". Ingresa tu correo y te notificaremos en cuanto se reponga el stock. También puedes activar alertas desde tu Lista de Deseos.'
  },
  {
    id: 432,
    category: 'plataforma',
    keywords: ['buscador', 'search', 'buscar', 'encontrar', 'lupa'],
    question: '¿Cómo uso el buscador de la página?',
    answer: 'Haz clic en el ícono de lupa y escribe lo que buscas: nombre del producto, categoría, color o estilo. El buscador muestra sugerencias en tiempo real y resultados relevantes con fotos y precios.'
  },
  {
    id: 433,
    category: 'plataforma',
    keywords: ['checkout', 'pagar', 'finalizar', 'compra', 'proceso'],
    question: '¿Cómo es el proceso de checkout?',
    answer: 'El checkout tiene 3 pasos: 1) Datos de envío (dirección y contacto), 2) Método de pago (tarjeta, PSE, Nequi, etc.), 3) Confirmación del pedido. Si tienes cuenta, tus datos se llenan automáticamente.'
  },
  {
    id: 434,
    category: 'plataforma',
    keywords: ['error', 'pagina', 'no carga', 'lenta', 'problema', 'bug'],
    question: '¿Qué hago si la página no carga correctamente?',
    answer: 'Intenta limpiar la caché de tu navegador, desactivar extensiones o usar otro navegador (Chrome, Firefox, Safari). Si el problema persiste, contáctanos por WhatsApp. Puede ser un mantenimiento temporal.'
  },
  {
    id: 435,
    category: 'plataforma',
    keywords: ['navegador', 'compatible', 'chrome', 'firefox', 'safari', 'edge'],
    question: '¿Qué navegadores son compatibles?',
    answer: 'Nuestra plataforma es compatible con las últimas versiones de Chrome, Firefox, Safari y Edge. Recomendamos mantener tu navegador actualizado para la mejor experiencia de compra.'
  },
  {
    id: 436,
    category: 'plataforma',
    keywords: ['accesibilidad', 'discapacidad', 'lector', 'pantalla', 'inclusivo'],
    question: '¿La plataforma es accesible para personas con discapacidad?',
    answer: 'Sí, nuestra plataforma cumple con estándares de accesibilidad web WCAG 2.1. Incluye compatibilidad con lectores de pantalla, navegación por teclado, alto contraste y textos alternativos en imágenes.'
  },
  {
    id: 437,
    category: 'plataforma',
    keywords: ['app', 'aplicacion', 'descargar', 'movil', 'android', 'ios'],
    question: '¿Tienen aplicación móvil?',
    answer: 'Estamos desarrollando nuestra app nativa para iOS y Android. Mientras tanto, puedes agregar nuestra página web a la pantalla de inicio de tu celular para acceso rápido como si fuera una app.'
  },
  {
    id: 438,
    category: 'plataforma',
    keywords: ['cookie', 'cookies', 'rastreo', 'privacidad', 'navegacion'],
    question: '¿Qué cookies utiliza la plataforma?',
    answer: 'Usamos cookies esenciales para el funcionamiento del sitio, cookies de rendimiento para mejorar la experiencia y cookies de marketing (opcionales). Puedes gestionar tus preferencias de cookies en el banner de privacidad.'
  },
  {
    id: 439,
    category: 'plataforma',
    keywords: ['nuevo', 'novedades', 'recien', 'llegado', 'ultimo', 'lanzamiento'],
    question: '¿Dónde veo los productos nuevos?',
    answer: 'En la sección "Novedades" del menú principal encontrarás los últimos productos agregados a nuestro catálogo. También puedes ordenar cualquier categoría por "Más recientes" para ver las últimas incorporaciones.'
  },
  {
    id: 440,
    category: 'plataforma',
    keywords: ['oferta', 'descuento', 'sale', 'rebaja', 'seccion ofertas'],
    question: '¿Dónde encuentro las ofertas?',
    answer: 'Visita la sección "Ofertas" en el menú principal para ver todos los productos con descuento. Puedes filtrar por categoría, porcentaje de descuento y rango de precio. Las ofertas se actualizan semanalmente.'
  },
  {
    id: 441,
    category: 'plataforma',
    keywords: ['lookbook', 'inspiracion', 'editorial', 'moda', 'tendencias'],
    question: '¿Tienen lookbook o sección de inspiración?',
    answer: 'Sí, nuestra sección "Inspírate" muestra lookbooks editoriales con outfits completos que puedes comprar directamente. También publicamos guías de estilo y tendencias en nuestro blog de moda.'
  },
  {
    id: 442,
    category: 'plataforma',
    keywords: ['blog', 'articulo', 'contenido', 'moda', 'tips', 'consejos'],
    question: '¿Tienen blog de moda?',
    answer: 'Sí, nuestro blog "Urban Style" publica artículos semanales sobre tendencias, guías de estilo, tips de cuidado de prendas y entrevistas con diseñadores. Encuéntralo en el menú principal bajo "Blog".'
  },
  {
    id: 443,
    category: 'plataforma',
    keywords: ['chat', 'valentina', 'asistente', 'ayuda', 'bot', 'chatbot'],
    question: '¿Cómo funciona el chat con Zyla?',
    answer: 'Soy Zyla, tu asistente virtual. Haz clic en el ícono de chat en la esquina inferior derecha para hablar conmigo. Puedo ayudarte a encontrar productos, resolver dudas, rastrear pedidos y mucho más. ¡Estoy disponible 24/7!'
  },
  {
    id: 444,
    category: 'plataforma',
    keywords: ['compartir', 'redes', 'sociales', 'enviar', 'producto', 'link'],
    question: '¿Puedo compartir productos en redes sociales?',
    answer: 'Sí, cada producto tiene botones para compartir en WhatsApp, Instagram, Facebook y copiar el enlace directo. También puedes compartir tu Lista de Deseos con amigos y familiares.'
  },
  {
    id: 445,
    category: 'plataforma',
    keywords: ['moneda', 'precio', 'formato', 'cop', 'pesos', 'divisa'],
    question: '¿En qué moneda se muestran los precios?',
    answer: 'Todos los precios se muestran en Pesos Colombianos (COP) con IVA incluido. El formato es con punto como separador de miles (ej: $149.900). No ofrecemos visualización en otras monedas por el momento.'
  },
  // ============================================================
  // CATEGORÍA: REGISTRO Y MEMBRESÍA (entry ID 445b)
  // ============================================================
  {
    id: 4450,
    category: 'empresa',
    keywords: ['urbanthread', 'empresa', 'llama', 'nombre', 'quienes', 'somos', 'marca', 'tienda', 'negocio'],
    question: '¿Qué es UrbanThread AI y cómo se llama su empresa?',
    answer: 'Somos UrbanThread AI, una plataforma de Smart Commerce especializada en moda premium y sostenible en Colombia. Ofrecemos colecciones para Mujer, Hombre, Niños, Beauty y Accesorios, todas diseñadas con materiales eco-friendly y procesos de bajo impacto ambiental. Puedes conocer más sobre nosotros en la sección "Quiénes Somos" de nuestra página.'
  },
  {
    id: 4451,
    category: 'registro',
    keywords: ['cliente', 'registrar', 'registro', 'inscribir', 'unirme', 'cuenta', 'miembro', 'comprar'],
    question: '¿Cómo puedo ser cliente de UrbanThread AI?',
    answer: 'Ser cliente de UrbanThread AI es muy sencillo. Solo necesitas realizar tu primera compra en nuestra tienda online y automáticamente se creará tu cuenta. Luego podrás acceder al Portal Cliente con tu número de documento y un código OTP que llegará a tu correo. No necesitas registro previo. Si prefieres, también puedes contactarnos por WhatsApp al 300 509 1114 para recibir asesoría personalizada.'
  },
  // ============================================================
  // CATEGORÍA: PORTAL-CLIENTE (25 entries, IDs 446-470)
  // ============================================================
  {
    id: 446,
    category: 'portal-cliente',
    keywords: ['portal', 'dashboard', 'panel', 'mi cuenta', 'espacio personal'],
    question: '¿Qué es el Portal Cliente?',
    answer: 'El Portal Cliente es tu espacio personal en UrbanThread AI donde puedes gestionar pedidos, radicaciones, documentos, direcciones, métodos de pago, puntos y preferencias. Accede desde "Mi Cuenta" después de iniciar sesión.'
  },
  {
    id: 447,
    category: 'portal-cliente',
    keywords: ['radicacion', 'radicaciones', 'solicitud', 'tramite', 'crear'],
    question: '¿Qué son las radicaciones?',
    answer: 'Las radicaciones son solicitudes formales que puedes crear para devoluciones, cambios, reclamos o consultas. Cada radicación tiene un número único de seguimiento y puedes monitorear su estado en tiempo real desde tu Portal.'
  },
  {
    id: 448,
    category: 'portal-cliente',
    keywords: ['radicacion', 'crear', 'nueva', 'solicitar', 'radicar'],
    question: '¿Cómo creo una radicación?',
    answer: 'En tu Portal Cliente, ve a "Radicaciones" > "Nueva radicación". Selecciona el tipo (devolución, cambio, reclamo), el pedido relacionado, describe el motivo y adjunta fotos si es necesario. Recibirás confirmación inmediata.'
  },
  {
    id: 449,
    category: 'portal-cliente',
    keywords: ['radicacion', 'estado', 'seguimiento', 'consultar', 'donde'],
    question: '¿Cómo consulto el estado de mi radicación?',
    answer: 'En tu Portal Cliente > "Radicaciones" verás todas tus solicitudes con su estado actual: Recibida, En revisión, Aprobada, En proceso o Finalizada. Haz clic en cada una para ver el detalle y las actualizaciones.'
  },
  {
    id: 450,
    category: 'portal-cliente',
    keywords: ['documentos', 'facturas', 'descargar', 'pdf', 'comprobantes'],
    question: '¿Dónde descargo mis facturas y documentos?',
    answer: 'En tu Portal Cliente > "Documentos" encontrarás todas tus facturas electrónicas, notas crédito, comprobantes de pago y certificados de garantía. Puedes descargarlos en PDF o enviarlos por correo.'
  },
  {
    id: 451,
    category: 'portal-cliente',
    keywords: ['pedidos', 'historial', 'ver', 'consultar', 'mis pedidos'],
    question: '¿Cómo veo mis pedidos en el Portal Cliente?',
    answer: 'En tu Portal Cliente > "Mis Pedidos" verás el listado completo de tus compras con estado, fecha, total y número de guía. Puedes filtrar por estado (activos, entregados, cancelados) y ver el detalle de cada uno.'
  },
  {
    id: 452,
    category: 'portal-cliente',
    keywords: ['direcciones', 'guardar', 'gestionar', 'agregar', 'editar'],
    question: '¿Cómo gestiono mis direcciones en el Portal?',
    answer: 'En "Mis Direcciones" puedes agregar, editar o eliminar direcciones de envío. Marca una como predeterminada para agilizar el checkout. Puedes guardar hasta 10 direcciones diferentes.'
  },
  {
    id: 453,
    category: 'portal-cliente',
    keywords: ['metodos', 'pago', 'tarjetas', 'gestionar', 'guardadas'],
    question: '¿Cómo gestiono mis métodos de pago?',
    answer: 'En tu Portal Cliente > "Métodos de pago" puedes ver, agregar o eliminar tarjetas guardadas. Los datos se almacenan de forma segura mediante tokenización. Puedes establecer un método de pago predeterminado.'
  },
  {
    id: 454,
    category: 'portal-cliente',
    keywords: ['notificaciones', 'alertas', 'avisos', 'portal', 'campana'],
    question: '¿Cómo funcionan las notificaciones del Portal?',
    answer: 'El ícono de campana en tu Portal muestra notificaciones en tiempo real: actualizaciones de pedidos, radicaciones, promociones exclusivas y alertas de stock. Puedes configurar qué notificaciones recibir.'
  },
  {
    id: 455,
    category: 'portal-cliente',
    keywords: ['puntos', 'saldo', 'movimientos', 'historial puntos', 'redimir'],
    question: '¿Cómo veo mis puntos en el Portal Cliente?',
    answer: 'En tu dashboard principal verás tu saldo de puntos. En "Mis Puntos" encontrarás el historial detallado: puntos ganados por compra, puntos redimidos, puntos por vencer y tu nivel de membresía actual.'
  },
  {
    id: 456,
    category: 'portal-cliente',
    keywords: ['lista', 'deseos', 'wishlist', 'favoritos', 'portal'],
    question: '¿Cómo accedo a mi lista de deseos desde el Portal?',
    answer: 'En tu Portal Cliente > "Lista de Deseos" verás todos los productos que has marcado como favoritos. Puedes agregar productos al carrito directamente, compartir tu lista o recibir alertas de descuento en esos productos.'
  },
  {
    id: 457,
    category: 'portal-cliente',
    keywords: ['seguridad', 'portal', 'contraseña', 'verificacion', 'proteger'],
    question: '¿Cómo protejo mi Portal Cliente?',
    answer: 'Activa la verificación en dos pasos (OTP) en "Mi Perfil" > "Seguridad". Usa una contraseña fuerte, no la compartas y cierra sesión en dispositivos compartidos. Revisa periódicamente tu historial de actividad.'
  },
  {
    id: 458,
    category: 'portal-cliente',
    keywords: ['soporte', 'ayuda', 'ticket', 'contactar', 'desde portal'],
    question: '¿Puedo contactar soporte desde el Portal Cliente?',
    answer: 'Sí, en tu Portal Cliente > "Ayuda" puedes crear tickets de soporte, iniciar un chat con Zyla o ver las preguntas frecuentes. También encontrarás el enlace directo a nuestro WhatsApp de atención.'
  },
  {
    id: 459,
    category: 'portal-cliente',
    keywords: ['referido', 'codigo', 'compartir', 'invitar', 'amigo portal'],
    question: '¿Dónde encuentro mi código de referido?',
    answer: 'En tu Portal Cliente > "Referidos" encontrarás tu código único y enlace para compartir. Verás el historial de amigos referidos, compras realizadas y los descuentos ganados. Comparte por WhatsApp, email o redes.'
  },
  {
    id: 460,
    category: 'portal-cliente',
    keywords: ['preferencias', 'talla', 'estilo', 'personalizar', 'gusto'],
    question: '¿Puedo guardar mis preferencias de talla y estilo?',
    answer: 'Sí, en "Mi Perfil" > "Preferencias" puedes guardar tu talla habitual, colores favoritos y estilos preferidos. Esto nos permite personalizar las recomendaciones de productos y ofertas que te mostramos.'
  },
  {
    id: 461,
    category: 'portal-cliente',
    keywords: ['reseña', 'opinion', 'calificar', 'escribir', 'valorar'],
    question: '¿Cómo dejo una reseña de un producto?',
    answer: 'Después de recibir tu pedido, recibirás un correo invitándote a dejar tu reseña. También puedes hacerlo desde tu Portal Cliente > "Mis Pedidos" > selecciona el producto > "Escribir reseña". Puedes incluir fotos.'
  },
  {
    id: 462,
    category: 'portal-cliente',
    keywords: ['devolucion', 'portal', 'solicitar', 'proceso', 'paso a paso'],
    question: '¿Cómo solicito una devolución desde el Portal?',
    answer: 'Ve a "Mis Pedidos", selecciona el pedido, haz clic en "Solicitar devolución" junto al producto. Elige el motivo, adjunta fotos si aplica y confirma. Se creará una radicación automáticamente con número de seguimiento.'
  },
  {
    id: 463,
    category: 'portal-cliente',
    keywords: ['cambio', 'portal', 'solicitar', 'talla', 'color'],
    question: '¿Cómo solicito un cambio desde el Portal?',
    answer: 'En "Mis Pedidos", selecciona el producto y haz clic en "Solicitar cambio". Indica la nueva talla o color deseado. Se creará una radicación y te enviaremos el nuevo producto una vez recibamos el original.'
  },
  {
    id: 464,
    category: 'portal-cliente',
    keywords: ['reclamo', 'queja', 'inconformidad', 'problema', 'portal'],
    question: '¿Cómo presento un reclamo en el Portal?',
    answer: 'En "Radicaciones" > "Nueva radicación" > selecciona "Reclamo". Describe detalladamente el problema, adjunta evidencias y envía. Nuestro equipo revisará tu caso y te responderá en máximo 48 horas hábiles.'
  },
  {
    id: 465,
    category: 'portal-cliente',
    keywords: ['exportar', 'datos', 'descargar', 'informacion', 'personal'],
    question: '¿Puedo exportar mis datos del Portal?',
    answer: 'Sí, en "Mi Perfil" > "Privacidad" > "Exportar mis datos" puedes descargar toda tu información personal, historial de compras y actividad en formato PDF. Cumplimos con tu derecho a la portabilidad de datos.'
  },
  {
    id: 466,
    category: 'portal-cliente',
    keywords: ['tarjeta', 'regalo', 'saldo', 'consultar', 'portal'],
    question: '¿Cómo consulto el saldo de mi tarjeta de regalo en el Portal?',
    answer: 'En tu Portal Cliente > "Tarjetas de regalo" ingresa el código de tu tarjeta para ver el saldo disponible, fecha de vencimiento y el historial de uso. También puedes comprar nuevas tarjetas de regalo desde aquí.'
  },
  {
    id: 467,
    category: 'portal-cliente',
    keywords: ['dashboard', 'resumen', 'inicio', 'principal', 'portal'],
    question: '¿Qué información veo en el dashboard del Portal?',
    answer: 'Tu dashboard muestra: pedidos activos, saldo de puntos, nivel de membresía, radicaciones pendientes, productos recomendados y notificaciones recientes. Es tu centro de control para toda tu experiencia UrbanThread.'
  },
  {
    id: 468,
    category: 'portal-cliente',
    keywords: ['movil', 'portal', 'celular', 'responsive', 'acceder'],
    question: '¿Puedo acceder al Portal Cliente desde el celular?',
    answer: 'Sí, el Portal Cliente está completamente optimizado para dispositivos móviles. Puedes gestionar pedidos, crear radicaciones, consultar puntos y más desde tu celular con la misma funcionalidad que en computador.'
  },
  {
    id: 469,
    category: 'portal-cliente',
    keywords: ['suscripcion', 'newsletter', 'gestionar', 'correos', 'portal'],
    question: '¿Cómo gestiono mis suscripciones desde el Portal?',
    answer: 'En "Mi Perfil" > "Notificaciones" puedes activar o desactivar: newsletter semanal, alertas de ofertas, notificaciones de pedidos, alertas de stock y comunicaciones de nuevas colecciones.'
  },
  {
    id: 470,
    category: 'portal-cliente',
    keywords: ['tutorial', 'guia', 'ayuda', 'como usar', 'portal cliente'],
    question: '¿Hay un tutorial para usar el Portal Cliente?',
    answer: 'Sí, al ingresar por primera vez al Portal verás un tour guiado interactivo. También puedes acceder al tutorial en cualquier momento desde "Ayuda" > "Tour del Portal". Zyla te guía paso a paso por cada sección.'
  },
  // ============================================================
  // CATEGORÍA: CONTACTO (15 entries, IDs 471-485)
  // ============================================================
  {
    id: 471,
    category: 'contacto',
    keywords: ['contacto', 'contactar', 'comunicar', 'hablar', 'atencion'],
    question: '¿Cómo puedo contactar a UrbanThread AI?',
    answer: 'Puedes contactarnos por WhatsApp al 300 509 1114, correo electrónico soporte@urbanthread.co, chat en vivo con Zyla en nuestra página web, o por nuestras redes sociales @UrbanThreadAI.'
  },
  {
    id: 472,
    category: 'contacto',
    keywords: ['whatsapp', 'wsp', 'wasap', 'mensaje', 'chat whatsapp'],
    question: '¿Cuál es el WhatsApp de UrbanThread AI?',
    answer: 'Nuestro WhatsApp de atención al cliente es el 300 509 1114. Estamos disponibles de lunes a sábado de 7:00 a.m. a 9:00 p.m. y domingos de 9:00 a.m. a 5:00 p.m. ¡Escríbenos y Zyla te atenderá!'
  },
  {
    id: 473,
    category: 'contacto',
    keywords: ['correo', 'email', 'mail', 'electronico', 'escribir'],
    question: '¿Cuál es el correo electrónico de soporte?',
    answer: 'Nuestro correo de soporte es soporte@urbanthread.co. Para temas corporativos: corporativo@urbanthread.co. Respondemos todos los correos en un plazo máximo de 24 horas hábiles.'
  },
  {
    id: 474,
    category: 'contacto',
    keywords: ['horario', 'atencion', 'servicio', 'cliente', 'disponible'],
    question: '¿Cuál es el horario de atención al cliente?',
    answer: 'Nuestro equipo de atención está disponible de lunes a sábado de 7:00 a.m. a 9:00 p.m. y domingos de 9:00 a.m. a 5:00 p.m. (hora Colombia). Zyla en el chat está disponible 24/7 para consultas básicas.'
  },
  {
    id: 475,
    category: 'contacto',
    keywords: ['telefono', 'llamar', 'linea', 'numero', 'telefonico'],
    question: '¿Tienen línea telefónica?',
    answer: 'Nuestra línea principal es el (601) 555 0123 en Bogotá. También puedes llamar a la línea nacional gratuita 01 8000 123 456. Horario de atención telefónica: lunes a viernes de 8:00 a.m. a 6:00 p.m.'
  },
  {
    id: 476,
    category: 'contacto',
    keywords: ['redes', 'sociales', 'instagram', 'facebook', 'tiktok', 'twitter'],
    question: '¿En qué redes sociales están?',
    answer: 'Síguenos en Instagram (@UrbanThreadAI), Facebook (UrbanThread AI), TikTok (@urbanthread.ai) y Twitter/X (@UrbanThreadAI). Publicamos novedades, ofertas, tips de moda y contenido exclusivo.'
  },
  {
    id: 477,
    category: 'contacto',
    keywords: ['queja', 'reclamo', 'pqr', 'peticion', 'formal'],
    question: '¿Cómo presento una queja o reclamo formal?',
    answer: 'Puedes presentar PQR (Peticiones, Quejas y Reclamos) a través de tu Portal Cliente > "Radicaciones", por correo a pqr@urbanthread.co o por nuestra línea telefónica. Respondemos en máximo 15 días hábiles según la ley.'
  },
  {
    id: 478,
    category: 'contacto',
    keywords: ['chat', 'vivo', 'en linea', 'online', 'tiempo real'],
    question: '¿Tienen chat en vivo?',
    answer: 'Sí, Zyla está disponible 24/7 en nuestro chat en vivo. Para consultas que requieran un agente humano, nuestro equipo está disponible en el chat de lunes a sábado de 7:00 a.m. a 9:00 p.m.'
  },
  {
    id: 479,
    category: 'contacto',
    keywords: ['tienda', 'fisica', 'showroom', 'visitar', 'presencial'],
    question: '¿Tienen tienda física?',
    answer: 'Actualmente UrbanThread AI opera exclusivamente en línea. Estamos evaluando abrir showrooms en Bogotá y Medellín donde podrás ver y probarte las prendas. ¡Mantente atento a nuestras novedades!'
  },
  {
    id: 480,
    category: 'contacto',
    keywords: ['prensa', 'medios', 'periodista', 'comunicaciones', 'press'],
    question: '¿Cómo contacto al equipo de prensa?',
    answer: 'Para consultas de prensa y medios, escríbenos a prensa@urbanthread.co. Nuestro equipo de comunicaciones atenderá tu solicitud y te proporcionará material de prensa, imágenes y entrevistas.'
  },
  {
    id: 481,
    category: 'contacto',
    keywords: ['alianza', 'colaboracion', 'partnership', 'negocio', 'propuesta'],
    question: '¿Cómo propongo una alianza o colaboración?',
    answer: 'Para propuestas de alianzas comerciales, colaboraciones con influencers o partnerships, escríbenos a alianzas@urbanthread.co con tu propuesta detallada. Evaluamos todas las solicitudes en un plazo de 5 días hábiles.'
  },
  {
    id: 482,
    category: 'contacto',
    keywords: ['trabajo', 'empleo', 'vacante', 'trabajar', 'curriculum'],
    question: '¿Cómo puedo trabajar en UrbanThread AI?',
    answer: 'Visita nuestra sección "Trabaja con nosotros" en el pie de página para ver las vacantes disponibles. También puedes enviar tu hoja de vida a talento@urbanthread.co. ¡Siempre buscamos personas apasionadas por la moda!'
  },
  {
    id: 483,
    category: 'contacto',
    keywords: ['influencer', 'embajador', 'marca', 'colaborar', 'creador'],
    question: '¿Tienen programa de influencers o embajadores?',
    answer: 'Sí, nuestro programa "Urban Creators" busca influencers y creadores de contenido apasionados por la moda. Escríbenos a creators@urbanthread.co con tu perfil de redes sociales y propuesta de colaboración.'
  },
  {
    id: 484,
    category: 'contacto',
    keywords: ['superintendencia', 'consumidor', 'defensa', 'derechos', 'entidad'],
    question: '¿Ante quién puedo escalar un reclamo?',
    answer: 'Si no estás satisfecho con nuestra respuesta, puedes escalar tu caso ante la Superintendencia de Industria y Comercio (SIC) a través de www.sic.gov.co o la línea 01 8000 910 165.'
  },
  {
    id: 485,
    category: 'contacto',
    keywords: ['respuesta', 'tiempo', 'demora', 'contestar', 'cuando responden'],
    question: '¿Cuánto tardan en responder?',
    answer: 'WhatsApp y chat: respuesta inmediata o máximo 30 minutos en horario de atención. Correo electrónico: máximo 24 horas hábiles. Radicaciones: 48 horas hábiles. PQR formales: máximo 15 días hábiles según la ley.'
  },
  // ============================================================
  // CATEGORÍA: GENERAL (15 entries, IDs 486-500)
  // ============================================================
  {
    id: 486,
    category: 'general',
    keywords: ['urbanthread', 'que es', 'empresa', 'marca', 'quienes son'],
    question: '¿Qué es UrbanThread AI?',
    answer: 'UrbanThread AI es una marca colombiana de moda en línea que combina diseño contemporáneo con tecnología e inteligencia artificial. Ofrecemos ropa para mujer, hombre, niños, accesorios y productos de belleza con un compromiso firme con la sostenibilidad.'
  },
  {
    id: 487,
    category: 'general',
    keywords: ['mision', 'vision', 'proposito', 'objetivo', 'valores'],
    question: '¿Cuál es la misión de UrbanThread AI?',
    answer: 'Nuestra misión es democratizar la moda de calidad en Colombia, haciendo accesibles las últimas tendencias con precios justos y prácticas sostenibles. Creemos que vestir bien no debe costar el planeta.'
  },
  {
    id: 488,
    category: 'general',
    keywords: ['historia', 'fundacion', 'cuando', 'inicio', 'origen', 'creacion'],
    question: '¿Cuándo se fundó UrbanThread AI?',
    answer: 'UrbanThread AI nació en 2022 en Bogotá, Colombia, con la visión de crear una experiencia de moda en línea potenciada por inteligencia artificial. Desde entonces hemos crecido para servir a clientes en todo el país.'
  },
  {
    id: 489,
    category: 'general',
    keywords: ['colombiana', 'colombia', 'nacional', 'local', 'pais'],
    question: '¿UrbanThread AI es una empresa colombiana?',
    answer: 'Sí, somos una empresa 100% colombiana con sede en Bogotá. Diseñamos nuestras colecciones localmente, trabajamos con proveedores nacionales e internacionales y estamos comprometidos con el desarrollo de la industria de moda colombiana.'
  },
  {
    id: 490,
    category: 'general',
    keywords: ['inteligencia', 'artificial', 'ia', 'ai', 'tecnologia'],
    question: '¿Cómo usan la inteligencia artificial?',
    answer: 'Usamos IA para personalizar tu experiencia de compra: recomendaciones de productos basadas en tus gustos, asistente virtual Zyla, predicción de tallas y análisis de tendencias para diseñar colecciones que te encanten.'
  },
  {
    id: 491,
    category: 'general',
    keywords: ['valentina', 'asistente', 'chatbot', 'quien', 'bot'],
    question: '¿Quién es Zyla?',
    answer: 'Soy Zyla, la asistente virtual de UrbanThread AI. Estoy aquí para ayudarte a encontrar productos, resolver dudas, rastrear pedidos y brindarte la mejor experiencia de compra. ¡Puedes preguntarme lo que necesites, estoy disponible 24/7!'
  },
  {
    id: 492,
    category: 'general',
    keywords: ['diferencia', 'competencia', 'unico', 'especial', 'por que elegir'],
    question: '¿Qué diferencia a UrbanThread AI de otras marcas?',
    answer: 'Nos diferenciamos por: tecnología IA para personalización, compromiso real con la sostenibilidad, precios accesibles sin sacrificar calidad, atención al cliente excepcional con Zyla 24/7 y diseños exclusivos inspirados en tendencias globales.'
  },
  {
    id: 493,
    category: 'general',
    keywords: ['diseñador', 'diseño', 'quien diseña', 'equipo', 'creativo'],
    question: '¿Quién diseña las colecciones?',
    answer: 'Nuestro equipo creativo está compuesto por diseñadores colombianos con experiencia internacional. Combinamos su talento con análisis de tendencias por IA para crear colecciones que reflejan el estilo urbano contemporáneo.'
  },
  {
    id: 494,
    category: 'general',
    keywords: ['calidad', 'garantia', 'bueno', 'confiable', 'premium'],
    question: '¿Cómo garantizan la calidad de sus productos?',
    answer: 'Cada producto pasa por rigurosos controles de calidad: revisión de materiales, costuras, acabados y ajuste. Trabajamos solo con proveedores certificados y ofrecemos garantía de 30 días en todas nuestras prendas.'
  },
  {
    id: 495,
    category: 'general',
    keywords: ['sede', 'oficina', 'ubicacion', 'donde', 'direccion empresa'],
    question: '¿Dónde están ubicados?',
    answer: 'Nuestra sede principal está en Bogotá, Colombia. Contamos con un centro de distribución en la zona industrial de Fontibón que nos permite despachar pedidos a todo el país de manera eficiente.'
  },
  {
    id: 496,
    category: 'general',
    keywords: ['seguro', 'confiable', 'estafa', 'real', 'legitimo', 'verdad'],
    question: '¿UrbanThread AI es confiable?',
    answer: 'Sí, somos una empresa legalmente constituida en Colombia con NIT registrado. Contamos con certificado SSL, pasarela de pago segura, política de devoluciones clara y miles de clientes satisfechos. Puedes verificar nuestras reseñas en Google.'
  },
  {
    id: 497,
    category: 'general',
    keywords: ['expansion', 'crecimiento', 'futuro', 'planes', 'nuevos mercados'],
    question: '¿Tienen planes de expansión?',
    answer: 'Sí, estamos trabajando en expandir nuestras operaciones a otros países de Latinoamérica, abrir showrooms físicos en Colombia y lanzar nuestra app móvil nativa. ¡El futuro de UrbanThread AI es emocionante!'
  },
  {
    id: 498,
    category: 'general',
    keywords: ['terminos', 'condiciones', 'legal', 'politicas', 'privacidad'],
    question: '¿Dónde encuentro los términos y condiciones?',
    answer: 'Nuestros términos y condiciones, política de privacidad y política de devoluciones están disponibles en el pie de página de nuestro sitio web. Te recomendamos revisarlos para conocer tus derechos como consumidor.'
  },
  {
    id: 499,
    category: 'general',
    keywords: ['opinion', 'sugerencia', 'feedback', 'mejorar', 'comentario'],
    question: '¿Cómo puedo enviar sugerencias o feedback?',
    answer: 'Valoramos tu opinión. Puedes enviar sugerencias por correo a feedback@urbanthread.co, a través del chat con Zyla o en la sección "Sugerencias" de tu Portal Cliente. Cada comentario nos ayuda a mejorar.'
  },
  {
    id: 500,
    category: 'general',
    keywords: ['gracias', 'agradecimiento', 'excelente', 'buena', 'atencion'],
    question: '¿Cómo puedo dejar un comentario positivo?',
    answer: 'Nos alegra que hayas tenido una buena experiencia. Puedes dejarnos una reseña en Google, compartir tu experiencia en redes sociales con #UrbanThreadAI o escribirnos a feedback@urbanthread.co. ¡Tu apoyo nos motiva a seguir mejorando!'
  },
];


export function searchKnowledge(query: string): KnowledgeEntry[] {
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Stop words - common words that don't add search value
  const stopWords = new Set([
    'como', 'puedo', 'puede', 'quiero', 'quisiera', 'necesito', 'tengo',
    'hacer', 'tener', 'hola', 'buenas', 'buenos', 'dias', 'tardes', 'noches',
    'por', 'para', 'que', 'una', 'uno', 'los', 'las', 'del', 'con', 'sin',
    'mas', 'muy', 'hay', 'ser', 'esta', 'este', 'esto', 'eso', 'esa',
    'favor', 'gracias', 'bien', 'mal', 'aqui', 'alla', 'donde', 'cuando',
    'cual', 'quien', 'todo', 'toda', 'todos', 'todas', 'algo', 'nada',
    'otro', 'otra', 'otros', 'otras', 'mismo', 'misma', 'sobre', 'entre',
    'desde', 'hasta', 'hacia', 'ante', 'bajo', 'tras', 'durante',
    'mediante', 'segun', 'sino', 'tambien', 'ademas', 'solo', 'aun',
    'aunque', 'porque', 'pues', 'entonces', 'asi', 'cada', 'ambos',
    'varios', 'mucho', 'poco', 'tanto', 'tan',
    'nuevo', 'nueva', 'bueno', 'buena', 'malo', 'mala',
    'saber', 'decir', 'ver', 'dar', 'vez', 'usted', 'ustedes',
    'debe', 'debo',
  ]);

  const queryWords = normalizedQuery
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  // If after filtering stop words we have no meaningful words, return empty (let backend handle it)
  if (queryWords.length === 0) {
    return [];
  }

  // Common phrases for higher-priority matching
  const phrases = [
    'no llega', 'no llego', 'donde esta', 'cuanto tarda',
    'cuanto cuesta', 'envio gratis', 'portal cliente', 'contra entrega',
    'metodo de pago', 'tiempo de entrega', 'codigo otp', 'numero de pedido',
    'estado de mi pedido', 'realizar pedido', 'registrarme', 'crear cuenta',
    'devolver producto', 'cambiar talla', 'cancelar pedido',
    'pedido minimo', 'monto minimo', 'valor minimo', 'compra minima',
    'ser cliente', 'productos venden', 'que venden', 'que ofrecen',
    'se llama', 'que es urbanthread', 'quienes somos',
  ];

  const results = knowledgeBase
    .map(entry => {
      let score = 0;
      let keywordMatches = 0;
      const entryKeywordsNorm = entry.keywords.map(k => k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
      const entryQuestion = entry.question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      // Exact phrase matching (highest priority)
      for (const phrase of phrases) {
        if (normalizedQuery.includes(phrase)) {
          if (entryKeywordsNorm.some(k => k.includes(phrase))) score += 10;
          if (entryQuestion.includes(phrase)) score += 8;
        }
      }

      // Individual word matching — check against each keyword individually
      for (const word of queryWords) {
        // A word matches if it IS a keyword or is contained in a keyword
        const keywordMatch = entryKeywordsNorm.some(k => k === word || k.split(' ').includes(word));
        if (keywordMatch) {
          score += 3;
          keywordMatches++;
        }
        if (entryQuestion.includes(word)) score += 2;
      }

      // Bonus for multiple keyword matches (rewards specificity)
      if (keywordMatches >= 3) score += 5;
      else if (keywordMatches >= 2) score += 2;

      return { entry, score };
    })
    .filter(r => r.score >= 5) // Minimum threshold to avoid weak/irrelevant matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => r.entry);

  return results;
}
