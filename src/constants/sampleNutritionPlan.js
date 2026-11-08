/**
 * Sample Nutrition Plan - Plan Modelo de 7 Días para Argentina
 *
 * Cumple estrictamente con la especificación del Prompt Maestro nutricional:
 * (src/lib/nutritionPromptGenerator.js) y el transformer de nutrición
 * (src/lib/transformers/nutritionTransformer.js):
 *
 * - planMeta: tmb, tdee, targetKcal, deficit, proteina_g, carbos_g, grasas_g, rationale, requiereDerivacion, notaDerivacion
 * - weeks[0].days: 7 días completos (Lunes a Domingo) con alternancia entrenamiento/descanso y comidas familiares
 * - meals: name, hora, kcal, proteina_g, carbos_g, grasas_g, ingredientes, preparacion, sustituciones, nota_timing, variantes
 * - REGLA OBLIGATORIA DE MEDICIÓN: Ingredientes con gramos/ml exactos y porción relativa casera (tazas, cucharadas, unidades)
 * - mealPrepGuide: preparaciones en lote para la semana
 * - shoppingList: clasificada por rubros con unidades de compra reales
 * - notas_semana: observaciones prácticas de adherencia
 */

export const SAMPLE_NUTRITION_PLAN = {
  name: "Plan Nutricional Deportivo · Recomposición & Rendimiento",
  author: "Lic. Nutrición Deportiva",
  planMeta: {
    tmb: 1780,
    tdee: 2500,
    targetKcal: 2150,
    deficit: -350,
    proteina_g: 165,
    carbos_g: 230,
    grasas_g: 60,
    rationale: "Déficit calórico moderado del 14% para maximizar la oxidación de grasa preservando la masa muscular y el rendimiento deportivo.",
    requiereDerivacion: false,
    notaDerivacion: null
  },
  weeks: [
    {
      weekLabel: "Semana Estándar",
      summary: "Distribución semanal con ciclismo de carbohidratos peri-entreno y estrategia dominical para reunión familiar.",
      notes: "Priorizar 2.5 a 3 litros de agua diarios. El mate es libre siempre que no se use azúcar agregada.",
      days: [
        // ── LUNES (Día de Entrenamiento: Fuerza / Tren Superior) ──
        {
          dayLabel: "Lunes",
          esDiaEntreno: true,
          meals: [
            {
              name: "Desayuno",
              hora: "07:30",
              kcal: 460,
              proteina_g: 32,
              carbos_g: 58,
              grasas_g: 11,
              ingredientes: "80g de avena tradicional (1 taza al ras), 200ml de leche descremada (1 taza), 1 banana madura (1 unidad mediana), 15g de manteca de maní (1 cucharada sopera)",
              preparacion: "Calentar la avena con la leche durante 2 minutos a fuego bajo o microondas. Servir con la banana pisada y la manteca de maní encima.",
              sustituciones: "Sin avena: 60g de granola sin azúcar (3/4 taza) o 2 tostadas de pan integral con 40g de ricota magra (2 cucharadas soperas).",
              nota_timing: "Consumir 90 a 120 minutos antes de la sesión de entrenamiento.",
              variantes: [
                {
                  label: "Opción rápida sin cocción",
                  ingredientes: "3 huevos revueltos (3 unidades), 60g de pan integral (2 tostadas medianas), 30g de queso port salut descremado (1 feta gruesa / 2 dedos), 1 manzana (1 unidad)",
                  kcal: 450,
                  proteina_g: 30,
                  carbos_g: 54,
                  grasas_g: 12
                }
              ]
            },
            {
              name: "Almuerzo (Post-Entreno)",
              hora: "13:00",
              kcal: 720,
              proteina_g: 55,
              carbos_g: 80,
              grasas_g: 18,
              ingredientes: "160g de pechuga de pollo grillada (1 filete grande / tamaño de la mano completa), 220g de arroz integral cocido (1 taza y media), 150g de brócoli al vapor (1 taza grande), 10ml de aceite de oliva virgen extra (1 cucharada sopera)",
              preparacion: "Cocinar la pechuga a la plancha con orégano y pimentón. Servir junto con el arroz caliente y el brócoli aderezado con el aceite de oliva.",
              sustituciones: "Pollo por 170g de bife de paleta o nalga magra (1 bife mediano). Arroz por 250g de papa hervida (1 papa mediana y media).",
              nota_timing: "Comida principal post-entreno: reabastecimiento de glucógeno y síntesis proteica.",
              variantes: [
                {
                  label: "Opción con legumbres",
                  ingredientes: "200g de lentejas cocidas (1 taza colmada), 120g de carne picada especial magra (1 taza de carne salteada), salsa de tomate casera (1/2 taza), 10ml de aceite de oliva (1 cucharada sopera)",
                  kcal: 710,
                  proteina_g: 52,
                  carbos_g: 78,
                  grasas_g: 19
                }
              ]
            },
            {
              name: "Merienda",
              hora: "17:30",
              kcal: 380,
              proteina_g: 28,
              carbos_g: 45,
              grasas_g: 9,
              ingredientes: "200g de yogur descremado natural (1 pote grande), 1 scoop de proteína de suero o 30g de leche en polvo descremada (2 cucharadas soperas), 40g de avena (1/2 taza), 15g de nueces partidas (1 puñado chico / 4 mariposas)",
              preparacion: "Mezclar el yogur con la proteína o leche en polvo hasta homogenizar. Incorporar la avena y las nueces.",
              sustituciones: "Yogur por 150g de queso blanco descremado o ricota magra (3 cucharadas soperas colmadas).",
              nota_timing: "Acompañar con infusión caliente (té verde o café) o mate con stevia.",
              variantes: [
                {
                  label: "Tostadas proteicas",
                  ingredientes: "60g de pan integral (2 tostadas), 80g de atún al natural escurrido (1/2 lata), 1 huevo duro picado (1 unidad), 1 rodaja de tomate",
                  kcal: 375,
                  proteina_g: 29,
                  carbos_g: 42,
                  grasas_g: 9
                }
              ]
            },
            {
              name: "Cena",
              hora: "21:30",
              kcal: 590,
              proteina_g: 50,
              carbos_g: 47,
              grasas_g: 22,
              ingredientes: "180g de merluza o filet de pescado a la plancha (2 filetes chicos), 200g de batata al horno (1 unidad mediana), ensalada de 100g de hojas verdes y 80g de tomate (1 plato hondo), 10ml de aceite de girasol alto oleico o de oliva (1 cucharada sopera)",
              preparacion: "Cocinar el pescado con limón y provenzal 3 minutos por lado. Acompañar con la batata asada en rodajas y la ensalada fresca.",
              sustituciones: "Merluza por 160g de pata-muslo de pollo deshuesada sin piel (1 unidad mediana). Batata por 200g de calabaza asada.",
              nota_timing: "Cena liviana de fácil digestión para favorecer el descanso nocturno.",
              variantes: [
                {
                  label: "Tortilla de vegetales y queso",
                  ingredientes: "2 huevos enteros (2 unidades) + 2 claras (2 unidades), 150g de espinaca cocida (1 taza compacta), 40g de queso port salut (1 feta gruesa / 2 dedos), 150g de papa hervida en cubos (1 taza)",
                  kcal: 580,
                  proteina_g: 45,
                  carbos_g: 48,
                  grasas_g: 22
                }
              ]
            }
          ]
        },

        // ── MARTES (Día de Entrenamiento: Piernas) ──
        {
          dayLabel: "Martes",
          esDiaEntreno: true,
          meals: [
            {
              name: "Desayuno",
              hora: "07:30",
              kcal: 470,
              proteina_g: 33,
              carbos_g: 60,
              grasas_g: 11,
              ingredientes: "3 claras y 1 huevo entero (4 unidades), 60g de pan de masa madre o integral (2 tostadas grandes), 1 naranja en gajos (1 unidad mediana), 10g de semillas de chía o lino (1 cucharada sopera al ras)",
              preparacion: "Hacer huevos revueltos en sartén antiadherente. Tostar el pan y espolvorear las semillas sobre la fruta.",
              sustituciones: "Huevos por 150g de ricota magra con una pizca de canela y stevia sobre las tostadas.",
              nota_timing: "Hidratar con 500ml de agua al despertar.",
              variantes: [
                {
                  label: "Pancakes de avena y banana",
                  ingredientes: "60g de harina de avena (3/4 taza), 2 huevos (2 unidades), 1 banana pisada (1 unidad), 10g de miel (1 cucharadita de té)",
                  kcal: 465,
                  proteina_g: 31,
                  carbos_g: 62,
                  grasas_g: 11
                }
              ]
            },
            {
              name: "Almuerzo (Pre-Entreno / Principal)",
              hora: "13:00",
              kcal: 730,
              proteina_g: 54,
              carbos_g: 82,
              grasas_g: 19,
              ingredientes: "180g de carne vacuna magra como bola de lomo o nalga (1 bife grande / palma y media), 200g de fideos secos integrales ya cocidos (1 plato playo colmado), salsa de tomate natural casera (1/2 taza), 10ml de aceite de oliva (1 cucharada sopera)",
              preparacion: "Cocinar los fideos al dente. Grillar la carne a fuego fuerte con sal moderada y mezclar la pasta con la salsa y el aceite.",
              sustituciones: "Carne vacuna por 170g de pechuga de pollo. Fideos por 220g de arroz blanco o yamaní cocido (1 taza y media).",
              nota_timing: "Comida rica en carbohidratos complejos para asegurar glucógeno en la sesión de piernas.",
              variantes: [
                {
                  label: "Arroz con atún y huevo",
                  ingredientes: "220g de arroz blanco cocido (1 taza y media), 160g de atún al natural (1 lata entera grande), 1 huevo duro (1 unidad), 10ml de aceite de oliva (1 cucharada sopera)",
                  kcal: 720,
                  proteina_g: 52,
                  carbos_g: 80,
                  grasas_g: 20
                }
              ]
            },
            {
              name: "Merienda",
              hora: "17:30",
              kcal: 370,
              proteina_g: 27,
              carbos_g: 44,
              grasas_g: 9,
              ingredientes: "150g de yogur griego o descremado (1 pote chico), 1 barra de cereal con proteína o 30g de frutos secos surtidos (1 puñado mediano), 1 pera en cubos (1 unidad mediana)",
              preparacion: "Cortar la pera en trozos e incorporarla al yogur junto con los frutos secos.",
              sustituciones: "Peras por manzana o durazno según estación.",
              nota_timing: "Ideal para consumir inmediatamente al finalizar el entrenamiento.",
              variantes: [
                {
                  label: "Batido regenerador",
                  ingredientes: "250ml de leche descremada (1 taza y cuarto), 1 scoop de proteína (30g), 1 banana chica (1 unidad), 10g de cacao amargo en polvo (1 cucharadita)",
                  kcal: 365,
                  proteina_g: 28,
                  carbos_g: 43,
                  grasas_g: 8
                }
              ]
            },
            {
              name: "Cena",
              hora: "21:30",
              kcal: 580,
              proteina_g: 51,
              carbos_g: 44,
              grasas_g: 21,
              ingredientes: "170g de pechuga de pollo al horno (1 bife mediano a grande), 250g de puré mixto de zapallo y zanahoria (1 taza colmada), ensalada de repollo y rúcula (1 plato hondo), 10ml de aceite de oliva (1 cucharada sopera)",
              preparacion: "Hornear el pollo en tiritas con orégano. Preparar el puré pisando los vegetales hervidos y acompañar con ensalada crujiente.",
              sustituciones: "Pollo por 160g de cerdo magro (carré de cerdo). Zapallo por 200g de papa hervida.",
              nota_timing: "Acompañar con infusión digestiva (manzanilla o boldo).",
              variantes: [
                {
                  label: "Omelette con vegetales salteados",
                  ingredientes: "3 huevos (3 unidades), 40g de queso port salut (1 feta gruesa / 2 dedos), 150g de zapallitos salteados (1 taza), 1 rodaja de pan integral (30g)",
                  kcal: 570,
                  proteina_g: 46,
                  carbos_g: 42,
                  grasas_g: 23
                }
              ]
            }
          ]
        },

        // ── MIÉRCOLES (Día de Descanso: Recuperación) ──
        {
          dayLabel: "Miércoles",
          esDiaEntreno: false,
          meals: [
            {
              name: "Desayuno",
              hora: "08:00",
              kcal: 440,
              proteina_g: 32,
              carbos_g: 42,
              grasas_g: 15,
              ingredientes: "3 huevos revueltos con orégano (3 unidades), 30g de pan integral (1 tostada), 40g de queso port salut descremado (1 feta gruesa / 2 dedos), 1 pocillo de café o mate amargo",
              preparacion: "Derretir el queso sobre los huevos en la sartén. Servir con la tostada crujiente y la infusión.",
              sustituciones: "Pan integral por 2 galletas de arroz grandes.",
              nota_timing: "Día sin entrenamiento: menor volumen de carbohidratos matutinos.",
              variantes: [
                {
                  label: "Yogur con semillas y proteína",
                  ingredientes: "200g de yogur descremado (1 pote grande), 25g de proteína o leche en polvo (2 cucharadas soperas), 20g de nueces (1 puñado chico / 4 unidades), 1 mandarina (1 unidad)",
                  kcal: 430,
                  proteina_g: 31,
                  carbos_g: 40,
                  grasas_g: 15
                }
              ]
            },
            {
              name: "Almuerzo",
              hora: "13:00",
              kcal: 680,
              proteina_g: 52,
              carbos_g: 55,
              grasas_g: 27,
              ingredientes: "180g de carne picada especial o roast beef magro (1 taza colmada de carne cocida), 150g de arroz integral cocido (1 taza al ras), salteado de cebolla, morrón y zuquini (1 taza y media), 15ml de aceite de oliva (1 cucharada sopera colmada)",
              preparacion: "Dorar la cebolla y el morrón en una sartén con media cucharada de aceite. Agregar la carne picada y servir sobre el arroz integral tibio.",
              sustituciones: "Carne picada por 180g de pechuga en cubos salteada.",
              nota_timing: "Comida densa en micronutrientes para apoyar la recuperación muscular.",
              variantes: [
                {
                  label: "Ensalada tibia de pollo y palta",
                  ingredientes: "170g de pollo desmechado (1 taza colmada), 80g de palta madura (media palta chica), 120g de choclo desgranado (3/4 taza), hojas verdes a gusto",
                  kcal: 670,
                  proteina_g: 51,
                  carbos_g: 52,
                  grasas_g: 28
                }
              ]
            },
            {
              name: "Merienda",
              hora: "17:30",
              kcal: 360,
              proteina_g: 26,
              carbos_g: 38,
              grasas_g: 10,
              ingredientes: "150g de queso blanco descremado (3 cucharadas soperas colmadas), 1 manzana cortada en rodajas finas (1 unidad mediana), 15g de manteca de maní (1 cucharada sopera al ras), canela a gusto",
              preparacion: "Untar las rodajas de manzana con el queso blanco y un toque de manteca de maní.",
              sustituciones: "Manzana por pera o durazno.",
              nota_timing: "Acompañar con mate amargo o café solo.",
              variantes: [
                {
                  label: "Tostada con ricota y frutos secos",
                  ingredientes: "30g de pan integral (1 tostada), 80g de ricota magra (2 cucharadas colmadas), 15g de nueces (1 puñado chico), stevia o gotas de vainilla",
                  kcal: 350,
                  proteina_g: 25,
                  carbos_g: 36,
                  grasas_g: 11
                }
              ]
            },
            {
              name: "Cena",
              hora: "21:30",
              kcal: 670,
              proteina_g: 55,
              carbos_g: 50,
              grasas_g: 26,
              ingredientes: "200g de merluza o abadejo al horno (2 filetes medianos), 180g de papa hervida en cubos (1 unidad mediana), ensalada de tomate, pepino y cebolla morada (1 plato hondo), 15ml de aceite de girasol alto oleico o de oliva (1 cucharada sopera colmada)",
              preparacion: "Cocinar los filetes de pescado con jugo de limón y ajo picado. Acompañar con la papa y ensalada condimentada.",
              sustituciones: "Pescado blanco por 2 latas chicas de atún al natural (160g escurridos).",
              nota_timing: "Cena balanceada con digestión óptima.",
              variantes: [
                {
                  label: "Pechuga grille con puré de calabaza",
                  ingredientes: "180g de pechuga de pollo (1 bife grande), 250g de puré de calabaza (1 taza colmada), 10ml de aceite de oliva (1 cucharada sopera), ensalada verde",
                  kcal: 660,
                  proteina_g: 53,
                  carbos_g: 48,
                  grasas_g: 26
                }
              ]
            }
          ]
        },

        // ── JUEVES (Día de Entrenamiento: Torso / Hipertrofia) ──
        {
          dayLabel: "Jueves",
          esDiaEntreno: true,
          meals: [
            {
              name: "Desayuno",
              hora: "07:30",
              kcal: 460,
              proteina_g: 31,
              carbos_g: 59,
              grasas_g: 11,
              ingredientes: "80g de avena arrollada (1 taza al ras), 200ml de leche descremada (1 taza), 1 cucharadita de cacao amargo (5g), 1 banana (1 unidad mediana), 10g de semillas de girasol o lino (1 cucharada de postre)",
              preparacion: "Mezclar la avena con la leche y el cacao en una taza. Llevar 2 minutos a microondas y servir con banana en rodajas y semillas.",
              sustituciones: "Leche descremada por leche de almendras o agua si hay intolerancia a la lactosa.",
              nota_timing: "Pre-entreno energético de liberación sostenida.",
              variantes: [
                {
                  label: "Tostón con huevo y queso",
                  ingredientes: "60g de pan integral (2 tostadas), 2 huevos revueltos (2 unidades), 40g de queso port salut (1 feta gruesa / 2 dedos), 1 vaso de jugo de naranja natural (150ml)",
                  kcal: 450,
                  proteina_g: 29,
                  carbos_g: 56,
                  grasas_g: 12
                }
              ]
            },
            {
              name: "Almuerzo",
              hora: "13:00",
              kcal: 730,
              proteina_g: 54,
              carbos_g: 81,
              grasas_g: 19,
              ingredientes: "170g de pechuga de pollo marinada con limón y mostaza (1 bife grande), 200g de batata horneada (1 unidad mediana), 100g de choclo desgranado (1/2 taza colmada), ensalada de lechuga y tomate (1 plato), 10ml de aceite de oliva (1 cucharada sopera)",
              preparacion: "Cocinar la pechuga a la plancha. Cortar la batata en bastones y dorar al horno sin aceite excesivo.",
              sustituciones: "Batata por 200g de arroz integral cocido (1 taza y cuarto).",
              nota_timing: "Comida post-entreno con alta densidad de carbohidratos para recuperación.",
              variantes: [
                {
                  label: "Bowl de arroz, carne y palta",
                  ingredientes: "160g de nalga en tiritas salteada (1 bife mediano), 220g de arroz blanco cocido (1 taza y media), 40g de palta (1/4 de unidad), salsa criolla casera",
                  kcal: 720,
                  proteina_g: 52,
                  carbos_g: 79,
                  grasas_g: 20
                }
              ]
            },
            {
              name: "Merienda",
              hora: "17:30",
              kcal: 380,
              proteina_g: 28,
              carbos_g: 45,
              grasas_g: 9,
              ingredientes: "200g de yogur descremado (1 pote grande), 30g de copos de maíz sin azúcar (1 taza mediana), 1 cucharada sopera de semillas de chía (10g), 1 puñado de arándanos o 1 mandarina (1 unidad)",
              preparacion: "Mezclar el yogur con los cereales y la fruta fresca.",
              sustituciones: "Copos de maíz por 30g de avena tostada en sartén.",
              nota_timing: "Snack proteico de tarde.",
              variantes: [
                {
                  label: "Pancake de ricota",
                  ingredientes: "80g de ricota magra (2 cucharadas soperas), 1 huevo entero (1 unidad), 40g de avena (1/2 taza), esencia de vainilla y stevia",
                  kcal: 370,
                  proteina_g: 27,
                  carbos_g: 42,
                  grasas_g: 10
                }
              ]
            },
            {
              name: "Cena",
              hora: "21:30",
              kcal: 580,
              proteina_g: 52,
              carbos_g: 45,
              grasas_g: 21,
              ingredientes: "180g de carne magra al horno como colita de cuadril o paleta (1 porción mediana / palma y media), 180g de puré de papas casero con leche descremada (1 taza), ensalada de rúcula y zanahoria rallada (1 plato hondo), 10ml de aceite de oliva (1 cucharada sopera)",
              preparacion: "Asar la carne con especias. Preparar el puré pisando papas hervidas con un chorrito de leche tibia y sal marina.",
              sustituciones: "Carne vacuna por 180g de pata-muslo de pollo al horno.",
              nota_timing: "Cena reconfortante y completa.",
              variantes: [
                {
                  label: "Wok de pollo y fideos de arroz",
                  ingredientes: "160g de pollo en dados (1 taza), 120g de fideos cocidos (3/4 taza), vegetales mixtos salteados (cebolla, morrón, brócoli - 2 tazas), salsa de soja baja en sodio (1 cucharada sopera)",
                  kcal: 575,
                  proteina_g: 50,
                  carbos_g: 46,
                  grasas_g: 20
                }
              ]
            }
          ]
        },

        // ── VIERNES (Día de Entrenamiento: Piernas / Cadena Posterior) ──
        {
          dayLabel: "Viernes",
          esDiaEntreno: true,
          meals: [
            {
              name: "Desayuno",
              hora: "07:30",
              kcal: 465,
              proteina_g: 32,
              carbos_g: 59,
              grasas_g: 11,
              ingredientes: "60g de pan integral (2 tostadas medianas), 80g de queso ricota magra (2 cucharadas soperas colmadas), 1 huevo duro pisado (1 unidad), 1 vaso de leche descremada o café con leche (200ml), 1 pera mediana (1 unidad)",
              preparacion: "Mezclar la ricota con el huevo duro pisado y untar sobre las tostadas calientes. Acompañar con la pera y el café con leche.",
              sustituciones: "Ricota por 40g de queso cremoso magro derretido.",
              nota_timing: "Desayuno saciante previo a la sesión de entrenamiento.",
              variantes: [
                {
                  label: "Porridge de avena y manzana",
                  ingredientes: "70g de avena (3/4 taza colmada), 200ml de leche descremada (1 taza), 1 manzana rallada (1 unidad), 10g de manteca de maní (1 cucharada de postre)",
                  kcal: 460,
                  proteina_g: 30,
                  carbos_g: 61,
                  grasas_g: 11
                }
              ]
            },
            {
              name: "Almuerzo",
              hora: "13:00",
              kcal: 725,
              proteina_g: 54,
              carbos_g: 80,
              grasas_g: 19,
              ingredientes: "170g de pechuga de pollo a la plancha (1 bife grande), 220g de arroz integral cocido (1 taza y media), 150g de zapallitos salteados (1 taza colmada), 10ml de aceite de oliva (1 cucharada sopera)",
              preparacion: "Dorar el pollo con ajo en polvo y sal fina. Servir con el arroz integral tibio y los zapallitos aderezados.",
              sustituciones: "Arroz integral por 250g de papa al horno con piel en gajos.",
              nota_timing: "Recarga de glucógeno para finalizar la semana de fuerza.",
              variantes: [
                {
                  label: "Pastel de papa saludable",
                  ingredientes: "160g de carne picada magra con cebolla (1 taza de relleno), 220g de puré de papa (1 taza colmada), 1 huevo duro picado (1 unidad), ensalada de hojas verdes",
                  kcal: 715,
                  proteina_g: 52,
                  carbos_g: 78,
                  grasas_g: 20
                }
              ]
            },
            {
              name: "Merienda",
              hora: "17:30",
              kcal: 380,
              proteina_g: 28,
              carbos_g: 45,
              grasas_g: 9,
              ingredientes: "150g de yogur descremado (1 pote chico), 40g de avena instantánea (1/2 taza), 15g de pasas de uva o frutos secos (1 cucharada sopera colmada), 1 banana chica (1 unidad)",
              preparacion: "Colocar la avena en la base, verter el yogur y coronar con rodajas de banana y pasas.",
              sustituciones: "Pasas de uva por 1 cucharadita de miel.",
              nota_timing: "Colación de tarde ligera y energizante.",
              variantes: [
                {
                  label: "Sándwich integral de jamón cocido magro y queso",
                  ingredientes: "60g de pan integral (2 rebanadas), 40g de jamón cocido natural magro (2 fetas), 30g de queso port salut (1 feta gruesa), hojas de lechuga y tomate",
                  kcal: 375,
                  proteina_g: 27,
                  carbos_g: 43,
                  grasas_g: 10
                }
              ]
            },
            {
              name: "Cena",
              hora: "21:30",
              kcal: 580,
              proteina_g: 51,
              carbos_g: 46,
              grasas_g: 21,
              ingredientes: "180g de lomo de cerdo magro o carré (1 bife grande / palma y media), 200g de batata o calabaza asada (1 taza), ensalada mixta de tomate, repollo y zanahoria (1 plato playo), 10ml de aceite de oliva (1 cucharada sopera)",
              preparacion: "Cocinar el carré de cerdo a fuego medio para mantenerlo tierno. Servir con la calabaza caramelizada al horno.",
              sustituciones: "Cerdo por 180g de merluza a la plancha.",
              nota_timing: "Cena de viernes equilibrada para iniciar el fin de semana.",
              variantes: [
                {
                  label: "Tacos proteicos caseros",
                  ingredientes: "2 fajitas o tortillas integrales medianas (2 unidades), 160g de pollo desmechado (1 taza colmada), morrones y cebolla salteados (1 taza), salsa criolla",
                  kcal: 575,
                  proteina_g: 49,
                  carbos_g: 48,
                  grasas_g: 20
                }
              ]
            }
          ]
        },

        // ── SÁBADO (Día de Entrenamiento Corto o Actividad Libre) ──
        {
          dayLabel: "Sábado",
          esDiaEntreno: true,
          meals: [
            {
              name: "Desayuno",
              hora: "08:30",
              kcal: 480,
              proteina_g: 34,
              carbos_g: 58,
              grasas_g: 13,
              ingredientes: "3 huevos enteros (3 unidades), 60g de pan integral o de campo (2 tostadas medianas), 1 palta chica partida al medio: usar 40g (1/4 de palta / 2 cucharadas), 1 kiwi o naranja (1 unidad)",
              preparacion: "Tostar el pan, pisar la palta con unas gotas de limón y montar los huevos revueltos o a la plancha encima.",
              sustituciones: "Palta por 30g de queso untable descremado.",
              nota_timing: "Desayuno de fin de semana con mayor tiempo de preparación.",
              variantes: [
                {
                  label: "Bowl de avena proteico con fruta",
                  ingredientes: "80g de avena (1 taza al ras), 200ml de leche descremada (1 taza), 1 scoop de proteína (30g), 1 taza de frutillas frescas picadas",
                  kcal: 470,
                  proteina_g: 33,
                  carbos_g: 60,
                  grasas_g: 11
                }
              ]
            },
            {
              name: "Almuerzo",
              hora: "13:30",
              kcal: 710,
              proteina_g: 53,
              carbos_g: 78,
              grasas_g: 20,
              ingredientes: "180g de pechuga de pollo marinada al horno (1 bife grande), 220g de arroz primavera con arvejas y zanahorias cocido (1 taza y media), ensalada de rúcula y cherrys (1 plato hondo), 10ml de aceite de oliva (1 cucharada sopera)",
              preparacion: "Cocinar el arroz con arvejas y zanahorias en cubitos. Servir con la pechuga dorada y ensalada fresca.",
              sustituciones: "Pollo por 170g de bife de cuadril magro a la plancha.",
              nota_timing: "Almuerzo completo de sábado.",
              variantes: [
                {
                  label: "Hamburguesas caseras de carne magra",
                  ingredientes: "180g de carne picada magra hecha hamburguesa (2 medallones medianos), 1 pan de hamburguesa integral (1 unidad), 1 rodaja de tomate y lechuga, ensalada mixta de guarnición",
                  kcal: 700,
                  proteina_g: 51,
                  carbos_g: 75,
                  grasas_g: 21
                }
              ]
            },
            {
              name: "Merienda (Ronda de Mate)",
              hora: "18:00",
              kcal: 370,
              proteina_g: 26,
              carbos_g: 44,
              grasas_g: 10,
              ingredientes: "3 galletas de arroz grandes o 2 tostadas integrales (40g), 80g de queso blanco descremado o ricota (2 cucharadas soperas colmadas), 1 cucharadita de mermelada light (15g), mate amargo o con stevia a voluntad",
              preparacion: "Untar las galletas con queso blanco y mermelada. Cebar mate caliente sin azúcar agregada.",
              sustituciones: "Galletas de arroz por 40g de avena cocida en leche.",
              nota_timing: "Ritual del mate respetado dentro del balance calórico.",
              variantes: [
                {
                  label: "Yogur con manzana y nueces",
                  ingredientes: "150g de yogur natural (1 pote chico), 1 manzana en cubos (1 unidad), 15g de nueces (1 puñado chico / 4 mariposas), canela en polvo",
                  kcal: 360,
                  proteina_g: 25,
                  carbos_g: 42,
                  grasas_g: 11
                }
              ]
            },
            {
              name: "Cena",
              hora: "22:00",
              kcal: 590,
              proteina_g: 52,
              carbos_g: 50,
              grasas_g: 21,
              ingredientes: "2 porciones de pizza casera con masa fina integral y queso port salut descremado (140g de pizza / 2 porciones medianas), 1 pechuga de pollo chica desmechada como topping proteico (100g), ensalada verde de acompañamiento (1 plato playo colmado)",
              preparacion: "Armar pizza casera con masa fina. Sumar el pollo desmechado sobre la mozzarella o port salut para elevar el aporte proteico sin disparar grasas.",
              sustituciones: "Pizza por 1 tarta individual de verduras con masa de semillas y 2 huevos.",
              nota_timing: "Comida social adaptada sin culpa ni descontrol.",
              variantes: [
                {
                  label: "Brochettes de carne y vegetales",
                  ingredientes: "180g de lomo o nalga en cubos (1 taza y media), morrón, cebolla y tomates cherry en palitos de brochette (3 unidades), 1 choclo hervido mediano (1 unidad)",
                  kcal: 580,
                  proteina_g: 50,
                  carbos_g: 48,
                  grasas_g: 21
                }
              ]
            }
          ]
        },

        // ── DOMINGO (Día de Descanso / Comida Social / Asado Familiar) ──
        {
          dayLabel: "Domingo",
          esDiaEntreno: false,
          meals: [
            {
              name: "Desayuno",
              hora: "09:00",
              kcal: 410,
              proteina_g: 30,
              carbos_g: 45,
              grasas_g: 11,
              ingredientes: "2 huevos revueltos (2 unidades), 40g de pan de campo o integral (1 tostada grande), 1 manzana o banana (1 unidad mediana), infusión o mate con stevia",
              preparacion: "Tostar el pan y coronar con los huevos hechos con spray vegetal. Acompañar con la fruta fresca.",
              sustituciones: "Manzana por 1 mandarina o 1 naranja.",
              nota_timing: "Desayuno moderado previendo el almuerzo social de domingo.",
              variantes: [
                {
                  label: "Tazón de yogur con frutas",
                  ingredientes: "200g de yogur descremado (1 pote grande), 30g de avena (1/3 taza), 1 banana chica en rodajas (1 unidad), canela",
                  kcal: 400,
                  proteina_g: 28,
                  carbos_g: 46,
                  grasas_g: 10
                }
              ]
            },
            {
              name: "Almuerzo (Asado o Almuerzo Familiar)",
              hora: "13:30",
              kcal: 750,
              proteina_g: 58,
              carbos_g: 52,
              grasas_g: 32,
              ingredientes: "220g de carne asada eligiendo cortes magros como vacío sin grasa visible, colita de cuadril o pollo sin piel (1 porción generosa / tamaño mano abierta), 150g de ensalada rusa casera con papa, zanahoria y mayonesa moderada (1 taza), ensalada criolla de lechuga, tomate y cebolla a voluntad (1 plato hondo colmado)",
              preparacion: "Estrategia dominical: servirse primero una base abundante de ensalada fresca, luego la porción medida de ensalada rusa y priorizar el corte magro de carne retirando la grasa visible.",
              sustituciones: "Asado por pastas de domingo: 2 platos chicos de ravioles de verdura o ricota con salsa bolognesa magra.",
              nota_timing: "Estrategia de adherencia real: disfrutar el ritual del domingo comiendo con criterio.",
              variantes: [
                {
                  label: "Pastas caseras de domingo",
                  ingredientes: "200g de fideos secos cocidos (1 plato playo), 150g de salsa bolognesa casera con carne magra picada (3/4 taza), 15g de queso rallado (1 cucharada sopera colmada), ensalada verde",
                  kcal: 740,
                  proteina_g: 54,
                  carbos_g: 54,
                  grasas_g: 31
                }
              ]
            },
            {
              name: "Merienda (Mateada de Tarde)",
              hora: "18:00",
              kcal: 350,
              proteina_g: 25,
              carbos_g: 40,
              grasas_g: 9,
              ingredientes: "150g de yogur descremado (1 pote chico), 30g de avena o granola sin azúcar (1/3 taza), 1 rodaja de sandía o 1 fruta de estación (1 unidad mediana), mate amargo a voluntad",
              preparacion: "Verter la granola sobre el yogur. Servir con mate fresco.",
              sustituciones: "Yogur por 100g de ricota magra con gotas de vainilla y stevia.",
              nota_timing: "Digestión liviana tras el almuerzo de asado.",
              variantes: [
                {
                  label: "Tostadas con queso blanco",
                  ingredientes: "40g de pan integral (1 tostada y media), 60g de queso blanco descremado (2 cucharadas soperas), 1 manzana (1 unidad)",
                  kcal: 345,
                  proteina_g: 24,
                  carbos_g: 41,
                  grasas_g: 9
                }
              ]
            },
            {
              name: "Cena",
              hora: "21:30",
              kcal: 640,
              proteina_g: 52,
              carbos_g: 53,
              grasas_g: 24,
              ingredientes: "180g de pechuga de pollo o carne magra cocida (1 bife grande / palma y media), 200g de sopa casera de verduras o calabaza (1 tazón grande), 150g de papa hervida (1 unidad mediana), 10ml de aceite de oliva (1 cucharada sopera)",
              preparacion: "Cocinar el pollo a la plancha y servir con una sopa caliente reconfortante y la papa hervida.",
              sustituciones: "Pollo por 2 latas de atún al natural (160g escurridos).",
              nota_timing: "Cena depurativa y equilibrada para arrancar la semana siguiente con energía.",
              variantes: [
                {
                  label: "Omelette de claras y queso con ensalada",
                  ingredientes: "3 claras y 1 huevo entero (4 unidades), 40g de queso port salut (1 feta gruesa / 2 dedos), 1 tostada de pan integral (30g), vegetales hervidos a gusto (1 taza)",
                  kcal: 630,
                  proteina_g: 50,
                  carbos_g: 50,
                  grasas_g: 25
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  mealPrepGuide: [
    {
      preparacion: "Cocinar 600g de arroz integral y 500g de batata al horno en lote el domingo",
      rinde: "Guarniciones de carbohidratos para almuerzos y cenas de lunes a jueves",
      conservacion: "Heladera en recipientes herméticos de vidrio hasta 4 días"
    },
    {
      preparacion: "Hervir 8 huevos duros y guardarlos con cáscara",
      rinde: "Snacks proteicos rápidos y agregados a ensaladas de lunes a viernes",
      conservacion: "Heladera hasta 6 días con cáscara intacta"
    },
    {
      preparacion: "Marinar 1 kg de pechugas de pollo en filetes con limón, provenzal y pimentón",
      rinde: "Cocción al momento en 6 minutos de plancha para 4 comidas",
      conservacion: "Heladera hasta 3 días o freezer en bolsas individuales hasta 3 meses"
    }
  ],
  shoppingList: {
    carnes_y_huevos: [
      { item: "Pechuga de pollo", cantidad: "1.5 kg" },
      { item: "Carne vacuna magra (paleta, nalga o bola de lomo)", cantidad: "1 kg" },
      { item: "Filet de merluza fresca o congelada", cantidad: "800g" },
      { item: "Huevos de campo", cantidad: "2 docenas (24 unidades)" },
      { item: "Atún al natural en lata", cantidad: "3 latas (120g escurridos c/u)" }
    ],
    lacteos: [
      { item: "Leche descremada", cantidad: "2 litros" },
      { item: "Yogur descremado natural o griego", cantidad: "6 potes individuales" },
      { item: "Queso Port Salut descremado", cantidad: "400g" },
      { item: "Queso blanco descremado o ricota magra", cantidad: "500g" }
    ],
    verduleria: [
      { item: "Batatas", cantidad: "1.5 kg" },
      { item: "Papas", cantidad: "1.5 kg" },
      { item: "Calabaza o anco", cantidad: "1 unidad grande" },
      { item: "Bananas", cantidad: "1.5 kg (aprox. 8 unidades)" },
      { item: "Manzanas y peras", cantidad: "1 kg surtido" },
      { item: "Espinaca o acelga", cantidad: "2 paquetes" },
      { item: "Tomates redondos", cantidad: "1 kg" },
      { item: "Lechuga y rúcula", cantidad: "2 plantas" },
      { item: "Zapallitos verdes y morrones", cantidad: "1 kg surtido" },
      { item: "Paltas", cantidad: "2 unidades medianas" }
    ],
    almacen: [
      { item: "Avena tradicional o arrollada", cantidad: "1 kg" },
      { item: "Arroz integral o yamaní", cantidad: "1 kg" },
      { item: "Fideos secos integrales", cantidad: "500g" },
      { item: "Pan integral de molde o masa madre", cantidad: "1 paquete grande (500g)" },
      { item: "Manteca de maní 100% natural sin azúcar", cantidad: "1 frasco (350g)" },
      { item: "Frutos secos (nueces o maní tostado sin sal)", cantidad: "250g" },
      { item: "Semillas de chía o girasol", cantidad: "150g" }
    ],
    aceites_y_condimentos: [
      { item: "Aceite de oliva virgen extra", cantidad: "1 botella (500ml)" },
      { item: "Orégano, provenzal y pimentón dulce", cantidad: "1 sobre de cada uno" },
      { item: "Stevia líquida o en polvo", cantidad: "1 frasco" }
    ]
  },
  notas_semana: [
    "Todas las comidas indican gramos exactos y su porción relativa aproximada (tazas, cucharadas, unidades) para que puedas seguir el plan tanto si pesás la comida como si usás vajilla cotidiana.",
    "Bebé un vaso de agua al despertar y asegurá 2.5 a 3 litros a lo largo del día. El mate no reemplaza el agua pura pero es un excelente compañero sin azúcar.",
    "El domingo en el asado o reunión familiar, llená la mitad del plato con ensalada fresca antes de servirte la carne y la ensalada rusa para controlar porciones de forma natural."
  ]
};

export default SAMPLE_NUTRITION_PLAN;
