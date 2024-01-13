import { ServiceProviderRepository } from '../../providers/adapters/service_provider.repository';

export class ServiceProviderAvailabilityService {
  constructor(private serviceProviderRepository: ServiceProviderRepository) {}

  public async findAvailabilityAt(postalCode: string, date: Date): Promise<{ serviceProviderName: string, wasteStreamLabel: string }[]> {
    return this.serviceProviderRepository.findByPostalCodeAndDate(postalCode, date);
  }
}
