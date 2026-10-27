
/*
  AutoDiagnóstico
  Cuestionario dinámico conectado con Flask.
  Consulta las reglas de SWI-Prolog a través de Flask.
*/

// ==========================================
// 1. PREGUNTAS PRINCIPALES
// ==========================================

const questions = [
  {
    id: "tipo_auto",
    category: "PARA EMPEZAR",
    title: "¿Qué tipo de automóvil tienes?",
    help: "Esta versión está diseñada para automóviles de gasolina.",
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
    help: "Selecciona la opción que corresponda.",
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
    help: "Elige el síntoma que mejor describa lo que sucede.",
    options: [
      { value: "no_arranca", label: "El automóvil no arranca" },
      { value: "pierde_potencia", label: "El motor pierde fuerza" },
      { value: "temperatura", label: "El motor se calienta demasiado" },
      { value: "ruido", label: "Escucho un ruido inusual" },
      { value: "frenos", label: "Vibra al frenar o falla el pedal del freno" },
      { value: "humo", label: "Sale humo por el escape" },
      { value: "consumo", label: "Consume demasiada gasolina" },
      { value: "check_engine", label: "Se encendió Check Engine" },
      { value: "cambios", label: "Tengo problemas al cambiar de velocidad" },
      { value: "olor_gasolina", label: "Huele mucho a gasolina" },
      { value: "vibracion", label: "El motor tiembla cuando está detenido" },
      { value: "fuga", label: "Veo una mancha debajo del automóvil" },
      { value: "direccion", label: "El automóvil se jala hacia un lado" },
      { value: "clutch", label: "El motor se revoluciona, pero el auto no avanza bien" },
      { value: "otro", label: "Otro problema / no estoy seguro" }
    ]
  },
  {
    id: "duracion",
    category: "DETALLES",
    title: "¿Cuándo comenzó el problema?",
    help: "Indica cuándo comenzaste a notar el problema.",
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
// 2. PREGUNTAS ESPECIFICAS
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
      { value: "variable", label: "Sube y baja" },
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
  },

  humo: {
    id: "detalle",
    title: "¿De qué color es el humo del escape?",
    options: [
      { value: "azul", label: "Azul" },
      { value: "blanco_espeso", label: "Blanco espeso y constante" },
      { value: "negro", label: "Negro" },
      { value: "blanco_breve", label: "Blanco ligero que desaparece" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  consumo: {
    id: "detalle",
    title: "¿Qué has notado sobre el consumo de gasolina?",
    options: [
      { value: "mucho", label: "Gasta mucho más que antes" },
      { value: "humo_negro", label: "Gasta más y sale humo negro" },
      { value: "normal", label: "Parece normal" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  check_engine: {
    id: "detalle",
    title: "¿Cómo aparece la luz Check Engine?",
    options: [
      { value: "fija", label: "Permanece encendida" },
      { value: "parpadea", label: "Parpadea" },
      { value: "se_apago", label: "Se encendió y después se apagó" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  cambios: {
    id: "detalle",
    title: "¿Qué sucede al cambiar de velocidad?",
    options: [
      { value: "raspa", label: "Se escucha un rechinido" },
      { value: "dura", label: "La palanca está muy dura" },
      { value: "en_frio", label: "Solo ocurre con el motor frío" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  olor_gasolina: {
    id: "detalle",
    title: "¿Dónde percibes el olor a gasolina?",
    options: [
      { value: "interior", label: "Dentro del automóvil" },
      { value: "exterior", label: "Fuera del automóvil" },
      { value: "al_cargar", label: "Solo al cargar gasolina" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  vibracion: {
    id: "detalle",
    title: "¿Qué sucede cuando el automóvil está detenido?",
    options: [
      { value: "tiembla", label: "El motor tiembla" },
      { value: "enciende_apaga", label: "El motor se apaga solo" },
      { value: "rpm_variable", label: "Las revoluciones suben y bajan" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  fuga: {
    id: "detalle",
    title: "¿Cómo es la mancha debajo del automóvil?",
    options: [
      { value: "verde_rosa", label: "Verde o rosa" },
      { value: "negra", label: "Negra y aceitosa" },
      { value: "clara_roja", label: "Transparente o rojiza" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  direccion: {
    id: "detalle",
    title: "¿Qué has notado al conducir en línea recta?",
    options: [
      { value: "izquierda", label: "Tiende a irse a la izquierda" },
      { value: "derecha", label: "Tiende a irse a la derecha" },
      { value: "vibracion", label: "El volante vibra" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  clutch: {
    id: "detalle",
    title: "¿Qué has notado al utilizar el embrague?",
    options: [
      { value: "patina", label: "El motor acelera, pero el auto avanza poco" },
      { value: "olor", label: "Hay olor a quemado" },
      { value: "dificultad", label: "Es difícil cambiar de velocidad" },
      { value: "no_se", label: "No estoy seguro" }
    ]
  },

  otro: {
    id: "detalle",
    title: "¿Puedes identificar algún síntoma?",
    options: [
      { value: "varios", label: "Tengo varios síntomas" },
      { value: "ninguno", label: "Ninguna opción describe el problema" },
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
// 6. OBTENER RESPUESTA SELECCIONADA
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

  } else if (problema === "olor_gasolina") {
    mensaje =
      "Seguridad: si el olor a gasolina es fuerte, " +
      "detente en un lugar seguro, apaga el motor " +
      "y evita llamas o chispas.";

  } else if (problema === "temperatura") {
    mensaje =
      "Seguridad: si la temperatura está en zona roja " +
      "o sale vapor, detente en un lugar seguro y apaga " +
      "el motor. No abras el sistema mientras esté caliente.";

  } else if (problema === "humo") {
    mensaje =
      "Seguridad: si hay humo abundante, olor a quemado " +
      "o señales de fuego, detente de forma segura " +
      "y solicita ayuda.";
  }

  if (mensaje) {
    warning.textContent = mensaje;
    warning.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
  }
}

// ==========================================
// 8. BOTON CONTINUAR
// ==========================================

nextButton.addEventListener("click", async () => {
  const question = questions[currentIndex];
  const selected = getSelectedValue();

  if (!selected) {
    errorMessage.classList.remove("hidden");
    return;
  }

  // Solo se admiten automóviles de gasolina
  if (question.id === "tipo_auto" && selected !== "gasolina") {
    warning.textContent =
      "Por ahora, el sistema está diseñado únicamente " +
      "para automóviles de gasolina. Si no estás seguro " +
      "del tipo de motor, consulta el manual del vehículo.";

    warning.classList.remove("hidden");
    return;
  }

  // El clutch solo corresponde a transmisión manual
  if (
    question.id === "problema" &&
    selected === "clutch" &&
    answers.transmision !== "manual"
  ) {
    warning.textContent =
      "Este apartado corresponde a automóviles " +
      "con transmisión manual. Selecciona otro problema.";

    warning.classList.remove("hidden");
    return;
  }

  answers[question.id] = selected;
  errorMessage.classList.add("hidden");

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
// 9. BOTON REGRESAR
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
// 10. OBTENER ETIQUETAS
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

// Solo cambia la presentación del texto.
// Las causas se obtienen de las reglas Prolog.

const etiquetasCausas = {
  alimentacion_combustible:
    "Posible problema de alimentación de combustible",

  sistema_encendido:
    "Posible problema del sistema de encendido",

  bateria_conexiones_electricas:
    "Posible problema de batería o conexiones eléctricas"
};

// ==========================================
// 12. MOSTRAR HIPOTESIS
// ==========================================

function mostrarHipotesis(causas) {
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
      "Todavía no hay reglas disponibles para esta combinación de respuestas. " +
      "No es posible determinar una causa con la información actual.";

    contenedor.appendChild(mensaje);
    return;
  }

  const lista = document.createElement("ul");

  causas.forEach(causa => {
    const item = document.createElement("li");

    item.textContent =
      etiquetasCausas[causa] || causa.replaceAll("_", " ");

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

  try {
    // Primero enviar las respuestas completas a Flask
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

    // Mostrar las respuestas en orden
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

    // Mostrar advertencias de seguridad
    if (data.advertencia) {
      const item = document.createElement("li");

      item.textContent =
        "Aviso de seguridad: " + data.advertencia;

      list.appendChild(item);
    }

    // Consultar las reglas dinámicas en SWI-Prolog
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
          problema: answers.problema,
          detalle: answers.detalle
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

    // Guardar las hipótesis obtenidas
    ultimasCausas = Array.isArray(diagnostico.causas)
      ? diagnostico.causas
      : [];

    // Mostrar los resultados en la página
    mostrarHipotesis(ultimasCausas);

    status.textContent =
      `Consulta completada: ${ultimasCausas.length} hipótesis encontradas.`;

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
// 14. BOTON EMPEZAR DE NUEVO
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

    renderQuestion();
  }
);

// ==========================================
// 15. BOTON COPIAR RESUMEN
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
                "- " + (etiquetasCausas[causa] || causa)
            )
            .join("\n")
        : "\n\nSin hipótesis disponibles para este caso.";

      await navigator.clipboard.writeText(
        lines.join("\n\n") + textoCausas
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
