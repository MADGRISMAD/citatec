import { TIEMPOEXTRA, tramiteDuration } from "../constants/tramite";
import { TramiteType } from "../enums/TramiteType";
import { FechaTicket } from "./FechaTicket";

export class ManejadorHuecos {
    private huecos: Date[] = [];

    agregarHueco(fecha: Date): void {
        this.huecos.push(fecha);
        this.huecos.sort((a, b) => a.getTime() - b.getTime());
    }

    buscarHuecoDisponible(tramite: TramiteType): Date | null {
        const duracionTramite = tramiteDuration[tramite] + TIEMPOEXTRA;
        for (let i = 0; i < this.huecos.length; i++) {
            const hueco = this.huecos[i];
            const siguienteHueco = this.huecos[i + 1];
            const finTramite = new Date(hueco.getTime() + duracionTramite * 60000);

            if (!siguienteHueco || finTramite.getTime() <= siguienteHueco.getTime()) {
                this.huecos.splice(i, 1);
                return hueco;
            }
        }
        return null;
    }

    cancelarCita(fecha: Date): void {
        this.agregarHueco(fecha);
    }
}