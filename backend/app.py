
"""Servidor Flask para AutoDiagnostico.

Recibe y valida las respuestas del cuestionario,
se comunica con SWI-Prolog y ofrece rutas para
consultar los resultados del sistema experto.
"""

from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

from prolog_bridge import (
    verificar_prolog,
    consultar_prolog,
    consultar_varios,
    enviar_respuestas_prolog,
    obtener_fallas_posibles,
    consultar_diagnostico_dinamico
)


# ==========================================
# 1. CONFIGURACION DEL PROYECTO
# ==========================================

ROOT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT_DIR / "frontend"

app = Flask(
    __name__,
    static_folder=str(FRONTEND_DIR),
    static_url_path="/static"
)


# ==========================================
# 2. VALIDACION DE RESPUESTAS
# ==========================================

ALLOWED_ANSWERS = {
    "tipo_auto": {
        "gasolina", "otro", "no_se"
    },

    "transmision": {
        "manual", "automatica", "no_se"
    },

    "problema": {
        "no_arranca",
        "pierde_potencia",
        "temperatura",
        "ruido",
        "frenos",
        "humo",
        "consumo",
        "check_engine",
        "cambios",
        "olor_gasolina",
        "vibracion",
        "fuga",
        "direccion",
        "clutch",
        "otro"
    },

    "duracion": {
        "hoy",
        "dias",
        "semanas",
        "intermitente",
        "no_se"
    }
}


DETALLES_PERMITIDOS = {
    "no_gira",
    "gira_no_enciende",
    "enciende_apaga",
    "subida",
    "acelerar",
    "siempre",
    "alta_velocidad",
    "muy_alta",
    "variable",
    "normal",
    "sin_indicador",
    "chillido",
    "zumbido",
    "golpeteo",
    "al_girar",
    "pedal_fondo",
    "esponjoso",
    "vibra_pedal",
    "vibra_volante",
    "azul",
    "blanco_espeso",
    "negro",
    "blanco_breve",
    "mucho",
    "humo_negro",
    "fija",
    "parpadea",
    "se_apago",
    "raspa",
    "dura",
    "en_frio",
    "interior",
    "exterior",
    "al_cargar",
    "tiembla",
    "rpm_variable",
    "verde_rosa",
    "negra",
    "clara_roja",
    "izquierda",
    "derecha",
    "vibracion",
    "patina",
    "olor",
    "dificultad",
    "varios",
    "ninguno",
    "no_se"
}

ALLOWED_ANSWERS["detalle"] = DETALLES_PERMITIDOS


# ==========================================
# 3. PAGINA PRINCIPAL
# ==========================================

@app.get("/")
def index():
    """Muestra el cuestionario web."""

    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


# ==========================================
# 4. ESTADO DEL BACKEND
# ==========================================

@app.get("/api/estado")
def estado():
    """Comprueba que Flask funciona."""

    return jsonify({
        "estado": "ok",
        "mensaje": "Backend de AutoDiagnostico funcionando."
    })


# ==========================================
# 5. RECIBIR RESPUESTAS DEL CUESTIONARIO
# ==========================================

