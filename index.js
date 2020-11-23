const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
require("dotenv").config();
let filtered = [];

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "company_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
    .prompt({
        name: "actionChoice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Departments", "View Roles", "View Employees", "View Employees by Department", "View Employees by Role", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Exit"]
    })
    .then(function(answer) {
        if (answer.actionChoice === "View Departments") {
          viewDepartments();
        } else if(answer.actionChoice === "View Roles") {
            viewRoles();
        } else if(answer.actionChoice === "View Employees") {
            viewEmployees();
        } else if(answer.actionChoice === "View Employees by Department") {
            viewEmployeesByDepartment();
        } else if(answer.actionChoice === "View Employees by Role") {
            viewEmployeesByRole();
        } else if(answer.actionChoice === "Add Department") {
            addDepartment();
        } else if(answer.actionChoice === "Add Role") {
            addRole();
        } else if(answer.actionChoice === "Add Employee") {
            addEmployee();
        } else if(answer.actionChoice === "Update Employee Role") {
            updateEmployeeRole();
        } else{
          connection.end();
        };
    });
};

function viewDepartments(){
    connection.query("SELECT name FROM department", function(err, res) {
        if(err){
            throw err
        }
        console.log("")
        console.log("----------------------------------------------------------------------------------")
        res.forEach(department => console.log(department.name))
        console.log("----------------------------------------------------------------------------------")
        console.log("")
        start();
    });
}

function viewRoles(){
    connection.query("SELECT title FROM role", function(err, res) {
        if(err){
            throw err
        }
        console.log("")
        console.log("----------------------------------------------------------------------------------")
        res.forEach(role => console.log(role.title))
        console.log("----------------------------------------------------------------------------------")
        console.log("")
        start();
    });
}
  
function viewEmployeesByDepartment() {
    connection.query("SELECT name FROM department", function(err, res) {
        if(err){
            throw err
        }
        let departments = [];
        res.forEach(department => departments.push(department.name))
        inquirer
        .prompt([
            {
            name: "selectedDepartment",
            type: "list",
            choices: departments,
            message: "What department would you like to see?"
            }
        ]).then(function(response){
            let selectedDepartment = response.selectedDepartment
            let query = `SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager  FROM employee e LEFT JOIN role ON e.role_id = role.id RIGHT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id `

            connection.query(query, function(err, res) {
                if(err){
                    throw err
                }
                filtered = res.filter(employee => employee.department === selectedDepartment)
                console.log("")
                console.log("----------------------------------------------------------------------------------")
                console.log(selectedDepartment)
                console.log("")
                console.table(filtered);
                console.log("----------------------------------------------------------------------------------")
                start();
            });
        });
    });
};

function viewEmployeesByRole() {
    connection.query("SELECT title FROM role", function(err, res) {
        if(err){
            throw err
        }
        let roles = [];
        res.forEach(role => roles.push(role.title))
        inquirer
        .prompt([
            {
            name: "selectedRole",
            type: "list",
            choices: roles,
            message: "What role would you like to see?"
            }
        ]).then(function(response){
            let selectedRole = response.selectedRole
            let query = `SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager  FROM employee e LEFT JOIN role ON e.role_id = role.id RIGHT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id `

            connection.query(query, function(err, res) {
                if(err){
                    throw err
                }
                filtered = res.filter(employee => employee.title === selectedRole)
                console.log("")
                console.log("----------------------------------------------------------------------------------")
                console.log(selectedRole)
                console.log("")
                console.table(filtered);
                console.log("----------------------------------------------------------------------------------")
                start();
            });
        });
    });
};

function viewEmployees() {
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id"

    connection.query(query, function(err, res) {
        if(err){
            throw err
        }
    console.log("")
    console.log("----------------------------------------------------------------------------------")
    console.log("Employees")
    console.log("")
    console.table(res);
    console.log("----------------------------------------------------------------------------------")
    start();
    });
};

function addDepartment() {
    inquirer
    .prompt([
        {
        name: "newDepartment",
        type: "input",
        message: "What is the name of the new department?"
        }
    ])
    .then(function(response) {
        let newDepartment = response.newDepartment
        connection.query(
            "INSERT INTO department SET ?",
            {
              name: newDepartment,
            },
            function(err) {
              if (err) throw err;
              console.log("")
              console.log("----------------------------------------------------------------------------------")
              console.log(newDepartment + " was added as a department.");
              console.log("----------------------------------------------------------------------------------")
              console.log("")
              start();
            }
          );
    });
};

function addRole() {
    inquirer
    .prompt([
    
    ])
    .then(function(response) {

        start();
    });
};

function addEmployee() {
    inquirer
    .prompt([
    
    ])
    .then(function(response) {

        start();
    });
};

function updateEmployeeRole() {
    inquirer
    .prompt([
    
    ])
    .then(function(response) {

        start();
    });
};