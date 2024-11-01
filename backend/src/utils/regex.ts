export function validarNumeroDeControl (numeroDeControl: number): boolean {
    return /^[0-9]{8}$/.test(numeroDeControl.toString());
}