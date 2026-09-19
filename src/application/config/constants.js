/**
 * Constantes compartidas de la aplicación.
 */

/** Clave versionada de localStorage para el modelo de datos v1. */
export const STORAGE_KEY = "concepts-app:v1";

/**
 * Pausa (ms) antes de arrancar el auto-scroll por hover: da tiempo a
 * leer el principio del texto antes de que empiece a moverse.
 */
export const HOVER_SCROLL_DELAY = 750;

/**
 * Píxeles por segundo del auto-scroll por hover. Muy lento, para que
 * el desborde sea legible mientras el cursor está sobre la tarjeta.
 */
export const HOVER_SCROLL_SPEED = 16;

/**
 * Retardo (ms) con el que aparecen los botones de respuesta una vez
 * volteada la tarjeta en el modo estudio: da tiempo a leer la
 * respuesta antes de decidir.
 */
export const STUDY_ACTIONS_DELAY = 1500;
