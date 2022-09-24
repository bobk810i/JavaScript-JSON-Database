const fs = require('fs');
const path = require('path');

function DB_get(dbName, callback){
    let fullDbPath = path.join(__dirname, `${dbName}.json`);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);

    return callback({"status": true, "data": data});
}

function DB_getElement(dbName, subName, info, callback){
    let fullDbPath = path.join(__dirname, `${dbName}.json`);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);

    let property = Object.entries(info)[0]; // take only first property
    let finalElement;
    let foundElement = false;
    data[subName].forEach((element)=>{ // list through all elements
        Object.keys(element).forEach((key)=>{ // list through all keys
            if(key == property[0]){ // correct key
                if(element[key] == property[1]){
                    foundElement = true;
                    finalElement = element;
                }             
            }
        })
    })
    if(foundElement){ // element has been found
        return callback({"status": true, "data": finalElement});
    }else{
        return callback({"status": false, "data": "Element not found"});
    }
}

function DB_getElementById(dbPath, dbName, id, callback){
    let fullDbPath = path.join(__dirname, `${dbPath}.json`);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);
    
    let finalElement = null;
    data[dbName].forEach((element)=>{ // search fir the element in database
        if(element._id == id){
            finalElement = element;
        }
    })
    if(finalElement != null){ // element found in database
        return callback({"status": true, "data": finalElement});
    }else{ // element not found in database
        return callback({"status": false});
    }
}

function DB_addElement(dbPath, dbName, newElement, callback){
    let fullDbPath = path.join(__dirname, `${dbPath}.json`);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);

    newElement["_id"] = uid(); // Add id to the element

    data[dbName].push(newElement);
    fs.writeFileSync(fullDbPath, JSON.stringify(data, null, 2), 'utf8');
    return callback({"status": true});
}

function DB_editElement(dbPath, dbName, id, newElement, callback){
    let fullDbPath = path.join(__dirname, `${dbPath}.json`);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);
    let elementIndex = indexById(data[dbName], id); // get the element index in database
    let oldElement = DB_getElement(dbPath, dbName, id).data; // get the old element itself
    
    let finalElement = oldElement;

    if(finalElement != null){ // element found in database
        let dbValuesNames = [];
        let dbEditedValuesNames = [];
        Object.entries(finalElement).forEach((entry)=>{ // list all the existing db element entries
            dbValuesNames.push(entry[0]);
        })
        Object.entries(newElement).forEach((entry)=>{ // list all the new db element entries
            dbEditedValuesNames.push(entry[0]);
        })
        
        dbValuesNames.forEach((existingValue)=>{
            dbEditedValuesNames.forEach((newValue)=>{
                if(existingValue == newValue){
                    finalElement[existingValue] = newElement[existingValue];
                }
            })
        })

        data[dbName].splice(elementIndex, 1); // delete old element
        data[dbName].push(finalElement); // add element to the database
        fs.writeFileSync(fullDbPath, JSON.stringify(data, null, 2), 'utf8');
        return callback({"status": true}); // everything alright

    }else{ // element not found in database
        return callback({"status": false, "data": "Element not found"});
    }
}

function indexById(data, id){
    let counter = 0;
    let index = counter;
    data.forEach((element)=>{
        if(element._id == id){
            index = counter;
            
        }else{
            counter = counter + 1;
        }
    })
    return index;
}

function DB_deleteElement(dbPath, dbName, id, callback){
    let fullDbPath = path.join(__dirname, `${dbPath}.json`);
    let rawData = fs.readFileSync(fullDbPath);
    let data = JSON.parse(rawData);
    let elementIndex = indexById(data[dbName], id);

    data[dbName].splice(elementIndex, 1);
    fs.writeFileSync(fullDbPath, JSON.stringify(data, null, 2), 'utf8');
    return callback({"status": true});
}

function uid() { // unique ID generator
  return (Math.random().toString(36) + Math.random().toString(36)).replace(/\./g,"");
};

