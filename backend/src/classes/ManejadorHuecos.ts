import { TIEMPOEXTRA, tramiteDuration } from "../constants/tramite";
import { TramiteType } from "../enums/TramiteType";
import { Ticket } from "../types/Ticket";
export class ManejadorHuecos {

    constructor(public huecos: [inicio:Date, final:Date][] = []) {
        this.huecos = huecos;
    }

    agregarHueco(fechaInicio: Date, fechaFinal: Date): void {
        this.huecos.push([fechaInicio, fechaFinal]);
        this.huecos.sort(
            (a: [Date, Date], b: [Date, Date]) =>
                new Date(a[0]).getTime() - new Date(b[0]).getTime()
        );
    }

    buscarHuecoDisponible(tramite: TramiteType): Date | null {
        const duracionTramiteMilisegundos: number = (tramiteDuration[tramite] + TIEMPOEXTRA) * 60000;
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
                // Comprueba si el siguiente hueco es justo despues del anterior, para unir los huecos en uno
            } while (i + cadenaFinal < this.huecos.length && new Date(this.huecos[i + cadenaFinal][0]).getTime() == finHueco.getTime());
        }

        return null;
    }

    cancelarTicket(ticket: Ticket): void {
        console.log(ticket.fechaProgramada);
        const fechaInicio:Date = new Date(ticket.fechaProgramada);
        const duracion :number =
            tramiteDuration[ticket.tipoTramite as TramiteType] + TIEMPOEXTRA;

        const fechaFinal = new Date(fechaInicio.getTime() + duracion * 60000);
        this.agregarHueco(fechaInicio, fechaFinal);
        console.log("Se canceló el ticket para el día ", fechaInicio);
    }
}
