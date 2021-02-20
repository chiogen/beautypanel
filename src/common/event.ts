
export function getEventPath(event: Event) {

    const path = [] as Array<Node>;

    let node = event.currentTarget as Node | null;

    while (node) {
        path.push(node);
        node = node.parentNode;
    }

    return path;
}