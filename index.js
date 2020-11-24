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
        choices: ["View Departments", "View Roles", "View Employees", "View Employees by Department", "View Employees by Role", "View Employees by Manager", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "Update Employee Manager", "Delete Department", "Delete Role", "Delete Employee", "Exit"]
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
        } else if(answer.actionChoice === "View Employees by Manager") {
            viewEmployeesByManager();
        } else if(answer.actionChoice === "Add Department") {
            addDepartment();
        } else if(answer.actionChoice === "Add Role") {
            addRole();
        } else if(answer.actionChoice === "Add Employee") {
            addEmployee();
        } else if(answer.actionChoice === "Update Employee Role") {
            updateEmployeeRole();
        } else if(answer.actionChoice === "Update Employee Manager") {
            updateEmployeeManager();
        } else if(answer.actionChoice === "Delete Department") {
            DeleteDepartment();
        } else if(answer.actionChoice === "Delete Role") {
            DeleteRole();
        } else if(answer.actionChoice === "Delete Employee") {
            DeleteEmployee();
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
        console.log("Departments")
        console.log("------------")
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
        console.log("Roles")
        console.log("------")
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
            let query = `SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager  FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id `

            connection.query(query, function(err, res) {
                if(err){
                    throw err
                }
                filtered = res.filter(employee => employee.department === selectedDepartment)
                if (filtered.length === 0){
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log(selectedDepartment + " has no employees.")
                    console.log("----------------------------------------------------------------------------------")
                    console.log("")
                } else {
                console.log("")
                console.log("----------------------------------------------------------------------------------")
                console.log(selectedDepartment)
                console.log("")
                console.table(filtered);
                console.log("----------------------------------------------------------------------------------")
                }
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
                if (filtered.length === 0){
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log("Currently there are no employees in the " + selectedRole + " role.")
                    console.log("----------------------------------------------------------------------------------")
                    console.log("")
                } else {
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log(selectedRole)
                    console.log("")
                    console.table(filtered);
                    console.log("----------------------------------------------------------------------------------")
                }   
                start();
            });
        });
    });
};

