% ==========================================
% SISTEMA EXPERTO DE DIAGNOSTICO AUTOMOTRIZ - VERSION UNIFICADA FINAL
% ==========================================

% ==========================================
% 1. CONEXION CON FLASK - Se conserva
% ==========================================
estado_sistema(listo).
color_prueba(rojo).
color_prueba(azul).
color_prueba(verde).

recibir_respuestas(Tipo, Transmision, Problema, Duracion) :-
    write_term(respuestas(Tipo, Transmision, Problema, Duracion), [quoted(true)]), nl.

% ==========================================
% 2. BASE DE CONOCIMIENTOS - Sincronizada con app.js
% ==========================================
tipo_valido(gasolina). % Proyecto solo gasolina

transmision_valida(manual).
transmision_valida(automatica).
transmision_valida(cvt).

duracion_valida(reciente).
duracion_valida(unos_dias).
duracion_valida(semanas).
duracion_valida(continuo).

problema_tipo(no_arranca).
problema_tipo(pierde_potencia).
problema_tipo(temperatura).
problema_tipo(ruido).
problema_tipo(frenos).

% Todos los valores reales del cuestionario + opciones sin diagnostico
sintoma_valido(no_arranca, gira_no_enciende).
sintoma_valido(no_arranca, no_gira).
sintoma_valido(no_arranca, enciende_apaga).
sintoma_valido(pierde_potencia, acelerar).
sintoma_valido(pierde_potencia, subida).
sintoma_valido(pierde_potencia, siempre).
sintoma_valido(pierde_potencia, alta_velocidad).
sintoma_valido(temperatura, muy_alta).
sintoma_valido(temperatura, variable).
sintoma_valido(temperatura, normal). % no genera hipotesis
sintoma_valido(ruido, chillido).
sintoma_valido(ruido, golpeteo).
sintoma_valido(ruido, zumbido).
sintoma_valido(ruido, al_girar).
sintoma_valido(ruido, no_se). % no genera hipotesis
sintoma_valido(frenos, esponjoso).
sintoma_valido(frenos, vibra_pedal).
sintoma_valido(frenos, vibra_volante).
sintoma_valido(frenos, pedal_fondo).
sintoma_valido(frenos, sin_indicador). % no genera hipotesis

% ==========================================
% 3. COMPONENTES vs FALLAS - Distinguidos
% ==========================================
componente(bateria).
componente(bomba_combustible).
componente(bujias).
componente(filtro_aire).
componente(filtro_combustible).
componente(inyectores).
componente(sistema_refrigeracion).
componente(termostato).
componente(ventilador).
componente(sensor_temperatura).
componente(correa_accesorios).
componente(rodamiento).
componente(direccion_asistida).
componente(discos_freno).
componente(circuito_frenos).

falla(bateria_descargada).
falla(bateria_conexiones_electricas).
falla(alimentacion_combustible).
falla(sistema_encendido).
falla(alimentacion_irregular).
falla(filtro_aire_obstruido).
falla(bujias_desgastadas).
falla(filtro_combustible_obstruido).
falla(inyectores_sucios).
falla(refrigerante_bajo).
falla(termostato_fallado).
falla(ventilador_fallado).
falla(sensor_temperatura_fallado).
falla(correa_desgastada).
falla(rodamiento_desgastado).
falla(direccion_asistida_falla).
falla(aire_circuito_frenos).
falla(liquido_frenos_bajo).
falla(discos_alabeados).

falla_de_componente(bateria_descargada, bateria).
falla_de_componente(bateria_conexiones_electricas, bateria).
falla_de_componente(alimentacion_combustible, bomba_combustible).
falla_de_componente(sistema_encendido, bujias).
falla_de_componente(alimentacion_irregular, bomba_combustible).
falla_de_componente(filtro_aire_obstruido, filtro_aire).
falla_de_componente(bujias_desgastadas, bujias).
falla_de_componente(filtro_combustible_obstruido, filtro_combustible).
falla_de_componente(inyectores_sucios, inyectores).
falla_de_componente(refrigerante_bajo, sistema_refrigeracion).
falla_de_componente(termostato_fallado, termostato).
falla_de_componente(ventilador_fallado, ventilador).
falla_de_componente(sensor_temperatura_fallado, sensor_temperatura).
falla_de_componente(correa_desgastada, correa_accesorios).
falla_de_componente(rodamiento_desgastado, rodamiento).
falla_de_componente(direccion_asistida_falla, direccion_asistida).
falla_de_componente(aire_circuito_frenos, circuito_frenos).
falla_de_componente(liquido_frenos_bajo, circuito_frenos).
falla_de_componente(discos_alabeados, discos_freno).

