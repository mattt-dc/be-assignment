import { ServiceProviderEntity } from '../entities/service_provider.entity';
import { BaseRepository } from './base.repository';

export class ServiceProviderRepository extends BaseRepository<ServiceProviderEntity> {
  
  public async findByPostalCodeAndDate(postalCode: string, date: Date): Promise<{ serviceProviderName: string, wasteStreamLabel: string }[]> {
    const weekday = date.getDay();
  
    const serviceProviders = await this.createQueryBuilder('service_provider_entity')
      .innerJoin('service_provider_entity.coverages', 'service_provider_coverage_entity')
      .innerJoin('service_provider_coverage_entity.waste_stream', 'waste_stream_entity')
      .where('service_provider_coverage_entity.postal_code_start <= :postalCode AND service_provider_coverage_entity.postal_code_end >= :postalCode', { postalCode })
      .andWhere(`service_provider_coverage_entity.weekday_availability LIKE :weekday`, { weekday: `%${weekday}%` })
      .select(['service_provider_entity.name', 'waste_stream_entity.label'])
      .getRawMany();
  
    return serviceProviders.map(sp => ({ serviceProviderName: sp.service_provider_entity_name, 
      wasteStreamLabel: sp.waste_stream_entity_label }));
  }
}