function viewEmployeesByManager() {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name, manager_id FROM employee", function(err, res) {
        if(err){
            throw err
        }
        let employees = res;
        let employeeNames = res.map(employee => employee.name)
        inquirer
        .prompt([
            {
            name: "managerSelected",
            type: "list",
            choices: employeeNames,
            message: "What manager would you like to see?"
            }
        ]).then(function(response){
            let managerSelected = response.managerSelected
            let query = `SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager  FROM employee e LEFT JOIN role ON e.role_id = role.id RIGHT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id `

            connection.query(query, function(err, res) {
                if(err){
                    throw err
                }
                filtered = res.filter(employee => employee.manager === managerSelected)
                if (filtered.length === 0) {
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log(managerSelected + " has no direct reports")
                    console.log("----------------------------------------------------------------------------------")
                    console.log("")
                } else {
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log("Direct Reports of " + managerSelected)
                    console.log("")
                    console.table(filtered);
                    console.log("----------------------------------------------------------------------------------")
                }
                
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
    connection.query("SELECT name FROM department", function(err, res) {
        if(err){
            throw err
        }
        let departments = [];
        res.forEach(department => departments.push(department.name))
        inquirer
        .prompt([
            {
                name: "newRole",
                type: "input",
                message: "What is the name of the new role?"
            },
            {
                name: "newSalary",
                type: "input",
                message: "How much is the salary?"
            },
            {
                name: "roleDepartment",
                type: "list",
                choices: departments,
                message: "What department is the role in?"
            }
        ])
        .then(function(response) {
            let newRole = response.newRole
            let newSalary = parseInt(response.newSalary)
            let roleDepartment = response.roleDepartment
            connection.query(
                "SELECT id FROM department WHERE name = ?", [roleDepartment], function(err, res){
                    if (err) {
                        throw err
                    }
                    connection.query(
                        "INSERT INTO role SET ?",
                        {
                        title: newRole,
                        salary: newSalary,
                        department_id: res[0].id
                        },
                        function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log("")
                        console.log("----------------------------------------------------------------------------------")
                        console.log(`${newRole} was added as a role for ${roleDepartment}.`);
                        console.log("----------------------------------------------------------------------------------")
                        console.log("")
                        start();
                        }
                    );
                }
            )
        });
    });
};

function addEmployee() {
    connection.query("SELECT id, title FROM role", function(err, res) {
        if(err){
            throw err
        }
        let roles = res;
        let roleTitles = res.map(role => role.title)
        connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employee", function(err, res) {
            if(err){
                throw err
            }
            let managers = res
            let managerNames = managers.map(manager => manager.manager)
            managerNames.push("None")
            inquirer
            .prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "What is the first name of the new employee?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the last name of the new employee?"
                },
                {
                    name: "employeeRole",
                    type: "list",
                    choices: roleTitles,
                    message: "What is the role of the new employee?"
                },
                {
                    name: "employeeManager",
                    type: "list",
                    choices: managerNames,
                    message: "Who is the employee's manager?"
                }
            ])
            .then(function(response) {
                let firstName = response.firstName
                let lastName = response.lastName
                let employeeRole = roles.filter(role => role.title === response.employeeRole)
                let employeeRoleId = employeeRole[0].id;
                let employeeManager;
                let employeeManagerId;
                if (response.employeeManager === "None") {
                    employeeManagerId = null
                } else {
                    employeeManager = managers.filter(manager => manager.manager === response.employeeManager)
                    employeeManagerId = employeeManager[0].id
                }
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: employeeRoleId,
                    manager_id: employeeManagerId
                    },
                    function(err) {
                    if (err) {
                        throw err;
                    }
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log(`${firstName} ${lastName} was added as a ${employeeRole[0].title}.`);
                    console.log("----------------------------------------------------------------------------------")
                    console.log("")
                    start();
                    }
                );
            });
        });
    });
};

function updateEmployeeRole() {
    connection.query("SELECT id, title FROM role", function(err, res) {
        if(err){
            throw err
        }
        let roles = res;
        let roleTitles = res.map(role => role.title)
        connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function(err, res) {
            if(err){
                throw err
            }
            let employees = res;
            let employeeNames = res.map(employee => employee.name)
            inquirer
            .prompt([
                {
                    name: "updatingEmployee",
                    type: "list",
                    choices: employeeNames,
                    message: "What employee would you like to update?"
                },
                {
                    name: "newRole",
                    type: "list",
                    choices: roleTitles,
                    message: "What is the new role for this employee?"
                }
            ])
            .then(function(response) {
                let updatingEmployee = employees.filter(employee => employee.name === response.updatingEmployee)
                let employeeId = updatingEmployee[0].id
                let employeeRole = roles.filter(role => role.title === response.newRole)
                let employeeRoleId = employeeRole[0].id;
                connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                      {
                        role_id: employeeRoleId
                      },
                      {
                        id: employeeId
                      }
                    ],
                    function(error) {
                      if (error) throw err;
                      console.log("")
                      console.log("----------------------------------------------------------------------------------")
                      console.log(`${updatingEmployee[0].name} has been updated to a ${employeeRole[0].title}`);
                      console.log("----------------------------------------------------------------------------------")
                      console.log("")
                      start();
                    }
                );
            });
        });
    });
};

