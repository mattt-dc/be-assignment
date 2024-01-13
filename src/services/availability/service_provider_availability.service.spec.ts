import { ServiceProviderAvailabilityService } from './service_provider_availability.service';
import { ServiceProviderRepository } from '../../providers/adapters/service_provider.repository';

describe('ServiceProviderAvailabilityService', () => {
  let serviceProviderRepository: jest.Mocked<ServiceProviderRepository>;
  let serviceProviderAvailabilityService: ServiceProviderAvailabilityService;

  beforeEach(() => {
    serviceProviderRepository = {
      findByPostalCodeAndDate: jest.fn(),
    } as any;
    serviceProviderAvailabilityService = new ServiceProviderAvailabilityService(
      serviceProviderRepository,
    );
  });

  describe('findAvailabilityAt', () => {
    it('should return [Unwasted (paper, metal), Bluecollection(metal)] for postal code 1010 on a Monday (2023-10-02)', async () => {
      serviceProviderRepository.findByPostalCodeAndDate.mockResolvedValue([
        { serviceProviderName: 'Unwasted', wasteStreamLabel: 'paper' },
        { serviceProviderName: 'Unwasted', wasteStreamLabel: 'metal' },
        { serviceProviderName: 'Bluecollection', wasteStreamLabel: 'metal' },
      ]);

      const result = await serviceProviderAvailabilityService.findAvailabilityAt('1010', new Date('2023-10-02'));
      expect(result).toEqual([
        { serviceProviderName: 'Unwasted', wasteStreamLabel: 'paper' },
        { serviceProviderName: 'Unwasted', wasteStreamLabel: 'metal' },
        { serviceProviderName: 'Bluecollection', wasteStreamLabel: 'metal' },
      ]);
    });

    it('should return [Unwasted(metal), Bluecollection(metal)] for postal code 1010 on a Wednesday (2023-10-04)', async () => {
      serviceProviderRepository.findByPostalCodeAndDate.mockResolvedValue([
        { serviceProviderName: 'Unwasted', wasteStreamLabel: 'metal' },
        { serviceProviderName: 'Bluecollection', wasteStreamLabel: 'metal' },
      ]);
  
      const result = await serviceProviderAvailabilityService.findAvailabilityAt('1010', new Date('2023-10-04'));
      expect(result).toEqual([
        { serviceProviderName: 'Unwasted', wasteStreamLabel: 'metal' },
        { serviceProviderName: 'Bluecollection', wasteStreamLabel: 'metal' },
      ]);
    });
  
    it('should return [Bluecollection(metal)] for postal code 2000 on a Thursday (2023-10-05)', async () => {
      serviceProviderRepository.findByPostalCodeAndDate.mockResolvedValue([
        { serviceProviderName: 'Bluecollection', wasteStreamLabel: 'metal' },
      ]);
  
      const result = await serviceProviderAvailabilityService.findAvailabilityAt('2000', new Date('2023-10-05'));
      expect(result).toEqual([
        { serviceProviderName: 'Bluecollection', wasteStreamLabel: 'metal' },
      ]);
    });
  
    it('should return empty list if no service providers are available for postal code 1010 on a Sunday (2023-10-08)', async () => {
      serviceProviderRepository.findByPostalCodeAndDate.mockResolvedValue([]);
  
      const result = await serviceProviderAvailabilityService.findAvailabilityAt('1010', new Date('2023-10-08'));
      expect(result).toEqual([]);
    });
  
    it('should return empty list if no service providers are available at postal code 0000', async () => {
      serviceProviderRepository.findByPostalCodeAndDate.mockResolvedValue([]);
  
      const result = await serviceProviderAvailabilityService.findAvailabilityAt('0000', new Date('2023-10-02')); // Any date can be used here
      expect(result).toEqual([]);
    });
  });
});
