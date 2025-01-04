import { StatsFilter, StatResults} from "shared-types";
import { BACKEND_URL } from "../constants/url";
import axios, { AxiosResponse } from "axios";
import { createQueryString } from "@/utils/formater";
export async function obtenerEstadisticas(params: Partial<StatsFilter>): Promise<StatResults> {
    const queryParams = await createQueryString(params);
    const url = `${BACKEND_URL}/stats?${queryParams}`;
    const res:AxiosResponse<StatResults> = await axios.get(url);
    return res.data as StatResults;
}