const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
require("dotenv").config();

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
        choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Exit"]
    })
    .then(function(answer) {
        if (answer.actionChoice === "View Departments") {
          viewDepartments();
        }
        else if(answer.actionChoice === "View Roles") {
            viewRoles();
        } else if(answer.actionChoice === "View Employees") {
            viewEmployees();
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
  
function viewDepartments() {
    connection.query(query, function(err, res) {
        if(err){
            throw err
        }
    console.table(res);
    });   
};

function viewRoles() {
    inquirer
    .prompt([
    
    ])
    .then(function(response) {

        start();
    });
};

function viewEmployees() {
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id"

    connection.query(query, function(err, res) {
        if(err){
            throw err
        }
    console.table(res);
    start();
    });
};

function addDepartment() {
    inquirer
    .prompt([
    
    ])
    .then(function(response) {

        start();
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