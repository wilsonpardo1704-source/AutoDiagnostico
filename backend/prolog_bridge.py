import json
import re
import shutil
import subprocess
from pathlib import Path

CARPETA_PROYECTO = Path(__file__).resolve().parent.parent
ARCHIVO_PROLOG = CARPETA_PROYECTO / 'prolog' / 'diagnostico.pl'
ATOMO = re.compile(r'[a-z][a-z0-9_]*\Z')


def _ejecutar(objetivo):
    ejecutable = shutil.which('swipl')
    if not ejecutable:
        return {'estado': 'error', 'mensaje': 'No se encontro SWI-Prolog.'}
    if not ARCHIVO_PROLOG.is_file():
        return {'estado': 'error', 'mensaje': 'No existe diagnostico.pl.'}
    try:
        resultado = subprocess.run(
            [ejecutable, '-q', '-s', str(ARCHIVO_PROLOG), '-g', objetivo, '-t', 'halt'],
            capture_output=True, text=True, timeout=15, check=False, encoding='utf-8', errors='replace'
        )
    except (OSError, subprocess.SubprocessError) as error:
        return {'estado': 'error', 'mensaje': str(error)}
    if resultado.returncode != 0:
        return {'estado': 'error', 'mensaje': resultado.stderr.strip() or 'Error al consultar Prolog.'}
    return {'estado': 'ok', 'salida': resultado.stdout}


def verificar_prolog():
    ejecutable = shutil.which('swipl')
    if not ejecutable:
        return {'estado': 'error', 'mensaje': 'No se encontro SWI-Prolog.'}
    try:
        resultado = subprocess.run([ejecutable, '--version'], capture_output=True, text=True, timeout=10, check=True)
        return {'estado': 'ok', 'mensaje': 'Python se comunico correctamente con SWI-Prolog.',
                'version': resultado.stdout.strip(), 'archivo_prolog_existe': ARCHIVO_PROLOG.is_file()}
    except (OSError, subprocess.SubprocessError) as error:
        return {'estado': 'error', 'mensaje': str(error)}


def consultar_prolog():
    resultado = _ejecutar('estado_sistema(X),writeln(X)')
    if resultado['estado'] != 'ok':
        return resultado
    return {'estado': 'ok', 'resultado': resultado['salida'].strip()}


def consultar_varios():
    resultado = _ejecutar('forall(color_prueba(X),writeln(X))')
    if resultado['estado'] != 'ok':
        return resultado
    return {'estado': 'ok', 'soluciones': resultado['salida'].splitlines()}


def _validar_atomos(respuestas, campos):
    valores = []
    for campo in campos:
        valor = respuestas.get(campo)
        if not isinstance(valor, str) or not ATOMO.fullmatch(valor):
            return None
        valores.append(valor)
    return valores


def enviar_respuestas_prolog(respuestas):
    if not isinstance(respuestas, dict):
        return {'estado': 'error', 'mensaje': 'Datos invalidos.'}
    valores = _validar_atomos(respuestas, ('tipo_auto', 'transmision', 'problema', 'duracion'))
    if valores is None:
        return {'estado': 'error', 'mensaje': 'Las respuestas contienen valores invalidos.'}
    resultado = _ejecutar('recibir_respuestas(' + ','.join(valores) + ')')
    if resultado['estado'] != 'ok':
        return resultado
    return {'estado': 'ok', 'datos_prolog': resultado['salida'].strip()}


def consultar_diagnostico_dinamico(respuestas):
    """Obtiene causas, explicaciones y recomendaciones desde SWI-Prolog."""
    if not isinstance(respuestas, dict):
        return {'estado': 'error', 'mensaje': 'Datos invalidos.'}

    valores = _validar_atomos(respuestas, ('tipo_auto', 'problema', 'detalle'))
    if valores is None:
        return {'estado': 'error', 'mensaje': 'Las respuestas contienen valores invalidos.'}

    tipo, problema, detalle = valores
    transmision = respuestas.get('transmision')
    duracion = respuestas.get('duracion')
    completo = transmision is not None and duracion is not None

    if completo:
        adicionales = _validar_atomos(respuestas, ('transmision', 'duracion'))
        if adicionales is None:
            return {'estado': 'error', 'mensaje': 'Transmision o duracion invalidas.'}
        transmision, duracion = adicionales
        # Traduccion de las opciones de la interfaz al vocabulario de Prolog.
        duracion = {'hoy': 'reciente', 'dias': 'unos_dias',
                    'intermitente': 'continuo'}.get(duracion, duracion)
        # "no_se" no es una duracion valida en el sistema experto.
        if duracion == 'no_se' or transmision == 'no_se':
            completo = False
        else:
            consulta = f'posible_causa_completa({tipo},{transmision},{problema},{detalle},{duracion},Causa)'

    if not completo:
        consulta = f'posible_causa({tipo},{problema},{detalle},Causa)'

    # json_write_dict requiere una representacion JSON consistente.
    # format('~q',...) no sirve: imprime terminos de Prolog, no JSON.
    # json_write_dict/2 convierte atomos a cadenas JSON al usar width(0).
    objetivo = (
        'use_module(library(http/json)),'
        'forall((' + consulta + '),('
        f"(explicacion({problema},{detalle},Causa,Exp)->true;Exp=''),"
        "(recomendacion(Causa,Rec)->true;Rec=''),"
        'atom_string(Causa,CausaTexto),'
        'atom_string(Exp,ExpTexto),'
        'atom_string(Rec,RecTexto),'
        'json_write_dict(current_output, '
        'json{causa:CausaTexto,explicacion:ExpTexto,recomendacion:RecTexto}, [width(0)]),nl))'
    )
    resultado = _ejecutar(objetivo)
    if resultado['estado'] != 'ok':
        return resultado

    diagnosticos = []
    for linea in resultado['salida'].splitlines():
        if not linea.strip():
            continue
        try:
            dato = json.loads(linea)
        except json.JSONDecodeError as error:
            return {'estado': 'error', 'mensaje':
                    f'Prolog devolvio texto no valido como JSON: {linea[:160]!r}. Detalle: {error}'}
        if not isinstance(dato, dict) or not isinstance(dato.get('causa'), str):
            return {'estado': 'error', 'mensaje': 'Prolog devolvio un diagnostico con formato inesperado.'}
        diagnosticos.append(dato)

    unicos = list({d['causa']: d for d in diagnosticos}.values())
    return {'estado': 'ok', 'causas': [d['causa'] for d in unicos],
            'cantidad': len(unicos), 'diagnosticos': unicos,
            'modo': 'completo' if completo else 'basico'}


def obtener_fallas_posibles():
    resultado = consultar_diagnostico_dinamico({
        'tipo_auto': 'gasolina', 'problema': 'no_arranca', 'detalle': 'gira_no_enciende'
    })
    if resultado['estado'] != 'ok':
        return resultado
    return {'estado': 'ok', 'fallas': resultado['causas'], 'cantidad': resultado['cantidad']}