function DB_createDb(dbName, subDbName, callback){
    // Check if the same name DB exsists
    let dbPath = path.join(__dirname, `${dbName}.json`);
    let dbList = [];
    let dbExists = false;
    fs.readdir(__dirname, (err, data)=>{
        data.forEach((file)=>{ // get all JSON files from directory
            let name = file.split(".")[0];
            let prefix = file.split(".")[1];
            if(prefix == 'json'){
                dbList.push(name);
            }
        })
        dbList.forEach((element)=>{
            if(element == dbName){ // same name DB exsists - change variable
                dbExists = true;
            }
        })
        if(dbExists){
            return callback({"status": false, "data": "Database already exsists"});
        }else{
            let newDb = {};
            newDb[subDbName] = [];
            fs.writeFileSync(dbPath, JSON.stringify(newDb, null, 2), 'utf8');
            return callback({"status": true});
        }
    });
}

function DB_deleteDb(dbName, callback){
    let dbPath = path.join(__dirname, `${dbName}.json`);
    fs.unlink(dbPath, (err)=>{
        if(err){
            return callback({"status": false, "data": "Database doesn't exsists"});
        }else{
            return callback({"status": true});
        }
    })
}

function DB_createSub(dbName, subName, callback){
    let dbPath = path.join(__dirname, `${dbName}.json`);
    let dbList = [];
    fs.readdir(__dirname, (err, data)=>{
        data.forEach((file)=>{ // get all JSON files from directory
            let name = file.split(".")[0];
            let prefix = file.split(".")[1];
            if(prefix == 'json'){
                dbList.push(name);
            }
        })
        dbList.forEach((element)=>{
            if(element == dbName){ // same name DB exsists - change variable
                dbExists = true;
            }
        })
        if(dbExists){ // database exists

            let subExsists = false;
            let rawInside = fs.readFileSync(dbPath);
            let inside = JSON.parse(rawInside);
            let allSubNames = Object.keys(inside);
            allSubNames.forEach((element)=>{
                if(element == subName){ // check if the same name sub exsists
                    subExsists = true;
                }
            })
            if(subExsists){
                return callback({"result": false, "data": "Subbase already exsists"});
            }else{
                // Create Subbase
                inside[subName] = [];
                fs.writeFileSync(dbPath, JSON.stringify(inside, null, 2), 'utf8');
                return callback({"result": true});
            }
            
        }else{
            return callback({"status": false, "data": "Database doesn't exsists"})
        }
    });
}

function DB_deleteSub(dbName, subName, callback){
    let dbPath = path.join(__dirname, `${dbName}.json`);
    let dbList = [];
    fs.readdir(__dirname, (err, data)=>{
        data.forEach((file)=>{ // get all JSON files from directory
            let name = file.split(".")[0];
            let prefix = file.split(".")[1];
            if(prefix == 'json'){
                dbList.push(name);
            }
        })
        dbList.forEach((element)=>{
            if(element == dbName){ // same name DB exsists - change variable
                dbExists = true;
            }
        })
        if(dbExists){ // database exists

            let subExsists = false;
            let rawInside = fs.readFileSync(dbPath);
            let inside = JSON.parse(rawInside);
            let allSubNames = Object.keys(inside);
            allSubNames.forEach((element)=>{
                if(element == subName){ // check if the same name sub exsists
                    subExsists = true;
                }
            })
            if(subExsists){
                // delete subbase
                delete inside[subName];
                fs.writeFileSync(dbPath, JSON.stringify(inside, null, 2), 'utf8');
                return callback({"result": true});
            }else{ // sub doesn't exsists
                return callback({"result": false, "data": "Subbase doesn't exsists"});
            }
            
        }else{
            return callback({"status": false, "data": "Database doesn't exsists"})
        }
    });
}

module.exports = {DB_getElementById, DB_addElement, DB_editElement, DB_deleteElement, DB_get, DB_createDb, DB_deleteDb, DB_createSub, DB_deleteSub, DB_getElement};

