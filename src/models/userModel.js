const { isEmpty } = require("lodash");
exports.create = async (data) => {
  logger.debug({
    query: `INSERT INTO users SET ? `,
    insertData: data,
  });
  return await db.query(`INSERT INTO users SET ? `, data);
};

exports.find = async (
  where = {},
  orderBy = "order by users.created_at desc",
  gropuBy = ""
) => {
  let filterdWhere = "";
  let condition = [];

  if (!isEmpty(where)) {
    filterdWhere = "where ";

    for (let i in Object.keys(where)) {
      condition.push(
        ` users.${Object.keys(where)[i]}="${Object.values(where)[i]}" `
      );
    }
  }

  filterdWhere += condition.length > 0 ? condition.join("and") : filterdWhere;

  logger.debug({
    query: `SELECT users.id, users.user_name,users.email, users.is_password_encrypted, users.role_id , roles.role_name FROM users join roles on roles.id = users.role_id  ${filterdWhere} ${orderBy} ${gropuBy}`,
  });

  return await db.query(
    `SELECT users.id, users.user_name,users.email, users.is_password_encrypted, users.role_id , roles.role_name FROM users join roles on roles.id = users.role_id  ${filterdWhere} ${orderBy} ${gropuBy}`
  );
};

exports.findSameName = async (
  where = {},
  orderBy = "order by users.user_name asc",
  gropuBy = ""
) => {
  let filterdWhere = "";
  let condition = [];

  if (!isEmpty(where)) {
    filterdWhere = "where ";

    for (let i in Object.keys(where)) {
      condition.push(
        ` users.${Object.keys(where)[i]} like "${Object.values(where)[i]}%" `
      );
    }
  }
  filterdWhere += condition.length > 0 ? condition.join("and") : filterdWhere;

  logger.debug({
    query: `SELECT users.id, users.user_name,users.email,users.class_code ,users.is_password_encrypted, users.role_id , roles.role_name FROM users join roles on roles.id = users.role_id ${filterdWhere} ${orderBy} ${gropuBy}`,
  });

  return await db.query(
    `SELECT users.id, users.user_name,users.email,users.class_code ,users.is_password_encrypted, users.role_id , roles.role_name FROM users join roles on roles.id = users.role_id ${filterdWhere} ${orderBy} ${gropuBy}`
  );
};

exports.findOne = async (
  where,
  orderBy = "order by users.created_at desc",
  gropuBy = ""
) => {
  let condition = [];
  let filterdWhere = "";
  for (let i in Object.keys(where)) {
    condition.push(
      ` users.${Object.keys(where)[i]}="${Object.values(where)[i]}" `
    );
  }

  filterdWhere = condition.length > 0 ? condition.join("and") : filterdWhere;

  logger.debug({
    query: `SELECT users.id, users.user_name, users.email,users.is_password_encrypted, users.role_id,users.is_gcl_data_access_granted,users.google_access_token_id , roles.role_name, teachers.id as teacher_id,  students.id as student_id FROM users join roles on roles.id = users.role_id  left join teachers on teachers.user_id = users.id  left join students on students.user_id = users.id where ${filterdWhere} ${orderBy} ${gropuBy}`,
  });

  let result = await db.query(
    `SELECT users.id, users.user_name, users.email,users.is_password_encrypted, users.role_id,users.is_gcl_data_access_granted,users.google_access_token_id , roles.role_name, teachers.id as teacher_id,  students.id as student_id FROM users join roles on roles.id = users.role_id  left join teachers on teachers.user_id = users.id  left join students on students.user_id = users.id where ${filterdWhere} ${orderBy} ${gropuBy}`
  );
  return result.length > 0 ? result[0] : null;
};
exports.findOneWithPassword = async (
  where,
  orderBy = "order by created_at desc",
  gropuBy = ""
) => {
  let condition = [];
  let filterdWhere = "";
  for (let i in Object.keys(where)) {
    condition.push(
      ` users.${Object.keys(where)[i]}="${Object.values(where)[i]}" `
    );
  }

  filterdWhere = condition.length > 0 ? condition.join("and") : filterdWhere;

  logger.debug({
    query: `SELECT users.* , roles.role_name, teachers.id as teacher_id, students.id as student_id FROM users join roles on roles.id = users.role_id left join teachers on teachers.user_id = users.id  left join students on students.user_id = users.id where ${filterdWhere} ${gropuBy} ${gropuBy}`,
  });

  let result = await db.query(
    `SELECT users.* , roles.role_name, teachers.id as teacher_id, students.id as student_id FROM users join roles on roles.id = users.role_id left join teachers on teachers.user_id = users.id  left join students on students.user_id = users.id where ${filterdWhere} ${gropuBy} ${gropuBy}`
  );
  return result.length > 0 ? result[0] : null;
};

exports.findStudentWithPassword = async (
  where,
  orderBy = "order by created_at desc",
  gropuBy = ""
) => {
  let condition = [];
  let filterdWhere = "";
  for (let i in Object.keys(where)) {
    condition.push(
      ` users.${Object.keys(where)[i]}="${Object.values(where)[i]}" `
    );
  }

  filterdWhere = condition.length > 0 ? condition.join("and") : filterdWhere;

  logger.debug({
    query: `SELECT users.* , roles.role_name, teachers.id as teacher_id, students.id as student_id FROM users join roles on roles.id = users.role_id left join teachers on teachers.user_id = users.id  left join students on students.user_id = users.id where ${filterdWhere} ${gropuBy} ${gropuBy}`,
  });

  let result = await db.query(
    `SELECT users.* , roles.role_name, teachers.id as teacher_id, students.id as student_id FROM users join roles on roles.id = users.role_id left join teachers on teachers.user_id = users.id  left join students on students.user_id = users.id where ${filterdWhere} ${gropuBy} ${gropuBy}`
  );
  return result.length > 0 ? result[0] : null;
};

exports.update = async (where, data) => {
  let filterdWhere = "";
  let condition = [];

  if (!isEmpty(where)) {
    for (let i in Object.keys(where)) {
      condition.push(` ${Object.keys(where)[i]}="${Object.values(where)[i]}" `);
    }
  }
  filterdWhere = condition.length > 0 ? condition.join("and") : filterdWhere;
  let user = [];
  for (var i in data) {
    user.push(` ${i}="${data[i]}"`);
  }
  data = user.join();
  // console.log(`UPDATE users SET ${data} where ${filterdWhere}`);

  logger.debug({
    query: `UPDATE users SET ${data} where ${filterdWhere}`,
  });

  return await db.query(`UPDATE users SET ${data} where ${filterdWhere}`);
};

exports.remove = async (where) => {
  let filterdWhere = "";
  let condition = [];

  if (!isEmpty(where)) {
    for (let i in Object.keys(where)) {
      condition.push(` ${Object.keys(where)[i]}="${Object.values(where)[i]}" `);
    }
  }
  filterdWhere = condition.length > 0 ? condition.join("and") : filterdWhere;

  logger.debug({
    query: `DELETE FROM users where ${filterdWhere}`,
  });
  return await db.query(`DELETE FROM users where ${filterdWhere}`);
};

exports.query = async (query) => {
  return await db.query(query);
};
