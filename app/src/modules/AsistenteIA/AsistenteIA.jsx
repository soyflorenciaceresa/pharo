import { useEffect, useRef, useState } from 'react';
import LayoutChat from '../../templates/LayoutChat/LayoutChat.jsx';
import ChatResultCard from '../../components/ChatResultCard/ChatResultCard.jsx';
import { MAIN_SIDEBAR_PROPS } from '../../config/sidebars/main.js';
import { generateSimplePdf, downloadBlob } from '../../utils/simplePdf.js';

// Pantalla del chatbot de IA — cross-módulo (como Main/Home, no pertenece a
// ningún módulo de negocio puntual), reachable desde el Buscador de CUALQUIER
// TopBar (ver App.jsx: onSearch guarda la consulta y navega acá). Compone
// LayoutChat (genérico, sin lógica de negocio) y le inyecta: conversaciones
// mock, un "respondedor" con reglas simples por palabra clave (sin backend de
// IA todavía — placeholder documentado, ver getMockResponse) y la descarga
// real de PDF (utils/simplePdf.js, sin dependencias).

function nowTime() {
  return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

function downloadClientPdf(client) {
  const blob = generateSimplePdf(
    [
      `Nombre: ${client.nombre}`,
      `CUIT: ${client.cuit}`,
      `Dirección: ${client.direccion}`,
      `Teléfono: ${client.telefono}`,
      `Email: ${client.email}`,
      `Estado: ${client.estado}`,
    ],
    { title: `Cliente ${client.nombre}` },
  );
  downloadBlob(blob, `cliente-${client.nombre.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

const MARTIN_COMPARETTO = {
  nombre: 'Martín Comparetto',
  cuit: '20-12345678-9',
  direccion: 'Lavalle 407, CABA',
  telefono: '+54 911 6168-6688',
  email: 'martin.comparetto@outlook.com',
  estado: 'Activo',
};

const CAPUTO_ASOCIADOS = {
  nombre: 'Caputo y Asociados',
  cuit: '30-71234567-8',
  direccion: 'Av. Córdoba 1234, CABA',
  telefono: '+54 11 4555-2020',
  email: 'contacto@caputoyasociados.com',
  estado: 'Activo',
};

function clientResultCard(client) {
  return (
    <ChatResultCard
      title={`Cliente ${client.nombre}`}
      rows={[
        { label: 'Nombre', value: client.nombre },
        { label: 'CUIT', value: client.cuit },
        { label: 'Dirección', value: client.direccion },
        { label: 'Teléfono', value: client.telefono },
        { label: 'Email', value: client.email },
        { label: 'Estado', value: client.estado },
      ]}
      actions={[{ label: 'Descargar PDF', icon: 'bi-download', onClick: () => downloadClientPdf(client) }]}
    />
  );
}

// Conversaciones de ejemplo — reemplazar por el historial real del usuario
// cuando exista backend. Cada una ya trae su intercambio inicial (mock) para
// que la lista no quede vacía y se pueda probar la navegación entre chats.
const SEED_CONVERSATIONS = [
  {
    id: 'c1',
    title: 'Facturas pendientes julio 2026',
    group: 'Hoy',
    messages: [
      { id: 'c1-1', role: 'user', text: 'Facturas pendientes julio 2026', time: '09:12 a. m.' },
      {
        id: 'c1-2',
        role: 'assistant',
        text: 'Encontré 3 facturas pendientes de julio 2026.',
        time: '09:12 a. m.',
        content: (
          <ChatResultCard
            title="Facturas pendientes"
            rows={[
              { label: 'FC-0231', value: '$45.200,00' },
              { label: 'FC-0244', value: '$18.900,00' },
              { label: 'FC-0259', value: '$64.150,00' },
            ]}
          />
        ),
      },
    ],
  },
  {
    id: 'c2',
    title: 'Buscar cliente Martín Comparetto',
    group: 'Hoy',
    messages: [
      { id: 'c2-1', role: 'user', text: 'buscar cliente Martín Comparetto', time: '12:36 p. m.' },
      {
        id: 'c2-2',
        role: 'assistant',
        text: 'Cliente encontrado en el sistema.',
        time: '12:36 p. m.',
        content: clientResultCard(MARTIN_COMPARETTO),
      },
    ],
  },
  {
    id: 'c3',
    title: 'Dame el resumen de cuenta de GalDic',
    group: 'Hoy',
    messages: [
      { id: 'c3-1', role: 'user', text: 'Dame el resumen de cuenta de GalDic', time: '02:47 p. m.' },
      {
        id: 'c3-2',
        role: 'assistant',
        text: 'Este es el resumen de cuenta de GalDic.',
        time: '02:47 p. m.',
        content: (
          <ChatResultCard
            title="Resumen de cuenta — GalDic"
            rows={[
              { label: 'Saldo actual', value: '$128.450,00' },
              { label: 'Facturas pendientes', value: '3' },
              { label: 'Última actualización', value: '01/09/2026' },
            ]}
          />
        ),
      },
    ],
  },
  {
    id: 'c4',
    title: '¿Cuáles son los pedidos abiertos?',
    group: 'Ayer',
    messages: [
      { id: 'c4-1', role: 'user', text: '¿Cuáles son los pedidos abiertos?', time: '10:05 a. m.' },
      {
        id: 'c4-2',
        role: 'assistant',
        text: 'Estos son los pedidos abiertos actualmente.',
        time: '10:05 a. m.',
        content: (
          <ChatResultCard
            title="Pedidos abiertos"
            rows={[
              { label: 'Pedido #4021', value: 'En preparación' },
              { label: 'Pedido #4022', value: 'Enviado' },
              { label: 'Pedido #4023', value: 'Pendiente de pago' },
            ]}
          />
        ),
      },
    ],
  },
  {
    id: 'c5',
    title: 'Mostrar facturas vencidas del mes',
    group: 'Ayer',
    messages: [
      { id: 'c5-1', role: 'user', text: 'Mostrar facturas vencidas del mes', time: '04:20 p. m.' },
      {
        id: 'c5-2',
        role: 'assistant',
        text: 'Encontré 2 facturas vencidas este mes.',
        time: '04:20 p. m.',
        content: (
          <ChatResultCard
            title="Facturas vencidas"
            rows={[
              { label: 'FC-0198', value: 'Vencida hace 4 días' },
              { label: 'FC-0205', value: 'Vencida hace 1 día' },
            ]}
          />
        ),
      },
    ],
  },
  {
    id: 'c6',
    title: 'Buscar cliente Caputo y Asociados',
    group: 'Última semana',
    messages: [
      { id: 'c6-1', role: 'user', text: 'Buscar cliente Caputo y Asociados', time: '11:14 a. m.' },
      {
        id: 'c6-2',
        role: 'assistant',
        text: 'Cliente encontrado en el sistema.',
        time: '11:14 a. m.',
        content: clientResultCard(CAPUTO_ASOCIADOS),
      },
    ],
  },
  {
    id: 'c7',
    title: 'Estado pedidos Transportes SA',
    group: 'Última semana',
    messages: [
      { id: 'c7-1', role: 'user', text: 'Estado pedidos Transportes SA', time: '05:02 p. m.' },
      {
        id: 'c7-2',
        role: 'assistant',
        text: 'Este es el estado de los pedidos de Transportes SA.',
        time: '05:02 p. m.',
        content: (
          <ChatResultCard
            title="Pedidos — Transportes SA"
            rows={[
              { label: 'Pedido #3980', value: 'Entregado' },
              { label: 'Pedido #3991', value: 'En tránsito' },
            ]}
          />
        ),
      },
    ],
  },
];

const SUGGESTIONS = [
  {
    icon: 'bi-bar-chart',
    accent: 'violet',
    title: 'Obtener resumen de cuenta',
    description: 'Consultá el estado financiero de un cliente',
    query: 'Dame el resumen de cuenta de un cliente',
  },
  {
    icon: 'icon-clientes',
    accent: 'blue',
    title: 'Buscar información de cliente',
    description: 'Buscá datos, contacto y estado de un cliente',
    query: 'Buscar información de cliente',
  },
  {
    icon: 'bi-cart',
    accent: 'green',
    title: 'Ver pedidos abiertos',
    description: 'Consultá el estado de órdenes activas',
    query: '¿Cuáles son los pedidos abiertos?',
  },
];

// Respondedor mock — reglas simples por palabra clave, sin backend de IA
// todavía. Reemplazar por la integración real cuando exista; mientras tanto
// deja claro (con el texto de fallback) que es una respuesta de ejemplo.
function getMockResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('cliente')) {
    const client = q.includes('caputo') ? CAPUTO_ASOCIADOS : MARTIN_COMPARETTO;
    return { text: 'Cliente encontrado en el sistema.', content: clientResultCard(client) };
  }

  if (q.includes('pedido')) {
    return {
      text: 'Estos son los pedidos abiertos actualmente.',
      content: (
        <ChatResultCard
          title="Pedidos abiertos"
          rows={[
            { label: 'Pedido #4021', value: 'En preparación' },
            { label: 'Pedido #4022', value: 'Enviado' },
            { label: 'Pedido #4023', value: 'Pendiente de pago' },
          ]}
        />
      ),
    };
  }

  if (q.includes('resumen') || q.includes('cuenta') || q.includes('factura')) {
    return {
      text: 'Este es el resumen de cuenta solicitado.',
      content: (
        <ChatResultCard
          title="Resumen de cuenta"
          rows={[
            { label: 'Saldo actual', value: '$128.450,00' },
            { label: 'Facturas pendientes', value: '3' },
            { label: 'Última actualización', value: new Date().toLocaleDateString('es-AR') },
          ]}
          actions={[
            {
              label: 'Descargar PDF',
              icon: 'bi-download',
              onClick: () =>
                downloadBlob(
                  generateSimplePdf(
                    ['Saldo actual: $128.450,00', 'Facturas pendientes: 3', `Fecha: ${new Date().toLocaleDateString('es-AR')}`],
                    { title: 'Resumen de cuenta' },
                  ),
                  'resumen-de-cuenta.pdf',
                ),
            },
          ]}
        />
      ),
    };
  }

  if (q.includes('contrato')) {
    return {
      text: 'Puedo ayudarte a armar un contrato. Contame con qué cliente o proceso está relacionado y te guío paso a paso.',
    };
  }

  return {
    text: 'Estoy procesando tu consulta. Esta es una respuesta de ejemplo — todavía no hay una integración real de IA conectada.',
  };
}

function buildDisplayText(text, attachments) {
  if (attachments.length === 0) return text;
  const names = attachments.map((f) => f.name).join(', ');
  return text ? `${text}\n[Adjunto: ${names}]` : `[Adjunto: ${names}]`;
}

export default function AsistenteIA({ onNavigate, pendingQuery, onConsumePendingQuery }) {
  const [conversations, setConversations] = useState(SEED_CONVERSATIONS);
  const [activeId, setActiveId] = useState(null);
  const [isResponding, setIsResponding] = useState(false);
  const consumedInitialQuery = useRef(false);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  function sendToConversation(convId, userText, attachments) {
    const userMsg = { id: `${convId}-${Date.now()}-u`, role: 'user', text: buildDisplayText(userText, attachments), time: nowTime() };
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, userMsg] } : c)));
    setIsResponding(true);

    window.setTimeout(() => {
      const response = getMockResponse(userText);
      const assistantMsg = { id: `${convId}-${Date.now()}-a`, role: 'assistant', time: nowTime(), ...response };
      setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c)));
      setIsResponding(false);
    }, 700);
  }

  function handleSend(text, attachments = []) {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;

    if (activeId) {
      sendToConversation(activeId, trimmed, attachments);
      return;
    }

    const newId = `conv-${Date.now()}`;
    const title = trimmed ? trimmed.slice(0, 48) : 'Nueva conversación';
    setConversations((prev) => [{ id: newId, title, group: 'Hoy', messages: [] }, ...prev]);
    setActiveId(newId);
    sendToConversation(newId, trimmed, attachments);
  }

  // Si se llega acá desde el Buscador de otra pantalla (ver App.jsx), la
  // consulta tipeada ahí arranca una conversación nueva automáticamente.
  useEffect(() => {
    if (pendingQuery && !consumedInitialQuery.current) {
      consumedInitialQuery.current = true;
      handleSend(pendingQuery, []);
      onConsumePendingQuery?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuery]);

  return (
    <LayoutChat
      sidebar={MAIN_SIDEBAR_PROPS}
      onNavigate={onNavigate ?? ((d) => console.log('navigate', d))}
      onCompanyChange={(c) => console.log('company change', c)}
      onLogout={() => console.log('logout')}
      onToggle={(d) => console.log('toggle', d)}
      onSearch={(query) => handleSend(query, [])}
      conversations={conversations.map((c) => ({ id: c.id, title: c.title, group: c.group }))}
      activeConversationId={activeId}
      onSelectConversation={setActiveId}
      onNewChat={() => setActiveId(null)}
      messages={activeConversation?.messages ?? []}
      onSendMessage={handleSend}
      isResponding={isResponding}
      suggestions={SUGGESTIONS.map((s) => ({ ...s, onClick: () => handleSend(s.query, []) }))}
    />
  );
}
