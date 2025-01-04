export function outputLog(...s: any[]): void {

        // Joins all the strings in the array into a single string
        const joinedString: string = s.join(" ");

        const e = new Error();
        const frame = e.stack!.split("\n")[2]; // 0 es esta función, 1 es el caller, 2 es el caller del caller
        const lineNumber = frame.split(":")[1];
        const fileName = frame.split(":")[0].split("/").pop();
        console.log(`[${fileName}:${lineNumber}]: ${joinedString}`);
}
