import stringHash from "string-hash";
import mime from 'mime-types'

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

