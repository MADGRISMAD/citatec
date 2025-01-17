import { TIEMPOEXTRA } from "../constants/tramite";
import { Ticket, TramiteConfig, outputLog } from "shared-types";
import { compararRangosDeFechas } from "../utils/Fecha";
export class ManejadorHuecos {

    constructor(public huecos: [inicio:Date, final:Date][] = []) {
        this.huecos = huecos;
    }

    agregarHueco(fechaInicio: Date, fechaFinal: Date): void {
        const nuevoHueco: [Date, Date] = [fechaInicio, fechaFinal];

        console.log("Agregando hueco:", nuevoHueco[0], nuevoHueco[1]);
        const index = this.huecos.findIndex(rango => compararRangosDeFechas(rango, nuevoHueco) > 0);
        if (index === -1) {
            this.huecos.push(nuevoHueco);
        } else {
            this.huecos.splice(index, 0, nuevoHueco);
        }
    }

    buscarHuecoDisponible(tramite: TramiteConfig): Date | undefined {
        let inicioSiguienteHueco: Date;
        const duracionTramiteMilisegundos: number = (parseInt(tramite.duration as unknown as string) + TIEMPOEXTRA) * 60000;
        for (let i = 0; i < this.huecos.length; i++) {
            const inicioHueco: Date = new Date(this.huecos[i][0]);
            // Comprueba si el hueco es en el pasado, lo borra
            if (inicioHueco.getTime() < Date.now()){
                this.huecos.splice(i, 1);
                i--;
                continue;
            }
            let cadenaFinal = 0;
            let finHueco: Date;
            do {
                finHueco = new Date(this.huecos[i + cadenaFinal][1]);
                const tiempoHuecoMilisegundos: number =
                    finHueco.getTime() - inicioHueco.getTime();
                // Comprueba si en el hueco cabe el trámite
                if (duracionTramiteMilisegundos <= tiempoHuecoMilisegundos) {
                    // Borra todos los rangos usados
                    const tempArray: [Date,Date][] = this.huecos;
                    tempArray.splice(i, cadenaFinal + 1);
                    this.huecos = tempArray;
                    // Si sobra tiempo, crea otro rango con el tiempo restante
                    if (tiempoHuecoMilisegundos - duracionTramiteMilisegundos > 0) {
                        const milisegundosNuevoHueco: number =
                            inicioHueco.getTime() +
                            duracionTramiteMilisegundos;
                        this.agregarHueco(new Date(milisegundosNuevoHueco), finHueco);
                    }
                    return inicioHueco;
                }
                cadenaFinal++;
                inicioSiguienteHueco = new Date(this.huecos[i + cadenaFinal][0]);
                // Comprueba si el siguiente hueco es justo despues del anterior, para unir los huecos en uno
                console.log(inicioSiguienteHueco.getTime(), finHueco.getTime());
                console.log(inicioSiguienteHueco, finHueco);
            } while (i + cadenaFinal < this.huecos.length && inicioSiguienteHueco.getTime() == finHueco.getTime());
        }
        return undefined;
    }

    cancelarTicket(ticket: Ticket): void {
        // Crea un hueco en un ticket cancelado
        console.log("Cancelando ticket");
        const fechaInicio:Date = new Date(ticket.fechaProgramada);
        const duracion :number =
            parseInt(ticket.tipoTramite.duration as unknown as string) + TIEMPOEXTRA;

        const fechaFinal = new Date(fechaInicio.getTime() + duracion * 60000);
        this.agregarHueco(fechaInicio, fechaFinal);
        outputLog("Se canceló el ticket para el día ", fechaInicio);
    }
}
