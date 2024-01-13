/**
 * As the database connection and service setup is done in an async method called
 * from the constructor, the class might not be fully initialized when it's first used
 * (if this was a 'real' application).
 *
 * Dependency injection could be used to avoid this. Done this way for convenience.
 */

import { Connection } from 'typeorm';
import { CustomerRepository } from './providers/adapters/customer.repository';
import { ServiceProviderRepository } from './providers/adapters/service_provider.repository';
import { CustomerEntity } from './providers/entities/customer.entity';
import { ServiceProviderAvailabilityService } from './services/availability/service_provider_availability.service';
import { RegisterStreamService } from './services/customer/register_stream.service';
import { getDbClient } from './providers/adapters/db';
import { ServiceProviderEntity } from './providers/entities/service_provider.entity';

class App {
  private connection!: Connection;

  private registerStreamService!: RegisterStreamService;
  private serviceProviderAvailabilityService!: ServiceProviderAvailabilityService;

  private customerRepository!: CustomerRepository;
  private serviceProviderRepository!: ServiceProviderRepository;

  constructor() {
    //todo: see note at top of file
    this.init();
  }

  async init() {
    this.connection = await getDbClient();

    this.customerRepository = new CustomerRepository(CustomerEntity);
    this.serviceProviderRepository = new ServiceProviderRepository(ServiceProviderEntity);

    this.registerStreamService = new RegisterStreamService(this.customerRepository);
    this.serviceProviderAvailabilityService = new ServiceProviderAvailabilityService(
      this.serviceProviderRepository,
    );

    await this.test();
  }

  async stop() {
    await this.connection.destroy();
  }

  async test() {
    const results = await Promise.all([
      this.serviceProviderAvailabilityService.findAvailabilityAt('1010', new Date('2023-10-02')),
      this.serviceProviderAvailabilityService.findAvailabilityAt('1010', new Date('2023-10-04')),
      this.serviceProviderAvailabilityService.findAvailabilityAt('2000', new Date('2023-10-05')),
      this.serviceProviderAvailabilityService.findAvailabilityAt('1010', new Date('2023-10-08')),
      this.serviceProviderAvailabilityService.findAvailabilityAt('0000', new Date('2023-10-03')),
    ]);
  
    const expectedResults = [
      [{ serviceProviderName: 'Unwasted', wasteStreamLabel: 'paper' }, { serviceProviderName: 'Unwasted', wasteStreamLabel: 'metal' }, { serviceProviderName: 'Bluecollection', wasteStreamLabel: 'metal' }],
      [{ serviceProviderName: 'Unwasted', wasteStreamLabel: 'metal' }, { serviceProviderName: 'Bluecollection', wasteStreamLabel: 'metal' }],
      [{ serviceProviderName: 'Bluecollection', wasteStreamLabel: 'metal' }],
      [],
      [],
    ];
  
    for (let i = 0; i < results.length; i++) {
      if (JSON.stringify(results[i]) !== JSON.stringify(expectedResults[i])) {
        console.error(`Test failed for index ${i}. Expected ${JSON.stringify(expectedResults[i])}, but got ${JSON.stringify(results[i])}`);
      }
    }

    console.log('Tests ran correctly');
  }
}

export default new App();