causa_asociada(no_arranca, gira_no_enciende, alimentacion_combustible).
causa_asociada(no_arranca, gira_no_enciende, sistema_encendido).
causa_asociada(no_arranca, gira_no_enciende, bateria_conexiones_electricas).
causa_asociada(no_arranca, no_gira, bateria_descargada).
causa_asociada(no_arranca, enciende_apaga, alimentacion_irregular).
causa_asociada(pierde_potencia, acelerar, filtro_aire_obstruido).
causa_asociada(pierde_potencia, acelerar, bujias_desgastadas).
causa_asociada(pierde_potencia, subida, filtro_combustible_obstruido).
causa_asociada(pierde_potencia, siempre, inyectores_sucios).
causa_asociada(pierde_potencia, alta_velocidad, filtro_aire_obstruido).
causa_asociada(pierde_potencia, alta_velocidad, inyectores_sucios).
causa_asociada(temperatura, muy_alta, refrigerante_bajo).
causa_asociada(temperatura, muy_alta, termostato_fallado).
causa_asociada(temperatura, muy_alta, ventilador_fallado).
causa_asociada(temperatura, variable, sensor_temperatura_fallado).
causa_asociada(ruido, chillido, correa_desgastada).
causa_asociada(ruido, golpeteo, rodamiento_desgastado).
causa_asociada(ruido, zumbido, rodamiento_desgastado).
causa_asociada(ruido, al_girar, direccion_asistida_falla).
causa_asociada(ruido, al_girar, rodamiento_desgastado).
causa_asociada(frenos, esponjoso, aire_circuito_frenos).
causa_asociada(frenos, esponjoso, liquido_frenos_bajo).
causa_asociada(frenos, vibra_pedal, discos_alabeados).
causa_asociada(frenos, vibra_volante, discos_alabeados).
causa_asociada(frenos, pedal_fondo, aire_circuito_frenos).
causa_asociada(frenos, pedal_fondo, liquido_frenos_bajo).

% ==========================================
% 4. COMPATIBILIDAD - Justificable mecanicamente
% ==========================================
compatible_transmision(Causa, Trans) :-
    falla(Causa), transmision_valida(Trans).

% Duracion: agudas = cualquier duracion, desgaste = semanas/continuo
compatible_duracion(Causa, Dur) :- duracion_valida(Dur), falla_aguda(Causa).
compatible_duracion(Causa, semanas) :- falla_desgaste(Causa).
compatible_duracion(Causa, continuo) :- falla_desgaste(Causa).

falla_aguda(bateria_descargada).
falla_aguda(bateria_conexiones_electricas).
falla_aguda(alimentacion_combustible).
falla_aguda(sistema_encendido).
falla_aguda(alimentacion_irregular).
falla_aguda(refrigerante_bajo).
falla_aguda(termostato_fallado).
falla_aguda(ventilador_fallado).
falla_aguda(sensor_temperatura_fallado).
falla_aguda(aire_circuito_frenos).
falla_aguda(liquido_frenos_bajo).

falla_desgaste(filtro_aire_obstruido).
falla_desgaste(bujias_desgastadas).
falla_desgaste(filtro_combustible_obstruido).
falla_desgaste(inyectores_sucios).
falla_desgaste(correa_desgastada).
falla_desgaste(rodamiento_desgastado).
falla_desgaste(direccion_asistida_falla).
falla_desgaste(discos_alabeados).

% ==========================================
% 5. REGLAS DE INFERENCIA - 13 reglas no triviales
% ==========================================
regla_inferencia(Tipo, no_arranca, no_gira, Causa) :-
    tipo_valido(Tipo), sintoma_valido(no_arranca, no_gira),
    causa_asociada(no_arranca, no_gira, Causa),
    falla_de_componente(Causa, Comp), componente(Comp).

