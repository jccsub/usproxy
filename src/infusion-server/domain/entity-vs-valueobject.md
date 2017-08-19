# Difference between Entity and Value Object

Source [What is the difference between Entities and Value Objects?](http://culttt.com/2014/04/30/difference-entities-value-objects/)

We can generally make the distinction between an Entity and a Value Object when an object is represented with an id.

An Entity’s attributes can change, but it remains the same representation within our system because of it’s unique identifier. Whereas a Value Object is a single instance of an object that is created and then destroyed. We don’t care about a specific instance of a Value Object and we can’t change it’s attributes