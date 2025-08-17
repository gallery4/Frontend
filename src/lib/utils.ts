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

    if (mimetype == "application/pdf"){
        return "pdf"
    }

    if (mimetype == "application/epub+zip"){
        return "epub"
    }

    // NOTE: mime.lookup() return "application/mp4" as it could not determine whether the file
    // contains only audio, or audio + video, or neither of them, from the file name alone 
    // which would results in different MIME types. 
    // Let's assume that mp4 is a video file and let the vidstack determine how to handle the file.
    if (mimetype == "application/mp4") {
        return "video"
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
