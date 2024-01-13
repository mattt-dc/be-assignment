import { Connection } from 'typeorm';
import { Weekday } from '../entities/service_provider_coverage.entity';

export async function seedDatabase(connection: Connection) {
    
    const wasteStreams = [
        { label: 'paper', category: 'recyclable', id: 'de10e229-d599-4c1d-bfba-dc041f5eace4' },
        { label: 'metal', category: 'recyclable', id: 'de10e229-d599-4c1d-bfba-dc041f5eace3' },
        { label: 'glass', category: 'recyclable', id: 'de10e229-d599-4c1d-bfba-dc041f5eace2' },
    ];

    await connection.createQueryBuilder()
        .insert()
        .into('waste_stream_entity')
        .values(wasteStreams)
        .execute();

    const serviceProviders = [
        { name: 'Unwasted', address: 'Stationplein, 1, 1012 AB Amsterdam',
            id: 'de10e229-d599-4c1d-bfba-dc041f5eace8' },
        { name: 'Bluecollection', address: 'Prins Hendrikkade, 1, 1012 JD Amsterdam',
            id: 'de10e229-d599-4c1d-bfba-dc041f5eace9' },
    ];

    await connection.createQueryBuilder()
    .insert()
    .into('service_provider_entity')
    .values(serviceProviders)
    .execute();

    const coverages = [
        { 
          service_provider: 'de10e229-d599-4c1d-bfba-dc041f5eace8', 
          waste_stream: 'de10e229-d599-4c1d-bfba-dc041f5eace4', 
          postal_code_start: '1010', 
          postal_code_end: '1020', 
          weekday_availability: [Weekday.Monday, Weekday.Tuesday, Weekday.Thursday] 
        },
        { 
          service_provider: 'de10e229-d599-4c1d-bfba-dc041f5eace8', 
          waste_stream: 'de10e229-d599-4c1d-bfba-dc041f5eace3', 
          postal_code_start: '1010', 
          postal_code_end: '1020', 
          weekday_availability: [Weekday.Monday, Weekday.Wednesday, Weekday.Friday] 
        },
        { 
          service_provider: 'de10e229-d599-4c1d-bfba-dc041f5eace9', 
          waste_stream: 'de10e229-d599-4c1d-bfba-dc041f5eace3', 
          postal_code_start: '1000', 
          postal_code_end: '9999', 
          weekday_availability: [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, 
            Weekday.Thursday, Weekday.Friday] 
        },
    ];
    
    await connection.createQueryBuilder()
        .insert()
        .into('service_provider_coverage_entity')
        .values(coverages)
        .execute();
}
