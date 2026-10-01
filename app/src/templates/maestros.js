// Catálogo de templates de pantalla de Maestros (Figma: Pharo Design System,
// páginas "Templates" y "Maestros", actualizadas el 30/09/2026). Es la fuente
// única para ELEGIR un template al crear una pantalla nueva: cada entrada
// dice qué es, cuándo usarlo y cuándo no, y qué estructura de datos espera.
// Los datos de cada pantalla se cargan por props en `LayoutMaestroFormulario`
// (M-01…M-04) o en `LayoutMaestroDataGrid` (Listado).
//
// Numeración (Figma, frames "M-0x · … - Spec"): M-01 Formulario simple, M-02
// Formulario por secciones, M-03 Formulario con tabs, M-04 Formulario
// compuesto (a/b/c). El Listado se nombra "Listado" en las specs ("→ usar
// Listado"), pero el frame de la página Templates se llama "M-01 · Listado",
// que choca con "M-01 · Formulario simple" de la página Maestros.
// ⚠️ Pendiente de resolver en Figma; acá se usa `Listado` sin número para no
// duplicar el id M-01.
//
// `cuandoUsar`/`cuandoNoUsar`/`reglas` replican las specs de Figma. Los
// textos marcados [Supuesto — validar] allá siguen siendo supuestos.
export const MAESTRO_TEMPLATES = {
  Listado: {
    id: 'Listado',
    nombre: 'Listado',
    template: 'LayoutMaestroDataGrid',
    resumen: 'Listado/búsqueda de registros de un maestro (DataGrid).',
    estructura: 'PageHeader(maestro) + Data Grid (con buscador)',
  },
  'M-01': {
    id: 'M-01',
    nombre: 'Formulario simple',
    template: 'LayoutMaestroFormulario',
    resumen: 'Un solo grupo de pocos campos. Ej.: Depósitos, Envases.',
    estructura: 'PageHeader(form) + 1 Form Section (+ Accordion colapsado al final, opcional)',
    usa: { blocks: 'una sola Form Section; opcionalmente 1–2 Accordion al final', tabs: false },
    cuandoUsar: [
      'Maestro con un solo grupo de pocos campos, como Depósitos o Envases.',
      'Todos los campos son necesarios para guardar y caben en una sola pantalla, sin scroll.',
      'Sin colecciones hijas ni datos opcionales que justifiquen tabs o más secciones.',
      'Como destino de Crear, Editar y Visualizar desde el listado del maestro.',
    ],
    cuandoNoUsar: [
      'Varios grupos de datos del mismo contexto → M-02.',
      'Grupos que no pertenecen al mismo contexto o se completan por separado (como Buques) → M-03.',
      'Colecciones hijas (contactos, direcciones) → M-04.',
      'Accordion con información obligatoria: los campos obligatorios van siempre en la Form Section. Los datos opcionales pueden ir en un Accordion colapsado al final (ver M-02, sección 03).',
      'Listar o buscar registros → Listado.',
      'Edición rápida o confirmación → Modal o Drawer.',
    ],
  },
  'M-02': {
    id: 'M-02',
    nombre: 'Formulario por secciones',
    template: 'LayoutMaestroFormulario',
    resumen: 'Varios grupos de datos del mismo contexto, sin límite de campos. Ej.: Clientes, Productos.',
    estructura: 'PageHeader(form) + N Form Section apiladas (+ Accordion colapsado al final, opcional)',
    usa: { blocks: 'varias Form Section; opcionalmente 1–2 Accordion colapsados al final', tabs: false },
    cuandoUsar: [
      'Maestro con varios grupos de datos del mismo contexto, sin límite de campos, como Clientes o Productos.',
      'Conviene ver todo de una vez, scrolleando, sin cambiar de tab.',
      'Cada grupo tiene un título claro y se resuelve con una Form Section.',
      'Hay un bloque claramente secundario (datos opcionales): va al final como Accordion colapsado.',
      'Como destino de Crear, Editar y Visualizar desde el listado del maestro.',
    ],
    cuandoNoUsar: [
      'Un solo grupo de pocos campos → M-01.',
      'Grupos que no pertenecen al mismo contexto o se completan por separado → M-03.',
      'Colecciones hijas → M-04.',
      'Datos opcionales en una Form Section (siempre va expandida) → usar un Accordion colapsado.',
      'Listar o buscar registros → Listado.',
    ],
    // Sección 03 de la spec: "Uso del Accordion". Vale para TODOS los
    // templates de Maestros (M-01 a M-04), no solo M-02.
    reglas: [
      'Tabs vs Accordion: las tabs son para grupos de peso parecido que se completan por separado; el Accordion es para un bloque claramente secundario.',
      'Se puede usar en todos los templates de Maestros (M-01 a M-04), siempre que no contenga información obligatoria: datos opcionales o poco usados que se pueden dejar sin completar.',
      'Va al final de la pantalla, colapsado por defecto, con un título que indique que es opcional (ej. "Datos adicionales (opcional)").',
      'Máximo uno o dos por pantalla; con más grupos de peso parecido → M-03. [Supuesto — validar]',
      'Nunca para campos obligatorios ni anidado. Si hay un error adentro, se abre solo con un indicador. [Supuesto — validar]',
    ],
  },
  'M-03': {
    id: 'M-03',
    nombre: 'Formulario con tabs',
    template: 'LayoutMaestroFormulario',
    resumen: 'Grupos de datos de distinto contexto que se completan por separado, sin importar la cantidad de campos. Ej.: Buques.',
    estructura: 'PageHeader(form) + Tabs + una Form Section por tab (+ Accordion colapsado al final, opcional)',
    usa: { blocks: 'solo Accordion opcional al final', tabs: 'mínimo 2, una Form Section por tab' },
    cuandoUsar: [
      'Maestro con grupos de datos de distinto contexto que se completan por separado, como Buques, sin importar la cantidad de campos.',
      'Primera tab General y otras tabs con grupos de peso parecido (incluso un grupo grande de datos opcionales).',
      'Quien completa no necesita ver todos los grupos a la vez.',
      'Como destino de Crear, Editar y Visualizar desde el listado del maestro.',
    ],
    cuandoNoUsar: [
      'Todos los datos del mismo contexto, aunque sean muchos campos → M-02.',
      'Un solo grupo, pocos campos → M-01.',
      'Colecciones hijas o una identificación que debe verse siempre → M-04.',
      'Una sola tab → M-01 o M-02. Un bloque secundario opcional no necesita tabs: va como Accordion colapsado al final (ver M-02, sección 03).',
      'Listar o buscar registros → Listado.',
    ],
  },
  'M-04a': {
    id: 'M-04a',
    nombre: 'Formulario compuesto · Cabecera + grilla',
    template: 'LayoutMaestroFormulario',
    resumen: 'Maestro con una sola colección hija (sin tabs).',
    estructura: 'PageHeader(form) + Form Section(s) + Child Grid Section al final',
    usa: { blocks: 'Form Section(s) y Child Grid Section al final', tabs: false },
  },
  'M-04b': {
    id: 'M-04b',
    nombre: 'Formulario compuesto · Cabecera + tabs de formularios',
    template: 'LayoutMaestroFormulario',
    resumen: 'Cabecera fija (identificación) + tabs cuyo contenido son formularios.',
    estructura: 'PageHeader(form) + Form Section(s) fijas + Tabs + Form Section(s) por tab',
    usa: { blocks: 'Form Section(s) de cabecera (siempre visibles)', tabs: 'mínimo 2, con Form Section' },
  },
  'M-04c': {
    id: 'M-04c',
    nombre: 'Formulario compuesto · Cabecera + tabs con grilla',
    template: 'LayoutMaestroFormulario',
    resumen: 'Cabecera fija + una tab por colección hija (dos o más colecciones).',
    estructura: 'PageHeader(form) + Form Section(s) fijas + Tabs + Child Grid Section por tab',
    usa: { blocks: 'Form Section(s) de cabecera (siempre visibles)', tabs: 'mínimo 2, con Child Grid Section' },
  },
};

