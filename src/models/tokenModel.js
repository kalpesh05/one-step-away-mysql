const { isEmpty } = require("lodash");
exports.create = async (data) => {
  logger.debug({
    query: `INSERT INTO tokens SET ? `,
    inpitData: data,
  });
  return await db.query(`INSERT INTO tokens SET ? `, data);
};

exports.find = async (
  where = {},
  orderBy = "order by created_at desc",
  gropuBy = ""
) => {
  let filterdWhere = "";
  let condition = [];
  if (!isEmpty(where)) {
    filterdWhere = " where ";
    for (let i in Object.keys(where)) {
      condition.push(` ${Object.keys(where)[i]}="${Object.values(where)[i]}" `);
    }
  }

  filterdWhere += condition.length > 0 ? condition.join("and") : filterdWhere;

  let sql = `SELECT * FROM tokens ${filterdWhere} ${orderBy} ${gropuBy}`;

  logger.debug({
    query: sql,
  });
  return await db.query(sql);
};

exports.findOne = async (
  where,
  orderBy = "order by created_at desc",
  gropuBy = ""
) => {
  let condition = [];
  let filterdWhere = "";
  if (!isEmpty(where)) {
    filterdWhere = " where ";
    for (let i in Object.keys(where)) {
      condition.push(` ${Object.keys(where)[i]}="${Object.values(where)[i]}" `);
    }
  }

  filterdWhere += condition.length > 0 ? condition.join("and") : filterdWhere;

  let sql = `SELECT * FROM tokens ${filterdWhere} ${gropuBy} ${gropuBy}`;

  logger.debug({
    query: sql,
  });
  let result = await db.query(sql);
  return result.length > 0 ? result[0] : null;
};

exports.update = async (where, data) => {
  let condition = [];
  let filterdWhere = "";
  for (let i in Object.keys(where)) {
    condition.push(` ${Object.keys(where)[i]}="${Object.values(where)[i]}" `);
  }
  filterdWhere = condition.length > 0 ? condition.join("and") : filterdWhere;
  let token = [];
  for (var i in data) {
    token.push(`${i}="${data[i]}"`);
  }
  data = token.join();
  // console.log(filterdWhere);
  // console.log(data);

  let sql = `UPDATE tokens SET ${data} where ${filterdWhere}`;

  logger.debug({
    query: sql,
  });
  return await db.query(sql);
};

exports.remove = async (where) => {
  let condition = [];
  let filterdWhere = "";
  for (let i in Object.keys(where)) {
    condition.push(` ${Object.keys(where)[i]}="${Object.values(where)[i]}" `);
  }
  filterdWhere = condition.length > 0 ? condition.join(" and ") : filterdWhere;

  let sql = `DELETE FROM tokens where ${filterdWhere}`;

  logger.debug({
    query: sql,
  });
  return await db.query(sql);
};
