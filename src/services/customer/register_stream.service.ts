import { CustomerRepository } from '../../providers/adapters/customer.repository';
import { ServiceProviderRepository } from 'src/providers/adapters/service_provider.repository';
import { WasteStreamRepository } from 'src/providers/adapters/waste_stream.repository';
import { ServiceProviderAvailabilityService } from '../availability/service_provider_availability.service';
import { RegisteredStreamPickupRepository } from '../../providers/adapters/registered_stream_pickup.repository';
import { RegisteredStreamPickupEntity } from '../../providers/entities/registered_stream_pickup.entity';
import { SuccessResponse } from 'src/interfaces/success_response.interface';
import { ErrorResponse } from 'src/interfaces/error_response.interface';

export type RegisterStreamResponse = SuccessResponse<RegisteredStreamPickupEntity> | ErrorResponse;

export class RegisterStreamService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly serviceProviderRepository: ServiceProviderRepository,
    private readonly wasteStreamRepository: WasteStreamRepository,
    private readonly registeredStreamPickupRepository: RegisteredStreamPickupRepository,
    private readonly serviceProviderAvailabilityService: ServiceProviderAvailabilityService,
  ) {}

  public async registerStream(
    customerId: string,
    streamId: string,
    serviceProviderId: string,
    pickupDate: Date,
  ): Promise<RegisterStreamResponse> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      return {
        status: 'error',
        error: {
          code: 'CUSTOMER_NOT_FOUND',
          message: 'Customer not found',
        },
      };
    }

    const serviceProvider = await this.serviceProviderRepository.findById(serviceProviderId);

    if (!serviceProvider) {
      return {
        status: 'error',
        error: {
          code: 'SERVICE_PROVIDER_NOT_FOUND',
          message: 'Service provider not found',
        },
      };
    }

    const wasteStream = await this.wasteStreamRepository.findById(streamId);

    if (!wasteStream) {
      return {
        status: 'error',
        error: {
          code: 'WASTE_STREAM_NOT_FOUND',
          message: 'Waste stream not found',
        },
      };
    }

    const availableServiceProviders = await this.serviceProviderAvailabilityService
      .findAvailabilityAt(customer.postal_code, pickupDate);

    const isServiceProviderAvailable = availableServiceProviders.some(provider => 
      provider.serviceProviderName === serviceProvider.name && provider.wasteStreamLabel === wasteStream.label
    );

    if (!isServiceProviderAvailable) {
      return {
        status: 'error',
        error: {
          code: 'SERVICE_PROVIDER_NOT_AVAILABLE',
          message: 'The selected service provider or waste stream is not available at this postal code and date',
        },
      };
    }

    const registeredStreamPickup = new RegisteredStreamPickupEntity();
    registeredStreamPickup.customer = customer;
    registeredStreamPickup.waste_stream = wasteStream;
    registeredStreamPickup.service_provider = serviceProvider;
    registeredStreamPickup.pickup_date = pickupDate;

    await this.registeredStreamPickupRepository.save(registeredStreamPickup);

    return {
      status: 'success',
      data: registeredStreamPickup,
    };
  }
}
