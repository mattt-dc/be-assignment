import { ServiceProviderEntity } from '../entities/service_provider.entity';
import { BaseRepository } from './base.repository';

export class ServiceProviderRepository extends BaseRepository<ServiceProviderEntity> {
  
  public async findByPostalCodeAndDate(postalCode: string, date: Date): Promise<{ serviceProviderName: string, wasteStreamLabel: string }[]> {
    const weekday = date.getDay() + 1;
  
    const serviceProviders = await this.createQueryBuilder('service_provider')
      .innerJoin('service_provider.coverages', 'coverage')
      .innerJoin('coverage.waste_stream', 'waste_stream')
      .where('coverage.postal_code_start <= :postalCode AND coverage.postal_code_end >= :postalCode', { postalCode })
      .andWhere(':weekday = ANY(coverage.weekday_availability::text[])', { weekday })
      .select(['service_provider.name', 'waste_stream.label'])
      .getRawMany();
  
    return serviceProviders.map(sp => ({ serviceProviderName: sp.service_provider_name, wasteStreamLabel: sp.waste_stream_label }));
  }
}
