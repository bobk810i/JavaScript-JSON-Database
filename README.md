## JavaScript JSON Database
Easy and simple to use JavaScript / NodeJS database module.
### Set of functions for CRUD operations.

Download `JS_JSON_Database` file from Github and place it inside your project.
Import the module:

```js
const db = require(<project path>/JS_JSON_Database);
```

### Database structure:

```js
{
  "subbase_1": [
    {Object 1},
    {Object 2},
    ...
  ],
  "subbase_2": [
    {Object 1},
    {Object 2},
    ...
  ],
  ...
}
```

### Callback structure:

```js
{status: <boolean>, data: <string>}
```
- `status` - information about the success
- `data` - required database element or information about the failure

### Functions:

**DB_createDb( database_name ,  subbase_name , callback() )**

Creating new database file.
- `database_name` - name of the database
- `subbase_name` - name of the first, default subbase


**DB_deleteDb( database_name , callback() )**

Deleting database file.
- `database_name` - name of the database


**DB_createSub( database_name ,  subbase_name , callback() )**

Creating subbase inside the existing database file.
- `database_name` - name of the database
- `subbase_name` - name of the new subbase


**DB_deleteSub( database_name ,  subbase_name , callback() )**

Deleting subbase from the existing database file.
- `database_name` - name of the database
- `subbase_name` - name of the subbase


**DB_get( database_name , callback() )**
Getting whole database.
- `database_name` - name of the database


**DB_getElement( database_name ,  subbase_name , property , callback() )**

Getting the specyfic element from the database by its property.
- `database_name` - name of the database
- `subbase_name` - name of the subbase
- `property` - ex. {name: <name>}
  
  
**DB_getElementById( database_name ,  subbase_name , id , callback() )**

Getting the specyfic element from the database by its ID.
- `database_name` - name of the database
- `subbase_name` - name of the subbase
- `id` - id of the exsisting element
  
  
**DB_addElement( database_name ,  subbase_name , element , callback() )**

Adding the element to the database.
- `database_name` - name of the database
- `subbase_name` - name of the subbase
- `element` - new database element (ex. {name: "name", mail: "mail"})
  
  
**DB_editElement( database_name ,  subbase_name , id, properties , callback() )**

Editing the existing element inside the database.
- `database_name` - name of the database
- `subbase_name` - name of the subbase
- `id` - id of the exsisting element
- `properties` - properties to edit (ex. {mail: "mail"})
  
  
**DB_deleteElement( database_name ,  subbase_name , id , callback() )**

Deleting the existing element inside the database.
- `database_name` - name of the database
- `subbase_name` - name of the subbase
- `id` - id of the exsisting element
