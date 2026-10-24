// Datos de ejemplo. Sustituir por una API cuando exista backend.
window.FOODGRAM_DATA = {
  chefs: [
    { id: "marco", nombre: "Marco Rossi", titulo: "Maître Rôtisseur", color: "orange", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4Y8CCfg3fIQutoz1tLTG979QUIv-U0uHBrwglkd_0Q9LOKHA-mw8AvmPirzLDFOtrmHmJvxtMhxgu96fM7vYzolnBw8r3ER4g-JF7soT4LvDtT17mYyefYfqwCXz3coGhddv-f4_J_bB0D1z-9XFq0kr1e-tacuEZ0Ce_oHPEigIwTE3hm47zO0s1EdYgVvTY_s0Dn86-YM8lnpls1XKmwAdege4ZIZYv8ncohvl885uqJtXtIPS_s1zPjU209NS8GH5_sPHKJquY", bio: "Carnes, brasas y salsas de fondo. Treinta años frente al fuego." },
    { id: "elena", nombre: "Elena Vance", titulo: "Alquimista del huerto", color: "green", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXikm3-Em0I97OFAspUB3vEwBPYccnfLPofl-AyOi7HbGTjiyF6cwiag-phGMGbfEROpADCDRL5nSWHFlEAce6X7RNjL6GcQ3fsfJ3BvjioYHl-dSXxQWealt_ZMgbtDOYN53t8-fKtEZnHag4HSXoMWQ5l7rllCc3d_xlFVaPVsY6V6pqZnnu04LbXDWMCUZ_UbtySJdE75_ZAKgBxmCPCuDIV0XPsnnBMsDblknZ_emkJNUgnxQSZdRgeZyFdpkEj3DGywLMVjOm", bio: "Cocina vegetal, ácidos y frescura mediterránea." },
    { id: "silas", nombre: "Silas Thorne", titulo: "Maestro panadero", color: "yellow", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVMMqRA8cAhupzXh-KUAESK7gCRJNUj9f6lefw5iKlfX36iQfIMJGCIkhk9RPT-51qT8BmicwuJJehacQ5qMJ06V-d9tgmBWPH1jx3l4ATx5hDVSWke-pmEs64Vs4IeHX64qoKRFMw9B9DtILnP9MbrxU8ZFIQDnnrGJ09tv6lJAL9sOXtvtw4XhRkSK5ZxkQQjS4joY6rKkg59J9vDqSEd2vLFjS0pcbV-PgORVEvOX_tgARhoom-iooH0ggJjffKtTw6Jv8KGc2U", bio: "Masa madre, hidratación alta y paciencia." }
  ],
  recetas: [
    {
      id: "steak-mantequilla", chef: "marco", titulo: "El ritual de la mantequilla", categoria: "Carnes", dieta: [],
      tiempo: 25, dificultad: "Media", raciones: 2, foto: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHyvYhSviOV1qXaiuJhnK-UPlJxQP2M6cD9sbcPvndb-TXuoHwMEhI1PqPpL4yvupF3RsMvTvDU5nF2XgUXBuv6OHIQrvN-oRzTojDxyRGE4YofXzkUCgeTMBk5hu0RDH-lRT9V9VHMQOWdiSy83DZvGxmDOfZWp-O-pIY6ywUhQI2JMm4MYkfcA7YstxjP92H_VOefoly9-MiAUgUmV1pWhg_g3_X_plzh0yi6ftw-PYm-_YlbB5S3HO2GmKexIfYauJ0-tmdHy75", fotoAlt: "Chuletón jugoso cocinado al punto sobre una tabla de madera",
      secreto: "El secreto de esa corteza caoba no es el calor: es la mantequilla fría añadida en los últimos 60 segundos con ajo machacado y tomillo.",
      ingredientes: ["2 chuletones de 3 cm", "40 g de mantequilla fría", "3 dientes de ajo", "4 ramas de tomillo", "Sal en escamas", "Pimienta negra"],
      pasos: ["Saca la carne de la nevera 40 minutos antes y sécala bien.", "Sala generosamente y sella en sartén de hierro muy caliente 3 minutos por lado.", "Baja el fuego, añade mantequilla, ajo y tomillo y baña la carne durante 60 segundos.", "Reposa 5 minutos antes de cortar a contrafibra."]
    },
    {
      id: "ensalada-acida", chef: "elena", titulo: "El equilibrio ácido", categoria: "Ensaladas", dieta: ["vegetariano", "sin gluten"],
      tiempo: 15, dificultad: "Fácil", raciones: 2, foto: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn8Fc1H_iGnweOqiue0_vw81bOmsFEy_w6angkbHXUqhpt2fth90mhxm_YuqsQPjMlsWspMFZD_uoIS6PgCWy_C682ShYkfKrnHt8m4GVzcsqnzi9m5xTh-9GPL-PxbSsAlYfRakOdTKZcjyXTxFNuG3GuTlk4yrt8a3ElHLwqy51lo9Fw9K6cs9ZNfTGM6yxRNHrrVi7LZEpIkLVGaFhlD1UJLIt-60s2ddT7w_WT5dmvG14QhhK7IodqpR8-4i6UafRhCohoG51V", fotoAlt: "Bol colorido de ensalada mediterránea con feta y aceitunas",
      secreto: "A la mayoría de ensaladas caseras les falta un golpe cítrico. Macera la cebolla roja en zumo de limón 10 minutos antes de mezclar. Lo cambia todo.",
      ingredientes: ["1 cebolla roja", "El zumo de 1 limón", "200 g de tomate cherry", "1 pepino", "100 g de queso feta", "Aceitunas kalamata", "Aceite de oliva virgen extra", "Orégano"],
      pasos: ["Corta la cebolla en pluma fina y déjala 10 minutos en el zumo de limón.", "Trocea tomate y pepino y colócalos en un bol amplio.", "Añade la cebolla con su jugo, el feta y las aceitunas.", "Aliña con aceite y orégano justo antes de servir."]
    },
    {
      id: "pan-masa-madre", chef: "silas", titulo: "El secreto de la miga", categoria: "Panes", dieta: ["vegano"],
      tiempo: 720, dificultad: "Difícil", raciones: 8, foto: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSnW9Gxhpoan732daZzfP7C-V7zCJLjvkkrHhu3itYLhQ0JKB3Vdiw-lgRlPbk22ZgcxW3jtLvyZQIEEFlZuniUdeJF0a3qnSkcyvimVYJ3wzMnbXRI5g17lQTPQcFxHdXIOmFf3yydKCpP6nIzkGP3P7L66zpQdjV7IZ7GBJGrgjAAnEL7_fbkFIB8zLDRIMlEVX0q59H9PKv5Xy4C33XqjQ2iQSEx5HpZlBCNycXAOkBsCXlcBBJKC0V6rgwizlAThDVuWoxKsVL", fotoAlt: "Pan de masa madre dorado y crujiente siendo cortado",
      secreto: "No temas la hidratación alta. Un 85 % de agua es difícil de manejar, pero la miga aireada compensa cada dedo pegajoso.",
      ingredientes: ["500 g de harina de fuerza", "425 g de agua", "100 g de masa madre activa", "10 g de sal"],
      pasos: ["Mezcla harina y agua y deja autolisis 45 minutos.", "Incorpora masa madre y sal; haz 4 series de pliegues cada 30 minutos.", "Fermenta en frío toda la noche.", "Hornea en cocotte a 250 °C: 20 minutos tapado y 25 destapado."]
    }
  ]
};
