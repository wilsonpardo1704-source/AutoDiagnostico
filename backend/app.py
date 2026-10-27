"""Servidor Flask para AutoDiagnostico: cuestionario y consultas a SWI-Prolog."""
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
from prolog_bridge import (
    verificar_prolog, consultar_prolog, consultar_varios,
    enviar_respuestas_prolog, obtener_fallas_posibles,
    consultar_diagnostico_dinamico,
)

ROOT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT_DIR / 'frontend'
app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path='/static')

ALLOWED_ANSWERS = {
    'tipo_auto': {'gasolina', 'otro', 'no_se'},
    'transmision': {'manual', 'automatica', 'cvt', 'no_se'},
    'problema': {
        'no_arranca', 'pierde_potencia', 'temperatura', 'ruido', 'frenos',
        'humo', 'consumo', 'check_engine', 'cambios', 'olor_gasolina',
        'vibracion', 'fuga', 'direccion', 'clutch', 'otro',
    },
    'duracion': {'hoy', 'dias', 'semanas', 'intermitente', 'no_se',
                 'reciente', 'unos_dias', 'continuo'},
}
DETALLES_PERMITIDOS = {
    'no_gira', 'gira_no_enciende', 'enciende_apaga', 'subida', 'acelerar',
    'siempre', 'alta_velocidad', 'muy_alta', 'variable', 'normal',
    'sin_indicador', 'chillido', 'zumbido', 'golpeteo', 'al_girar',
    'pedal_fondo', 'esponjoso', 'vibra_pedal', 'vibra_volante',
    'azul', 'blanco_espeso', 'negro', 'blanco_breve', 'mucho', 'humo_negro',
    'fija', 'parpadea', 'se_apago', 'raspa', 'dura', 'en_frio', 'interior',
    'exterior', 'al_cargar', 'tiembla', 'rpm_variable', 'verde_rosa',
    'negra', 'clara_roja', 'izquierda', 'derecha', 'vibracion', 'patina',
    'olor', 'dificultad', 'varios', 'ninguno', 'no_se',
}
ALLOWED_ANSWERS['detalle'] = DETALLES_PERMITIDOS

# Traduccion de las opciones de la web a los atomos existentes en Prolog.
DURACION_PROLOG = {
    'hoy': 'reciente', 'dias': 'unos_dias', 'semanas': 'semanas',
    'intermitente': 'continuo', 'reciente': 'reciente',
    'unos_dias': 'unos_dias', 'continuo': 'continuo',
}
PROBLEMAS_CON_DIAGNOSTICO = {
    'no_arranca', 'pierde_potencia', 'temperatura', 'ruido', 'frenos'
}


def validar(datos, campos):
    if not isinstance(datos, dict):
        return 'Debes enviar un objeto JSON.'
    for campo in campos:
        if campo not in datos:
            return f'Falta el campo obligatorio: {campo}.'
        if not isinstance(datos[campo], str) or datos[campo] not in ALLOWED_ANSWERS[campo]:
            return f'Valor invalido para {campo}.'
    return None


def advertencia_seguridad(problema):
    avisos = {
        'frenos': 'Si los frenos fallan o el pedal se va al fondo, no conduzcas; solicita asistencia.',
        'olor_gasolina': 'Si el olor a gasolina es fuerte, apaga el motor en un lugar seguro y evita chispas o llamas.',
        'temperatura': 'Si la temperatura esta en zona roja o sale vapor, detente cuando sea seguro y no abras el sistema caliente.',
        'humo': 'Si hay humo abundante o senales de fuego, detente de forma segura y pide ayuda.',
    }
    return avisos.get(problema)


def preparar_consulta(datos):
    """No inventa sintomas: los casos no soportados devuelven cero hipotesis."""
    if datos['tipo_auto'] != 'gasolina' or datos['problema'] not in PROBLEMAS_CON_DIAGNOSTICO:
        return None
    consulta = {campo: datos[campo] for campo in ('tipo_auto', 'problema', 'detalle')}
    trans = datos.get('transmision')
    duracion = DURACION_PROLOG.get(datos.get('duracion'))
    # Si no hay certeza sobre la transmision/duracion, se usa el modo basico.
    if trans in {'manual', 'automatica', 'cvt'} and duracion:
        consulta.update(transmision=trans, duracion=duracion)
    return consulta


def ejecutar_diagnostico(datos):
    consulta = preparar_consulta(datos)
    if consulta is None:
        return {'estado': 'ok', 'causas': [], 'cantidad': 0,
                'diagnosticos': [], 'modo': 'sin_cobertura'}
    return consultar_diagnostico_dinamico(consulta)


@app.get('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.get('/api/estado')
def estado():
    return jsonify({'estado': 'ok', 'mensaje': 'Backend de AutoDiagnostico funcionando.'})


@app.post('/api/respuestas')
def recibir_respuestas():
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or not isinstance(data.get('respuestas'), dict):
        return jsonify({'estado': 'error', 'error': "Falta el objeto 'respuestas'."}), 400
    respuestas = data['respuestas']
    desconocidas = set(respuestas) - set(ALLOWED_ANSWERS)
    if desconocidas:
        return jsonify({'estado': 'error', 'error': f'Pregunta no reconocida: {sorted(desconocidas)[0]}.'}), 400
    error = validar(respuestas, ALLOWED_ANSWERS.keys())
    if error:
        return jsonify({'estado': 'error', 'error': error}), 400
    puente = enviar_respuestas_prolog(respuestas)
    if puente['estado'] != 'ok':
        return jsonify({'estado': 'error', 'error': puente.get('mensaje', 'Error de Prolog.')}), 503
    return jsonify({
        'estado': 'ok', 'mensaje': 'Flask envio las respuestas a SWI-Prolog correctamente.',
        'respuestas': respuestas,
        'advertencia': advertencia_seguridad(respuestas['problema']),
        'datos_prolog': puente['datos_prolog'],
    })


@app.get('/api/prolog/prueba')
def prueba_prolog():
    resultado = consultar_prolog()
    return jsonify(resultado), 200 if resultado['estado'] == 'ok' else 503


@app.get('/api/prolog/varios')
def prueba_varios():
    resultado = consultar_varios()
    return jsonify(resultado), 200 if resultado['estado'] == 'ok' else 503


@app.get('/api/prolog/fallas')
def consultar_fallas():
    resultado = obtener_fallas_posibles()
    return jsonify(resultado), 200 if resultado['estado'] == 'ok' else 503


@app.post('/api/prolog/diagnostico')
def diagnostico_dinamico():
    datos = request.get_json(silent=True)
    error = validar(datos, ('tipo_auto', 'problema', 'detalle'))
    if error:
        return jsonify({'estado': 'error', 'mensaje': error}), 400
    # Los campos opcionales deben venir ambos o ninguno.
    for campo in ('transmision', 'duracion'):
        if campo in datos:
            error = validar(datos, (campo,))
            if error:
                return jsonify({'estado': 'error', 'mensaje': error}), 400
    resultado = ejecutar_diagnostico(datos)
    if resultado['estado'] != 'ok':
        return jsonify(resultado), 503
    resultado['advertencia'] = advertencia_seguridad(datos['problema'])
    if resultado['cantidad'] == 0:
        resultado['mensaje'] = 'No hay informacion suficiente para proponer una causa con las reglas actuales.'
    return jsonify(resultado), 200


if __name__ == '__main__':
    app.run(debug=True)