// M-04 (a/b/c) comparten una sola spec ("M-04 · Formulario compuesto - Spec",
// patrón de composición, no un template único). Se comparten también sus
// cuándo usar / no usar y sus reglas, acá abajo.
export const MAESTRO_COMPUESTO_SPEC = {
  cuandoUsar: [
    'Maestro con colecciones hijas, como los contactos o las direcciones de un cliente. [Supuesto — validar] los ejemplos.',
    'Hay datos de identificación que deben verse siempre mientras el usuario navega por las tabs.',
    'La pantalla combina formularios, tabs y grillas en cantidades distintas y no entra en M-01, M-02 ni M-03.',
    'Como destino de Crear, Editar y Visualizar desde el listado del maestro.',
  ],
  cuandoNoUsar: [
    'Sin grilla hija ni cabecera fija → M-01, M-02 o M-03.',
    'Tabs dentro de tabs o más de una Tabs por pantalla → dividir en otro maestro o usar un Drawer.',
    'Accordion para esconder campos obligatorios ni la grilla hija: deben verse siempre.',
    'Editar filas hijas dentro de la grilla → Drawer o Modal.',
    'Listar o buscar registros → Listado.',
  ],
  // Sección 03 "Reglas de composición".
  reglas: [
    'Las piezas se apilan de arriba hacia abajo, todas a 960 px de ancho y con 16 px entre sí.',
    'Lo que está arriba de las Tabs es la cabecera y siempre se ve: ahí va la identificación del registro (código, denominación).',
    'Máximo una Tabs por pantalla, y nunca tabs dentro de tabs.',
    'Dentro de cada tab se apilan Form Section y/o Child Grid Section.',
    'Sin tabs: las Form Section van primero y la Child Grid Section al final.',
    'Con una sola colección hija no hacen falta tabs; con dos o más, una tab por colección. [Supuesto — validar] el orden y este límite.',
    'Un bloque opcional y secundario (sin información obligatoria) va como Accordion colapsado al final de la pantalla (ver M-02, sección 03), nunca en lugar de una tab. [Supuesto — validar]',
  ],
};

export const MAESTRO_TEMPLATE_IDS = Object.keys(MAESTRO_TEMPLATES);
