import { ServiceProviderEntity } from '../entities/service_provider.entity';
import { BaseRepository } from './base.repository';

export class ServiceProviderRepository extends BaseRepository<ServiceProviderEntity> {
  public async getServiceProviders(postalCode: string, date: Date): Promise<ServiceProviderEntity[]> {
    const weekday = date.getDay();

    return this.createQueryBuilder('service_provider')
      .innerJoin('service_provider.coverages', 'coverage')
      .where('coverage.postal_code_start <= :postalCode AND coverage.postal_code_end >= :postalCode', { postalCode })
      .andWhere(':weekday = ANY (coverage.weekday_availability)', { weekday })
      .getMany();
  }
}
