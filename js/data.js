// Datos de ejemplo. Cada ingrediente: [cantidad, unidad, nombre, clave de nevera, ¿básico de despensa?]
window.FOODGRAM_DATA = {
  chefs: [
    { id: "marco", nombre: "Marco Rossi", titulo: "Maître rôtisseur", color: "#ff6f4d", bio: "Brasas, hierro y fondos de salsa. Treinta años frente al fuego y ninguna prisa." },
    { id: "elena", nombre: "Elena Vance", titulo: "Alquimista del huerto", color: "#62d394", bio: "Cocina vegetal, ácidos y frescura. Si no cruje o no brilla, vuelve a la mesa." },
    { id: "silas", nombre: "Silas Thorne", titulo: "Maestro panadero", color: "#ffc53d", bio: "Masa madre, hidratación alta y paciencia. El reloj lo manda la masa." },
    { id: "lucia", nombre: "Lucía Marini", titulo: "Trattoria de barrio", color: "#ff8fb0", bio: "Pasta, huevos y cocina de la abuela. Pocas cosas, bien hechas." },
    { id: "noor", nombre: "Noor Haddad", titulo: "Pastelera nocturna", color: "#b99cff", bio: "Postres con sal, con humo y sin miedo a quemar un poco." }
  ],
  recetas: [
    {
      id: "steak-mantequilla", chef: "marco", titulo: "El ritual de la mantequilla", categoria: "Carnes", plato: "steak", mh: 205,
      dieta: ["sin gluten"], tiempo: 25, dificultad: "Media", raciones: 2,
      secreto: "El secreto de esa corteza caoba no es el calor: es la mantequilla fría que entra en los últimos 60 segundos con ajo machacado y tomillo.",
      ingredientes: [[2, "ud", "chuletones de 3 cm", "chuletón"], [40, "g", "mantequilla fría", "mantequilla"], [3, "dientes", "de ajo", "ajo"], [4, "ramas", "de tomillo", "tomillo"], [0, "", "Sal en escamas", "sal", 1], [0, "", "Pimienta negra", "pimienta", 1]],
      pasos: [{ t: "Saca la carne de la nevera 40 minutos antes y sécala muy bien con papel." }, { t: "Sala generosamente y sella en sartén de hierro humeante: 3 minutos por lado.", min: 6 }, { t: "Baja el fuego, añade mantequilla, ajo y tomillo y baña la carne con la cuchara.", min: 1 }, { t: "Deja reposar sobre una rejilla antes de cortar a contrafibra.", min: 5 }]
    },
    {
      id: "ensalada-acida", chef: "elena", titulo: "El equilibrio ácido", categoria: "Ensaladas", plato: "salad", mh: 160,
      dieta: ["vegetariano", "sin gluten"], tiempo: 15, dificultad: "Fácil", raciones: 2,
      secreto: "A casi todas las ensaladas caseras les falta un golpe cítrico. Macera la cebolla roja 10 minutos en limón antes de mezclar. Lo cambia todo.",
      ingredientes: [[1, "ud", "cebolla roja", "cebolla"], [1, "ud", "limón (el zumo)", "limón"], [200, "g", "de tomate cherry", "tomate"], [1, "ud", "pepino", "pepino"], [100, "g", "de queso feta", "feta"], [30, "g", "de aceitunas kalamata", "aceitunas"], [3, "cucharadas", "de aceite de oliva", "aceite", 1], [0, "", "Orégano", "orégano", 1]],
      pasos: [{ t: "Corta la cebolla en pluma fina y déjala macerar en el zumo de limón.", min: 10 }, { t: "Trocea tomate y pepino y colócalos en un bol amplio." }, { t: "Añade la cebolla con su jugo, el feta y las aceitunas." }, { t: "Aliña con aceite y orégano justo antes de llevar a la mesa." }]
    },
    {
      id: "pan-masa-madre", chef: "silas", titulo: "El secreto de la miga", categoria: "Panes", plato: "bread", mh: 30,
      dieta: ["vegano"], tiempo: 720, dificultad: "Difícil", raciones: 8,
      secreto: "No temas la hidratación alta. Un 85 % de agua cuesta de manejar, pero esa miga aireada compensa cada dedo pegajoso.",
      ingredientes: [[500, "g", "de harina de fuerza", "harina"], [425, "g", "de agua", "agua", 1], [100, "g", "de masa madre activa", "masa madre"], [10, "g", "de sal", "sal", 1]],
      pasos: [{ t: "Mezcla harina y agua y deja la autólisis.", min: 45 }, { t: "Incorpora masa madre y sal. Haz pliegues cada 30 minutos durante 2 horas.", min: 30 }, { t: "Dale forma y fermenta en frío toda la noche." }, { t: "Hornea en cocotte a 250 °C, tapado.", min: 20 }, { t: "Destapa y termina de dorar.", min: 25 }]
    },
    {
      id: "carbonara-sin-nata", chef: "lucia", titulo: "Carbonara de verdad", categoria: "Pastas", plato: "pasta", mh: 345,
      dieta: [], tiempo: 20, dificultad: "Media", raciones: 2,
      secreto: "Fuera del fuego, el huevo se liga con un cucharón de agua de cocción. Nunca nata, nunca prisa: si humea, ya has cuajado la salsa.",
      ingredientes: [[200, "g", "de espagueti", "espagueti"], [100, "g", "de guanciale", "guanciale"], [3, "ud", "yemas de huevo", "huevos"], [1, "ud", "huevo entero", "huevos"], [50, "g", "de pecorino rallado", "pecorino"], [0, "", "Pimienta negra recién molida", "pimienta", 1], [0, "", "Sal para el agua", "sal", 1]],
      pasos: [{ t: "Dora el guanciale a fuego bajo hasta que suelte la grasa y quede crujiente.", min: 8 }, { t: "Cuece la pasta en agua con poca sal; guarda una taza del agua.", min: 9 }, { t: "Mezcla yemas, huevo, pecorino y mucha pimienta en un bol." }, { t: "Fuera del fuego, une pasta, guanciale y crema de huevo con un chorro de agua de cocción. Remueve sin parar." }]
    },
    {
      id: "sopa-tomate-asado", chef: "elena", titulo: "Tomate asado, sopa de invierno", categoria: "Sopas", plato: "soup", mh: 215,
      dieta: ["vegano", "sin gluten"], tiempo: 50, dificultad: "Fácil", raciones: 4,
      secreto: "Asa los tomates con una pizca de azúcar hasta que se caramelicen los bordes. Ese amargor tostado sustituye a una hora de caldo.",
      ingredientes: [[1, "kg", "de tomates maduros", "tomate"], [1, "ud", "cebolla", "cebolla"], [4, "dientes", "de ajo", "ajo"], [1, "cucharadita", "de azúcar", "azúcar", 1], [500, "ml", "de agua o caldo", "agua", 1], [4, "cucharadas", "de aceite de oliva", "aceite", 1], [0, "", "Albahaca fresca", "albahaca"]],
      pasos: [{ t: "Parte los tomates, ponlos en bandeja con cebolla, ajos, aceite, sal y azúcar." }, { t: "Asa a 200 °C hasta que los bordes se ennegrezcan un poco.", min: 35 }, { t: "Tritura con el agua caliente hasta dejar una crema fina." }, { t: "Cuela si quieres sedosidad y sirve con albahaca y un hilo de aceite.", min: 5 }]
    },
    {
      id: "tortilla-jugosa", chef: "lucia", titulo: "Tortilla que tiembla", categoria: "Huevos", plato: "eggs", mh: 48,
      dieta: ["vegetariano", "sin gluten"], tiempo: 30, dificultad: "Media", raciones: 4,
      secreto: "Retírala del fuego cuando el centro todavía tiembla al mover la sartén. El calor residual termina el trabajo en el plato.",
      ingredientes: [[6, "ud", "huevos", "huevos"], [500, "g", "de patatas", "patatas"], [1, "ud", "cebolla", "cebolla"], [200, "ml", "de aceite de oliva", "aceite", 1], [0, "", "Sal", "sal", 1]],
      pasos: [{ t: "Pocha patata y cebolla en aceite a fuego suave sin que cojan color.", min: 20 }, { t: "Escurre y mezcla con los huevos batidos y sal. Deja reposar.", min: 5 }, { t: "Cuaja a fuego medio-bajo y da la vuelta con un plato.", min: 3 }, { t: "Retira cuando el centro aún tiemble." }]
    },
    {
      id: "paella-socarrat", chef: "marco", titulo: "Paella y el socarrat", categoria: "Arroces", plato: "rice", mh: 195,
      dieta: ["sin gluten"], tiempo: 60, dificultad: "Difícil", raciones: 4,
      secreto: "No remuevas el arroz jamás. En el último minuto y medio sube el fuego al máximo y escucha: ese crepitar es el socarrat.",
      ingredientes: [[320, "g", "de arroz bomba", "arroz"], [1, "l", "de caldo caliente", "agua", 1], [12, "ud", "gambas", "gambas"], [1, "ud", "pimiento rojo", "pimiento"], [100, "g", "de guisantes", "guisantes"], [1, "pizca", "de azafrán", "azafrán"], [4, "cucharadas", "de aceite de oliva", "aceite", 1]],
      pasos: [{ t: "Sofríe pimiento y gambas en la paella y reserva las gambas.", min: 8 }, { t: "Añade el arroz, nácaralo y reparte con la cuchara. Después no se toca.", min: 2 }, { t: "Vierte el caldo con azafrán y cuece a fuego fuerte primero, medio después.", min: 18 }, { t: "Sube el fuego para el socarrat y deja reposar tapado con un paño.", min: 2 }]
    },
    {
      id: "tarta-queso-vasca", chef: "noor", titulo: "Tarta quemada, corazón tembloroso", categoria: "Postres", plato: "cake", mh: 280,
      dieta: ["vegetariano"], tiempo: 60, dificultad: "Fácil", raciones: 8,
      secreto: "Horno a 220 °C y papel arrugado en el molde. La parte de arriba tiene que oscurecerse casi hasta el miedo; por dentro tiene que temblar.",
      ingredientes: [[800, "g", "de queso crema", "queso crema"], [250, "g", "de azúcar", "azúcar", 1], [5, "ud", "huevos", "huevos"], [400, "ml", "de nata para montar", "nata"], [20, "g", "de harina", "harina"]],
      pasos: [{ t: "Bate queso con azúcar hasta que no queden grumos." }, { t: "Incorpora huevos de uno en uno, luego la nata y la harina tamizada." }, { t: "Vierte en molde forrado con papel arrugado y hornea a 220 °C.", min: 40 }, { t: "Deja enfriar a temperatura ambiente antes de refrigerar.", min: 20 }]
    },
    {
      id: "cookies-sal", chef: "noor", titulo: "Cookies de sal y chocolate", categoria: "Postres", plato: "cookie", mh: 20,
      dieta: ["vegetariano"], tiempo: 35, dificultad: "Fácil", raciones: 12,
      secreto: "Reposa la masa 24 horas en la nevera. Sal en escamas apenas salen del horno: el contraste hace el resto del trabajo.",
      ingredientes: [[250, "g", "de harina", "harina"], [170, "g", "de mantequilla", "mantequilla"], [150, "g", "de azúcar moreno", "azúcar", 1], [1, "ud", "huevo", "huevos"], [200, "g", "de chocolate en trozos", "chocolate"], [0, "", "Sal en escamas", "sal", 1]],
      pasos: [{ t: "Bate mantequilla y azúcar moreno hasta que blanqueen.", min: 5 }, { t: "Añade el huevo, la harina y el chocolate troceado." }, { t: "Forma bolas, deja reposar la masa en frío y hornea a 180 °C.", min: 12 }, { t: "Sal en escamas al salir del horno y espera 5 minutos.", min: 5 }]
    }
  ]
};
