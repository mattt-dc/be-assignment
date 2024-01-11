export class BaseRepository<T extends Identifiable> implements Writable<T>, Readable<T> {
    private readonly items: T[] = [];

    public save(item: T): void {
        const existingItem = this.findById(item.id);

        if (existingItem) {
            Object.assign(existingItem, item);
        } else {
            this.items.push(item);
        }
    }

    public findById(id: string): T | undefined {
        return this.items.find(item => item.id === id);
    }
}