regla_inferencia(Tipo, no_arranca, gira_no_enciende, Causa) :-
    tipo_valido(Tipo), sintoma_valido(no_arranca, gira_no_enciende),
    causa_asociada(no_arranca, gira_no_enciende, Causa),
    falla(Causa), falla_de_componente(Causa, Comp), componente(Comp).

regla_inferencia(Tipo, no_arranca, enciende_apaga, Causa) :-
    tipo_valido(Tipo), sintoma_valido(no_arranca, enciende_apaga),
    causa_asociada(no_arranca, enciende_apaga, Causa),
    falla_de_componente(Causa, bomba_combustible).

regla_inferencia(Tipo, pierde_potencia, acelerar, Causa) :-
    tipo_valido(Tipo), causa_asociada(pierde_potencia, acelerar, Causa),
    falla_de_componente(Causa, Comp), componente(Comp).

regla_inferencia(Tipo, pierde_potencia, subida, Causa) :-
    tipo_valido(Tipo), sintoma_valido(pierde_potencia, subida),
    causa_asociada(pierde_potencia, subida, Causa), falla_de_componente(Causa, _).

regla_inferencia(Tipo, pierde_potencia, siempre, Causa) :-
    tipo_valido(Tipo), sintoma_valido(pierde_potencia, siempre),
    causa_asociada(pierde_potencia, siempre, Causa), falla(Causa).

regla_inferencia(Tipo, pierde_potencia, alta_velocidad, Causa) :-
    tipo_valido(Tipo), sintoma_valido(pierde_potencia, alta_velocidad),
    causa_asociada(pierde_potencia, alta_velocidad, Causa),
    falla_de_componente(Causa, Comp), componente(Comp).

regla_inferencia(Tipo, temperatura, muy_alta, Causa) :-
    tipo_valido(Tipo), causa_asociada(temperatura, muy_alta, Causa),
    falla_de_componente(Causa, Comp), componente(Comp).

regla_inferencia(Tipo, temperatura, variable, Causa) :-
    tipo_valido(Tipo), causa_asociada(temperatura, variable, Causa),
    falla_de_componente(Causa, sensor_temperatura).

regla_inferencia(Tipo, ruido, chillido, Causa) :-
    tipo_valido(Tipo), causa_asociada(ruido, chillido, Causa),
    falla_de_componente(Causa, correa_accesorios).

regla_inferencia(Tipo, ruido, golpeteo, Causa) :-
    tipo_valido(Tipo), sintoma_valido(ruido, golpeteo),
    causa_asociada(ruido, golpeteo, Causa),
    falla_de_componente(Causa, rodamiento).

regla_inferencia(Tipo, ruido, zumbido, Causa) :-
    tipo_valido(Tipo), sintoma_valido(ruido, zumbido),
    causa_asociada(ruido, zumbido, Causa),
    falla_de_componente(Causa, Comp), componente(Comp).

regla_inferencia(Tipo, ruido, al_girar, Causa) :-
    tipo_valido(Tipo), sintoma_valido(ruido, al_girar),
    causa_asociada(ruido, al_girar, Causa),
    falla_de_componente(Causa, Comp), componente(Comp).

regla_inferencia(Tipo, frenos, pedal_fondo, Causa) :-
    tipo_valido(Tipo), sintoma_valido(frenos, pedal_fondo),
    causa_asociada(frenos, pedal_fondo, Causa),
    falla_de_componente(Causa, circuito_frenos).

regla_inferencia(Tipo, frenos, Detalle, Causa) :-
    tipo_valido(Tipo), sintoma_valido(frenos, Detalle),
    (Detalle = vibra_pedal ; Detalle = vibra_volante ; Detalle = esponjoso),
    causa_asociada(frenos, Detalle, Causa),
    falla_de_componente(Causa, Comp), componente(Comp).

% ==========================================
% 6. DIAGNOSTICO PRINCIPAL
% ==========================================
diagnostico_interno(Tipo, Problema, Detalle, Causa) :-
    regla_inferencia(Tipo, Problema, Detalle, Causa).

