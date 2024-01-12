interface Writable<T> {
    save(item: T): Promise<void>;
}