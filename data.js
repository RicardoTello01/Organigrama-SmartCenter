function initialsFromName(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || '')
    .join('') || 'SC';
}

function accentByRole(role) {
  const value = String(role || '').toLowerCase();
  if (value.includes('consejo') || value.includes('director') || value.includes('subdirección') || value.includes('subdireccion')) return '#1fd7ff';
  if (value.includes('gerente') || value.includes('coordinador') || value.includes('supervisor') || value.includes('bienestar laboral') || value.includes('seguridad fisica') || value.includes('facilities') || value.includes('proteccion civil')) return '#4f94ff';
  return '#8c8cff';
}

function avatarSvg(label, role = '') {
  const initials = initialsFromName(label);
  const accent = accentByRole(role);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <defs>
        <radialGradient id="bg" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#123d7a" />
          <stop offset="65%" stop-color="#0a1f46" />
          <stop offset="100%" stop-color="#06152f" />
        </radialGradient>
        <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#86f0ff" stop-opacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="120" fill="url(#bg)" />
      <circle cx="120" cy="120" r="112" fill="none" stroke="url(#ring)" stroke-width="8" />
      <circle cx="120" cy="96" r="38" fill="#dbeafe" fill-opacity="0.18" />
      <path d="M50 188c12-36 40-54 70-54s58 18 70 54" fill="#dbeafe" fill-opacity="0.18" />
      <text x="120" y="130" text-anchor="middle" font-size="50" font-family="Segoe UI, Arial, sans-serif" font-weight="700" fill="#f4fbff">${initials}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function node({
  id,
  nombre,
  puesto,
  area,
  descripcion = 'Agregar descripción del puesto.',
  foto = '',
  activos = [],
  correo = '',
  telefono = '',
  sueldo = '',
  expanded = false,
  hijos = [],
  offsetNivel = 0,
  alignTo = ''
}) {
  return {
    id,
    nombre,
    puesto,
    area,
    descripcion,
    foto: foto || avatarSvg(nombre || puesto || 'SC', puesto),
    activos,
    contactos: { correo, telefono },
    sueldo,
    expanded,
    hijos,
    offsetNivel,
    alignTo
  };
}

const orgData = node({
  id: 'consejo-administracion',
  nombre: `Alejandro de Sousa

		Ricardo Llanos

		Rafael Correa`,
  puesto: 'Consejo de Administración',
  area: 'Consejo',
  descripcion: 'Órgano superior de gobierno corporativo.',
  expanded: true,
  hijos: [
    node({
      id: 'director-site',
      nombre: 'Erick Armando Hernández Becerra',
      puesto: 'Director de Site',
      area: 'Dirección',
      descripcion: `• Garantizar el desempeño integral del site: Asegurar el cumplimiento de objetivos operativos, niveles de servicio y rentabilidad, alineados a la estrategia del negocio.

                    • Definir y ejecutar la estrategia operativa: Establecer planes de crecimiento, eficiencia y mejora continua que optimicen recursos y fortalezcan la operación.

                    • Gestionar relaciones estratégicas con clientes y stakeholders: Asegurar el cumplimiento de acuerdos de servicio, la satisfacción del cliente y la continuidad del negocio.

                    • Liderar la estructura organizacional del site: Desarrollar equipos de alto desempeño, fortalecer el liderazgo interno y asegurar una cultura orientada a resultados.`,
      activos: ['Laptop', 'Celular'],
      foto: 'ASSETS/IMAGES/Director de Site.jpg',
      correo: 'erick.hernandez@smart-center.com.mx',
      telefono: '5512345678',
      expanded: false,
      hijos: [
        node({
          id: 'gerente-bbva',
          offsetNivel: 1,
          alignTo: 'subdireccion-finanzas',
          nombre: 'Adrian Evangelista Valencia',
          puesto: 'Gerente BBVA',
          area: 'BBVA',
	        descripcion: `• Asegurar el cumplimiento de metas comerciales: Gestionar la operación de ventas para alcanzar objetivos de conversión, volumen y revenue, mediante el seguimiento de KPIs y la optimización del desempeño.
                        • Optimizar la estrategia y ejecución de ventas: Definir e implementar estrategias comerciales, scripts, campañas y uso de bases de datos para maximizar la productividad y efectividad del equipo.
                        • Liderar y desarrollar equipos de alto desempeño: Dirigir a lideres de área, impulsando coaching, seguimiento y cultura de resultados para mejorar indicadores y reducir rotación.`,
          activos: ['Laptop', 'Celular'],
          foto: 'ASSETS/IMAGES/Gerente BBVA.jpg',
          correo: 'aevangelista@smart-center.com.mx',
          telefono: '5512955772',
          expanded: false,
          hijos: [
            node({
              id: 'coord-efi',
              nombre: 'Gabriel Fuentes Arreazola',
              puesto: 'Coordinador EFI',
              area: 'EFI',
              descripcion: `• Asegurar el cumplimiento de objetivos operativos: Definir metas claras y dar seguimiento a su ejecución, guiando al equipo para alcanzar los objetivos de la organización.
                            • Coordinar la gestión del personal y cumplimiento de procesos: Administrar el ingreso, permanencia, promoción e incidencias del personal, asegurando apego a políticas y procedimientos.
                            • Impulsar el desarrollo y clima laboral del equipo asignado: Promover la capacitación continua, fortalecer la comunicación y gestionar conflictos de manera efectiva para mantener un entorno productivo.`,
              activos: ['Laptop', 'Celular'],
              foto: 'ASSETS/IMAGES/Coordinador EFI.jpg',
              correo: 'jfuentes@smart-center.com.mx',
              telefono: '5579273314',
              hijos: [node({ id: 'ops-efi', offsetNivel: 1, nombre: 'Pendiente de definir', puesto: 'Operaciones', area: 'Operativo' })]
            }),
            node({
              id: 'coord-consumo',
              nombre: 'Carlos Garcia Tapia',
              puesto: 'Coordinador Consumo',
              area: 'Consumo',
              descripcion: `• Asegurar el cumplimiento de objetivos operativos: Definir metas claras y dar seguimiento a su ejecución, guiando al equipo para alcanzar los objetivos de la organización.
                            • Coordinar la gestión del personal y cumplimiento de procesos: Administrar el ingreso, permanencia, promoción e incidencias del personal, asegurando apego a políticas y procedimientos.
                            • Impulsar el desarrollo y clima laboral del equipo asignado: Promover la capacitación continua, fortalecer la comunicación y gestionar conflictos de manera efectiva para mantener un entorno productivo.`,
              activos: ['Laptop', 'Celular'],
              foto: 'ASSETS/IMAGES/Coordinador Consumo.jpg',
              correo: 'cgarcia@smart-center.com.mx',
              telefono: '5512995075',
              hijos: [node({ id: 'ops-consumo', offsetNivel: 1, nombre: 'Pendiente de definir', puesto: 'Operaciones', area: 'Operativo' })]
            }),
            node({
              id: 'coord-open-market',
              nombre: 'Julio Cesar Cruz Herrera',
              puesto: 'Coordinador Open Market',
              area: 'Open Market',
              descripcion: `• Asegurar el cumplimiento de objetivos operativos: Definir metas claras y dar seguimiento a su ejecución, guiando al equipo para alcanzar los objetivos de la organización.
                            • Coordinar la gestión del personal y cumplimiento de procesos: Administrar el ingreso, permanencia, promoción e incidencias del personal, asegurando apego a políticas y procedimientos.
                            • Impulsar el desarrollo y clima laboral del equipo asignado: Promover la capacitación continua, fortalecer la comunicación y gestionar conflictos de manera efectiva para mantener un entorno productivo.`,
              activos: ['Laptop', 'Celular'],
              foto: 'ASSETS/IMAGES/Coordinador Open Market.jpg',
              correo: 'jcruzh@smart-center.com.mx',
              telefono: '5513947774',
              hijos: [node({ id: 'ops-open-market', offsetNivel: 1, nombre: 'Pendiente de definir', puesto: 'Operaciones', area: 'Operativo' })]
            }),
            node({
              id: 'coord-calidad',
              nombre: 'Elizabeth Medina Juarez',
              puesto: 'Coordinador Calidad',
              area: 'Calidad',
              descripcion: `• Asegurar la ejecución y control de calidad: Garantizar la correcta asignación de recursos, cumplimiento de monitoreos, auditorías, reportes operativos y métricas (NPS, cancelaciones,), así como el seguimiento a procesos.
                            • Gestionar el desempeño y mejora continua de la operación: Dar seguimiento a retroalimentaciones, errores críticos, rechazos, reincidencias y desviaciones, implementando acciones correctivas y asegurando el cumplimiento de indicadores de calidad y negocio.
                            • Desarrollar, alinear y  comunicar al equipo : Capacitar y guiar al equipo de calidad, liderar calibraciones y homologaciones de criterios, coordinar sesiones con la triada y generar reportes ejecutivos para la toma de decisiones.`,
              activos: ['Laptop', 'Celular'],
              foto: 'ASSETS/IMAGES/Coordinador Calidad.jpg',
              correo: 'medinae@smart-center.com.mx',
              telefono: '5666769135',
              hijos: [
                node({ 
                  id: 'sup-calidad', 
                  nombre: 'Jacob Martin Escobar', 
                  puesto: 'Supervisor Calidad', 
                  area: 'Calidad',
                  activos: ['Laptop'],
                  correo: 'jmartin@smart-center.com.mx',
                  foto: 'ASSETS/IMAGES/Supervisor Calidad.jpg',
                  hijos: [
                    node({
                      id: 'Analista-calidad',
                      nombre: '',
                      puesto: 'Analista de Calidad',
                      area: '',
                      descripcion: ''
                    }),
                    node({
                      id: 'Auditor-calidad',
                      nombre: '',
                      puesto: 'Auditor de Calidad',
                      area: 'Calidad',
                      descripcion: ''
                    })
                  ] 
                }),
              ]
            }),
            node({
              id: 'coord-wfm',
              nombre: 'Oscar Ricardo Tello de la Cruz',
              puesto: 'Coordinador WFM',
              area: 'WFM',
              descripcion: `• Asegurar la gestión y entrega de información estratégica para operación: Garantizar la generación automatizada de reportes operativos, ejecutivos y de facturación, asegurando su precisión, oportunidad y utilidad para la toma de decisiones.
                            • Optimizar procesos y monitoreo del desempeño operativo: Supervisar bases de datos, automatizar procesos y asegurar el seguimiento en tiempo real de métricas contractuales, generando alertas y acciones para el cumplimiento de objetivos.
                            • Generar análisis y comunicación ejecutiva del negocio: Desarrollar reportes, propuestas y presentaciones a nivel directivo (interno y cliente), facilitando la visibilidad de resultados y oportunidades.`,
              activos: ['Laptop', 'Celular'],
              foto: 'ASSETS/IMAGES/Coordinador WFM.jpg',
              correo: 'otello@smart-center.com.mx',
              telefono: '5580743113',
              hijos: [
                node({ id: 'discado', nombre: 'Pendiente de definir', puesto: 'Discado', area: 'WFM' }),
                node({ id: 'analista-estadistica', nombre: 'Pendiente de definir', puesto: 'Analista de estadistica', area: 'WFM' })
              ]
            })
          ]
        }),
        node({
          id: 'gerente-unicef',
          offsetNivel: 1,
          nombre: 'Ricardo Hernandez Piña',
          puesto: 'Gerente Unicef',
          activos: ['Laptop', 'Celular'],
          descripcion: `• Asegurar la rentabilidad y control del negocio de la campaña asignada: Optimizar el uso de la base de datos y garantizar la rentabilidad y el flujo adecuado de ingresos.
                        • Gestionar la operación y al equipo: Retroalimentar al equipo, controlar ausentismo y rotación, e implementar estrategias y ajustes oportunos para alcanzar las metas establecidas.
                        • Analizar información y desempeño: Generar informes, analizar indicadores y campañas, y proponer soluciones basadas en datos para mejorar resultados.`,
          correo: 'rhernandez@smart-center.com.mx',
          telefono: '5561916662',
          area: 'Unicef',
          hijos: [node({ id: 'ops-unicef', offsetNivel: 2, nombre: 'Pendiente de definir', puesto: 'Operaciones', area: 'Operativo' })]
        }),
        node({
          id: 'gerente-welcome',
          offsetNivel: 1,
          alignTo: 'subdireccion-finanzas',
          nombre: 'María Guadalupe Garcia Martinez',
          puesto: 'Gerente Welcome',
          descripcion: `• Asegurar la rentabilidad y control del negocio de la campaña asignada: Optimizar el uso de la base de datos y garantizar la rentabilidad y el flujo adecuado de ingresos.
                        • Gestionar la operación y al equipo: Retroalimentar al equipo, controlar ausentismo y rotación, e implementar estrategias y ajustes oportunos para alcanzar las metas establecidas.
                        • Analizar información y desempeño: Generar informes, analizar indicadores y campañas, y proponer soluciones basadas en datos para mejorar resultados.`,
          activos: ['Laptop', 'Celular'],
          foto: 'ASSETS/IMAGES/GERENTE WELCOME.jpg',
          correo: 'mgarcia@smart-center.com.mx',
          area: 'Welcome',
          hijos: [node({ id: 'ops-unicef', offsetNivel: 2, nombre: 'Pendiente de definir', puesto: 'Operaciones', area: 'Operativo' })]
        }),
        node({
          id: 'gerente-capital-humano',
          offsetNivel: 1,
          alignTo: 'subdireccion-finanzas',
          nombre: 'Dulce Guzman Hernandez',
          puesto: 'Gerente de Capital Humano',
          descripcion: `  Asegurar la cobertura de vacantes: Implementar estrategias de atracción alineadas a políticas y procesos establecidos.
                        •Disminuir la rotación y fortalecer la retención: Diseñar e implementar acciones efectivas que promuevan la permanencia del talento.
                        •Optimizar y asegurar la capacitación: Estandarizar la inducción y fortalecer la capacitación para mejorar la calidad operativa.
                        •Gestionar clima, cultura y bienestar: Implementar estrategias alineadas al negocio que impulsen el compromiso y la experiencia del colaborador.
                        •Gestionar desempeño y compensación: Implementar evaluaciones efectivas y esquemas de compensación alineados a resultados del negocio.
                        •Asegurar cumplimiento y eficiencia administrativa: Mantener control laboral y procesos administrativos confiables y estandarizados.`,
          area: 'Capital Humano',
          activos: ['Laptop', 'Celular'],
          foto: 'ASSETS/IMAGES/GERENTE CAPITAL HUMANO.jpg',
          correo: 'dulce.guzman@smart-center.com.mx',
          telefono: '5666752510',
          hijos: [
            node({
              id: 'coord-atraccion-talento',
              nombre: 'Giovanni Díaz Martinez',
              puesto: 'Coordinador de atraccion de talento',
              area: 'Talento',
              descripcion: `•	Diseñar y ejecutar estrategias de reclutamiento efectivas: Atraer candidatos calificados mediante campañas, ferias y canales digitales, asegurando la cobertura de vacantes dentro de los plazos establecidos.
                            •	Gestión del proceso de selección: Coordina la publicación de vacantes, revisión de CVs, entrevistas por competencias y evaluaciones según el perfil, garantizando eficiencia, objetividad y cumplimiento de estándares internos y legales.
                            •	Seguimiento de indicadores: Monitorear indicadores clave de reclutamiento (tiempo de cobertura, calidad de candidatos, fuentes), generando reportes y acciones de mejora.`,
              activos: ['Laptop', 'Celular'],
              foto: 'ASSETS/IMAGES/COORDINADOR ATRACCION TALENTO.jpg',
              correo: 'atracciondetalento@smart-center.com.mx',
              telefono: '5579010347',
              hijos: [
                node({ 
			            id: 'analista-atraccion-talento-01', 
                  offsetNivel: 1,
			            nombre: 'Yessica Erandy David Perez', 
			            puesto: 'Analista de atraccion de talento', 
			            area: 'Talento',
			            activos: ['Sin activos'],
			            descripcion: '',
			            correo: '',
			            telefono: '' 
                }),
                node({ 
                  id: 'analista-atraccion-talento-02', 
                  offsetNivel: 1,
                  nombre: 'Vacante', 
                  puesto: 'Analista de atraccion de talento', 
                  area: 'Talento',
                  activos: ['Sin activos'] 
                })
              ]
            }),
            node({
              id: 'coord-rrll',
              nombre: 'Sandra Ivonne Perez Piña',
              puesto: 'Coordinador de relaciones laborales',
              area: 'RRLL',
              descripcion: `•	Gestión de relaciones laborales: Atención y resolución de conflictos, aplicación de medidas disciplinarias y coordinación de procesos de desvinculación. 
                            •	Cumplimiento legal y normativo: Asegurar el apego a la legislación laboral, gestionar contrataciones y representar a la empresa ante autoridades. 
                            •	Administración y control laboral: Manejo de expedientes, elaboración de reportes e impulso de inducción y capacitación en políticas internas.`,
              activos: ['Laptop', 'Celular'],
              foto: 'ASSETS/IMAGES/COORDINADOR RRLL.jpg',
              correo: 'rl.auxiliarcdmx@smart-center.com.mx',
              telefono: '5513092923',
              hijos: [
                node({ 
                  id: 'analista-rrll', 
                  offsetNivel: 1,
                  nombre: 'MAYRA GISELA LARA REYES', 
                  puesto: 'Analista RRLL', 
                  area: 'RRLL',
			            activos: ['Sin activos'],
                  descripcion: `• Gestión y control de archivos: Organizar, actualizar y resguardar documentación física y digital del área jurídica.
                                • Administración de bases de datos y registros: Dar seguimiento a altas y bajas de colaboradores, así como registrar y controlar objetos perdidos e información relevante.`,
                  correo: 'rl.auxiliar.admin@smart-center.com.mx',
                  telefono: '5519233544', 
                  foto: 'ASSETS/IMAGES/analista RRLL.jpg' 
                }),
                node({ 
			            id: 'becario-juridico', 
                  offsetNivel: 3,
			            nombre: ' Ariadna López Romero', 
			            puesto: 'Becario Juridico', 
			            area: 'RRLL',
			            activos: ['Sin activos'],
			            descripcion: '',
			            correo: '',
			            telefono: '',
                  foto: 'ASSETS/IMAGES/becario rrll.jpg'
                })
              ]
            }),
            node({
              id: 'sup-formacion',
              nombre: 'Victoria Bonilla Revuelta',
              puesto: 'Supervisor de Formacion',
              area: 'Formacion',
              descripcion: `•	Optimizar la capacitación de nuevos ingresos y campañas: Asegurar la correcta ejecución de planes de formación, acompañamiento en piso y cumplimiento de KPIs de nesting, con acciones correctivas medibles y seguimiento semanal
                            •	Diseñar y ejecutar planes de mejora y capacitación continua: Crear estrategias para elevar el desempeño de asesores y del equipo de formación, con metas claras, seguimiento mensual y resultados medibles en KPIs operativos y de calidad.
                            •	Seguimiento a indicadores de desempeño: Monitorear indicadores de formación y operación ( Nesting, productividad, calidad) implementando acciones correctivas en coordinación con las áreas involucradas.`,
              activos: ['Laptop', 'Celular'],
              foto: 'ASSETS/IMAGES/SUPERVISOR FORMACION.jpg',
              correo: 'vbonilla@smart-center.com.mx',
              telefono: '5554929759',
              hijos: [
                node({ id: 'formador', offsetNivel: 1, nombre: 'Pendiente de definir', puesto: 'Formador', area: 'Formacion' }),
                node({ id: 'coach', offsetNivel: 1, nombre: 'Pendiente de definir', puesto: 'Coach', area: 'Formacion' })
              ]
            }),
            node({
              id: 'bienestar-laboral',
              nombre: 'Nancy Fernández Islas',
              puesto: 'COORDINADOR DE DESARROLLO ORGANIZACIONAL',
              area: 'Bienestar',
              activos: ['Laptop'],
              descripcion: `•Gestión del talento y desarrollo organizacional: Diseñar e implementar programas de capacitación, planes de carrera y estrategias de desarrollo para fortalecer habilidades y crecimiento del personal. 
                            •Clima, cultura y cambio organizacional: Medir y mejorar el clima laboral, impulsar la cultura organizacional y gestionar iniciativas de cambio que alineen a los colaboradores con los objetivos del negocio. 
                            •Estrategia y analítica de talento: Generar indicadores, reportes y diagnósticos para la toma de decisiones y mejora continua de la organización.`,
              correo: 'nfernandez@smart-center.com.mx',
              telefono: '5522705146',
              foto: 'ASSETS/IMAGES/bienestar laboral.jpg',
              hijos: [
                node({ 
                  id: 'analista-comunicacion', 
                  offsetNivel: 1,
                  nombre: 'Smantha Ximena Snachez Gomez', 
                  puesto: 'Analista de comunicación interna', 
                  area: 'Bienestar',
                  descripcion: '',
                  correo: 'sxsanchez@smart-center.com.mx',
                  telefono: '5569661333',
                  foto: 'ASSETS/IMAGES/comunicacion interna.jpg',
                }),
                node({
                  id: 'Analista-desarrollo-org',
                  offsetNivel: 1,
                  nombre: 'Vacante',
                  puesto: 'Analista de desarrollo organizacional',
                  area: 'Bienestar',
                  descripcion: '',
                  correo: '',
                  telefono: '',
                  foto: ''
                }),
                node({
                  id: 'Becario-02',
                  offsetNivel: 3,
                  nombre: 'Vacante',
                  puesto: 'Becario',
                  area: 'Bienestar',
                  descripcion: '',
                  correo: '',
                  telefono: '',
                  foto: ''
                })
              ]
            }),
            node({ 
                  id: 'supervisor-atraccion-talento',
                  offsetNivel: 1,
                  alignTo: 'coord-atraccion-talento', 
                  nombre: 'Jaqueline Marcela Hernandez Medina', 
                  puesto: 'Supervisor de atraccion de talento', 
                  area: 'atraccion de talento',
                  descripcion: ``, 
                  foto: '', 
                  correo: '',
                  telefono: '',
                  hijos: [
                    node({
                      id: 'Analista-atraccion-talento-03',
                      nombre: 'Alejandra Llanos Martinez',
                      puesto: 'Analista de atraccion de talento',
                      area: 'atraccion de talento',
                      descripcion: '',
                      foto: 'ASSETS/IMAGES/Analista-atraccion-talento-03.jpg',
                      correo: '',
                      telefono: ''
                    })
                  ] 
                }),
            node({ 
                  id: 'enfermera',
                  offsetNivel: 3,
                  alignTo: 'supervisor-atraccion-talento',
                  nombre: 'Cynthia Lizbeth Hernández Dircio', 
                  puesto: 'Enfermera', 
                  area: 'Bienestar',
                  descripcion: `•  Atención médica y respuesta a emergencias: Brindar atención médica primaria, primeros auxilios y manejo de emergencias dentro de la operación, asegurando valoración inicial, estabilización y canalización oportuna. 
                                •  Gestión de salud ocupacional y prevención: Diseñar e implementar programas de prevención de riesgos laborales, campañas de salud y vacunación, promoviendo el bienestar y la seguridad de los colaboradores. 
                                •  Administración y control médico: Gestionar expedientes clínicos e insumos médicos, garantizando control de inventarios, confidencialidad de la información y cumplimiento de normativas sanitarias.`,
                  correo: 'enfermeria@smart-center.com.mx',
                  telefono: '5511489689',
                  foto: 'ASSETS/IMAGES/enfermera.jpg',
                }),
            node({ 
                  id: 'gestor-usuarios',
                  offsetNivel: 2,
                  alignTo: 'supervisor-atraccion-talento',
                  nombre: 'Marco Antonio Vidal Dduarte', 
                  puesto: 'Gestor de Usuarios', 
                  area: 'Bienestar',
                  descripcion: `•\tAdministrar la plataforma de usuarios BBVA (Altas/bajas)\n                                •\tGenerar datos estadísticos de Capital Humano\n                                •\tLlevar un control y seguimiento de latas y bajas de personal`, 
                  foto: 'ASSETS/IMAGES/gestor usuarios.jpg', 
                  correo: 'reportesch@smart-center.com.mx',
                  telefono: '5620320299',
                }),
          ]
        }),
        node({
          id: 'gerencia-administrativa',
          offsetNivel: 1,
          alignTo: 'subdireccion-finanzas',
          nombre: 'Juan José Pelaez Pérez',
          puesto: 'Gerencia Administrativa',
          foto: 'ASSETS/IMAGES/GERENTE ADMINISTRATIVO.jpg',
          area: 'Administración',
          descripcion: `• Estrategia operativa integral: Definir lineamientos, estrategias y estándares para las operaciones de limpieza, seguridad, monitoreo y protección civil, asegurando continuidad operativa, cobertura y cumplimiento de estándares en todas las instalaciones.
                        • Gestión de equipos multidisciplinarios: Liderar y coordinar a los responsables de cada área, garantizando desempeño, alineación a objetivos, productividad y calidad en el servicio.
                        • Administración de recursos y cumplimiento normativo: Gestionar presupuestos, compras e insumos, asegurando eficiencia en costos y cumplimiento de normativas de seguridad, higiene, protección civil y control interno.`,
          activos: ['Laptop', 'Celular'],
          correo: 'jpelaez@smart-center.com.mx',
          telefono: '5641795772',
          hijos: [
            node({
              id: 'seguridad-fisica',
              offsetNivel: 1,
              nombre: 'Juan Carlos Lazaro Lima',
              puesto: 'Seguridad Fisica',
              area: 'Administración',
		          activos: ['Sin activos'],
              descripcion: `• Control de accesos y cumplimiento: Supervisar entradas y salidas, asegurando el cumplimiento del reglamento interno.
                            • Seguridad y resguardo: Proteger instalaciones, bienes, personal e información, garantizando la confidencialidad.
                            • Control operativo y registro: Gestionar bitácoras, recepción de paquetería y revisión de accesos conforme a procedimientos.`,
              correo: 'jlazaro@smart-center.com.mx',
              telefono: '5620977892',
		          foto: 'ASSETS/IMAGES/seguridad fisica.jpg',
              hijos: [node({ id: 'guardia', nombre: 'Pendiente de definir', puesto: 'Guardia', area: 'Seguridad',
              
               })]
            }),
            node({ 
              id: 'proteccion-civil', 
              offsetNivel: 2,
              nombre: 'Ismael Villafaña Villareal', 
              puesto: 'Proteccion Civil', 
              area: 'Administración', 
              foto: 'ASSETS/IMAGES/PROTECCION CIVIL.jpg',
              descripcion: `•	Gestionar el cumplimiento normativo y trámites gubernamentales, elaborando, ingresando y dando seguimiento a permisos, licencias, dictámenes y requerimientos ante autoridades, asegurando su conclusión en tiempo y forma.
                            •	Integrar, administrar y resguardar la documentación oficial, manteniendo actualizadas las carpetas físicas y digitales (programas internos, evidencias, registros), garantizando su disponibilidad, trazabilidad y cumplimiento regulatorio.
                            •	Diseñar, implementar y actualizar el Programa Interno de Protección Civil, alineado a la normatividad vigente y a los riesgos específicos de la organización.`,
              activos: ['Laptop', 'Celular'],
              correo: 'ivillafana@smart-center.com.mx',
              telefono: '5530748303' 
		        }),
            node({
              id: 'facilities',
              offsetNivel: 3,
              nombre: 'Juan Pablo Moreno Alva',
              puesto: 'Facilities',
              foto: 'ASSETS/IMAGES/FACILITIES.jpg',
              area: 'Administración',
		          activos: ['Sin activos'],
              descripcion: `• Gestión y supervisión del servicio de limpieza: Planificar, coordinar y supervisar las actividades y al personal, asegurando calidad, cobertura y cumplimiento de estándares.
                            • Control operativo y de recursos: Administrar insumos, materiales y registros (bitácoras/reportes), garantizando eficiencia, trazabilidad y continuidad del servicio.
                            • Cumplimiento y mejora continua: Asegurar normas de seguridad e higiene, resguardo de la información e impulsar mejoras en los procesos de limpieza.`,
              correo: 'mantenimiento@smart-center.com.mx',
              telefono: '5536819817',
              hijos: [
                node({ id: 'mantenimiento', nombre: 'Pendiente de definir', puesto: 'Mantenimiento', area: 'Facilities' }),
                node({ id: 'limpieza', nombre: 'Pendiente de definir', puesto: 'Limpieza', area: 'Facilities' })
              ]
            }),
            node({ 
              id: 'CCTV', 
              offsetNivel: 3,
              nombre: 'Karla Isela Alcaráz Martinez', 
              puesto: 'Monitorista CCTV', 
              area: 'Administración', 
              foto: 'ASSETS/IMAGES/MONITORISTA CCTV.jpg',
              descripcion: `•	Gestionar el cumplimiento normativo y trámites gubernamentales, elaborando, ingresando y dando seguimiento a permisos, licencias, dictámenes y requerimientos ante autoridades, asegurando su conclusión en tiempo y forma.
                            •	Integrar, administrar y resguardar la documentación oficial, manteniendo actualizadas las carpetas físicas y digitales (programas internos, evidencias, registros), garantizando su disponibilidad, trazabilidad y cumplimiento regulatorio.
                            •	Diseñar, implementar y actualizar el Programa Interno de Protección Civil, alineado a la normatividad vigente y a los riesgos específicos de la organización.`,
              activos: ['Laptop', 'Celular'],
              correo: '',
              telefono: ''
		        }),
            node({ 
              id: 'validador-compras', 
              offsetNivel: 3,
              nombre: 'Brayan Ricardo Manriquez Raya', 
              puesto: 'Validador de compras', 
              area: 'Administración',
			        activos: ['Sin activos'],
              descripcion: `• Gestión de compras: Validar solicitudes y generar órdenes de compra conforme a políticas internas.
                            • Seguimiento y coordinación: Dar seguimiento a proveedores y coordinar la recepción de bienes o servicios, asegurando entregas oportunas.
                            • Control y soporte operativo: Actualizar estatus en sistemas, resguardar documentación y apoyar en la atención de incidencias del proceso de compra.`, 
              correo: 'comprasoda1@smart-center.com.mx',
              telefono: '5534440548',
              foto: 'ASSETS/IMAGES/validador compras.jpg', })
          ]
        }),
        node({
          id: 'gerente-enlace-tecnologico',
          offsetNivel: 1,
          alignTo: 'subdireccion-finanzas',
          nombre: 'José Marcos Martinez Topete',
          puesto: 'Gerente de Enlace Tecnologico',
          area: 'Tecnología',
          descripcion: `• Garantizar la continuidad del servicio y atención a usuarios: Asegurar la operación de soporte técnico, manteniendo la disponibilidad de servicios y el cumplimiento de SLAs de atención y resolución.
                        • Gestionar la atención y solución de incidencias técnicas: Dirigir la recepción, diagnóstico, escalamiento y cierre de tickets, asegurando tiempos de respuesta eficientes y solución efectiva al usuario.
                        • Liderar la mejora del servicio de soporte: Optimizar procesos, herramientas y niveles de soporte ,fortaleciendo al equipo técnico y mejorando la experiencia del usuario.`,
          activos: ['Laptop', 'Celular'],
          foto: 'ASSETS/IMAGES/GERENTE ENLACE TECNOLOGICO.jpg',
          correo: 'mtopete@smart-center.com.mx',
          telefono: '5510098839',
          hijos: [node({ 
			id: 'primer-nivel-noc', 
      offsetNivel: 2,
			nombre: 'Richard Arce Secundino', 
			puesto: 'Primer Nivel / Noc', 
			area: 'NOC', 
			activos: ['Celular'],
			descripcion: `• Gestión integral de la Mesa de Ayuda: Seguimiento del ciclo completo de tickets (recepción, categorización, priorización, asignación, seguimiento y cierre), asegurando atención oportuna y efectiva.
					• Atención y comunicación con usuarios: Seguimiento puntual a solicitudes e incidentes, manteniendo informado al usuario sobre el estatus y garantizando la validación de la solución.
					• Gestión de proveedores y escalamiento: Validar el cumplimiento de los servicios contratados con proveedores mediante el seguimiento de sus propios tiempos de respuesta.`,
			correo: '',
			telefono: '',
			foto: 'ASSETS/IMAGES/ARCE SECUNDINO RICHARD.jpg' 
		}),
		node({ 
			id: 'primer-nivel-noc', 
      offsetNivel: 2,
			nombre: 'Miguel Trinidad Marquez', 
			puesto: 'Primer Nivel / Noc', 
			area: 'NOC', 
			activos: ['Celular'],
			descripcion: `• Gestión integral de la Mesa de Ayuda: Seguimiento del ciclo completo de tickets (recepción, categorización, priorización, asignación, seguimiento y cierre), asegurando atención oportuna y efectiva.
					• Atención y comunicación con usuarios: Seguimiento puntual a solicitudes e incidentes, manteniendo informado al usuario sobre el estatus y garantizando la validación de la solución.
					• Gestión de proveedores y escalamiento: Validar el cumplimiento de los servicios contratados con proveedores mediante el seguimiento de sus propios tiempos de respuesta.`,
			correo: '',
			telefono: '',
			foto: 'ASSETS/IMAGES/Miguel Trinidad Marquez.jpg' 
		}),
		node({ 
			id: 'primer-nivel-noc', 
      offsetNivel: 2,
			nombre: 'Javier Vera Mejia', 
			puesto: 'Primer Nivel / Noc', 
			area: 'NOC', 
			activos: ['Celular'],
			descripcion: `• Gestión integral de la Mesa de Ayuda: Seguimiento del ciclo completo de tickets (recepción, categorización, priorización, asignación, seguimiento y cierre), asegurando atención oportuna y efectiva.
					• Atención y comunicación con usuarios: Seguimiento puntual a solicitudes e incidentes, manteniendo informado al usuario sobre el estatus y garantizando la validación de la solución.
					• Gestión de proveedores y escalamiento: Validar el cumplimiento de los servicios contratados con proveedores mediante el seguimiento de sus propios tiempos de respuesta.`,
			correo: '',
			telefono: '',
			foto: 'ASSETS/IMAGES/VERA MEJIA JAVIER.jpg'
		 }),
		node({ 
			id: 'primer-nivel-noc', 
      offsetNivel: 2,
			nombre: 'Juan Jose Cuevas Vicente', 
			puesto: 'Primer Nivel / Noc', 
			area: 'NOC', 
			activos: ['Celular'],
			descripcion: `• Gestión integral de la Mesa de Ayuda: Seguimiento del ciclo completo de tickets (recepción, categorización, priorización, asignación, seguimiento y cierre), asegurando atención oportuna y efectiva.
					• Atención y comunicación con usuarios: Seguimiento puntual a solicitudes e incidentes, manteniendo informado al usuario sobre el estatus y garantizando la validación de la solución.
					• Gestión de proveedores y escalamiento: Validar el cumplimiento de los servicios contratados con proveedores mediante el seguimiento de sus propios tiempos de respuesta.`,
			correo: '',
			telefono: '',
			foto: 'ASSETS/IMAGES/CUEVAS VICENTE JUAN JOSE.jpg' }),
		node({ 
			id: 'primer-nivel-noc', 
      offsetNivel: 2,
			nombre: 'Ángel Erasmo Gil Mohedano', 
			puesto: 'Primer Nivel / Noc', 
			area: 'NOC', 
			activos: ['Celular'],
			descripcion: `• Gestión integral de la Mesa de Ayuda: Seguimiento del ciclo completo de tickets (recepción, categorización, priorización, asignación, seguimiento y cierre), asegurando atención oportuna y efectiva.
					• Atención y comunicación con usuarios: Seguimiento puntual a solicitudes e incidentes, manteniendo informado al usuario sobre el estatus y garantizando la validación de la solución.
					• Gestión de proveedores y escalamiento: Validar el cumplimiento de los servicios contratados con proveedores mediante el seguimiento de sus propios tiempos de respuesta.`,
			correo: '',
			telefono: '',
			foto: 'ASSETS/IMAGES/GIL MOHEDANO ANGEL ERASMO.jpg'
		}),
		node({ id: 'primer-nivel-noc', offsetNivel: 2, nombre: 'Vacante', puesto: 'Primer Nivel / Noc', area: 'NOC', activos: ['Celular'] })
]
        }),
        node({
          id: 'gerente-ciberseguridad',
          offsetNivel: 1,
          alignTo: 'subdireccion-finanzas',
          nombre: 'Gerardo Jesús Flores Gómez',
          puesto: 'Gerente de Ciberseguridad',
          area: 'Ciberseguridad',
          descripcion: `• Definir y asegurar la estrategia de Seguridad de la Información: Establecer el modelo de gobernanza, políticas y controles alineados al negocio, garantizando la protección integral de la información.
                        • Gestionar riesgos, cumplimiento y continuidad operativa: Identificar y mitigar riesgos de seguridad, asegurar el cumplimiento regulatorio y liderar la respuesta a incidentes para garantizar la estabilidad del negocio.
                        •  Impulsar la cultura y toma de decisiones en ciberseguridad: Fortalecer la cultura organizacional, liderar al equipo de seguridad y comunicar a la alta dirección el estado, riesgos y acciones estratégicas.`,
          activos: ['Laptop', 'Celular'],
          foto: 'ASSETS/IMAGES/GERENTE CIBERSEGURIDAD.jpg',
          correo: 'gflores@smart-center.com.mx',
          telefono: '5651030579',
          hijos: [
            node({
              id: 'Auditor-CISO',
              offsetNivel: 2,
              nombre: 'Carlos Flores Flores',
              puesto: 'Analista de seguridad de la información',
              area: 'Ciberseguridad',
              activos: ['Laptop', 'Celular'],
              foto: '',
              descripcion: '',
              correo: '',
              telefono: ''
            }),
            node({ 
              id: 'documentador', 
              offsetNivel: 2,
              nombre: 'Gladys Carolina Medina Aguilar', 
              puesto: 'Documentador', 
              area: 'Ciberseguridad', 
              activos: ['Laptop', 'Celular'],
              foto: 'ASSETS/IMAGES/documentador.jpg',
              descripcion: `• Gestión y control documental de Seguridad de la Información: Desarrollar, actualizar y estandarizar políticas, normas, procedimientos y controles, asegurando la correcta administración de repositorios, control de versiones y trazabilidad de la documentación. 
                            • Soporte a auditorías y cumplimiento: Documentar y resguardar evidencias para auditorías internas, externas y certificaciones, así como dar seguimiento a planes de acción, asegurando su correcta ejecución y cumplimiento regulatorio. 
                            •  Mejora continua y soporte operativo del área: Identificar oportunidades de mejora en la gestión documental, asegurar la actualización oportuna ante cambios, y apoyar en la elaboración de reportes, minutas y seguimiento de acuerdos del área de Seguridad de la Información.`,
              correo: 'gcmedina@smart-center.com.mx',
              telefono: '5585784142' }),
            node({ 
              id: 'analista-seguridad',
              offsetNivel: 2,
              nombre: 'Juan Jose Flores Garcia', 
              puesto: 'Analista de concienciación y capacitación', 
              area: 'Ciberseguridad',
              activos: ['Laptop', 'Telefono'],
              descripcion: `• Análisis de riesgos y comportamiento de usuarios: Identificar riesgos de seguridad asociados al factor usuarios y apoyar en evaluaciones y cumplimiento.
                            • Diseño y ejecución de programas de concientización: Implementar campañas, capacitaciones y simulaciones (como phishing) para fortalecer la cultura de ciberseguridad.
                            • Evaluación y mejora continua: Medir la efectividad de las iniciativas, generar reportes y colaborar con otras áreas para optimizar estrategias de prevención.`,
              correo: 'jjflores@smart-center.com.mx',
              telefono: '5585633705',
              foto: 'ASSETS/IMAGES/analista de seguridad.jpg',
            }),
            node({ 
              id: 'analista-gestion',
              offsetNivel: 2,
              nombre: 'Carlos Alberto Escobedo Moreno', 
              puesto: 'Analista de Gestión de riesgo y cumplimiento', 
              area: 'Ciberseguridad',
              activos: ['Laptop', 'Telefono'],
              descripcion: `•	Monitorear y gestionar eventos e incidentes de seguridad, asegurando su detección, análisis y respuesta conforme a los estándares definidos.
                            •	Analizar alertas de seguridad mediante herramientas especializadas, determinando su impacto y priorización de acuerdo con el nivel de riesgo.
                            •	Ejecutar procesos de escalamiento de incidentes conforme a matrices de criticidad y protocolos establecidos.`,
              correo: 'caescobedo@smart-center.com.mx',
              telefono: '5638085146',
              foto: 'ASSETS/IMAGES/analista de gestion.jpg',
            }),
            node({ 
              id: 'auditor-seguridad',
              offsetNivel: 2, 
              nombre: 'Nilson Eduardo Flores Lopez', 
              puesto: 'auditor de seguridad', 
              area: 'Ciberseguridad' })
          ]
        }),
        node({
          id: 'gerente-desarrollo',
          offsetNivel: 1,
          alignTo: 'subdireccion-finanzas',
          nombre: 'David Omar Hernández Corona',
          puesto: 'Gerente de desarrollo',
          area: 'Desarrollo',
          descripcion: `• Gobernar la arquitectura y estrategia tecnológica: Establecer lineamientos de arquitectura, tecnologías y estándares de desarrollo, asegurando soluciones escalables, seguras y alineadas a los objetivos del negocio.
                        • Asegurar la calidad, seguridad y estabilidad operativa: Garantizar el cumplimiento de buenas prácticas, estándares de codificación, integraciones y seguridad, así como la atención de incidentes críticos y el desempeño de las soluciones.
                        • Liderar la ejecución técnica y evolución del equipo: Guiar al equipo de desarrollo, coordinar la planeación técnica, validar entregables y promover la mejora continua y adopción de nuevas tecnologías.`,
          activos: ['Laptop', 'Celular'],
          foto: 'ASSETS/IMAGES/GERENTE DESARROLLO.jpg',
          correo: 'dhernandez@smart-center.com.mx',
          telefono: '5514735388',
          hijos: [
            node({ 
              id: 'Especialista-de-Devscops', 
              nombre: 'Vacante', 
              puesto: 'Especialista de Devscops', 
              area: 'Desarrollo', 
              activos: ['Laptop', 'Celular'],
              }),
            node({ 
              id: 'DATA-SCIENTIST', 
              nombre: 'Ines Marlen Jaramillo Rosas', 
              puesto: 'Data Scientis', 
              area: 'Desarrollo', 
              activos: ['Laptop', 'Celular'], 
              foto: 'ASSETS/IMAGES/data scientist.jpg',
              descripcion: `• Desarrollo y preparación de modelos analíticos: Realizar feature engineering y preparar datos para la construcción de modelos, asegurando su calidad y relevancia.
                            • Evaluación e implementación de modelos: Medir el desempeño (accuracy, precision, recall, ROC, etc.) e integrar los modelos en aplicaciones o entornos productivos.
                            • Monitoreo y mejora continua: Supervisar el desempeño en producción, automatizar procesos analíticos y ejecutar ajustes o reentrenamiento de modelos según sea necesario.`,
              correo: 'ijaramillo@smart-center.com.mx',
              telefono: '5552753211',
              foto: 'ASSETS/IMAGES/DATA SCIENTIST.jpg',
            }),
            node({ 
              id: 'DESARROLLADOR-SENIOR', 
              nombre: 'David Morales Carrillo', 
              puesto: 'Desarrollador Sennior', 
              area: 'Desarrollo', 
              activos: ['Laptop', 'Celular'], 
              foto: 'ASSETS/IMAGES/data scientist.jpg',
              descripcion: `• Desarrollo de soluciones tecnológicas: Diseñar, desarrollar y optimizar aplicaciones backend, frontend o full stack, asegurando su funcionalidad y eficiencia.
                            • Análisis e integración de sistemas: Participar en el levantamiento de requerimientos e integrar soluciones con bases de datos, APIs y servicios externos.
                            • Soporte y colaboración técnica: Resolver incidencias complejas en producción y colaborar con equipos de QA, DevOps, seguridad y negocio para garantizar la calidad y continuidad de las soluciones.`,
              correo: 'dmorales@smart-center.com.mx',
              telefono: '5584469287',
              foto: 'ASSETS/IMAGES/DESARROLLADOR SENNIOR.jpg',
            }),
            node({ 
              id: 'ADMINISTRADOR-BBDD', 
              nombre: 'Eloy Rivera Soriano', 
              puesto: 'Administrador de Base de Datos', 
              area: 'Desarrollo', 
              activos: ['Laptop', 'Celular'], 
              foto: 'ASSETS/IMAGES/admin bbdd.jpg',
              descripcion: `•	Administración y operación de bases de datos: Instalar, configurar y administrar bases de datos en distintos ambientes asegurando su estabilidad, disponibilidad y correcto funcionamiento.
                            •	Monitoreo, optimización y continuidad del servicio: Supervisar el desempeño, capacidad y disponibilidad, optimizar consultas y estructuras, e implementar estrategias de respaldo y recuperación ante desastres para garantizar la continuidad operativa.
                            •	Seguridad, soporte y mejora continua: Gestionar accesos y controles de seguridad, atender y resolver incidentes, automatizar procesos y colaborar con otras áreas para mejorar soluciones y eficiencia operativa.`,
              correo: 'erivera@smart-center.com.mx',
              telefono: '5543463978',
              foto: 'ASSETS/IMAGES/ADMINISTRADOR BBDD.jpg',
            }),
            node({ 
              id: 'qa-enginner', 
              nombre: 'Karla Andrea Garcia Gómez', 
              puesto: 'QA Enginner', 
              area: 'IDS',
              activos: ['Laptop', 'Celular'],
              descripcion: `• Diseño y ejecución de pruebas: Crear, ejecutar y documentar casos de prueba funcionales y no funcionales para asegurar la calidad del software.
                            • Gestión de defectos y validación: Identificar, documentar y dar seguimiento a fallas, validando el cumplimiento de requerimientos técnicos, de negocio y de seguridad.
                            • Aseguramiento de calidad y colaboración: Garantizar el cumplimiento de estándares y buenas prácticas, colaborando con equipos de desarrollo, DevOps y negocio.`,
              correo: 'agarcia@smart-center.com.mx',
              telefono: '5651834192',
              foto: 'ASSETS/IMAGES/QA ENGINNER.jpg',      
            }),
            node({
              id: 'prompt-enginner-01',
              nombre: 'Aaron Vizcarra Aviles',
              puesto: 'Prompt Enginner',
              area: 'IDS',
              activos: ['Laptop', 'Telefono'],
              descripcion: '',
              correo: '',
              telefono: '',
              foto: 'ASSETS/IMAGES/PROMPT ENGINNER 01.jpg'
            }),
            node({
              id: 'prompt-enginner-02',
              nombre: 'Andres Flores Mejia',
              puesto: 'Prompt Enginner',
              area: 'IDS',
              activos: ['Laptop', 'Telefono'],
              descripcion: '',
              correo: '',
              telefono: '',
              foto: 'ASSETS/IMAGES/PROMPT ENGINNER 02.jpg'
            })
          ]
        }),
        node({
          id: 'CTO',
          offsetNivel: 1,
          alignTo: 'subdireccion-finanzas',
          nombre: 'Vacante',
          puesto: 'CTO',
          area: 'Infraestructura',
          descripcion: ``,
          activos: ['Laptop', 'Celular'],
          foto: '',
          correo: '',
          telefono: '',
          hijos: [
            node({
              id: 'Coordinador-infraestructura',
              nombre: 'Rodrigo Felix Sanchez Cortes',
              puesto: 'Coordinador de Infraestructura',
              area: 'Infraestructura',
              descripcion: '',
              activos: ['Laptop', 'Celular'],
              foto: '',
              correo: '',
              telefono: '',
              hijos: [
                node({
                  id: 'Especialista-infraestructura-01',
                  nombre: 'Diego Enrique Castillon Mañón',
                  puesto: 'Especialista de Infraestructura',
                  area: 'Infraestructura',
                  activos: ['Laptop', 'Celular'],
                  correo: '',
                  telefono: '',
                  descripcion: ''
                }),
                node({
                  id: 'Especialista-infraestructura-02',
                  nombre: 'Kevin David Mendoza Rangel',
                  puesto: 'Especialista de Infraestructura',
                  area: 'Infraestructura',
                  activos: ['Laptop', 'Celular'],
                  correo: '',
                  telefono: '',
                  descripcion: '',
                  foto: 'ASSETS/IMAGES/infra 02.jpg'
                }),
                node({
                  id: 'Especialista-infraestructura-03',
                  nombre: 'Luis Alberto Garcia Ayuso',
                  puesto: 'Especialista de Infraestructura',
                  area: 'Infraestructura',
                  activos: ['Laptop', 'Celular'],
                  correo: '',
                  telefono: '',
                  descripcion: ''
                }),
                node({
                  id: 'Especialista-infraestructura-04',
                  nombre: 'Eric Adrian Lopez Dominguez',
                  puesto: 'Especialista de Infraestructura',
                  area: 'Infraestructura',
                  activos: ['Laptop', 'Celular'],
                  correo: '',
                  telefono: '',
                  descripcion: '',
                  foto: 'ASSETS/IMAGES/Especialista-infraestructura-04.jpg'
                }),
                node({
                  id: 'Especialista-infraestructura-05',
                  nombre: 'Jorge Navarro',
                  puesto: 'Especialista de Infraestructura',
                  area: 'Infraestructura',
                  activos: ['Laptop', 'Celular'],
                  correo: '',
                  telefono: '',
                  descripcion: ''
                }),
              ]
            })

          ]
        })   
      ]
    }),
    node({
      id: 'subdireccion-finanzas',
      alignTo: 'director-site',
      nombre: 'Ricardo Lopez Candia',
      puesto: 'Subdirección de finanzas',
      area: 'Finanzas',
      activos: ['laptop', 'celular'],
      offsetNivel: 1,
      descripcion: `• Definir y asegurar la estrategia financiera del negocio: Liderar la planeación financiera integral (corto, mediano y largo plazo), el control presupuestal y la gestión del flujo de efectivo para garantizar la rentabilidad y sostenibilidad.
                    • Garantizar el cumplimiento y la solidez financiera: Asegurar el cumplimiento fiscal, contable y regulatorio, así como la confiabilidad de la información financiera y la correcta relación con entes reguladores.
                    • Impulsar la toma de decisiones estratégicas y la eficiencia operativa: Generar análisis financieros de alto nivel y proponer estrategias para optimizar recursos, reducir costos y fortalecer controles internos.`,
      correo: 'rlopez@smrt-center.com.mx',
	    telefono: '5539333383',
      expanded: true,
      hijos: [
        node({ 
          id: 'contador-a', 
          nombre: 'Rubén Ernesto Flores Acuña', 
          puesto: 'Gerente de contabilidad', 
          area: 'Finanzas',
          descripcion: `• Asegurar el control y registro contable oportuno: Supervisar el registro de gastos, control de facturación y correcta aplicación contable, garantizando información financiera confiable y en tiempo.
                        • Gestionar y optimizar procesos administrativos-contables: Coordinar la administración de reembolsos y cuentas, asegurando eficiencia, cumplimiento de políticas internas y control de recursos.
                        • Liderar y supervisar al equipo contable: Coordinar y dar seguimiento al trabajo equipo contable, asegurando calidad, cumplimiento y mejora continua.`,
          correo: 'rflores@smart-center.com.mx',
          telefono: '5543555317',
          foto: 'ASSETS/IMAGES/contador a.jpg',
          hijos: [
            node({ 
              id: 'contador-b', 
              nombre: 'Gerardo López Laguna', 
              puesto: 'Coordinador de contabilidad', 
              area: 'Finanzas',
              descripcion: `•	Coordinar el registro y control contable: Dar seguimiento al registro de gastos, validación de facturas y correcta aplicación contable, asegurando información oportuna y ordenada.
                           •	Gestionar procesos administrativos-contables: Coordinar la ejecución de reembolsos y control de cuentas, verificando el cumplimiento de políticas internas y tiempos establecidos.
                           •	Supervisar la operación del equipo contable: Dar seguimiento a las actividades del auxiliar contable, analista contable y de activos fijos, asegurando cumplimiento, calidad y continuidad en la operación.`,
              correo: 'glopez@smart-center.com.mx',
              telefono: '5566023543',
              foto: 'ASSETS/IMAGES/contador b.jpg',
		          hijos: [
			          node({
				          id: 'analista-contabilidad',
				          nombre: 'Gonzalo Javier Cuautle Alaguna',
				          puesto: 'Analista de contabilidad',
				          area: 'Finanzas',
				          descripcion: '',
				          correo: '',
				          telefono: '',
				          foto: ''
			          }),
		          ]
            }),
	        ]
	      }),
        node({
          id: 'Analista-nomina-01',
          offsetNivel: 2,
          nombre: 'Maria Luisa Gonzalez Ramos',
          puesto: 'Analista de nomina',
          area: 'Nomina',
          descripcion: `•	Entrega de pre nómina al área de nómina
                            •	Pago a los empleados los días de quincena
                            •	Atención a los empleados con temas relacionados a pagos`,
          correo: 'auxiliar.nominas@smart-center.com.mx',
          telefono: '5578336816',
          foto: 'ASSETS/IMAGES/Coordinador Nomina.jpg',
          hijos: [
            node({ 
              id: 'aux-nomina-01', 
              nombre: 'Jaquelin Moreno Romero', 
              puesto: 'Auxiliar de Nomina', 
              area: 'Nomina',
             }),
            node({ 
              id: 'aux-nomina-02', 
              nombre: 'Luis Aaron Zabaya', 
              puesto: 'Auxiliar de nomina', 
              area: 'Nomina',
              descripcion: `•	Cálculo de finiquitos
                            •	Cierre de nómina
                            •	Envío de nómina y finiquitos a las pagadoras`,
              correo: '',
              telefono: '',
              foto: '',
            })
          ]
        }),
        node({
          id: 'Consultora',
          offsetNivel: 1,
          nombre: 'Irma Elizabeth Ibarra Almanci',
          puesto: 'Consultora',
          area: 'Finanzas',
          descripcion: '',
          correo: '',
          telefono: '',
          foto: '',
          hijos: [
              node({
                id: 'Analista-nomina-02',
                nombre: 'Ana Karen Lopez Santiago',
                puesto: 'Analista de Nomina',
                area: 'Nomina',
                descripcion: '',
                correo: '',
                telefono: '',
                foto: '',
                hijos: [
                    node({
                      id: 'Auxiliar-nomina-01',
                      nombre: 'Linda Lizbeth Castro Gudiño',
                      puesto: 'Auxiliar de Nomina',
                      area: 'Nomina',
                      descripcion: '',
                      correo: '',
                      telefono: '',
                      foto: '',
                    }),
                    node({
                      id: 'Auxiliar-nomina-02',
                      nombre: 'Vacante',
                      puesto: 'Auxiliar de Nomina',
                      area: 'Nomina',
                      descripcion: '',
                      correo: '',
                      telefono: '',
                      foto: '',
                    }),
                  ]
                })
          ]
        })
      ]
    })
  ]
});

const PLACEHOLDER_PHOTO = avatarSvg('SC');
