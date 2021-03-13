const inquirer = require("inquirer")
const mysql = require("mysql")
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_db"
});

function startUp() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View all employee's",
                "View all employee's by roles",
                "View all employee's by departments",
                "Update employee",
                "Add employee",
                "Add role",
                "Add department"
            ]
        }
    ]).then(function (val) {
        switch (val.choice) {
            case "View all employee's":
                viewEmp();
                break;
            case "View all employee's by roles":
                viewRoles();
                break;
            case "View all employee's by departments":
                viewDpt();
                break;
            case "Add employee":
                addEmp();
                break;
            case "Update employee":
                updateEmp();
                break;
            case "Add role":
                addRole();
                break;
            case "Add department":
                addDpt();
                break;
        }
    })
}

function viewEmp() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startUp()
        })
}

function viewRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startUp()
        })
}

function viewDpt() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startUp()
        })
}

let arrOfRoles = [];
function roleSelect() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            arrOfRoles.push(res[i].title);
        }

    })
    return arrOfRoles;
}

let arrOfMgr = [];
function mgrSelect() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            arrOfMgr.push(res[i].first_name);
        }

    })
    return arrOfMgr;
}

function addEmp() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Please enter their first name "
        },
        {
            name: "lastname",
            type: "input",
            message: "Please enter their last name "
        },
        {
            name: "role",
            type: "list",
            message: "What is their role in the company? ",
            choices: roleSelect()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "What is their manager's name?",
            choices: mgrSelect()
        }
    ]).then(function (val) {
        let roleId = roleSelect().indexOf(val.role) + 1
        let managerId = mgrSelect().indexOf(val.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: val.firstName,
                last_name: val.lastName,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(val)
                startUp()
            })

    })
}

function updateEmp() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function (err, res) {
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: "firstName",
                type: "rawlist",
                choices: function () {
                    let firstName = [];
                    for (var i = 0; i < res.length; i++) {
                        firstName.push(res[i].first_name);
                    }
                    return firstName;
                },
                message: "What is the employee's first name? ",
            },
            {
                name: "lastName",
                type: "rawlist",
                choices: function () {
                    let lastName = [];
                    for (var i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }
                    return lastName;
                },
                message: "What is the employee's last name? ",
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the Employees new title? ",
                choices: roleSelect()
            },
        ]).then(function (val) {
            let roleId = roleSelect().indexOf(val.role) + 1
            connection.query("UPDATE employee SET WHERE ?",
                {
                    first_name: val.firstName

                },
                {
                    last_name: val.lastName

                },
                {
                    role_id: roleId

                },
                function (err) {
                    if (err) throw err
                    console.table(val)
                    startUp()
                })

        });
    });

}
function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What is the roles title?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary?"

            }
        ]).then(function (res) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: res.title,
                    salary: res.salary,
                },
                function (err) {
                    if (err) throw err
                    console.table(res);
                    startUp();
                }
            )

        });
    });
}

function addDpt() {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What department would you like to add?"
        }
    ]).then(function (res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
                name: res.name

            },
            function (err) {
                if (err) throw err
                console.table(res);
                startUp();
            }
        )
    })
}

connection.connect(function (err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    startUp();
});
