
import subprocess
import shutil
from pathlib import Path

# Ubicacion del proyecto
CARPETA_PROYECTO = Path(__file__).resolve().parent.parent

# Archivo de Prolog
ARCHIVO_PROLOG = CARPETA_PROYECTO / "prolog" / "diagnostico.pl"


def verificar_prolog():
    ejecutable = shutil.which("swipl")

    if ejecutable is None:
        return {
            "estado": "error",
            "mensaje": "No se encontro SWI-Prolog."
        }

    try:
        resultado = subprocess.run(
            [ejecutable, "--version"],
            capture_output=True,
            text=True,
            timeout=10,
            check=True
        )

        return {
            "estado": "ok",
            "mensaje": "Python se comunico correctamente con SWI-Prolog.",
            "version": resultado.stdout.strip(),
            "archivo_prolog_existe": ARCHIVO_PROLOG.is_file()
        }

    except (subprocess.SubprocessError, OSError) as error:
        return {
            "estado": "error",
            "mensaje": str(error)
        }


def consultar_prolog():
    ejecutable = shutil.which("swipl")

    if ejecutable is None:
        return {
            "estado": "error",
            "mensaje": "No se encontro SWI-Prolog."
        }

    if not ARCHIVO_PROLOG.is_file():
        return {
            "estado": "error",
            "mensaje": "No existe diagnostico.pl."
        }

    try:
        resultado = subprocess.run(
            [
                ejecutable,
                "-q",
                "-s", str(ARCHIVO_PROLOG),
                "-g", "estado_sistema(X), writeln(X)",
                "-t", "halt"
            ],
            capture_output=True,
            text=True,
            timeout=10
        )

        if resultado.returncode != 0:
            return {
                "estado": "error",
                "mensaje": resultado.stderr.strip()
            }

        return {
            "estado": "ok",
            "resultado": resultado.stdout.strip()
        }

    except (subprocess.SubprocessError, OSError) as error:
        return {
            "estado": "error",
            "mensaje": str(error)
        }

def consultar_varios():
    ejecutable = shutil.which("swipl")

    if ejecutable is None:
        return {"estado": "error", "mensaje": "No se encontro SWI-Prolog."}

    if not ARCHIVO_PROLOG.is_file():
        return {"estado": "error", "mensaje": "No existe diagnostico.pl."}

    try:
        resultado = subprocess.run(
            [
                ejecutable,
                "-q",
                "-s", str(ARCHIVO_PROLOG),
                "-g", "forall(color_prueba(X), writeln(X))",
                "-t", "halt"
            ],
            capture_output=True,
            text=True,
            timeout=10
        )

        if resultado.returncode != 0:
            return {
                "estado": "error",
                "mensaje": resultado.stderr.strip()
            }

        soluciones = resultado.stdout.strip().splitlines()

        return {
            "estado": "ok",
            "soluciones": soluciones
        }

    except (subprocess.SubprocessError, OSError) as error:
        return {"estado": "error", "mensaje": str(error)}



import json

def enviar_respuestas_prolog(respuestas):
    ejecutable = shutil.which("swipl")

    if ejecutable is None:
        return {
            "estado": "error",
            "mensaje": "No se encontro SWI-Prolog."
        }

    if not ARCHIVO_PROLOG.is_file():
        return {
            "estado": "error",
            "mensaje": "No existe diagnostico.pl."
        }

    campos = [
        "tipo_auto",
        "transmision",
        "problema",
        "duracion"
    ]

    # Los valores ya fueron validados por Flask.
    valores = [respuestas[campo] for campo in campos]

    # Construimos la consulta con valores permitidos.
    argumentos = ",".join(valores)

    consulta = f"recibir_respuestas({argumentos})"

    try:
        resultado = subprocess.run(
            [
                ejecutable,
                "-q",
                "-s", str(ARCHIVO_PROLOG),
                "-g", consulta,
                "-t", "halt"
            ],
            capture_output=True,
            text=True,
            timeout=10
        )

        if resultado.returncode != 0:
            return {
                "estado": "error",
                "mensaje": resultado.stderr.strip()
            }

        return {
            "estado": "ok",
            "datos_prolog": resultado.stdout.strip()
        }

    except (subprocess.SubprocessError, OSError) as error:
        return {
            "estado": "error",
            "mensaje": str(error)
        }


def obtener_fallas_posibles():
    """Consulta las fallas definidas en diagnostico.pl."""

    ejecutable = shutil.which("swipl")

    if ejecutable is None:
        return {
            "estado": "error",
            "mensaje": "No se encontro SWI-Prolog."
        }

    if not ARCHIVO_PROLOG.is_file():
        return {
            "estado": "error",
            "mensaje": "No existe diagnostico.pl."
        }

    try:
        resultado = subprocess.run(
            [
                ejecutable,
                "-q",
                "-s", str(ARCHIVO_PROLOG),
                "-g",
                "forall(falla_posible(X), writeln(X))",
                "-t", "halt"
            ],
            capture_output=True,
            text=True,
            timeout=10
        )

        if resultado.returncode != 0:
            return {
                "estado": "error",
                "mensaje": resultado.stderr.strip()
            }

        fallas = [
            linea.strip()
            for linea in resultado.stdout.splitlines()
            if linea.strip()
        ]

        return {
            "estado": "ok",
            "fallas": fallas,
            "cantidad": len(fallas)
        }

    except (subprocess.SubprocessError, OSError) as error:
        return {
            "estado": "error",
            "mensaje": str(error)
        }


def consultar_diagnostico_dinamico(respuestas):
    """
    Consulta las reglas de diagnostico usando los datos
    recibidos desde Flask.

    Requiere que diagnostico.pl tenga definido:
    posible_causa/4
    """

    ejecutable = shutil.which("swipl")

    if ejecutable is None:
        return {
            "estado": "error",
            "mensaje": "No se encontro SWI-Prolog."
        }

    if not ARCHIVO_PROLOG.is_file():
        return {
            "estado": "error",
            "mensaje": "No existe diagnostico.pl."
        }

    tipo = respuestas.get("tipo_auto")
    problema = respuestas.get("problema")
    detalle = respuestas.get("detalle")

    # Solo aceptamos atomos simples de Prolog.
    import re

    valores = (tipo, problema, detalle)

    if not all(
        isinstance(valor, str)
        and re.fullmatch(r"[a-z][a-z0-9_]*", valor)
        for valor in valores
    ):
        return {
            "estado": "error",
            "mensaje": "Las respuestas contienen valores invalidos."
        }

    objetivo = (
        "forall("
        f"posible_causa({tipo},{problema},{detalle},Causa),"
        "writeln(Causa)"
        ")"
    )

    try:
        resultado = subprocess.run(
            [
                ejecutable,
                "-q",
                "-s", str(ARCHIVO_PROLOG),
                "-g", objetivo,
                "-t", "halt"
            ],
            capture_output=True,
            text=True,
            timeout=10
        )

        if resultado.returncode != 0:
            return {
                "estado": "error",
                "mensaje": resultado.stderr.strip()
            }

        causas = [
            linea.strip()
            for linea in resultado.stdout.splitlines()
            if linea.strip()
        ]

        return {
            "estado": "ok",
            "causas": causas,
            "cantidad": len(causas)
        }

    except (subprocess.SubprocessError, OSError) as error:
        return {
            "estado": "error",
            "mensaje": str(error)
        }
