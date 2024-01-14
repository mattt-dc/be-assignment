import { RegisterStreamService } from './register_stream.service';
import { CustomerRepository } from '../../providers/adapters/customer.repository';
import { WasteStreamEntity } from '../../providers/entities/waste_stream.entity';
import { ServiceProviderEntity } from '../../providers/entities/service_provider.entity';
import { CustomerEntity } from 'src/providers/entities/customer.entity';
import { ServiceProviderRepository } from 'src/providers/adapters/service_provider.repository';
import { WasteStreamRepository } from 'src/providers/adapters/waste_stream.repository';
import { RegisteredStreamPickupRepository } from 'src/providers/adapters/registered_stream_pickup.repository';
import { ServiceProviderAvailabilityService } from '../availability/service_provider_availability.service';
import { RegisteredStreamPickupEntity } from 'src/providers/entities/registered_stream_pickup.entity';

//3. Testability
describe('RegisterStreamService', () => {
  let registerStreamService: RegisterStreamService;
  let customerRepository: CustomerRepository;
  let serviceProviderRepository: ServiceProviderRepository;
  let wasteStreamRepository: WasteStreamRepository;
  let registeredStreamPickupRepository: RegisteredStreamPickupRepository;
  let serviceProviderAvailabilityService: ServiceProviderAvailabilityService;

  beforeEach(() => {
    customerRepository = new CustomerRepository(CustomerEntity);
    serviceProviderRepository = new ServiceProviderRepository(ServiceProviderEntity);
    wasteStreamRepository = new WasteStreamRepository(WasteStreamEntity);
    registeredStreamPickupRepository = new RegisteredStreamPickupRepository(RegisteredStreamPickupEntity);
    serviceProviderAvailabilityService = new ServiceProviderAvailabilityService(serviceProviderRepository);

    registerStreamService = new RegisterStreamService(
      customerRepository,
      serviceProviderRepository,
      wasteStreamRepository,
      registeredStreamPickupRepository,
      serviceProviderAvailabilityService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerStream', () => {
    it(`should throw an error if the customer doesn't exist`, () => {
      jest.spyOn(customerRepository, 'findById').mockResolvedValueOnce(null);

      const response = registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date(),
      );

      expect(response).toEqual({
        error: 'Customer not found',
      });
      expect(customerRepository.findById).toHaveBeenCalledWith('customer-id');
    });

    it(`should throw an error if the stream doesn't exist`, () => {

    });

    it(`should throw an error if the service provider doesn't exist`, () => {

    });

    it(`should throw an error if the pickup date is not available for the service provider`, () => {
      
    });

    //1. Implementation
    it(`should register the stream`, () => {
      jest.spyOn(customerRepository, 'findById').mockResolvedValueOnce({
        id: 'customer-id',
        name: 'customer-name',
        address: 'customer-address',
        registered_stream_pickups: [],
        postal_code: 'customer-postal-code',
      });

      jest.spyOn(customerRepository, 'save').mockResolvedValueOnce(undefined);

      const response = registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date('2023-01-02'),
      );

      expect(response).toEqual({
        id: 'customer-id',
        name: 'customer-name',
        address: 'customer-address',
        postal_code: 'customer-postal-code',
        registered_stream_pickups: [
          {
            id: expect.any(String),
            waste_stream: new WasteStreamEntity(),
            service_provider: new ServiceProviderEntity(),
            pickup_date: new Date('2023-01-02'),
          },
        ],
      });
    });

    //4. Opportunities
    it(`should update the previous stream if it already exists`, () => {
    });
  });
});
