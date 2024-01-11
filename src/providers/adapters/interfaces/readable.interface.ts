interface Readable<T> {
    findById(id: string): T | undefined;
}