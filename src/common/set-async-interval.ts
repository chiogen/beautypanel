export function setAsyncInterval(callback: () => any, timeout: number) {

    let abort = false;
    let frame = -1;

    const handle = async () => {
        await callback()
        if (!abort) {
            frame = setTimeout(handle, timeout) as any as number; 
        }
    }

    frame = setTimeout(handle, timeout) as any as number; 

    return () => {
        abort = true;
        clearTimeout(frame);
    }
}