export const HOY: Date = new Date()
// 8:00 AM
const INICIO_HORARIO: Date = new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate(), 8, 0, 0);
// 4:00 PM
const FIN_HORARIO: Date = new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate(), 16, 0, 0);

export const HORARIO: Record<string, Date> = {
    INICIO: INICIO_HORARIO,
    FINAL: FIN_HORARIO
}
