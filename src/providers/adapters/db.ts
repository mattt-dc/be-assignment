import { newDb } from 'pg-mem';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CustomerEntity } from '../entities/customer.entity';
import { RegisteredStreamPickupEntity } from '../entities/registered_stream_pickup.entity';
import { ServiceProviderCoverageEntity } from '../entities/service_provider_coverage.entity';
import { ServiceProviderEntity } from '../entities/service_provider.entity';
import { WasteStreamEntity } from '../entities/waste_stream.entity';

export async function getDbClient() {
    const db = newDb();
    db.public.registerFunction({
        implementation: () => 'test',
        name: 'current_database',
    });
    db.public.registerFunction({
        implementation: () => 'PostgreSQL 13.3 on x86_64-pc-linux-gnu, ' +
                              'compiled by gcc (GCC) 8.3.1 20191121 (Red Hat 8.3.1-5), 64-bit',
        name: 'version',
    });
    db.public.registerFunction({
        implementation: () => uuidv4(),
        name: 'uuid_generate_v4',
    });
    const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [
        CustomerEntity,
        RegisteredStreamPickupEntity,
        ServiceProviderCoverageEntity,
        ServiceProviderEntity,
        WasteStreamEntity
        ]
    });

    await connection.synchronize();

    return connection;
}