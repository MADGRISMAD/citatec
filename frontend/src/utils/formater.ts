export async function createQueryString(params: Record<string, any>) {
    const filteredParams = await filterUndefinedKeys(params);
    return Object.keys(filteredParams)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
}

async function filterUndefinedKeys(obj: Record<string, any>) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== undefined)
      );
}