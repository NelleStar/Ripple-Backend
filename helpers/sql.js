const { BadRequestError } = require("../expressError");

//Helper for making selective update queries. The calling function can use it to make the SET clause of an SQL UPDATE statement. 
    // @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
    // @param jsToSql {Object} maps js-style data fields to database column names,  like { firstName: "first_name", age: "age" }
    // @returns {Object} {sqlSetCols, dataToUpdate}
    // @example {firstName: 'Aliya', age: 32} =>
    //         { setCols: '"first_name"=$1, "age"=$2',
    //         values: ['Aliya', 32] }

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  //creates an array called cols - maps over the keys of dataToUpdate object - for each key it retrieves the db column name from jsToSql mapping object
  // If no mapping is found, it uses the original key
  // It then formats each column and its value as a string in the form "column_name"=$1, $2, etc., where the $1, $2, etc. are placeholders for parameterized queries.
  const cols = keys.map(
    (colName, idx) => `${jsToSql[colName] || colName}=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