posible_causa(Tipo, Problema, Detalle, Causa) :-
    tipo_valido(Tipo), sintoma_valido(Problema, Detalle),
    distinct(Causa, diagnostico_interno(Tipo, Problema, Detalle, Causa)).

posible_causa_completa(Tipo, Transmision, Problema, Detalle, Duracion, Causa) :-
    tipo_valido(Tipo), transmision_valida(Transmision), duracion_valida(Duracion),
    sintoma_valido(Problema, Detalle),
    regla_inferencia(Tipo, Problema, Detalle, Causa),
    compatible_transmision(Causa, Transmision),
    compatible_duracion(Causa, Duracion).

% ==========================================
% 7. RECOMENDACIONES Y EXPLICACION
% ==========================================
recomendacion(bateria_descargada, 'Revisar bateria y conexiones.').
recomendacion(bateria_conexiones_electricas, 'Verificar bornes y masa.').
recomendacion(alimentacion_combustible, 'Revisar suministro combustible.').
recomendacion(sistema_encendido, 'Revisar bujias y bobina.').
recomendacion(alimentacion_irregular, 'Revisar ralenti y bomba.').
recomendacion(filtro_aire_obstruido, 'Inspeccionar filtro de aire.').
recomendacion(bujias_desgastadas, 'Revisar bujias.').
recomendacion(filtro_combustible_obstruido, 'Reemplazar filtro combustible.').
recomendacion(inyectores_sucios, 'Limpieza de inyectores.').
recomendacion(refrigerante_bajo, 'Detenerse, enfriar y revisar refrigerante.').
recomendacion(termostato_fallado, 'Revisar termostato.').
recomendacion(ventilador_fallado, 'Revisar ventilador.').
recomendacion(sensor_temperatura_fallado, 'Revisar sensor.').
recomendacion(correa_desgastada, 'Inspeccionar correa.').
recomendacion(rodamiento_desgastado, 'Revisar rodamientos.').
recomendacion(direccion_asistida_falla, 'Revisar liquido direccion.').
recomendacion(aire_circuito_frenos, 'No conducir, purgar y asistencia.').
recomendacion(liquido_frenos_bajo, 'No conducir, revisar fugas.').
recomendacion(discos_alabeados, 'Rectificar discos.').

explicacion(Problema, Detalle, Causa, Texto) :-
    causa_asociada(Problema, Detalle, Causa),
    falla_de_componente(Causa, Comp),
    atomic_list_concat(['Para ', Problema, ' con ', Detalle, ', causa ', Causa, ' en ', Comp], Texto).

explicar_diagnostico(Tipo, Problema, Detalle, Causa, Exp, Rec) :-
    posible_causa(Tipo, Problema, Detalle, Causa),
    explicacion(Problema, Detalle, Causa, Exp),
    recomendacion(Causa, Rec).

% ==========================================
% 8. CONSULTAS CON RESULTADOS
% ==========================================
% 1. ?- posible_causa(gasolina, ruido, golpeteo, C). -> C = rodamiento_desgastado
% 2. ?- posible_causa(gasolina, ruido, zumbido, C). -> C = rodamiento_desgastado
% 3. ?- posible_causa(gasolina, pierde_potencia, alta_velocidad, C). -> filtro_aire_obstruido ; inyectores_sucios
% 4. ?- posible_causa(gasolina, frenos, pedal_fondo, C). -> aire_circuito_frenos ; liquido_frenos_bajo
% 5. ?- posible_causa(gasolina, ruido, no_se, C). -> false (respuesta adecuada)
% 6. ?- posible_causa_completa(gasolina, manual, no_arranca, no_gira, reciente, C). -> bateria_descargada
% 7. ?- posible_causa_completa(gasolina, manual, no_arranca, no_gira, continuo, C). -> bateria_descargada (ya no se descarta)
% 8. ?- posible_causa_completa(gasolina, automatica, ruido, golpeteo, semanas, C). -> rodamiento_desgastado (ya funciona en automatica)
% 9. ?- posible_causa_completa(gasolina, manual, pierde_potencia, siempre, reciente, C). -> false (desgaste no es reciente)
% 10. ?- posible_causa_completa(gasolina, manual, pierde_potencia, siempre, continuo, C). -> inyectores_sucios