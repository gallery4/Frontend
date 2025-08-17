import imageIcon from '@mdi/svg/svg/image.svg?raw';
import audioIcon from '@mdi/svg/svg/music-box.svg?raw'
import videoIcon from '@mdi/svg/svg/movie.svg?raw'
import pdfIcon from '@mdi/svg/svg/file-pdf-box.svg?raw'
import epubIcon from '@mdi/svg/svg/book.svg?raw'
import directoryIcon from '@mdi/svg/svg/folder.svg?raw'
import zipIcon from '@mdi/svg/svg/folder-zip.svg?raw'
import placeholderIcon from '@mdi/svg/svg/square-rounded.svg?raw'

export function getIconClass(type: string, filetype: string | false | undefined): string {
    switch (type) {
        case 'file':
            switch (filetype) {
                case 'image':
                    return 'fill-sky-500 stroke-sky-900';
                case 'audio':
                    return 'fill-yellow-500 stroke-yellow-900';
                case 'video':
                    return 'fill-teal-500 stroke-teal-900';
                case 'pdf':
                    return 'fill-red-500 stroke-red-900';
                case 'epub':
                    return 'fill-lime-500 stroke-lime-900';
            }

            return '';

        case 'directory':
            return 'fill-amber-500 stroke-amber-900';

        case 'zip':
            return 'fill-emerald-500 stroke-emerald-900';

        case 'placeholder':
            return 'fill-gray-500 stroke-gray-900';
    }

    return '';
}

export function getIcon(type: string, filetype: string | false | undefined): string {
    switch (type) {
        case 'file':
            switch (filetype) {
                case 'image':
                    return imageIcon;
                case 'audio':
                    return audioIcon;
                case 'video':
                    return videoIcon;
                case 'pdf':
                    return pdfIcon;
                case 'epub':
                    return epubIcon;
            }

            return '';

        case 'directory':
            return directoryIcon;

        case 'zip':
            return zipIcon;

        case 'placeholder':
            return placeholderIcon;
    }

    return '';
}
