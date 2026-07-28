// src/data/servicios.ts

export interface ServicioDetalle {
  id: string
  nombre: string
  slug: string
  categoria: string
  badge: string
  descripcion_corta: string
  descripcion_larga: string
  opciones?: string[]
  incluye: string[]
  beneficios: string[]
  icono: string
  destacado?: boolean
  orden: number
}

export const SERVICIOS_CATALOGO: ServicioDetalle[] = [
  {
    id: 'entrenamiento-personalizado',
    nombre: 'Entrenamiento Personalizado',
    slug: 'entrenamiento-personalizado',
    categoria: 'entrenamiento',
    badge: 'Individual · Parejas · Grupos Reducidos',
    descripcion_corta: 'Programas de entrenamiento 100% a medida. Modalidad individual (1 a 1), en pareja o grupos reducidos con atención constante y técnica impecable.',
    descripcion_larga: 'Diseñamos un plan de entrenamiento totalmente individualizado según tu punto de partida, patologías previas y objetivos específicos (ganancia muscular, pérdida de grasa, fuerza o salud general). Disponible en formato presencial individual, entrenamientos en pareja o en pequeños grupos.',
    opciones: ['1 a 1 (Individual)', 'En Pareja', 'Grupos Reducidos (máx. 4-5 personas)'],
    incluye: [
      'Valoración inicial de condición física y movilidad',
      'Planificación semanal adaptada a tu agenda',
      'Corrección biomecánica y supervisión continua',
      'Acceso al Portal Cliente R3 para seguimiento de cargas'
    ],
    beneficios: [
      'Máxima seguridad y prevención de lesiones',
      'Optimización del tiempo de entrenamiento',
      'Resultados medibles y progreso constante'
    ],
    icono: 'Dumbbell',
    destacado: true,
    orden: 1
  },
  {
    id: 'fisioterapia',
    nombre: 'Fisioterapia',
    slug: 'fisioterapia',
    categoria: 'fisioterapia',
    badge: 'Tratamiento Clínico · Terapia Manual · Dolor',
    descripcion_corta: 'Diagnóstico clínico, terapia manual y tratamiento avanzado para la recuperación de lesiones, alivio del dolor y optimización articular.',
    descripcion_larga: 'Abordamos el dolor muscular y articular desde la causa raíz. Tratamos problemas de columna, sobrecargas, tendinopatías y molestias crónicas mediante fisioterapia manual, punción seca, neurodinamia y terapia miofascial.',
    incluye: [
      'Evaluación clínica inicial y anamnesis completa',
      'Terapia manual, masaje terapéutico y punción seca',
      'Reeducación postural y pauta de ejercicios para casa',
      'Coordinación directa con tu entrenador R3'
    ],
    beneficios: [
      'Alivio rápido del dolor agudo y crónico',
      'Recuperación de la movilidad articular',
      'Prevención de recaídas'
    ],
    icono: 'Activity',
    destacado: true,
    orden: 2
  },
  {
    id: 'readaptacion-lesiones',
    nombre: 'Readaptación de Lesiones y Deportiva',
    slug: 'readaptacion-lesiones',
    categoria: 'readaptacion',
    badge: 'Lesiones · Columna · Vuelta al Deporte',
    descripcion_corta: 'El puente clave entre la fisioterapia y la actividad física. Especialistas en dolor de espalda, recuperación de rodilla, hombro y estados post-quirúrgicos.',
    descripcion_larga: 'Proceso guiado de readaptación funcional para volver a moverte sin dolor y recuperar la confianza en tu cuerpo. Especialmente diseñado para patologías de columna (hernias, lumbalgias), ligamentos, meniscos, hombro o tras intervenciones quirúrgicas.',
    incluye: [
      'Protocolo Return-to-Play y vuelta a la vida activa',
      'Fortalecimiento progresivo de la zona afectada',
      'Control motor y estabilidad neuromuscular',
      'Test biomecánicos de control de carga'
    ],
    beneficios: [
      'Vuelta segura a tu deporte o rutina diaria',
      'Eliminación del miedo a volver a lesionarte',
      'Refuerzo de eslabones débiles'
    ],
    icono: 'ShieldCheck',
    destacado: true,
    orden: 3
  },
  {
    id: 'nutricion',
    nombre: 'Nutrición Deportiva y Clínica',
    slug: 'nutricion',
    categoria: 'nutricion',
    badge: 'Composición Corporal · Salud · Rendimiento',
    descripcion_corta: 'Planes de alimentación adaptados a tu estilo de vida, digestión y metas. Educación nutricional flexible sin dietas restrictivas.',
    descripcion_larga: 'La nutrición es la gasolina de tu rendimiento y salud. Creamos pautas nutricionales personalizadas para mejora de composición corporal (pérdida de grasa, ganancia muscular), salud digestiva y rendimiento deportivo.',
    incluye: [
      'Estudio de composición corporal por bioimpedancia',
      'Plan nutricional flexible adaptado a tus gustos y horarios',
      'Recetarios y lista de la compra práctica',
      'Ajustes quincenales y soporte de dudas'
    ],
    beneficios: [
      'Mejora de la energía diaria y digestión',
      'Recomposición corporal sostenible',
      'Mayor rendimiento en tus entrenamientos'
    ],
    icono: 'Apple',
    destacado: true,
    orden: 4
  },
  {
    id: 'antiaging',
    nombre: 'Antiaging y Salud Celular',
    slug: 'antiaging',
    categoria: 'antiaging',
    badge: 'Longevidad Activa · Masa Muscular · Vitalidad',
    descripcion_corta: 'Protocolos de envejecimiento saludable para preservar tu masa muscular, densidad ósea, energía diaria y salud cognitiva.',
    descripcion_larga: 'El entrenamiento y los hábitos correctos son la mejor herramienta de medicina preventiva. Diseñamos programas enfocados en frenar la sarcopenia, fortalecer la densidad ósea y maximizar la vitalidad biológica a cualquier edad.',
    incluye: [
      'Entrenamiento de fuerza enfocado en masa magra y densidad ósea',
      'Optimización de ritmos circadianos y calidad del descanso',
      'Estrategias para la salud cardiovascular y mitocondrial',
      'Seguimiento de marcadores de salud y vitalidad'
    ],
    beneficios: [
      'Preservación de la independencia física y agilidad',
      'Prevención del deterioro metabólico',
      'Mayor vitalidad y calidad de vida'
    ],
    icono: 'Sparkles',
    orden: 5
  },
  {
    id: 'salud-mujer',
    nombre: 'Salud de la Mujer',
    slug: 'salud-mujer',
    categoria: 'mujer',
    badge: 'Embarazo · Postparto · Suelo Pélvico',
    descripcion_corta: 'Cuidado especializado en cada etapa de la mujer: preparación al parto, recuperación de suelo pélvico, diástasis y patologías ginecológicas propias.',
    descripcion_larga: 'Atención multidisciplinar enfocada en la salud femenina. Acompañamos durante el embarazo de forma segura, adaptamos la recuperación postparto (diástasis, suelo pélvico) y diseñamos planes específicos para menopausia, endometriosis o síndrome de ovario poliquístico.',
    opciones: ['Embarazo Activo', 'Recuperación Postparto', 'Suelo Pélvico & Core', 'Salud Hormonal & Menopausia'],
    incluye: [
      'Valoración especializada de suelo pélvico y abdomen',
      'Entrenamiento adaptado a cada trimestre de embarazo',
      'Reeducación abdominal y ejercicios hipopresivos',
      'Tratamiento de molestias pélvicas y lumbares'
    ],
    beneficios: [
      'Parto y postparto con mayor seguridad y rápida recuperación',
      'Prevención y solución de incontinencia o prolapsos',
      'Bienestar hormonal y físico integral'
    ],
    icono: 'HeartHandshake',
    destacado: true,
    orden: 6
  },
  {
    id: 'servicios-empresas',
    nombre: 'Programas para Empresas (Corporate Wellness)',
    slug: 'servicios-empresas',
    categoria: 'empresas',
    badge: 'Salud Laboral · Ergonomía · Bienestar',
    descripcion_corta: 'Soluciones de salud y bienestar corporativo para cuidar la salud de tu equipo, reducir el absentismo laboral y potenciar el ambiente de trabajo.',
    descripcion_larga: 'Mejoramos la salud de los empleados mediante talleres de ergonomía, entrenamiento en grupo para empresas, pausas activas para la espalda y valoraciones de salud física para directivos y plantillas.',
    opciones: ['Entrenamiento Corporativo en Grupo', 'Talleres de Ergonomía & Salud Espalda', 'Valoraciones de Salud Ejecutiva'],
    incluye: [
      'Diagnóstico inicial de salud laboral en la plantilla',
      'Sesiones de entrenamiento postural y movilidad en oficina o centro',
      'Talleres de manejo del estrés y nutrición laboral',
      'Informes periódicos de impacto y adherencia del equipo'
    ],
    beneficios: [
      'Reducción drástica del absentismo por dolor de espalda',
      'Aumento de la productividad y motivación del equipo',
      'Diferenciación como empresa saludable y atractiva'
    ],
    icono: 'Building2',
    orden: 7
  },
  {
    id: 'valoraciones-funcionales',
    nombre: 'Valoraciones Funcionales',
    slug: 'valoraciones-funcionales',
    categoria: 'valoraciones',
    badge: 'Biomecánica · Test de Fuerza · Movilidad',
    descripcion_corta: 'Evaluación científica completa de tus patrones de movimiento, desequilibrios musculares, rango articular e índices de fuerza.',
    descripcion_larga: 'Antes de entrenar, debemos saber cómo se mueve tu cuerpo. Realizamos un estudio exhaustivo con pruebas biomecánicas, tests de movilidad articular (FMS), análisis de asimetrías de fuerza y rango de movimiento.',
    incluye: [
      'Test de movilidad articular y patrones de movimiento FMS',
      'Análisis de desequilibrios y asimetrías musculares',
      'Medición de fuerza máxima y dinamometría',
      'Informe técnico detallado con recomendaciones de partida'
    ],
    beneficios: [
      'Detección precoz de factores de riesgo de lesión',
      'Base científica para una programación de entrenamiento exacta',
      'Comparativa periódica para medir mejoras reales'
    ],
    icono: 'ClipboardCheck',
    orden: 8
  },
  {
    id: 'entrenamiento-online',
    nombre: 'Entrenamiento Online',
    slug: 'entrenamiento-online',
    categoria: 'online',
    badge: '100% Flexible · App R3 · Asesoramiento Continuo',
    descripcion_corta: 'Disfruta de la metodología R3 desde cualquier lugar del mundo. Programación a medida en el portal cliente con vídeos demostrativos y feedback diario.',
    descripcion_larga: 'La distancia o la falta de tiempo ya no son un obstáculo. Recibe tu plan semanal en la app R3 con vídeos explicativos paso a paso de cada ejercicio, corrección de técnica por vídeo y contacto directo con tu entrenador.',
    incluye: [
      'Acceso privado al Portal Cliente R3',
      'Planificación semanal adaptada a tu gimnasio o casa',
      'Revisión y corrección de vídeo de técnica de ejercicios',
      'Resolución de dudas por WhatsApp / Chat'
    ],
    beneficios: [
      'Libertad total de horarios y ubicación',
      'Flexibilidad absoluta sin perder rigor profesional',
      'Misma metodología y control de cargas'
    ],
    icono: 'Smartphone',
    orden: 9
  },
  {
    id: 'biohacking',
    nombre: 'Biohacking y Recuperación Avanzada',
    slug: 'biohacking',
    categoria: 'biohacking',
    badge: 'Terapia Térmica · Enfoque · Optimización',
    descripcion_corta: 'Estrategias de optimización fisiológica basadas en evidencia para acelerar la recuperación muscular, gestionar el estrés y maximizar el rendimiento mental.',
    descripcion_larga: 'Combinamos ciencia aplicada y protocolos de recuperación avanzada (contraste térmico, fotobiomodulación, variabilidad de la frecuencia cardíaca HRV y gestión del descanso) para optimizar la regeneración física y nerviosa.',
    incluye: [
      'Protocolos de recuperación rápida post-esfuerzo',
      'Optimización de la variabilidad del ritmo cardíaco (HRV)',
      'Estrategias de regulación del sistema nervioso autónomo',
      'Asesoramiento en suplementación clínica basada en evidencia'
    ],
    beneficios: [
      'Reducción de fatiga central y agujetas',
      'Mejor descanso profundo y rendimiento intelectual',
      'Mayor capacidad de adaptación al esfuerzo'
    ],
    icono: 'Cpu',
    orden: 10
  },
  {
    id: 'preparacion-fisica',
    nombre: 'Preparación Física Deportiva y Oposiciones',
    slug: 'preparacion-fisica',
    categoria: 'preparacion',
    badge: 'Alto Rendimiento · Potencia · Oposiciones',
    descripcion_corta: 'Programación avanzada para atletas de competición, deportistas amateurs y preparación específica de pruebas físicas de oposiciones (Policía, Bomberos).',
    descripcion_larga: 'Optimización de las capacidades físicas específicas del deporte (fuerza máxima, velocidad, aceleración, potencia y resistencia). Preparación especializada para aspirantes a cuerpos de seguridad (Policía Nacional, Guardia Civil, Bomberos).',
    opciones: ['Deportes de Equipo / Individuales', 'Oposiciones (Policía, Bomberos, ERE)', 'Atletas Amateurs de Alto Nivel'],
    incluye: [
      'Periodización por picos de forma para pruebas o carreras',
      'Test periódicos de velocidad, salto y potencia (VBT)',
      'Simulacros de pruebas de oposición',
      'Planificación coordinada de fuerza y acondicionamiento'
    ],
    beneficios: [
      'Superación garantizada de marcas en oposiciones',
      'Mejor rendimiento específico en tu deporte',
      'Menor riesgo de lesión en periodos de máxima exigencia'
    ],
    icono: 'Trophy',
    orden: 11
  }
]
