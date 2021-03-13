DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUE ("Legal");
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");

INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Bruce", "Wayne", 1, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Harleen", "Quinzel", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jason", "Todd", null, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Solomon", "Grundy", null, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Bob", "Kane", null, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Pamela", "Isley", null, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Victor", "Fries", null, 7);

SELECT * FROM department;
SELECT * FROM employee;
SELECT * FROM role;