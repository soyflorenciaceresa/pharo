from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

OUT = "/Users/florenciaceresa/Documents/pharo-prototyping-kit/docs/auditoria-ux-crear-buque-v2.pdf"

H = ["Nº", "Área", "Problema detectado", "Impacto en el usuario", "Severidad", "Mejora puntual sugerida"]
ROWS = [
 ["1", "8. Accesibilidad", "Los bordes de inputs y checkbox (#e3e5ea sobre blanco) tienen contraste 1.26:1. El placeholder tiene 2.03:1. WCAG 1.4.11 pide 3:1 para los límites de un control.", "Los campos casi no se distinguen del fondo.", "Alta", "Oscurecer el borde de controles de formulario a 3:1 o más con un token propio de input. Subir el contraste del placeholder."],
 ["2", "4. Validaciones / unidades", "Eslora, Manga, Puntal, Calado, TBT, TPC y Lastre no muestran unidad. VRN, TRN y TBT son siglas sin explicación.", "Riesgo de cargar valores en la unidad equivocada en un maestro que alimenta cálculos operativos.", "Crítica", "Agregar sufijo de unidad (m, t, t/cm) y helperText o tooltip con el nombre completo de las siglas."],
 ["3", "3. Obligatorios", "Ningún label marca obligatorio. Solo Código y Denominación se validan, y recién al guardar. Solo el acordeón dice \"(opcional)\". No hay required ni aria-required.", "El operador descubre las reglas por prueba y error.", "Alta", "Marcador * y leyenda \"* obligatorio\" en TextField. Setear aria-required."],
 ["4", "4. Mensajes de error", "Al guardar con errores el foco queda en el botón Guardar. No hay role=\"alert\" ni aria-live, ni scroll o foco al primer error. El mensaje es genérico: \"Campo requerido\".", "Con lector de pantalla el error pasa inadvertido. Con campos fuera de vista el usuario no sabe qué falló.", "Alta", "Mover el foco al primer campo con error. Anunciar con aria-live. Microcopy específico: \"Ingresá el código del buque\"."],
 ["5", "4. Validaciones", "Los numéricos son type=\"text\" con inputMode: aceptan letras. IMO no tiene formato ni longitud. No hay rangos (Año de construcción acepta 4 dígitos cualesquiera). Duplicados: no evaluable.", "Datos sucios en el maestro y error descubierto tarde.", "Alta", "Validar al salir del campo: IMO de 7 dígitos, numéricos con rango, año con rango razonable."],
 ["6", "7. Eficiencia", "Tipo, Bandera y Naviera son dos campos de texto libre (código + denominación) sin búsqueda ni autocompletado. El propio código lo reconoce como pendiente.", "Se tipea todo a mano. Riesgo de inconsistencia con el catálogo.", "Alta", "Autocompletar la denominación cuando el código existe en el catálogo. Un select con búsqueda sería lo ideal."],
 ["7", "6. Acciones", "Guardar y Cancelar están solo en el header y no son sticky. La página mide ~1100px. Cancelar navega sin avisar si hay cambios. Guardar no tiene estado de carga (doble clic posible). Enter no guarda (a verificar).", "Fricción en cada alta y riesgo de perder lo cargado.", "Alta", "Header o barra de acciones sticky. Confirmar al cancelar con cambios. Deshabilitar Guardar mientras guarda."],
 ["8", "5. Estados", "TextField no tiene hover ni estado de éxito. El foco solo engrosa el borde de 1px a 2px (contraste 3.64:1, sin outline). El error cambia solo el color del borde.", "Poca retroalimentación visual. El skill marca como anti-patrón reemplazar el anillo de foco por un cambio sutil.", "Media", "Agregar hover. Reforzar el anillo de foco. Sumar ícono de error junto al mensaje."],
 ["9", "2. Microcopy", "Los 20+ inputs muestran \"Placeholder text\" (default de TextField). En los lookups, \"Código\" y \"Denominación\" son solo placeholders: al tipear desaparecen y queda solo el label del grupo.", "Ruido sin significado. Anti-patrón: placeholder haciendo de label.", "Media", "placeholder vacío por defecto, o ejemplos reales (\"Ej.: 9811000\"). Mostrar sublabels visibles en los lookups."],
 ["10", "10. Consistencia / DS", "El foco del Checkbox usa --sidebar-accent (#448eff, token del sidebar). Button, Accordion y TextField usan --color-border-focus (#667afd).", "Dos colores de foco distintos en una misma pantalla.", "Media", "Unificar el foco de formulario en --color-border-focus."],
 ["11", "9. Responsive", "FormRow es una grilla fija de 3 columnas, sin media queries. Los lookups meten 2 inputs en 1/3 del ancho. A ~800px \"Código\" queda apretado (~65px). Mobile: no evaluado.", "En ventana angosta los lookups casi no se pueden usar.", "Media", "Colapsar a 2 y luego 1 columna en FormRow. Apilar código y denominación en el lookup."],
 ["12", "1. Jerarquía", "\"Datos adicionales (opcional)\" esconde Calado de entrada y salida, que en operación portuaria suele ser dato clave. El grupo \"Tonelaje y capacidad\" está marcado en el código como \"inferido… validar\".", "Datos relevantes pasan inadvertidos. Agrupación sin respaldo de diseño.", "Media", "Validar con negocio si Calado debe ir visible. Confirmar la agrupación con diseño."],
 ["13", "8. Accesibilidad", "Los botones del header miden 33px y los inputs 38px (el checkbox es de 20px, pero su label es clickeable). Cumple WCAG 2.2 AA (mínimo 24px), pero queda bajo los 44px que el skill pide.", "Para uso táctil o en pantallas de campo sería justo. En desktop no es bloqueante.", "Baja", "Ampliar el área clickeable del checkbox. Evaluar 40–44px si hay uso táctil."],
 ["14", "1. Agrupación", "Filas huérfanas: Coeficiente solo en su fila; TPC y Lastre en 2 de 3 columnas.", "Espacios vacíos irregulares que dificultan el barrido visual.", "Baja", "Reordenar campos dentro de cada grupo para completar filas, sin cambiar los grupos."],
 ["15", "10. Consistencia", "LookupField replica a mano el CSS del label de TextField. Los labels son de 12px con line-height 1.2.", "Desfase si el label del DS cambia.", "Baja", "Reusar el estilo compartido del label."],
 ["16", "2. Checkbox", "\"Inactivo\" aparece en el alta, donde casi nunca se usa, sin texto de ayuda.", "Pregunta innecesaria en el flujo más común.", "Baja", "Agregar helperText (\"No aparecerá en listados activos\") o menor peso visual."],
]
SEV = {"Crítica": "#991b1b", "Alta": "#dc2626", "Media": "#d97706", "Baja": "#6a7883"}

