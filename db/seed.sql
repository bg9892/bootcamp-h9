USE companyDB;

INSERT INTO employee (first_Name, last_name, role_id) 
VALUES ('Anis', 'Woodcock', 1),
('Kayan', 'Kaufman', 2),
('Cinar', 'Moore', 3);

INSERT INTO role (title, salary, department_id)
VALUES ('intern', 70000, 1),
('junior developer', 140000, 2),
('senior developer', 210000, 3);

INSERT INTO department (name)
VALUES ('software'),
('legal'),
("marketing");