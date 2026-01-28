function createNarrowingInput() {
    return new Proxy({}, {
        get(target, name) {
            return (target[name] ||= (value) => ({
                inputName: name,
                value,
            }));
        },
    });
}

export { createNarrowingInput };
