insert into company
    (company_name)
VALUES
    ('Google'),
    ('Apple'),
    ('Microsoft');

INSERT INTO employees
    (first_name, last_name, email, password, user_role, emp_status, company_id)
VALUES
    ('Eugene', 'Kim', 'ekim@google.com', 'pass123', True, True, 1),
    ('Tracy', 'N', 'tracy@apple.com', 'pass123', True, True, 2),
    ('Jonathan', 'A', 'jonathan@microsoft.com', 'pass123', True, True, 3),
    ('Jane', 'Doe-google', 'janedoe@google.com', 'pass123', False, True, 1),
    ('John', 'Doe-google', 'johndoen@google.com', 'pass123', False, True, 1),
    ('John', 'Doe-apple', 'johndoe@apple.com', 'pass123', False, True, 2),
    ('Jane', 'Doe-apple', 'janedoe@apple.com', 'pass123', False, True, 2),
    ('Steve', 'Doe-microsoft', 'stevedoe@microsoft.com', 'pass123', False, True, 3),
    ('Stephanie', 'Doe-microsoft', 'stephdoe@microsoft.com', 'pass123', False, True, 3);