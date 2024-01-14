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
import { WasteStreamRepository } from './providers/adapters/waste_stream.repository';
import { RegisteredStreamPickupRepository } from './providers/adapters/registered_stream_pickup.repository';
import { WasteStreamEntity } from './providers/entities/waste_stream.entity';
import { RegisteredStreamPickupEntity } from './providers/entities/registered_stream_pickup.entity';

class App {
  private connection!: Connection;

  private registerStreamService!: RegisterStreamService;
  private serviceProviderAvailabilityService!: ServiceProviderAvailabilityService;

  private customerRepository!: CustomerRepository;
  private serviceProviderRepository!: ServiceProviderRepository;
  private wasteStreamRepository!: WasteStreamRepository;
  private registeredStreamPickupRepository!: RegisteredStreamPickupRepository;

  constructor() {
    //todo: see note at top of file
    this.init();
  }

  async init(): Promise<void> {
    this.connection = await getDbClient();

    this.customerRepository = new CustomerRepository(CustomerEntity);
    this.serviceProviderRepository = new ServiceProviderRepository(ServiceProviderEntity);
    this.wasteStreamRepository = new WasteStreamRepository(WasteStreamEntity);
    this.registeredStreamPickupRepository = new RegisteredStreamPickupRepository(RegisteredStreamPickupEntity);

    this.serviceProviderAvailabilityService = new ServiceProviderAvailabilityService(
      this.serviceProviderRepository,
    );

    this.registerStreamService = new RegisterStreamService(
      this.customerRepository,
      this.serviceProviderRepository,
      this.wasteStreamRepository,
      this.registeredStreamPickupRepository,
      this.serviceProviderAvailabilityService,
    );

    await this.test();
  }

  async stop(): Promise<void> {
    await this.connection.destroy();
  }

  async test(): Promise<void> {
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

    const registerStreamResult = await this.registerStreamService.registerStream(
      'de10e229-d599-4c1d-bfba-dc041f5eace1',
      'de10e229-d599-4c1d-bfba-dc041f5eace4',
      'de10e229-d599-4c1d-bfba-dc041f5eace8',
      new Date('2023-10-02'),
    );
  
    const expectedRegisterStreamResult = {
      status: 'success',
      data: {
        customer: {
          id: 'de10e229-d599-4c1d-bfba-dc041f5eace1',
          name: 'test customer',
          address: 'test address',
          postal_code: '1010',
        },
        waste_stream: {
          id: 'de10e229-d599-4c1d-bfba-dc041f5eace4',
          label: 'paper',
          category: 'recyclable',
        },
        service_provider: {
          id: 'de10e229-d599-4c1d-bfba-dc041f5eace8',
          name: 'Unwasted',
          address: 'Stationplein, 1, 1012 AB Amsterdam',
        },
        pickup_date: new Date('2023-10-02'),
      },
    };
  
    if ('status' in registerStreamResult && registerStreamResult.status === 'success') {
      if (
        JSON.stringify(registerStreamResult.data.customer) !== JSON.stringify(expectedRegisterStreamResult.data.customer) ||
        JSON.stringify(registerStreamResult.data.waste_stream) !== JSON.stringify(expectedRegisterStreamResult.data.waste_stream) ||
        JSON.stringify(registerStreamResult.data.service_provider) !== JSON.stringify(expectedRegisterStreamResult.data.service_provider) ||
        JSON.stringify(registerStreamResult.data.pickup_date) !== JSON.stringify(expectedRegisterStreamResult.data.pickup_date) ||
        !registerStreamResult.data.id) {
          console.error(`Test failed for registerStream. The result did not match the expected result.`);
      }
    }
    else {
      console.log('RegisterStream test failed as the status was not success.');
    }

    console.log('Tests ran correctly');
  }
}

export default new App();
