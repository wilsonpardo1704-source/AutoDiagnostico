
% ==========================================
% SISTEMA EXPERTO DE DIAGNOSTICO AUTOMOTRIZ
% ==========================================

% Prueba inicial de conexion con Flask
estado_sistema(listo).


% ==========================================
% PRUEBAS DE MULTIPLES SOLUCIONES
% ==========================================

color_prueba(rojo).
color_prueba(azul).
color_prueba(verde).


% ==========================================
% RECEPCION DE DATOS DESDE FLASK
% ==========================================

recibir_respuestas(Tipo, Transmision, Problema, Duracion) :-
    write_term(
        respuestas(Tipo, Transmision, Problema, Duracion),
        [quoted(true)]
    ),
    nl.


% ==========================================
% 1. BASE DE CONOCIMIENTOS
% ==========================================

% Hechos utilizados en las primeras pruebas.
% Las reglas dinamicas no dependen de ellos.

tipo_auto(gasolina).
problema_principal(no_arranca).
detalle_sintoma(gira_no_enciende).


% ==========================================
% 2. REGLAS DE INFERENCIA
% ==========================================


% ------------------------------------------
% CASO 1: PROBLEMA DE ARRANQUE
% ------------------------------------------

% Condiciones:
% Automovil de gasolina.
% Problema principal: no_arranca.
% Detalle: gira_no_enciende.


% Hipotesis 1: Alimentacion de combustible

posible_causa(Tipo, Problema, Detalle, alimentacion_combustible) :-
    Tipo = gasolina,
    Problema = no_arranca,
    Detalle = gira_no_enciende.


% Hipotesis 2: Sistema de encendido

posible_causa(Tipo, Problema, Detalle, sistema_encendido) :-
    Tipo = gasolina,
    Problema = no_arranca,
    Detalle = gira_no_enciende.


% Hipotesis 3: Bateria o conexiones electricas

posible_causa(Tipo, Problema, Detalle, bateria_conexiones_electricas) :-
    Tipo = gasolina,
    Problema = no_arranca,
    Detalle = gira_no_enciende.


% ------------------------------------------
% CASO 2: PERDIDA DE POTENCIA
% ------------------------------------------

% Condiciones:
% Automovil de gasolina.
% Problema principal: pierde_potencia.
% Detalle: acelerar.


% Hipotesis 4: Filtro de aire obstruido
% Regla que escribiste anteriormente.

posible_causa(Tipo, Problema, Detalle, filtro_aire_obstruido) :-
    Tipo = gasolina,
    Problema = pierde_potencia,
    Detalle = acelerar.


% Otras hipotesis pendientes de desarrollar:
% - Bujias desgastadas.
% - Inyectores sucios.
% - Filtro de combustible obstruido.


% ==========================================
% 3. RECOMENDACIONES
% ==========================================

% Aqui se agregaran las recomendaciones
% correspondientes a las hipotesis.


% ==========================================
% 4. CONSULTAS DEL SISTEMA EXPERTO
% ==========================================

% Consulta para problemas de arranque:
%
% ?- posible_causa(gasolina, no_arranca,
%                  gira_no_enciende, Causa).
%
% Consulta para perdida de potencia:
%
% ?- posible_causa(gasolina, pierde_potencia,
%                  acelerar, Causa).
