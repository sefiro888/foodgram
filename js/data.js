// Datos de ejemplo. Cada ingrediente: [cantidad, unidad, nombre, clave de nevera, ¿básico de despensa?]
window.FOODGRAM_DATA = {
  chefs: [
    { id: "marco", nombre: "Marco Rossi", titulo: "Maître rôtisseur", color: "#ff6f4d", bio: "Brasas, hierro y fondos de salsa. Treinta años frente al fuego y ninguna prisa." },
    { id: "elena", nombre: "Elena Vance", titulo: "Alquimista del huerto", color: "#62d394", bio: "Cocina vegetal, ácidos y frescura. Si no cruje o no brilla, vuelve a la mesa." },
    { id: "silas", nombre: "Silas Thorne", titulo: "Maestro panadero", color: "#ffc53d", bio: "Masa madre, hidratación alta y paciencia. El reloj lo manda la masa." },
    { id: "lucia", nombre: "Lucía Marini", titulo: "Trattoria de barrio", color: "#ff8fb0", bio: "Pasta, huevos y cocina de la abuela. Pocas cosas, bien hechas." },
    { id: "noor", nombre: "Noor Haddad", titulo: "Pastelera nocturna", color: "#EBA0B5", bio: "Postres con sal, con humo y sin miedo a quemar un poco." }
  ],
  recetas: [
    {
      id: "steak-mantequilla", chef: "marco", titulo: "El ritual de la mantequilla", categoria: "Carnes", plato: "steak", mh: 100,
      dieta: ["sin gluten"], tiempo: 25, dificultad: "Media", raciones: 2,
      secreto: "El secreto de esa corteza caoba no es el calor: es la mantequilla fría que entra en los últimos 60 segundos con ajo machacado y tomillo.",
      ingredientes: [[2, "ud", "chuletones de 3 cm", "chuletón"], [40, "g", "mantequilla fría", "mantequilla"], [3, "dientes", "de ajo", "ajo"], [4, "ramas", "de tomillo", "tomillo"], [0, "", "Sal en escamas", "sal", 1], [0, "", "Pimienta negra", "pimienta", 1]],
      pasos: [{ t: "Saca la carne de la nevera 40 minutos antes y sécala muy bien con papel." }, { t: "Sala generosamente y sella en sartén de hierro humeante: 3 minutos por lado.", min: 6 }, { t: "Baja el fuego, añade mantequilla, ajo y tomillo y baña la carne con la cuchara.", min: 1 }, { t: "Deja reposar sobre una rejilla antes de cortar a contrafibra.", min: 5 }]
    },
    {
      id: "ensalada-acida", chef: "elena", titulo: "El equilibrio ácido", categoria: "Ensaladas", plato: "salad", mh: 6,
      dieta: ["vegetariano", "sin gluten"], tiempo: 15, dificultad: "Fácil", raciones: 2,
      secreto: "A casi todas las ensaladas caseras les falta un golpe cítrico. Macera la cebolla roja 10 minutos en limón antes de mezclar. Lo cambia todo.",
      ingredientes: [[1, "ud", "cebolla roja", "cebolla"], [1, "ud", "limón (el zumo)", "limón"], [200, "g", "de tomate cherry", "tomate"], [1, "ud", "pepino", "pepino"], [100, "g", "de queso feta", "feta"], [30, "g", "de aceitunas kalamata", "aceitunas"], [3, "cucharadas", "de aceite de oliva", "aceite", 1], [0, "", "Orégano", "orégano", 1]],
      pasos: [{ t: "Corta la cebolla en pluma fina y déjala macerar en el zumo de limón.", min: 10 }, { t: "Trocea tomate y pepino y colócalos en un bol amplio." }, { t: "Añade la cebolla con su jugo, el feta y las aceitunas." }, { t: "Aliña con aceite y orégano justo antes de llevar a la mesa." }]
    },
    {
      id: "pan-masa-madre", chef: "silas", titulo: "El secreto de la miga", categoria: "Panes", plato: "bread", mh: 42,
      dieta: ["vegano"], tiempo: 720, dificultad: "Difícil", raciones: 8,
      secreto: "No temas la hidratación alta. Un 85 % de agua cuesta de manejar, pero esa miga aireada compensa cada dedo pegajoso.",
      ingredientes: [[500, "g", "de harina de fuerza", "harina"], [425, "g", "de agua", "agua", 1], [100, "g", "de masa madre activa", "masa madre"], [10, "g", "de sal", "sal", 1]],
      pasos: [{ t: "Mezcla harina y agua y deja la autólisis.", min: 45 }, { t: "Incorpora masa madre y sal. Haz pliegues cada 30 minutos durante 2 horas.", min: 30 }, { t: "Dale forma y fermenta en frío toda la noche." }, { t: "Hornea en cocotte a 250 °C, tapado.", min: 20 }, { t: "Destapa y termina de dorar.", min: 25 }]
    },
    {
      id: "carbonara-sin-nata", chef: "lucia", titulo: "Carbonara de verdad", categoria: "Pastas", plato: "pasta", mh: 16,
      dieta: [], tiempo: 20, dificultad: "Media", raciones: 2,
      secreto: "Fuera del fuego, el huevo se liga con un cucharón de agua de cocción. Nunca nata, nunca prisa: si humea, ya has cuajado la salsa.",
      ingredientes: [[200, "g", "de espagueti", "espagueti"], [100, "g", "de guanciale", "guanciale"], [3, "ud", "yemas de huevo", "huevos"], [1, "ud", "huevo entero", "huevos"], [50, "g", "de pecorino rallado", "pecorino"], [0, "", "Pimienta negra recién molida", "pimienta", 1], [0, "", "Sal para el agua", "sal", 1]],
      pasos: [{ t: "Dora el guanciale a fuego bajo hasta que suelte la grasa y quede crujiente.", min: 8 }, { t: "Cuece la pasta en agua con poca sal; guarda una taza del agua.", min: 9 }, { t: "Mezcla yemas, huevo, pecorino y mucha pimienta en un bol." }, { t: "Fuera del fuego, une pasta, guanciale y crema de huevo con un chorro de agua de cocción. Remueve sin parar." }]
    },
    {
      id: "sopa-tomate-asado", chef: "elena", titulo: "Tomate asado, sopa de invierno", categoria: "Sopas", plato: "soup", mh: 75,
      dieta: ["vegano", "sin gluten"], tiempo: 50, dificultad: "Fácil", raciones: 4,
      secreto: "Asa los tomates con una pizca de azúcar hasta que se caramelicen los bordes. Ese amargor tostado sustituye a una hora de caldo.",
      ingredientes: [[1, "kg", "de tomates maduros", "tomate"], [1, "ud", "cebolla", "cebolla"], [4, "dientes", "de ajo", "ajo"], [1, "cucharadita", "de azúcar", "azúcar", 1], [500, "ml", "de agua o caldo", "agua", 1], [4, "cucharadas", "de aceite de oliva", "aceite", 1], [0, "", "Albahaca fresca", "albahaca"]],
      pasos: [{ t: "Parte los tomates, ponlos en bandeja con cebolla, ajos, aceite, sal y azúcar." }, { t: "Asa a 200 °C hasta que los bordes se ennegrezcan un poco.", min: 35 }, { t: "Tritura con el agua caliente hasta dejar una crema fina." }, { t: "Cuela si quieres sedosidad y sirve con albahaca y un hilo de aceite.", min: 5 }]
    },
    {
      id: "tortilla-jugosa", chef: "lucia", titulo: "Tortilla que tiembla", categoria: "Huevos", plato: "eggs", mh: 28,
      dieta: ["vegetariano", "sin gluten"], tiempo: 30, dificultad: "Media", raciones: 4,
      secreto: "Retírala del fuego cuando el centro todavía tiembla al mover la sartén. El calor residual termina el trabajo en el plato.",
      ingredientes: [[6, "ud", "huevos", "huevos"], [500, "g", "de patatas", "patatas"], [1, "ud", "cebolla", "cebolla"], [200, "ml", "de aceite de oliva", "aceite", 1], [0, "", "Sal", "sal", 1]],
      pasos: [{ t: "Pocha patata y cebolla en aceite a fuego suave sin que cojan color.", min: 20 }, { t: "Escurre y mezcla con los huevos batidos y sal. Deja reposar.", min: 5 }, { t: "Cuaja a fuego medio-bajo y da la vuelta con un plato.", min: 3 }, { t: "Retira cuando el centro aún tiemble." }]
    },
    {
      id: "paella-socarrat", chef: "marco", titulo: "Paella y el socarrat", categoria: "Arroces", plato: "rice", mh: 35,
      dieta: ["sin gluten"], tiempo: 60, dificultad: "Difícil", raciones: 4,
      secreto: "No remuevas el arroz jamás. En el último minuto y medio sube el fuego al máximo y escucha: ese crepitar es el socarrat.",
      ingredientes: [[320, "g", "de arroz bomba", "arroz"], [1, "l", "de caldo caliente", "agua", 1], [12, "ud", "gambas", "gambas"], [1, "ud", "pimiento rojo", "pimiento"], [100, "g", "de guisantes", "guisantes"], [1, "pizca", "de azafrán", "azafrán"], [4, "cucharadas", "de aceite de oliva", "aceite", 1]],
      pasos: [{ t: "Sofríe pimiento y gambas en la paella y reserva las gambas.", min: 8 }, { t: "Añade el arroz, nácaralo y reparte con la cuchara. Después no se toca.", min: 2 }, { t: "Vierte el caldo con azafrán y cuece a fuego fuerte primero, medio después.", min: 18 }, { t: "Sube el fuego para el socarrat y deja reposar tapado con un paño.", min: 2 }]
    },
    {
      id: "tarta-queso-vasca", chef: "noor", titulo: "Tarta quemada, corazón tembloroso", categoria: "Postres", plato: "cake", mh: 42,
      dieta: ["vegetariano"], tiempo: 60, dificultad: "Fácil", raciones: 8,
      secreto: "Horno a 220 °C y papel arrugado en el molde. La parte de arriba tiene que oscurecerse casi hasta el miedo; por dentro tiene que temblar.",
      ingredientes: [[800, "g", "de queso crema", "queso crema"], [250, "g", "de azúcar", "azúcar", 1], [5, "ud", "huevos", "huevos"], [400, "ml", "de nata para montar", "nata"], [20, "g", "de harina", "harina"]],
      pasos: [{ t: "Bate queso con azúcar hasta que no queden grumos." }, { t: "Incorpora huevos de uno en uno, luego la nata y la harina tamizada." }, { t: "Vierte en molde forrado con papel arrugado y hornea a 220 °C.", min: 40 }, { t: "Deja enfriar a temperatura ambiente antes de refrigerar.", min: 20 }]
    },
    {
      id: "cookies-sal", chef: "noor", titulo: "Cookies de sal y chocolate", categoria: "Postres", plato: "cookie", mh: 6,
      dieta: ["vegetariano"], tiempo: 35, dificultad: "Fácil", raciones: 12,
      secreto: "Reposa la masa 24 horas en la nevera. Sal en escamas apenas salen del horno: el contraste hace el resto del trabajo.",
      ingredientes: [[250, "g", "de harina", "harina"], [170, "g", "de mantequilla", "mantequilla"], [150, "g", "de azúcar moreno", "azúcar", 1], [1, "ud", "huevo", "huevos"], [200, "g", "de chocolate en trozos", "chocolate"], [0, "", "Sal en escamas", "sal", 1]],
      pasos: [{ t: "Bate mantequilla y azúcar moreno hasta que blanqueen.", min: 5 }, { t: "Añade el huevo, la harina y el chocolate troceado." }, { t: "Forma bolas, deja reposar la masa en frío y hornea a 180 °C.", min: 12 }, { t: "Sal en escamas al salir del horno y espera 5 minutos.", min: 5 }]
    }
  ]
};

