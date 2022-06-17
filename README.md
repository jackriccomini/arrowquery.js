# arrowquery-js

Response to [My other database is a compiler](https://blog.chiselstrike.com/my-other-database-is-a-compiler-10fd527a4d78).
Parse and compile JavaScript arrow functions to SQL queries at runtime.

## Transformation
```
> const { sql } = require("./arrowquery.js");
> console.log(sql(customers => customers.country == "Mexico" && customers.customerId > 5));
SELECT * FROM customers WHERE country = 'Mexico' and customerId > 5;
```

## Querying
```
> const db = require("better-sqlite3")("/tmp/Chinook_Sqlite.sqlite");
> db.magic = query => db.prepare(sql(query)).all()
> db.magic(employee => employee.state == "AB" && employee.employeeId < 2);
[ { EmployeeId: 1,
    LastName: 'Adams',
    FirstName: 'Andrew',
    Title: 'General Manager',
    ReportsTo: null,
    BirthDate: '1962-02-18 00:00:00',
    HireDate: '2002-08-14 00:00:00',
    Address: '11120 Jasper Ave NW',
    City: 'Edmonton',
    State: 'AB',
    Country: 'Canada',
    PostalCode: 'T5K 2N1',
    Phone: '+1 (780) 428-9482',
    Fax: '+1 (780) 428-3457',
    Email: 'andrew@chinookcorp.com' } ]
```

## Information

**Should I use this?**

No.
Cool that it's possible though.

**How does it work?**

Calling `.toString()` on a function lets you access its source code at runtime.
Passing that code to a JavaScript parser lets you compile arbitrary JavaScript functions to SQL (or anything).