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
    this.serviceProviderRepository = new ServiceProviderRepository();

    this.registerStreamService = new RegisterStreamService(this.customerRepository);
    this.serviceProviderAvailabilityService = new ServiceProviderAvailabilityService(
      this.serviceProviderRepository,
    );

    console.log('App ran correctly');
  }

  async stop() {
    await this.connection.destroy();
  }
}

export default new App();