// Capa social (datos de ejemplo): perfiles, comentarios, etiquetas y fotos opcionales.
(function (D) {
  var social = {
    marco: { handle: "marco.brasas", lugar: "Asador Rossi · Bilbao", seguidores: 48200, seguidos: 312, destacadas: ["Brasas", "Salsas", "Cuchillos"], directo: true },
    elena: { handle: "elena.huerto", lugar: "Huerto Vance · Valencia", seguidores: 31900, seguidos: 540, destacadas: ["Huerto", "Aliños", "Temporada"] },
    silas: { handle: "silas.masamadre", lugar: "Horno Thorne · Madrid", seguidores: 22700, seguidos: 128, destacadas: ["Masa madre", "Harinas", "Horno"] },
    lucia: { handle: "lucia.trattoria", lugar: "Trattoria Marini · Barcelona", seguidores: 56400, seguidos: 890, destacadas: ["Pasta fresca", "Nonna", "Huevos"] },
    noor: { handle: "noor.dulce", lugar: "Obrador Haddad · Sevilla", seguidores: 39100, seguidos: 402, destacadas: ["Tartas", "Galletas", "Caramelo"] }
  };
  D.chefs.forEach(function (c) { Object.assign(c, social[c.id]); });
  var extra = {
    "steak-mantequilla": { likes: 3412, horas: 2, tags: ["brasas", "chuleton", "mantequilla"], comentarios: [["lucia", "Ese baño final es pura poesía 🔥"], ["silas", "Con pan de masa madre para mojar, por favor."], ["elena", "¿Y una ensalada ácida al lado para cortar la grasa?"]] },
    "ensalada-acida": { likes: 1876, horas: 5, tags: ["huerto", "ensalada", "limon"], comentarios: [["noor", "La cebolla macerada lo cambia todo, confirmo."], ["marco", "Por fin una ensalada que no me aburre."]] },
    "pan-masa-madre": { likes: 2950, horas: 9, tags: ["masamadre", "pan", "horno"], comentarios: [["lucia", "Esa oreja 😍"], ["marco", "85 % de hidratación… valiente."], ["noor", "¿Cuánto tiempo de frío exactamente?"]] },
    "carbonara-sin-nata": { likes: 5204, horas: 14, tags: ["carbonara", "pasta", "sinnata"], comentarios: [["marco", "Gracias por defender la verdad."], ["elena", "Guanciale o nada."], ["silas", "La hice anoche. Ni una gota de nata. Perfecta."]] },
    "sopa-tomate-asado": { likes: 1320, horas: 22, tags: ["sopa", "tomate", "invierno"], comentarios: [["noor", "Con un picatoste de pan de Silas, ya."]] },
    "tortilla-jugosa": { likes: 4433, horas: 30, tags: ["tortilla", "conCebolla", "huevos"], comentarios: [["marco", "Con cebolla, por supuesto."], ["silas", "Que tiemble, que tiemble."]] },
    "paella-socarrat": { likes: 6120, horas: 40, tags: ["paella", "socarrat", "arroz"], comentarios: [["elena", "Ese crepitar 🥹"], ["lucia", "Aprendiendo del maestro."], ["noor", "Me guardo el truco del paño."]] },
    "tarta-queso-vasca": { likes: 7012, horas: 52, tags: ["tartadequeso", "postre", "horno"], comentarios: [["lucia", "La mejor del mundo, sin discusión."], ["marco", "Quemada pero no tanto… o sí."]] },
    "cookies-sal": { likes: 3890, horas: 70, tags: ["cookies", "chocolate", "sal"], comentarios: [["elena", "24 horas de reposo, apuntado."], ["silas", "La sal en escamas es la clave."]] }
  };
  D.recetas.forEach(function (r) { Object.assign(r, extra[r.id]); });
  D.chefs.forEach(function (c) { c.verificado = true; });
  // Comunidad: cocineros de casa con su receta.
  var gente = [
    { id: "ana", nombre: "Ana Ruiz", handle: "ana.cocinaencasa", titulo: "Cocina de diario para cinco", color: "#F3B47C", lugar: "Zaragoza", seguidores: 2130, seguidos: 410, bio: "Madre de tres. Lo que funciona entre semana y gusta a todos.", destacadas: ["Diario", "Cuchara"] },
    { id: "pablo", nombre: "Pablo Ortega", handle: "pablo.batchcooking", titulo: "Batch cooking los domingos", color: "#D9A066", lugar: "Málaga", seguidores: 8940, seguidos: 233, bio: "Dos horas el domingo, comida para toda la semana.", destacadas: ["Táperes", "Arroces"] },
    { id: "irene", nombre: "Irene Sol", handle: "irene.vegana", titulo: "Vegana sin dramas", color: "#A8C686", lugar: "Granada", seguidores: 5410, seguidos: 620, bio: "Legumbres, verdura y cero sermones.", destacadas: ["Legumbres", "Bowls"] },
    { id: "tomas", nombre: "Tomás Gil", handle: "tomas.panadero", titulo: "Panadero aficionado", color: "#E7C07A", lugar: "Valladolid", seguidores: 1280, seguidos: 98, bio: "Mi masa madre se llama Paca y tiene tres años.", destacadas: ["Paca", "Focaccias"] },
    { id: "carla", nombre: "Carla Méndez", handle: "carla.dulces", titulo: "Repostería para principiantes", color: "#F2A7A0", lugar: "Valencia", seguidores: 12300, seguidos: 540, bio: "Si yo puedo, tú puedes. Postres sin batidora de 600 €.", destacadas: ["Galletas", "Sin horno"] },
    { id: "javi", nombre: "Javi León", handle: "javi.estudiante", titulo: "Cocina con 20 € a la semana", color: "#F5C451", lugar: "Salamanca", seguidores: 3770, seguidos: 311, bio: "Piso compartido, una sartén y muchas ganas.", destacadas: ["Barato", "Una sartén"] },
    { id: "marta", nombre: "Marta Ibáñez", handle: "marta.viajes", titulo: "Recetas que traigo de viaje", color: "#E58F6B", lugar: "A Coruña", seguidores: 6520, seguidos: 702, bio: "Cada viaje acaba en una receta. Italia, Japón, México.", destacadas: ["Italia", "Japón"] },
    { id: "dani", nombre: "Dani Vidal", handle: "dani.parrilla", titulo: "Barbacoas de fin de semana", color: "#C9785A", lugar: "Murcia", seguidores: 4010, seguidos: 187, bio: "Brasa de sarmiento y paciencia.", destacadas: ["Brasa", "Ibérico"] }
  ];
  gente.forEach(function (g) { g.comunidad = true; D.chefs.push(g); });
  var R = function (id, chef, titulo, categoria, plato, mh, tiempo, dif, rac, secreto, ingredientes, pasos, likes, horas, tags, comentarios, dieta) {
    D.recetas.push({ id: id, chef: chef, titulo: titulo, categoria: categoria, plato: plato, mh: mh, tiempo: tiempo, dificultad: dif, raciones: rac, secreto: secreto, ingredientes: ingredientes, pasos: pasos, likes: likes, horas: horas, tags: tags, comentarios: comentarios, dieta: dieta || [] });
  };
  R("lentejas-diario", "ana", "Lentejas de diario", "Sopas", "soup", 28, 45, "Fácil", 5, "Un chorrito de vinagre justo antes de servir. Despierta todo el guiso sin que nadie sepa por qué.",
    [[400, "g", "de lentejas pardinas", "lentejas"], [1, "ud", "cebolla", "cebolla"], [2, "ud", "zanahorias", "zanahoria"], [1, "cucharadita", "de pimentón", "pimentón", 1], [1, "cucharada", "de vinagre", "vinagre", 1]],
    [{ t: "Sofríe cebolla y zanahoria picadas.", min: 10 }, { t: "Añade pimentón, lentejas y agua que las cubra dos dedos.", min: 35 }, { t: "Vinagre al final y a la mesa." }], 842, 3, ["lentejas", "cuchara", "diario"], [["javi", "Las hago este finde en el piso 🙌"], ["lucia", "El vinagre, gran truco."]], ["vegano", "sin gluten"]);
  R("arroz-horno-domingo", "pablo", "Arroz al horno del domingo", "Arroces", "rice", 16, 75, "Media", 6, "Caldo hirviendo y horno ya caliente: el arroz entra y no se toca. Si dudas, son 18 minutos a 220 °C.",
    [[400, "g", "de arroz redondo", "arroz"], [1, "ud", "cabeza de ajos", "ajo"], [200, "g", "de garbanzos cocidos", "garbanzos"], [2, "ud", "tomates", "tomate"], [1, "l", "de caldo", "agua", 1]],
    [{ t: "Dora el ajo y el tomate en la cazuela de barro.", min: 8 }, { t: "Añade arroz, garbanzos y caldo hirviendo.", min: 2 }, { t: "Horno a 220 °C sin tocar.", min: 18 }], 1530, 6, ["arrozalhorno", "batchcooking", "domingo"], [["marco", "Esto es cocina de verdad."], ["ana", "Me lo apunto para el domingo"]], ["sin gluten"]);
  R("garbanzos-tostados", "irene", "Garbanzos crujientes con yogur", "Ensaladas", "salad", 75, 30, "Fácil", 2, "Seca los garbanzos con un paño antes de hornearlos. Si entran húmedos, salen blandos.",
    [[400, "g", "de garbanzos cocidos", "garbanzos"], [1, "cucharadita", "de comino", "comino", 1], [150, "g", "de yogur vegetal", "yogur"], [1, "ud", "limón", "limón"], [60, "g", "de rúcula", "rúcula"]],
    [{ t: "Seca bien los garbanzos y alíñalos con aceite y comino." }, { t: "Hornea a 200 °C hasta que crujan.", min: 25 }, { t: "Sirve sobre rúcula con yogur al limón." }], 990, 11, ["vegano", "garbanzos", "bowl"], [["elena", "Me encanta este bowl 💚"]], ["vegano", "sin gluten"]);
  R("focaccia-romero", "tomas", "Focaccia de romero", "Panes", "bread", 100, 240, "Media", 8, "Hunde los dedos hasta el fondo de la bandeja y rellena los agujeros de aceite. Esa es la focaccia.",
    [[500, "g", "de harina de fuerza", "harina"], [400, "g", "de agua", "agua", 1], [5, "g", "de levadura seca", "levadura"], [60, "ml", "de aceite de oliva", "aceite", 1], [3, "ramas", "de romero", "romero"]],
    [{ t: "Mezcla todo menos el romero y deja levar tapado.", min: 120 }, { t: "Extiende en bandeja aceitada y haz los hoyos con los dedos.", min: 45 }, { t: "Romero, sal en escamas y horno a 230 °C.", min: 22 }], 640, 18, ["focaccia", "pan", "masamadre"], [["silas", "Buena miga, Tomás 👏"]], ["vegano"]);
  R("galletas-avena", "carla", "Galletas de avena y plátano", "Postres", "cookie", 42, 25, "Fácil", 10, "Plátano muy maduro, casi negro. Endulza solo y no necesitas añadir azúcar.",
    [[2, "ud", "plátanos muy maduros", "plátano"], [160, "g", "de copos de avena", "avena"], [60, "g", "de chocolate negro", "chocolate"], [1, "cucharadita", "de canela", "canela", 1]],
    [{ t: "Aplasta los plátanos y mezcla con avena, canela y chocolate." }, { t: "Forma montoncitos en la bandeja." }, { t: "Hornea a 180 °C.", min: 15 }], 2210, 26, ["sinazucar", "galletas", "facil"], [["noor", "Qué ricas, Carla 😍"], ["javi", "Baratas y sanas, top."]], ["vegano"]);
  R("huevos-rotos-piso", "javi", "Huevos rotos de piso", "Huevos", "eggs", 6, 25, "Fácil", 2, "Patatas en el microondas 6 minutos antes de freírlas. Mitad de tiempo, mitad de aceite.",
    [[3, "ud", "patatas", "patatas"], [3, "ud", "huevos", "huevos"], [80, "g", "de jamón o chorizo", "jamón"], [100, "ml", "de aceite", "aceite", 1]],
    [{ t: "Corta las patatas y dales microondas con un poco de sal.", min: 6 }, { t: "Termínalas en la sartén hasta dorar.", min: 8 }, { t: "Fríe los huevos, ponlos encima y rómpelos en la mesa." }], 1777, 34, ["piso", "barato", "huevos"], [["lucia", "La técnica del microondas, genial."], ["ana", "Mis hijos lo van a adorar"]], ["sin gluten"]);
  R("pasta-limon-amalfi", "marta", "Pasta al limón de Amalfi", "Pastas", "pasta", 42, 15, "Fácil", 2, "La ralladura va al final y fuera del fuego. Si la cueces, pierde todo el perfume.",
    [[200, "g", "de espagueti", "espagueti"], [2, "ud", "limones", "limón"], [40, "g", "de mantequilla", "mantequilla"], [40, "g", "de parmesano", "parmesano"]],
    [{ t: "Cuece la pasta y guarda un vaso del agua.", min: 9 }, { t: "Funde mantequilla con zumo de limón y un poco de agua de cocción." }, { t: "Fuera del fuego, pasta, parmesano y ralladura." }], 1340, 44, ["pasta", "limon", "italia"], [["lucia", "Amalfi en un plato 🍋"], ["marco", "Simple y perfecta."]], ["vegetariano"]);
  R("secreto-iberico", "dani", "Secreto ibérico a la brasa", "Carnes", "steak", 28, 30, "Media", 4, "Brasa de sarmiento muy viva y la carne entera. Se corta después del reposo, nunca antes.",
    [[800, "g", "de secreto ibérico", "secreto"], [0, "", "Sal gorda", "sal", 1], [1, "ud", "limón", "limón"], [2, "ud", "pimientos verdes", "pimiento"]],
    [{ t: "Prepara brasa viva de sarmiento.", min: 20 }, { t: "Asa el secreto entero, 4 minutos por lado.", min: 8 }, { t: "Reposa y corta en tiras con sal gorda.", min: 5 }], 1960, 50, ["brasa", "iberico", "barbacoa"], [["marco", "Así se hace, Dani 🔥"]], ["sin gluten"]);
  // Personas que han cocinado cada receta (base de ejemplo).
  D.recetas.forEach(function (r, i) { r.cocinado = Math.round((r.likes || 500) * (0.08 + (i % 4) * 0.03)); });
  // Fotos reales: pon aquí la URL (o ruta local) de cada receta. Si falta o no carga, se usa la ilustración.
  D.fotos = {};
})(window.FOODGRAM_DATA);
