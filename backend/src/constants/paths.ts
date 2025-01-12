import path from "path";
import ConfigManager from "../classes/ConfigManager";

export const TICKET_PATH = path.join(ConfigManager.get("DATA_PATH"), "data.json")
export const STATISTICS_PATH = path.join(ConfigManager.get("DATA_PATH"), "statistics.json")
export const TICKET_ARCHIVE_PATH= path.join(ConfigManager.get("DATA_PATH"), "historial.json")
export const MATERIAS_PATH= path.join(ConfigManager.get("DATA_PATH"), "materias.pdf")
export const TRAMITES_PATH= path.join(ConfigManager.get("DATA_PATH"), "tramites.json")
export const ADMIN_DEVICES_PATH = path.join(ConfigManager.get("DATA_PATH"), "adminDevices.json")