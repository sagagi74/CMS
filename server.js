//Importing neccessry modlues to run this
const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');

// promt for user to select 
const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',              
                'Exit'
            ]
        }
    ])
    .then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                db.end();
                break;
        }
    });
};
//view all department 
const viewAllDepartments = () => {
    const sql = `SELECT * FROM department ORDER BY id ASC`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//view all roles
const viewAllRoles = () => {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary 
                 FROM role 
                 INNER JOIN department ON role.department_id = department.id ORDER BY role.id ASC`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//view all emplyess joining role, deparmtent and employee table
const viewAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id 
                 LEFT JOIN department ON role.department_id = department.id 
                 LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY employee.id ASC`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
//add department  promt
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:'
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        db.query(sql, answer.departmentName, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.departmentName + ' to departments');
            promptUser();
        });
    });
};
// Add role prompt with department selection
const addRole = () => {
    // Fetch all departments to display as choices
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, departments) => {
        if (err) throw err;
        const departmentChoices = departments.map(department => ({
            name: department.name,
            value: department.id
        }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Enter the title of the role:'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'Enter the salary of the role:'
            },
            {
                type: 'list',
                name: 'roleDeptId',
                message: 'Select the department for the role:',
                choices: departmentChoices
            }
        ])
        .then(answer => {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [answer.roleTitle, answer.roleSalary, answer.roleDeptId];
            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added ' + answer.roleTitle + ' to roles');
                promptUser();
            });
        });
    });
};








//add employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the employee\'s first name:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the employee\'s last name:'
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the employee\'s role ID:'
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the employee\'s manager ID (if applicable):'
        }
    ])
    .then(answer => {
        // Set managerId to null if not provided
        const managerId = answer.managerId ? answer.managerId : null;
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [answer.firstName, answer.lastName, answer.roleId, managerId];
        db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.firstName + ' ' + answer.lastName + ' to employees');
            promptUser();
        });
    });
};

//update existed employee promt with name display and role display
const updateEmployeeRole = () => {
    // Fetch all employees to display as choices
    const sqlEmployees = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY id ASC`;
    db.query(sqlEmployees, (err, employees) => {
        if (err) throw err;

        const employeeChoices = employees.map(employee => ({
            name: employee.name,
            value: employee.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee whose role you want to update:',
                choices: employeeChoices
            }
        ])
        .then(answer => {
            const employeeId = answer.employeeId;

            // Fetch all roles to display as choices
            const sqlRoles = `SELECT id, title FROM role ORDER BY id ASC`;
            db.query(sqlRoles, (err, roles) => {
                if (err) throw err;

                const roleChoices = roles.map(role => ({
                    name: role.title,
                    value: role.id
                }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'newRoleId',
                        message: 'Select the new role for the employee:',
                        choices: roleChoices
                    }
                ])
                .then(answer => {
                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    const params = [answer.newRoleId, employeeId];
                    db.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('Updated employee\'s role');
                        promptUser();
                    });
                });
            });
        });
    });
};

promptUser();
