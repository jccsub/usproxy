# Application Services


## From [Services in Domain-Driven Design](https://lostechies.com/jimmybogard/2008/08/21/services-in-domain-driven-design/)

Services are first-class citizens of the domain model.  When concepts of the model would distort any Entity or Value Object, a Service is appropriate.  From Evans’ DDD, a good Service has these characteristics:

The operation relates to a domain concept that is not a natural part of an Entity or Value Object
The interface is defined in terms of other elements in the domain model
The operation is stateless
Services are always exposed as an interface, not for “swappability”, testability or the like, but to expose a set of cohesive operations in the form of a contract.  On a sidenote, it always bothered me when people say that an interface with one implementation is a design smell.  No, an interface is used to expose a contract.  Interfaces communicate design intent, far better than a class might.

* An **_Infrastructure Service_** would be something like our IEmailSender, that communicates directly with external resources, such as the file system, registry, SMTP, database, etc.  Something like NHibernate would show up in the Infrastructure.
* **_Domain services_** are the coordinators, allowing higher level functionality between many different smaller parts.  These would include things like OrderProcessor, ProductFinder, FundsTransferService, and so on.  Since Domain Services are first-class citizens of our domain model, their names and usages should be part of the Ubiquitous Language.  Meanings and responsibilities should make sense to the stakeholders or domain experts.

* Finally, we have _**Application Services**_.  In many cases, Application Services are the interface used by the outside world, where the outside world can’t communicate via our Entity objects, but may have other representations of them.  Application Services could map outside messages to internal operations and processes, communicating with services in the Domain and Infrastructure layers to provide cohesive operations for outside clients.  Messaging patterns tend to rule Application Services, as the other service layers don’t have a reference back out to the Application Services. _**Business rules are not allowed in an Application Service, those belong in the Domain layer.**_

## From [DDD Decoded - Application Services Explained](http://blog.sapiensworks.com/post/2016/08/19/DDD-Application-Services-Explained)
The Application Service is the host of a business case and acts as a mediator between the app and the domain model. As long as you keep the domain behaviour inside the dedicated patterns and none leaks into the AS, you’re good to go. Implementations vary and there’s not a recipe of how a “good” AS looks like. Just remember its role and respect the domain model, the actual code is up to you.

## From [Domain services vs Application services](http://enterprisecraftsmanship.com/2016/09/08/domain-services-vs-application-services/)
* An application service has an important and distinguishing role - it provides a hosting environment for the execution of domain logic. As such, it is a convenient point to inject various gateways such as a repository or wrappers for external services.

* Application services are stateless classes which can work on top of domain entities and value objects.

* The difference between domain services and application services is that domain services hold domain logic whereas application services don't
  * Domain services participate in the decision-making process the same way entities and value objects do.
  * Application services orchestrate those decisions made by entities and value objects.


## From [Services in DDD](http://gorodinski.com/blog/2012/04/14/services-in-domain-driven-design-ddd/)

  The differences between a domain service and an application services are subtle but critical:

  * Domain services are very granular where as application services are a facade purposed with providing an API.
  * Domain services contain domain logic that can’t naturally be placed in an entity or value object whereas application services orchestrate the execution of domain logic and don’t themselves implement any domain logic.
  * Domain service methods can have other domain elements as operands and return values whereas application services operate upon trivial operands such as identity values and primitive data structures.
  * Application services declare dependencies on infrastructural services required to execute domain logic.
  
## From [Application Services vs. Infrastructure Services vs. Domain Services](https://www.bennadel.com/blog/2385-application-services-vs-infrastructure-services-vs-domain-services.htm)
  
The Application Service can only be called by the Controller. Since the Application Service orchestrates application workflow, it would make no sense for them to be called by the Domain Service (or even by themselves) - a workflow has only one single starting point; if an Application Service could be called by other entities within the domain model, it would imply that a workflow has an indeterminate number of starting points.

