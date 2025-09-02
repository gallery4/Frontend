import tippy, { type Content } from 'tippy.js'

export function tooltipAttachment(element: HTMLElement) {
    const content = element.querySelector('.tooltip-content')

    if (content == null) return;

    const instance = tippy(element, {
        content: content.innerHTML,
        allowHTML: true,
    })

    return () => instance.destroy()
}