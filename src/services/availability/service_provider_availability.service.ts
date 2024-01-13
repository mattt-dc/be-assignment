import { ServiceProviderRepository } from '../../providers/adapters/service_provider.repository';

/*
  1. Implementation
  - How do you find the available service providers?
  - How to model correctly the response according to the expectation?
*/
export class ServiceProviderAvailabilityService {
  constructor(private serviceProviderRepository: ServiceProviderRepository) {}

  public async findAvailabilityAt(postalCode: string, date: Date): Promise<{ serviceProviderName: string, wasteStreamLabel: string }[]> {
    return this.serviceProviderRepository.findByPostalCodeAndDate(postalCode, date);
  }
}
