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
  let customerRepository: jest.Mocked<CustomerRepository>;
  let serviceProviderRepository: jest.Mocked<ServiceProviderRepository>;
  let wasteStreamRepository: jest.Mocked<WasteStreamRepository>;
  let registeredStreamPickupRepository: jest.Mocked<RegisteredStreamPickupRepository>;
  let serviceProviderAvailabilityService: jest.Mocked<ServiceProviderAvailabilityService>;

  beforeEach(() => {
    customerRepository = { findById: jest.fn(), } as any;
    serviceProviderRepository = { findById: jest.fn(), } as any;
    wasteStreamRepository = { findById: jest.fn(), } as any;
    registeredStreamPickupRepository = { save: jest.fn(), } as any;
    serviceProviderAvailabilityService = { findAvailabilityAt: jest.fn(), } as any;

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
      customerRepository.findById.mockResolvedValue(null);
  
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
      customerRepository.findById.mockResolvedValue(new CustomerEntity());
      serviceProviderRepository.findById.mockResolvedValue(new ServiceProviderEntity());
      wasteStreamRepository.findById.mockResolvedValueOnce(null);
  
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
      customerRepository.findById.mockResolvedValue(new CustomerEntity());
      serviceProviderRepository.findById.mockResolvedValueOnce(null);
  
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
      customerRepository.findById.mockResolvedValue(new CustomerEntity());
      serviceProviderRepository.findById.mockResolvedValue(new ServiceProviderEntity());
      wasteStreamRepository.findById.mockResolvedValueOnce(new WasteStreamEntity());
      serviceProviderAvailabilityService.findAvailabilityAt.mockResolvedValueOnce([]);
  
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
      customerRepository.findById.mockResolvedValue(new CustomerEntity());
      const serviceProvider = new ServiceProviderEntity();
      serviceProvider.id = 'service-provider-id';
      serviceProvider.name = 'service-provider-name';
      serviceProviderRepository.findById.mockResolvedValue(serviceProvider);
      const wasteStream = new WasteStreamEntity();
      wasteStream.id = 'stream-id';
      wasteStream.label = 'stream-name';
      wasteStreamRepository.findById.mockResolvedValueOnce(wasteStream);
    
      serviceProviderAvailabilityService.findAvailabilityAt.mockResolvedValueOnce([
        {
          serviceProviderName: serviceProvider.name,
          wasteStreamLabel: wasteStream.label,
        },
      ]);
    
      const registeredStreamPickup = new RegisteredStreamPickupEntity();
      registeredStreamPickup.customer = new CustomerEntity();
      registeredStreamPickup.service_provider = serviceProvider;
      registeredStreamPickup.waste_stream = wasteStream;
      registeredStreamPickup.pickup_date = new Date('2023-01-02');
      registeredStreamPickupRepository.save.mockResolvedValueOnce();
    
      const response = await registerStreamService.registerStream(
        registeredStreamPickup.customer.id,
        registeredStreamPickup.waste_stream.id,
        registeredStreamPickup.service_provider.id,
        registeredStreamPickup.pickup_date,
      );
    
      expect(response).toEqual({
        status: 'success',
        data: registeredStreamPickup,
      });
    
      expect(registeredStreamPickupRepository.save).toHaveBeenCalledWith(registeredStreamPickup);
    });
  });
});
