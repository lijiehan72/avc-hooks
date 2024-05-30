export default function cloneDeep(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        const copy = [];
        for (let i = 0; i < obj.length; i++) {
            copy[i] = cloneDeep(obj[i]);
        }
        return copy;
    }

    const copy = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = cloneDeep(obj[key]);
        }
    }
    return copy;
}
