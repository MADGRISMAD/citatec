import { StatsFilter, Stats} from "shared-types";
import { AxiosResponse } from "axios";
import { createQueryString } from "@/utils/formater";
import customAxios from "@/utils/axios";
export async function obtenerEstadisticas(params: Partial<StatsFilter>): Promise<Stats> {
    const queryParams = await createQueryString(params);
    const url = `/stats?${queryParams}`;
    const res:AxiosResponse<Stats> = await customAxios.get(url);
    return res.data as Stats;
}