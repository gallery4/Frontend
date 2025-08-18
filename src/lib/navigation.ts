
import { determineFileType, encodePath } from "./utils";

export function createViewUrl(path: string, base: URL | string): URL {
    const filetype = determineFileType(path)

    if (filetype == false) {
        throw new Error("unsupported file type.")
    }

    const encodedPath = encodePath(path)

    return new URL(`/view/${filetype}/${encodedPath}`, base)
}

export function createBrowseUrl(path: string, base: URL | string): URL {
    const encodedPath = encodePath(path)

    return new URL(`/browse/${encodedPath}`, base)
}