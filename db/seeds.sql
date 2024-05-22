USE CMS_db;

INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Software Engineer', 120000, 2),
    ('Accountant', 90000, 3),
    ('Legal Team Lead', 110000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Mark', 'Brown', 3, NULL),
    ('Mike', 'Johnson', 4, 3),
    ('Samantha', 'Green', 5, NULL);