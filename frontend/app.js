
/*
  AUTODIAGNÓSTICO
  Cuestionario de 5 problemas automotrices.
  Conectado con Flask y SWI-Prolog.
*/

// ==========================================
// 1. PREGUNTAS PRINCIPALES
// ==========================================

const questions = [
  {
    id: "tipo_auto",
    category: "PARA EMPEZAR",
    title: "¿Qué tipo de automóvil tienes?",
    help: "Este sistema está diseñado para automóviles de gasolina.",
    options: [
      { value: "gasolina", label: "Automóvil de gasolina" },
      { value: "otro", label: "Diésel, híbrido o eléctrico" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },
  {
    id: "transmision",
    category: "TU AUTOMÓVIL",
    title: "¿Qué tipo de transmisión tiene?",
    help: "Selecciona la opción correspondiente.",
    options: [
      { value: "manual", label: "Manual (estándar)" },
      { value: "automatica", label: "Automática" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },
  {
    id: "problema",
    category: "SÍNTOMA PRINCIPAL",
    title: "¿Cuál es el problema principal que has notado?",
    help: "Selecciona el problema que mejor describa la situación.",
    options: [
      { value: "no_arranca", label: "El automóvil no arranca" },
      { value: "pierde_potencia", label: "El motor pierde fuerza" },
      { value: "temperatura", label: "El motor se calienta demasiado" },
      { value: "ruido", label: "Escucho un ruido inusual" },
      { value: "frenos", label: "Tengo problemas con los frenos" }
    ]
  },
  {
    id: "duracion",
    category: "DETALLES",
    title: "¿Cuándo comenzó el problema?",
    help: "Indica cuándo empezaste a notarlo.",
    options: [
      { value: "hoy", label: "Hoy, de repente" },
      { value: "dias", label: "Hace unos días" },
      { value: "semanas", label: "Hace varias semanas o más" },
      { value: "intermitente", label: "Aparece y desaparece" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  }
];

// ==========================================
// 2. PREGUNTAS ESPECÍFICAS
// ==========================================

const preguntasEspecificas = {
  no_arranca: {
    id: "detalle",
    title: "¿Qué sucede cuando intentas encender el automóvil?",
    options: [
      { value: "no_gira", label: "El motor no gira" },
      { value: "gira_no_enciende", label: "El motor gira, pero no enciende" },
      { value: "enciende_apaga", label: "Enciende y se apaga" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  pierde_potencia: {
    id: "detalle",
    title: "¿Cuándo notas que el motor pierde fuerza?",
    options: [
      { value: "subida", label: "Al subir una pendiente" },
      { value: "acelerar", label: "Al acelerar" },
      { value: "siempre", label: "Todo el tiempo" },
      { value: "alta_velocidad", label: "A velocidades altas" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  temperatura: {
    id: "detalle",
    title: "¿Qué observas en el indicador de temperatura?",
    options: [
      { value: "muy_alta", label: "La temperatura está muy alta" },
      { value: "variable", label: "La temperatura sube y baja" },
      { value: "normal", label: "Parece normal" },
      { value: "sin_indicador", label: "Mi automóvil no tiene indicador" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  ruido: {
    id: "detalle",
    title: "¿Qué tipo de ruido escuchas?",
    options: [
      { value: "chillido", label: "Un chillido agudo" },
      { value: "zumbido", label: "Un zumbido" },
      { value: "golpeteo", label: "Un golpeteo metálico" },
      { value: "al_girar", label: "Ruido al girar el volante" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  frenos: {
    id: "detalle",
    title: "¿Qué sucede cuando utilizas los frenos?",
    options: [
      { value: "pedal_fondo", label: "El pedal se va hasta el fondo" },
      { value: "esponjoso", label: "El pedal se siente esponjoso" },
      { value: "vibra_pedal", label: "Vibra el pedal" },
      { value: "vibra_volante", label: "Vibra el volante al frenar" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  }
};

// ==========================================
// 3. ESTADO DEL CUESTIONARIO
// ==========================================

let currentIndex = 0;
const answers = {};
let ultimasCausas = [];
let ultimosDiagnosticos = [];

const stepLabel = document.getElementById("step-label");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");
const category = document.getElementById("question-category");
const title = document.getElementById("question-title");
const help = document.getElementById("question-help");
const optionsContainer = document.getElementById("options");
const warning = document.getElementById("warning");
const errorMessage = document.getElementById("error-message");
const panel = document.getElementById("question-panel");
const summary = document.getElementById("summary");
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");

// ==========================================
// 4. ACTUALIZAR PREGUNTAS
// ==========================================

function actualizarPreguntas() {
  const preguntasBase = questions.filter(
    pregunta => pregunta.id !== "detalle"
  );

  const problema = answers.problema;

  if (problema && preguntasEspecificas[problema]) {
    const preguntaDetalle = {
      ...preguntasEspecificas[problema],
      category: "DETALLES DEL PROBLEMA",
      help: "Selecciona la opción que mejor describa lo que sucede."
    };

    const posicion = preguntasBase.findIndex(
      pregunta => pregunta.id === "duracion"
    );

    preguntasBase.splice(posicion, 0, preguntaDetalle);
  }

  questions.length = 0;
  questions.push(...preguntasBase);
}

// ==========================================
// 5. MOSTRAR PREGUNTAS
// ==========================================

function renderQuestion() {
  const question = questions[currentIndex];

  const percent = Math.round(
    ((currentIndex + 1) / questions.length) * 100
  );

  stepLabel.textContent =
    `Pregunta ${currentIndex + 1} de ${questions.length}`;

  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;

  category.textContent = question.category;
  title.textContent = question.title;
  help.textContent = question.help;

  optionsContainer.replaceChildren();

  warning.classList.add("hidden");
  errorMessage.classList.add("hidden");

  if (question.id === "detalle") {
    showSafetyWarning();
  }

  backButton.disabled = currentIndex === 0;
  nextButton.disabled = false;

  nextButton.textContent =
    currentIndex === questions.length - 1
      ? "Enviar respuestas"
      : "Continuar";

  question.options.forEach(option => {
    const label = document.createElement("label");
    label.className = "option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = question.id;
    input.value = option.value;
    input.checked = answers[question.id] === option.value;

    const text = document.createElement("span");
    text.textContent = option.label;

    label.append(input, text);
    optionsContainer.appendChild(label);
  });
}

// ==========================================
// 6. OBTENER RESPUESTA
// ==========================================

function getSelectedValue() {
  const selected = optionsContainer.querySelector("input:checked");
  return selected ? selected.value : null;
}

// ==========================================
// 7. ADVERTENCIAS DE SEGURIDAD
// ==========================================

function showSafetyWarning() {
  const problema = answers.problema;
  let mensaje = "";

  if (problema === "frenos") {
    mensaje =
      "Seguridad: si los frenos no funcionan correctamente, " +
      "no conduzcas el automóvil y solicita asistencia.";

  } else if (problema === "temperatura") {
    mensaje =
      "Seguridad: si la temperatura está muy alta " +
      "o sale vapor, detente en un lugar seguro y apaga " +
      "el motor. No abras el sistema mientras esté caliente.";
  }

  if (mensaje) {
    warning.textContent = mensaje;
    warning.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
  }
}

// ==========================================
// 8. BOTÓN CONTINUAR
// ==========================================

nextButton.addEventListener("click", async () => {
  const question = questions[currentIndex];
  const selected = getSelectedValue();

  if (!selected) {
    errorMessage.classList.remove("hidden");
    return;
  }

  // Esta versión solo admite gasolina.
  if (question.id === "tipo_auto" && selected !== "gasolina") {
    warning.textContent =
      "Por ahora, el sistema está diseñado únicamente " +
      "para automóviles de gasolina. Consulta el manual " +
      "si no conoces el tipo de motor.";

    warning.classList.remove("hidden");
    return;
  }

  answers[question.id] = selected;
  errorMessage.classList.add("hidden");

  // Agregar la pregunta específica del problema.
  if (question.id === "problema") {
    delete answers.detalle;
    actualizarPreguntas();
  }

  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    await sendAnswersToBackend();
  }
});

// ==========================================
// 9. BOTÓN REGRESAR
// ==========================================

backButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    const selected = getSelectedValue();

    if (selected) {
      answers[questions[currentIndex].id] = selected;
    }

    currentIndex--;
    renderQuestion();
  }
});

// ==========================================
// 10. OBTENER ETIQUETAS DE RESPUESTAS
// ==========================================

function getAnswerLabel(questionId, value) {
  const question = questions.find(
    q => q.id === questionId
  );

  if (!question) {
    return value;
  }

  const option = question.options.find(
    item => item.value === value
  );

  return option ? option.label : value;
}

// ==========================================
// 11. ETIQUETAS DE RESULTADOS PROLOG
// ==========================================

// Solo cambia la presentación de los resultados.
// Las causas son calculadas por las reglas Prolog.

const etiquetasCausas = {
  alimentacion_combustible:
    "Posible problema de alimentación de combustible",

  sistema_encendido:
    "Posible problema del sistema de encendido",

  bateria_conexiones_electricas:
    "Posible problema de batería o conexiones eléctricas",

  filtro_aire_obstruido:
    "Posible filtro de aire obstruido"
};

// ==========================================
// 12. MOSTRAR HIPÓTESIS
// ==========================================

function mostrarHipotesis(causas, diagnosticos = []) {
  const list = document.getElementById("answers-list");
  let contenedor = document.getElementById("prolog-resultados");

  if (!contenedor) {
    contenedor = document.createElement("section");
    contenedor.id = "prolog-resultados";
    contenedor.style.marginTop = "24px";

    list.insertAdjacentElement("afterend", contenedor);
  }

  contenedor.replaceChildren();

  const titulo = document.createElement("h3");
  titulo.textContent = "Posibles causas según Prolog";
  contenedor.appendChild(titulo);

  const aviso = document.createElement("p");
  aviso.textContent =
    "Estas son hipótesis orientativas, no un diagnóstico confirmado.";

  contenedor.appendChild(aviso);

  if (!causas.length) {
    const mensaje = document.createElement("p");

    mensaje.textContent =
      "Todavía no hay reglas disponibles para esta " +
      "combinación de respuestas. No es posible determinar " +
      "una causa con la información actual.";

    contenedor.appendChild(mensaje);
    return;
  }

  const lista = document.createElement("ul");

  causas.forEach(causa => {
    const item = document.createElement("li");
    const nombre = document.createElement("strong");
    nombre.textContent = etiquetasCausas[causa] || causa.replaceAll("_", " ");
    item.appendChild(nombre);

    const diagnostico = diagnosticos.find(d => d.causa === causa);
    if (diagnostico?.explicacion) {
      const explicacion = document.createElement("p");
      explicacion.textContent = "Explicación: " + diagnostico.explicacion.replaceAll("_", " ");
      item.appendChild(explicacion);
    }
    if (diagnostico?.recomendacion) {
      const recomendacion = document.createElement("p");
      recomendacion.textContent = "Recomendación: " + diagnostico.recomendacion;
      item.appendChild(recomendacion);
    }
    lista.appendChild(item);
  });

  contenedor.appendChild(lista);
}

// ==========================================
// 13. ENVIAR RESPUESTAS A FLASK Y PROLOG
// ==========================================

async function sendAnswersToBackend() {
  nextButton.disabled = true;
  nextButton.textContent = "Consultando...";

  panel.classList.add("hidden");
  summary.classList.remove("hidden");

  const status = document.getElementById("server-status");
  status.className = "status";
  status.textContent = "Enviando respuestas a Flask...";

  const list = document.getElementById("answers-list");
  list.replaceChildren();

  document.getElementById("prolog-resultados")?.remove();

  ultimasCausas = [];
  ultimosDiagnosticos = [];

  try {
    // Primera petición: enviar todas las respuestas.
    const response = await fetch("/api/respuestas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        respuestas: answers
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        data.mensaje ||
        "Flask rechazó las respuestas."
      );
    }

    // Mostrar resumen del cuestionario.
    questions.forEach(pregunta => {
      const value = data.respuestas[pregunta.id];

      if (value === undefined) {
        return;
      }

      const item = document.createElement("li");
      const strong = document.createElement("strong");

      strong.textContent = pregunta.title + " ";

      item.append(
        strong,
        document.createTextNode(
          getAnswerLabel(pregunta.id, value)
        )
      );

      list.appendChild(item);
    });

    // Mostrar advertencias del backend.
    if (data.advertencia) {
      const item = document.createElement("li");

      item.textContent =
        "Aviso de seguridad: " + data.advertencia;

      list.appendChild(item);
    }

    // Segunda petición: consultar reglas de Prolog.
    status.textContent =
      "Respuestas recibidas. Consultando reglas de Prolog...";

    const responseProlog = await fetch(
      "/api/prolog/diagnostico",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo_auto: answers.tipo_auto,
          transmision: answers.transmision,
          problema: answers.problema,
          detalle: answers.detalle,
          duracion: answers.duracion
        })
      }
    );

    const diagnostico = await responseProlog.json();

    if (!responseProlog.ok || diagnostico.estado !== "ok") {
      throw new Error(
        diagnostico.mensaje ||
        diagnostico.error ||
        "No se pudo consultar Prolog."
      );
    }

    ultimasCausas = Array.isArray(diagnostico.causas)
      ? diagnostico.causas
      : [];

    ultimosDiagnosticos = Array.isArray(diagnostico.diagnosticos)
      ? diagnostico.diagnosticos
      : [];
    mostrarHipotesis(ultimasCausas, ultimosDiagnosticos);

    status.textContent =
      `Consulta completada: ${ultimasCausas.length} hipótesis encontradas.`;
    if (answers.duracion === "intermitente") {
      status.textContent += " Nota: el backend interpreta provisionalmente 'intermitente' como 'continuo'.";
    }
    if (diagnostico.modo === "basico") {
      status.textContent += " Se utilizó el diagnóstico básico.";
    }

  } catch (error) {
    status.className = "status failure";

    status.textContent =
      "No se completó la consulta: " + error.message;

  } finally {
    nextButton.disabled = false;
    nextButton.textContent = "Enviar respuestas";
  }
}

// ==========================================
// 14. BOTÓN EMPEZAR DE NUEVO
// ==========================================

document.getElementById("restart-button").addEventListener(
  "click",
  () => {
    currentIndex = 0;

    Object.keys(answers).forEach(
      key => delete answers[key]
    );

    actualizarPreguntas();

    summary.classList.add("hidden");
    panel.classList.remove("hidden");

    document.getElementById("copy-status").textContent = "";
    document.getElementById("prolog-resultados")?.remove();

    ultimasCausas = [];
    ultimosDiagnosticos = [];

    renderQuestion();
  }
);

// ==========================================
// 15. BOTÓN COPIAR RESUMEN
// ==========================================

document.getElementById("copy-button").addEventListener(
  "click",
  async () => {
    const lines = questions.map(question => {
      const respuesta = answers[question.id]
        ? getAnswerLabel(
            question.id,
            answers[question.id]
          )
        : "Sin respuesta";

      return `${question.title}\nRespuesta: ${respuesta}`;
    });

    try {
      const textoCausas = ultimasCausas.length
        ? "\n\nPosibles causas según Prolog:\n" +
          ultimasCausas
            .map(
              causa =>
                "- " + (
                  etiquetasCausas[causa] ||
                  causa.replaceAll("_", " ")
                )
            )
            .join("\n")
        : "\n\nSin hipótesis disponibles para este caso.";

      const textoDetalles = ultimosDiagnosticos.map(d =>
        [d.causa.replaceAll("_", " "),
         d.explicacion ? "Explicación: " + d.explicacion.replaceAll("_", " ") : "",
         d.recomendacion ? "Recomendación: " + d.recomendacion : ""]
          .filter(Boolean).join("\n")
      ).join("\n\n");
      await navigator.clipboard.writeText(
        lines.join("\n\n") + textoCausas +
        (textoDetalles ? "\n\nDetalles del diagnóstico:\n" + textoDetalles : "")
      );

      document.getElementById("copy-status").textContent =
        "Resumen copiado correctamente.";

    } catch (error) {
      document.getElementById("copy-status").textContent =
        "No se pudo copiar automáticamente.";
    }
  }
);

// ==========================================
// 16. INICIAR CUESTIONARIO
// ==========================================

renderQuestion();