function updateEmployeeManager() {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function(err, res) {
        if(err){
            throw err
        }
        let employees = res;
        let employeeNames = res.map(employee => employee.name)
        inquirer
        .prompt([
            {
                name: "updatingEmployee",
                type: "list",
                choices: employeeNames,
                message: "What employee would you like to update?"
            },
            {
                name: "newManager",
                type: "list",
                choices: employeeNames,
                message: "Who is the new manager for this employee?"
            }
        ])
        .then(function(response) {
            let updatingEmployee = employees.filter(employee => employee.name === response.updatingEmployee)
            let employeeId = updatingEmployee[0].id
            let employeeManager = employees.filter(employee => employee.name === response.newManager)
            let employeeManagerId = employeeManager[0].id;
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                    manager_id: employeeManagerId
                    },
                    {
                    id: employeeId
                    }
                ],
                function(error) {
                    if (error) throw err;
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log(`${updatingEmployee[0].name} has been updated to report to ${employeeManager[0].name}.`);
                    console.log("----------------------------------------------------------------------------------")
                    console.log("")
                    start();
                }
            );
        });
    });
};

function DeleteDepartment() {
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
            message: "What department would you like to delete?"
            },
            {
                name: "confirm",
                type: "list",
                choices: ["Yes", "Cancel"],
                message: "Deleting a department will delete all job roles and employees in that department. Are you sure you want to delete this department?"
            }
        ]).then(function(response){
            let confirm = response.confirm
            let selectedDepartment = response.selectedDepartment
            if (confirm === "Yes"){
                connection.query("DELETE FROM department WHERE ?", 
                [{
                    name: selectedDepartment
                }],
                function(err, res) {
                    if(err){
                        throw err
                    }
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log(selectedDepartment +" deleted.")
                    console.log("----------------------------------------------------------------------------------")
                });  
            } else {
                console.log("")
                console.log("----------------------------------------------------------------------------------")
                console.log("Successfully canceled.")
                console.log("----------------------------------------------------------------------------------")
            };
            start();
        });
    });
};

function DeleteRole() {
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
            message: "What role would you like to delete?"
            },
            {
                name: "confirm",
                type: "list",
                choices: ["Yes", "Cancel"],
                message: "Deleting a role will delete all employees in that role. Are you sure you want to delete this role?"
            }
        ]).then(function(response){
            let confirm = response.confirm
            let selectedRole = response.selectedRole
            if (confirm === "Yes"){
                connection.query("DELETE FROM role WHERE ?", 
                [{
                    title: selectedRole
                }],
                function(err, res) {
                    if(err){
                        throw err
                    }
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log(selectedRole +" deleted.")
                    console.log("----------------------------------------------------------------------------------")
                });  
            } else {
                console.log("")
                console.log("----------------------------------------------------------------------------------")
                console.log("Successfully canceled.")
                console.log("----------------------------------------------------------------------------------")
            };
            start();
        });
    });
};

function DeleteEmployee() {
    connection.query("SELECT id, CONCAT(first_name, last_name) AS name FROM employee", function(err, res) {
        if(err){
            throw err
        }
        let employees = res;
        let employeeNames = [];
        res.forEach(employee => employeeNames.push(employee.name))
        inquirer
        .prompt([
            {
            name: "selectedEmployee",
            type: "list",
            choices: employeeNames,
            message: "Which employee would you like to delete?"
            },
            {
                name: "confirm",
                type: "list",
                choices: ["Yes", "Cancel"],
                message: "Are you sure you want to delete this employee?"
            }
        ]).then(function(response){
            let confirm = response.confirm
            let selectedEmployee = employees.filter(employee => employee.name === response.selectedEmployee);
            let selectedEmployeeId = selectedEmployee[0].id
            if (confirm === "Yes"){
                connection.query("DELETE FROM employee WHERE ?", 
                [{
                   id: selectedEmployeeId
                }],
                function(err, res) {
                    if(err){
                        throw err
                    }
                    console.log("")
                    console.log("----------------------------------------------------------------------------------")
                    console.log(selectedEmployee[0].name +" deleted.")
                    console.log("----------------------------------------------------------------------------------")
                });  
            } else {
                console.log("")
                console.log("----------------------------------------------------------------------------------")
                console.log("Successfully canceled.")
                console.log("----------------------------------------------------------------------------------")
            };
            start();
        });
    });
};   