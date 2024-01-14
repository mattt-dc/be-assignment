# Seenons Backend Assignment

## Steps Taken

- Separated registered stream pickups from customer entities so they are no longer tightly coupled. The updated entity setup also allows for efficiently retrieving all registered stream pickups for a service provider.
- Setup an in-memory postgres database to allow running integration tests without needing to setup a database instance. This is very quick to run and avoids having to setup dockerfiles, etc (although using docker would have advantages such as not just being an emulation of a database).
- Created a base repository to avoid duplicating repository methods. This uses an 'identifiable' interface to allow finding by id for all entities.
- Setup writable and readable interfaces to be implemented by repositories. These could be used for read-only repositories, for example if the waste stream repository should not be written to, or to implement a CQRS pattern.
- Availability service business logic is being handled in a database call. This could provide performance advantages.
- Added 'integration tests' that run when the application is started and test the provided requirements. The database is seeded on startup to allow this. In a 'real' application these should not run on startup and should be handled by a test framework. The current implementation is for demo purposes.
- Setup new success and error responses for the register stream service.

## Next Steps

These would be my next steps for further improvements. Not done due to time constraints.

- There is currently a lack of error handling. For example in the register stream service if a database call fails the error should be caught and an appropriate error response should be returned.
- Allow for more than one address per customer.
- Duplicate data is currently possible. This could be prevented at a database level.
- Caching. Redis could be used.
- Fix lint parsing errors.
- A domain model diagram.
- Fix inconsistent indentation!

## Note

This was my first time using node and typescript so some best practices may not have been followed.
