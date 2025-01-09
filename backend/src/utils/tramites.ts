export function redondearAMultiploDe5(fecha: Date, minutos: number): void {
    fecha.setMinutes(Math.ceil(minutos / 5) * 5,0, 0);
}