import { QueryRunner, Repository, SelectQueryBuilder, getRepository } from 'typeorm';

export class BaseRepository<T extends Identifiable> implements Writable<T>, Readable<T> {
    private repository: Repository<T>;

    constructor(entityClass: new () => T) {
        this.repository = getRepository(entityClass);
    }

    public createQueryBuilder(alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<T> {
        return this.repository.createQueryBuilder(alias, queryRunner);
    }

    public async save(item: T): Promise<void> {
        await this.repository.save(item);
    }

    public async findById(id: string): Promise<T | null> {
        return await this.repository.findOneById(id);
    }
}