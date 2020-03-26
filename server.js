const mysql = require('mysql');
const inquirer = require("inquirer");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "companyDB"
});

const queryAsync = util.promisify(connection.query).bind(connection);

connection.connect(function (err) {
  if (err) throw err;
  startQuestions();
});

function startQuestions() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View Employees By Departments",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          employees();
          break;

        case "View Employees By Departments":
          departments();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;
      }
    })
}

function employees() {
  let query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department ";
  query += "FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id"
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startQuestions();
  })
}

async function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employees first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employees last name?"
      },
      {
        name: "department",
        type: "input",
        message: "What is the employees department?",
      },
      {
        name: "role",
        type: "input",
        message: "What is the employees role?",
      },
      {
        name: "salary",
        type: "input",
        message: `What is the employees salary?`
      }
    ])
    .then(async function (answer) {
      const { firstName, lastName, department, role, salary } = answer;
      const roleID = await queryAsync('SELECT id FROM role');
      const departmentID = await queryAsync('SELECT id FROM department');
      const queries = {
        employeeQuery: `INSERT INTO employee (first_name, last_name, role_id) VALUES ('${firstName}', '${lastName}', '${roleID.length + 1}')`,
        roleQuery: `INSERT INTO role (title, salary, department_id) VALUES ('${role}', '${salary}', '${departmentID.length + 1}')`,
        departmentQuery: `INSERT INTO department (department) VALUES ('${department}')`
      };

      await queryAsync(queries.employeeQuery);
      await queryAsync(queries.roleQuery);
      await queryAsync(queries.departmentQuery);

      startQuestions();
    });
}

async function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "role",
        type: "input",
        message: "What is the employee's new role?"
      }
    ])
    .then(async function (answer) {
      console.log(answer.role);
      const roleID = await queryAsync(`SELECT role_id FROM employee WHERE first_name = '${answer.firstName}' AND last_name = '${answer.lastName}'`);
      const query = `UPDATE role SET title = '${answer.role}' WHERE id = '${roleID[0].role_id}'`;
      await queryAsync(query);
      startQuestions();
    })
}


// Still working on this------------------------------------------------------------------


// async function removeEmployee() {
//   const employee = await queryAsync(`SELECT first_name, last_name FROM employee`);
//   let nameArray = [];

//   for (var i = 0; i < employee.length; i++) {
//     nameArray.push(employee[i].first_name + " " + employee[i].last_name);
//   }
//   await inquirer
//     .prompt([
//       {
//         name: "name",
//         type: "rawlist",
//         message: "What is the employee's first name?",
//         choices: nameArray
//       }
//     ])
//     .then(async function (answer) {
      
//       console.log(test);
//       const query = `DELETE FROM employee WHERE first_name = '${answer.firstName}' AND last_name = ${answer.lastName}`;
//       // await queryAsync(query);
//       startQuestions();
//     });
// }