TOP5 = [
 "Unidades y siglas (#2): cambio de label o sufijo que evita errores de datos costosos.",
 "Marcador de obligatorio + aria-required (#3): cambio pequeño en TextField que sirve a todo el kit.",
 "Foco al primer error + aria-live + microcopy específico (#4): esfuerzo bajo, gran mejora de accesibilidad.",
 "Contraste de bordes y placeholder (#1): ajuste de token que se propaga a todo el sistema; validar antes con diseño.",
 "Header sticky + confirmación al cancelar con cambios (#7): se nota en cada alta.",
]
GOOD = [
 "Agrupación por secciones con títulos nítidos y lo opcional en un acordeón colapsado (progressive disclosure).",
 "Error junto al campo, que se limpia al tipear.",
 "Labels visibles y asociados (label htmlFor); lookups con role=\"group\" y aria-label que incluye el texto visible.",
 "Jerarquía de acciones correcta: Guardar primario, Cancelar secundario, ambos con ícono.",
 "Teclados móviles adecuados (inputMode decimal y numérico).",
 "Anillo de foco visible en botones y acordeón.",
 "Uso de tokens y del template M-02, sin hex crudos en la pantalla.",
 "Transiciones que respetan prefers-reduced-motion.",
]

base = ParagraphStyle("b", fontName="Helvetica", fontSize=8, leading=10.2, textColor=colors.HexColor("#061e30"))
hdr = ParagraphStyle("h", parent=base, fontName="Helvetica-Bold", textColor=colors.white)
title = ParagraphStyle("t", parent=base, fontName="Helvetica-Bold", fontSize=18, leading=22)
h2 = ParagraphStyle("h2", parent=base, fontName="Helvetica-Bold", fontSize=12, leading=15, spaceBefore=12, spaceAfter=5)
body = ParagraphStyle("p", parent=base, fontSize=9, leading=12)
small = ParagraphStyle("s", parent=base, fontSize=8, leading=10.5, textColor=colors.HexColor("#6a7883"))

def P(t, s=base):
    return Paragraph(t, s)

def sev(s):
    return Paragraph(f'<font color="{SEV[s]}"><b>{s}</b></font>', base)

data = [[P(h, hdr) for h in H]]
for r in ROWS:
    data.append([P(r[0]), P(r[1]), P(r[2]), P(r[3]), sev(r[4]), P(r[5])])

W = landscape(A4)[0] - 24 * mm
cw = [9*mm, 24*mm, 80*mm, 52*mm, 17*mm, W - (9+24+80+52+17)*mm]
t = Table(data, colWidths=cw, repeatRows=1)
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4059fd")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#c9ced6")),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f6f7f9")]),
    ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
]))

def footer(c, d):
    c.saveState()
    c.setFont("Helvetica", 7.5)
    c.setFillColor(colors.HexColor("#6a7883"))
    c.drawString(12 * mm, 8 * mm, "Pharo · Ports · Auditoría UX/UI de Crear Buque")
    c.drawRightString(landscape(A4)[0] - 12 * mm, 8 * mm, f"Página {d.page}")
    c.restoreState()

doc = SimpleDocTemplate(OUT, pagesize=landscape(A4), leftMargin=12*mm, rightMargin=12*mm, topMargin=12*mm, bottomMargin=14*mm,
                        title="Auditoría UX/UI - Crear Buque (Ports)", author="Claude")
s = [
    P("Auditoría UX/UI: Crear Buque (módulo Ports, app Pharo)", title),
    Spacer(1, 3),
    P("Plataforma: web desktop · Pantalla revisada: /buques/nuevo (BuqueFormulario) · Solo detección de mejoras, sin rediseño.", small),
    Spacer(1, 6),
    P("<b>Alcance y límites.</b> Se aplicó el marco de prioridades del skill ui-ux-pro-max, pero su motor de búsqueda y su base de datos no están instalados, "
      "por lo que no se consultaron sus guías. Los hallazgos salen de la inspección de la pantalla corriendo, su código, los componentes del kit y contrastes calculados con los tokens reales. "
      "No evaluado: specs de campos en Figma (el link apunta a los templates M-01…M-04), reglas de negocio (obligatorios, formatos, unidades, duplicados), "
      "flujo posterior al guardado y responsive real en mobile (evaluado solo por código).", body),
    P("Hallazgos", h2),
    t,
    P("Top 5 por impacto/esfuerzo", h2),
] + [P(f"{i}. {x}", body) for i, x in enumerate(TOP5, 1)] + [
    P("Lo que ya funciona bien y conviene mantener", h2),
] + [P(f"• {x}", body) for x in GOOD]

doc.build(s, onFirstPage=footer, onLaterPages=footer)
print(OUT)
