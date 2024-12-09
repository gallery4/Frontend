import stringHash from "string-hash";
import mime from 'mime-types'
import naturalCompare from "natural-compare-lite";

export function getFilenameFromKey(name: string, type: 'image' | 'media' | 'zip' | 'directory') {
    return name.substring(name.lastIndexOf('/') + 1);
}

export function createElementId(name: string): string {
    return stringHash(name).toString(16);
}

export function determinFileType(name: string): string | false {
    const lower = name.toLowerCase();

    const mimetype = mime.lookup(lower);

    if (mimetype == false) {
        return false
    }

    return mimetype.substring(0, mimetype.indexOf('/'));
}

export function compareItems(a: any, b: any, sortBy: string, order: string) {
    let output = sortBy == "name" ?
        naturalCompare(a["name"], b["name"]) :
        a["dateTime"].localeCompare(b["dateTime"]);

    if (order == "descending")
        output = output * -1;

    return output;
}

export function extractSort(sort: string) {
    switch (sort) {
        case "name ascending":
            return { sortBy: "name", order: "ascending" };
        case "name descending":
            return { sortBy: "name", order: "descending" };

        case "dateTime ascending":
            return { sortBy: "dateTime", order: "ascending" };
        case "dateTime descending":
            return { sortBy: "dateTime", order: "descending" };
    }

    throw new Error("invalid parameter")
}