@app.post("/api/respuestas")
def recibir_respuestas():
    """Recibe y valida las respuestas del usuario."""

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "estado": "error",
            "error": "Debes enviar un objeto JSON."
        }), 400

    respuestas_recibidas = data.get("respuestas")

    if not isinstance(respuestas_recibidas, dict):
        return jsonify({
            "estado": "error",
            "error": "Falta el objeto 'respuestas'."
        }), 400

    respuestas_validas = {}

    # Comprobar respuestas recibidas
    for pregunta, respuesta in respuestas_recibidas.items():

        if pregunta not in ALLOWED_ANSWERS:
            return jsonify({
                "estado": "error",
                "error": f"Pregunta no reconocida: {pregunta}."
            }), 400

        if (
            not isinstance(respuesta, str)
            or respuesta not in ALLOWED_ANSWERS[pregunta]
        ):
            return jsonify({
                "estado": "error",
                "error": f"Respuesta no valida para: {pregunta}."
            }), 400

        respuestas_validas[pregunta] = respuesta

    # Comprobar que no falten preguntas
    requeridas = set(ALLOWED_ANSWERS.keys())
    faltantes = requeridas - set(respuestas_validas.keys())

    if faltantes:
        return jsonify({
            "estado": "error",
            "error": "Faltan respuestas obligatorias.",
            "faltantes": sorted(faltantes)
        }), 400

    # ======================================
    # ADVERTENCIAS DE SEGURIDAD
    # ======================================

    advertencia = None
    problema = respuestas_validas["problema"]

    if problema == "frenos":
        advertencia = (
            "Si los frenos fallan o el pedal se va al fondo, "
            "no conduzcas; solicita asistencia."
        )

    elif problema == "olor_gasolina":
        advertencia = (
            "Si el olor a gasolina es fuerte, apaga el motor "
            "en un lugar seguro y evita chispas o llamas."
        )

    elif problema == "temperatura":
        advertencia = (
            "Si la temperatura esta en zona roja o sale vapor, "
            "apaga el motor cuando sea seguro y no abras "
            "el sistema caliente."
        )

    elif problema == "humo":
        advertencia = (
            "Si hay humo abundante o senales de fuego, "
            "detente de forma segura y pide ayuda."
        )

    # ======================================
    # ENVIAR RESPUESTAS A SWI-PROLOG
    # ======================================

    # Se conserva la conexion de prueba
    # que ya funcionaba con recibir_respuestas/4.

    datos_para_prolog = {
        campo: respuestas_validas[campo]
        for campo in (
            "tipo_auto",
            "transmision",
            "problema",
            "duracion"
        )
    }

    resultado_prolog = enviar_respuestas_prolog(
        datos_para_prolog
    )

    if resultado_prolog["estado"] != "ok":
        return jsonify({
            "estado": "error",
            "error": resultado_prolog.get(
                "mensaje",
                "Error al comunicarse con Prolog."
            )
        }), 503

    return jsonify({
        "estado": "ok",
        "mensaje": (
            "Flask envio las respuestas a "
            "SWI-Prolog correctamente."
        ),
        "respuestas": respuestas_validas,
        "advertencia": advertencia,
        "datos_prolog": resultado_prolog["datos_prolog"]
    })


# ==========================================
# 6. PRUEBA DE CONEXION CON PROLOG
# ==========================================

@app.get("/api/prolog/prueba")
def prueba_prolog():

    resultado = consultar_prolog()

    if resultado["estado"] == "ok":
        return jsonify(resultado), 200

    return jsonify(resultado), 503


# ==========================================
# 7. PRUEBA DE MULTIPLES RESULTADOS
# ==========================================

@app.get("/api/prolog/varios")
def prueba_varios():

    resultado = consultar_varios()

    if resultado["estado"] == "ok":
        return jsonify(resultado), 200

    return jsonify(resultado), 503


# ==========================================
# 8. CONSULTAR FALLAS DEL CASO FIJO
# ==========================================

@app.get("/api/prolog/fallas")
def consultar_fallas():

    resultado = obtener_fallas_posibles()

    if resultado["estado"] == "ok":
        return jsonify(resultado), 200

    return jsonify(resultado), 503


# ==========================================
# 9. DIAGNOSTICO DINAMICO
# ==========================================

@app.post("/api/prolog/diagnostico")
def diagnostico_dinamico():
    """Consulta Prolog con los datos enviados por Flask."""

    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return jsonify({
            "estado": "error",
            "mensaje": "Debes enviar un objeto JSON."
        }), 400

    campos = (
        "tipo_auto",
        "problema",
        "detalle"
    )

    # Validar las respuestas
    for campo in campos:

        valor = datos.get(campo)

        if (
            not isinstance(valor, str)
            or valor not in ALLOWED_ANSWERS[campo]
        ):
            return jsonify({
                "estado": "error",
                "mensaje": f"Valor invalido para {campo}."
            }), 400

    # Consultar las reglas escritas en Prolog
    resultado = consultar_diagnostico_dinamico(datos)

    if resultado["estado"] != "ok":
        return jsonify(resultado), 503

    return jsonify(resultado), 200


# ==========================================
# 10. INICIAR SERVIDOR
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)
