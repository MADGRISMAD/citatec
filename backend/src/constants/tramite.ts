import { TramiteType } from "shared-types";

// El tiempo que tarda cada trámite en ser atendido en minutos (usar múltipos de 5)
export const tramiteDuration: Record<TramiteType, number> = {
    [TramiteType.INSCRIPCION]: 10,
    [TramiteType.BECA]: 5,
    [TramiteType.CERTIFICADO]: 5,
    [TramiteType.CONSTANCIA]: 60,
}

export const TIEMPOEXTRA = 5; // Tiempo extra en minutos entre trámite y trámite