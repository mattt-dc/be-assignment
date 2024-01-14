export interface Readable<T> {
    findById(id: string): Promise<T | null>;
}