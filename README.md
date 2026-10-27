# AutoDiagnóstico — interfaz conectada a Flask

## Qué incluye
- `frontend/`: interfaz de preguntas, estilos y JavaScript.
- `backend/app.py`: servidor Flask que sirve la página y recibe las respuestas.
- `backend/requirements.txt`: dependencia de Flask.
- `prolog/README.md`: espacio para la lógica Prolog desarrollada por el estudiante.

## Cómo ejecutarlo en Windows
Abre una terminal en esta carpeta principal del proyecto y ejecuta:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe backend\app.py
```

Abre en el navegador `http://127.0.0.1:5000/`.

**Importante:** ahora abre la página desde la dirección de Flask, no desde `index.html` ni desde Live Server. La petición `fetch` usa la misma dirección del servidor.

## Pruebas
- Página: `http://127.0.0.1:5000/`
- Estado: `http://127.0.0.1:5000/api/estado`
- En la página, responde todas las preguntas y pulsa **Enviar respuestas**. El resumen debe decir que Flask recibió y validó las respuestas.

## Estado actual
La conexión navegador–Flask funciona, pero aún no hay diagnóstico ni consulta a SWI-Prolog. La lógica de hechos, reglas y predicados debe desarrollarla el estudiante según las indicaciones de la práctica.
