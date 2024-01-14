import { RegisterStreamService } from './register_stream.service';
import { CustomerRepository } from '../../providers/adapters/customer.repository';
import { WasteStreamEntity } from '../../providers/entities/waste_stream.entity';
import { ServiceProviderEntity } from '../../providers/entities/service_provider.entity';
import { CustomerEntity } from '../../providers/entities/customer.entity';
import { ServiceProviderRepository } from '../../providers/adapters/service_provider.repository';
import { WasteStreamRepository } from '../../providers/adapters/waste_stream.repository';
import { RegisteredStreamPickupRepository } from '../../providers/adapters/registered_stream_pickup.repository';
import { ServiceProviderAvailabilityService } from '../availability/service_provider_availability.service';
import { RegisteredStreamPickupEntity } from '../../providers/entities/registered_stream_pickup.entity';

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
    it(`should return an error response if the customer doesn't exist`, async () => {
      jest.spyOn(customerRepository, 'findById').mockResolvedValueOnce(null);
  
      const response = await registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date(),
      );
  
      expect(response).toEqual({
        status: 'error',
        error: {
          code: 'CUSTOMER_NOT_FOUND',
          message: 'Customer not found',
        },
      });
      expect(customerRepository.findById).toHaveBeenCalledWith('customer-id');
    });

    it(`should return an error response if the stream doesn't exist`, async () => {
      jest.spyOn(wasteStreamRepository, 'findById').mockResolvedValueOnce(null);
  
      const response = await registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date(),
      );
  
      expect(response).toEqual({
        status: 'error',
        error: {
          code: 'WASTE_STREAM_NOT_FOUND',
          message: 'Waste stream not found',
        },
      });
    });

    it(`should return an error response if the service provider doesn't exist`, async () => {
      jest.spyOn(serviceProviderRepository, 'findById').mockResolvedValueOnce(null);
  
      const response = await registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date(),
      );
  
      expect(response).toEqual({
        status: 'error',
        error: {
          code: 'SERVICE_PROVIDER_NOT_FOUND',
          message: 'Service provider not found',
        },
      });
    });

    it(`should return an error response if the pickup date is not available for the service provider`, async () => {
      jest.spyOn(serviceProviderAvailabilityService, 'findAvailabilityAt').mockResolvedValueOnce([]);
  
      const response = await registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date(),
      );
  
      expect(response).toEqual({
        status: 'error',
        error: {
          code: 'SERVICE_PROVIDER_NOT_AVAILABLE',
          message: 'The selected service provider or waste stream is not available at this postal code and date',
        },
      });
    });

    it(`should register the stream`, async () => {
      jest.spyOn(customerRepository, 'findById').mockResolvedValueOnce({
        id: 'customer-id',
        name: 'customer-name',
        address: 'customer-address',
        postal_code: 'customer-postal-code',
        registered_stream_pickups: [],
      });
    
      jest.spyOn(wasteStreamRepository, 'findById').mockResolvedValueOnce(new WasteStreamEntity());
    
      jest.spyOn(serviceProviderRepository, 'findById').mockResolvedValueOnce(new ServiceProviderEntity());
    
      jest.spyOn(serviceProviderAvailabilityService, 'findAvailabilityAt').mockResolvedValueOnce([
        {
          serviceProviderName: 'service-provider-name',
          wasteStreamLabel: 'stream-name',
        },
      ]);
    
      const registeredStreamPickup = new RegisteredStreamPickupEntity();
      jest.spyOn(registeredStreamPickupRepository, 'save').mockResolvedValueOnce();
    
      const response = await registerStreamService.registerStream(
        'customer-id',
        'stream-id',
        'service-provider-id',
        new Date('2023-01-02'),
      );
    
      expect(response).toEqual({
        status: 'success',
        data: registeredStreamPickup,
      });
    
      expect(registeredStreamPickupRepository.save).toHaveBeenCalledWith(registeredStreamPickup);
    });
  });
});
