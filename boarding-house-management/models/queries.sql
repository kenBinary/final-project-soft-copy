-- #DASHBOARD QUERIES#
-- # OCCUPANCY OVERVIEW 
-- number of occupied rooms
-- create view v_occupied_rooms as 
-- select * from room where room_status = 1;
-- number of unoccupied rooms
-- create view v_unoccupied_rooms as 
-- select * from room where room_status = 0;


-- # FINANCIAL SUMMARY
-- total revenue generate for the current month
create view v_revenue_from_current_month as 
select sum(room_fee) as totalRevenue from room inner join room_fee on room.room_number = room_fee.room_number
where room.room_status = true and room_fee.is_paid = true and month(room_fee.date_paid) = month(curdate());

-- rent collections for current month by tenant
create view v_current_month_dues as 
select first_name as firstName , last_name as lastName, room_fee.rent_due as rentDue, room.room_fee as roomFee from tenant
inner join room_fee on tenant.tenant_id = room_fee.tenant_id inner join room on room_fee.room_number = room.room_number
where room_fee.is_paid = false and month(room_fee.rent_due) = month(curdate());

-- # IMPORTANT REMINDER
-- rent collection within this week
create view v_rent_reminders as
select first_name, last_name, room_fee.rent_due, room.room_fee from tenant 
inner join room_fee on tenant.tenant_id = room_fee.tenant_id inner join room on room_fee.room_number = room.room_number
where timestampdiff(MONTH, curdate(), room_fee.rent_due) < 7;


-- #ROOM MANAGEMENT#
-- # Room Allocation (assign a tenant to a room)
-- delimiter $$
-- create procedure p_assign_room (
--     in roomNumber int,
--     in tenantId varchar(255), 
--     in internetTrue boolean,
--     IN current_due DATE
--     )
-- begin
--     DECLARE EXIT HANDLER FOR SQLEXCEPTION
--     BEGIN
--         ROLLBACK;
--         SELECT 'assign room failed' AS MESSAGE;
--     END;

--     start transaction;
--     -- adds the initial room_fee when assigning
--     insert into room_fee values (uuid(), roomNumber, tenantId, null, current_due, false );

--     -- adds the initial utility_fee for light and water
--     insert into utility_fee values (uuid(), null, current_due, false, 1, tenantId),(uuid(), null, current_due, false, 2, tenantId);

--     -- adds optional initial utility_fee for internet
--     if internetTrue then
--         insert into utility_fee values (uuid(), null, current_due, false, 3, tenantId);
--     end if;
--     UPDATE tenant SET occupancy_status = TRUE WHERE tenant_id = tenantId;
--     update room set room_status = TRUE, headcount = headcount + 1 where room_number = roomNumber;
--     commit;
--     select 'assign room Successful' as message;
-- end $$
-- delimiter ;

-- # GET TENANTS FROM OCCUPIED ROOM
-- select first_name, last_name from tenant inner join room_fee on room_fee.tenant_id = tenant.tenant_id
-- inner join room on room.room_number = room_fee.room_number where room.room_number = roomNumber;

-- -- # REMOVE TENANT FROM ROOM
-- delimiter $$
-- create procedure p_remove_tenant_room (
--     in roomNumber int,
--     in tenantId varchar(255)
--     )
-- begin
--     DECLARE EXIT HANDLER FOR SQLEXCEPTION
--     BEGIN
--         ROLLBACK;
--         SELECT 'remove fail' AS MESSAGE;
--     END;

--     start transaction;
--     -- update assigned room's status
--     update room set headcount = headcount - 1, room_status = false where room_number = roomNumber;

--     -- update tenant occupancy status
--     update tenant set occupancy_status = false where tenant_id = tenantId;

--     -- set room_fee of tenant to null
--     update room_fee set room_number = null where tenant_id = tenantId and room_number = roomNumber;
--     commit;
    
--     select 'remove success' as message;
-- end $$
-- delimiter ;


-- create procedure p_tenant_from_room (
--     in roomNumber int,
--     )
-- begin
--     select first_name, last_name from tenant inner join room_fee on room_fee.tenant_id = tenant.tenant_id
--     inner join room on room.room_number = room_fee.room_number where room.room_number = roomNumber;
-- end $$
-- delimiter ;




-- # Room Availability and Room Details

-- # Room Billings and Payments (Paying a bill)
-- when current fee for month is paid create new fee for preceding month
-- delimiter $$
-- create procedure p_pay_room (
--     in tenantId varchar(255),
--     in datePaid date, in isPaid boolean
-- )
-- begin
--     declare exit handler for sqlexception
--     begin
--         rollback;
--         select 'payment failed' as message;
--     end;

--     start transaction;
--     declare var_is_paid boolean default false;
--     declare var_room_number int;
--     declare var_prev_due date;

--     select room_number into var_room_number, rent_due from room_fee where tenant_id = tenantId;
--     -- pay current month bill
--     update room_fee set date_paid = datePaid, is_paid = isPaid where tenant_id = tenantId and date_paid = null;
--     -- add new bill for next month
--     declare var_new_due date;
--     set var_new_due = concat(year(var_prev_due), '-', month(var_prev_due)+1, '-', 5)
--     insert into room_fee values(uuid(), var_room_number, tenantId, null, var_new_due, false);
--     commit;
--     select 'bill paid succesfully' as message;
-- end$$
-- delimiter;

-- #Room Status Updates
delimiter $$
create procedure p_update_room_status (
    in roomNumber int, in roomStatus boolean
)
begin
    update room set room_status = roomStatus where room_number = roomNumber;
end$$
delimiter ;

-- #TENANT MANAGEMENT#
-- # Get new Tenants
-- CREATE VIEW v_new_tenant AS 
-- SELECT tenant_id, first_name, last_name FROM tenant WHERE occupancy_status = FALSE;

-- # Tenant Registration
-- delimiter $$
-- create procedure p_add_tenant(
--     in firstName varchar(255),
--     in lastName varchar(255),
--     in contactNumber int,
--     in identificationNumber varchar(255)
-- )
-- begin
--     declare exit handler for sqlexception
--     begin
--         rollback;
--         select 'failed to add tenant' as message;
--     end;
--     start transaction;
--         insert into tenant values(uuid(), firstName, lastName, contactNumber, false, false, identificationNumber);
--     commit;
--     select 'add tenant successful' as message;
-- end $$
-- delimiter ;

-- -- # Get new Tenants
-- CREATE VIEW v_new_tenant AS 
-- SELECT tenant_id, first_name, last_name FROM tenant WHERE occupancy_status = FALSE;

-- # Edit 
-- delimiter $$
-- create procedure p_edit_tenant(
--     in tenantId varchar(255),
--     in newFirstName varchar(255),
--     in newLastName varchar(255),
--     in newContactNumber int,
--     in newArchiveStatus boolean,
--     in newIdentificationNumber varchar(255)
-- )
-- begin
--     declare exit handler for sqlexception
--     begin
--         rollback;
--         select 'failed to edit tenant' as message;
--     end;
--     start transaction;
--         update tenant set first_name = newFirstName, last_name = newLastName, contact_number = newContactNumber,
--         archive_status = newArchiveStatus, identification_number = newIdentificationNumber where tenant_id = tenantId;
--     commit;
--     select 'edit tenant successful' as message;
-- end $$
-- delimiter ;

-- -- # ADD A NEW NECESSITY
-- delimiter $$
-- create procedure p_add_necessity(
--     in necessityFee int, in necessityType varchar(255),
--     in tenantId varchar(255)
-- )
-- begin
--     declare exit handler for sqlexception
--     begin
--         rollback;
--         select 'add necessity fail' as message;
--     end;
--     declare var_necessity_id varchar(255);
--     set var_necessity_id = uuid():
--     start transaction;
--         -- add new necessity
--         insert into necessity values(var_necessity_id, necessityFee, necessityType);
--         -- add initial necessity_fee
--         declare var_current_due date;
--         set var_current_due = concat(year(curdate()),'-', month(curdate()),'-', 5);
--         insert into necessity_fee values(uuid(), tenantId, var_necessity_id, false, null, var_current_due);
--     commit;
--     select 'add necessity success' as message;
-- end$$
-- delimiter ;

-- # GET TENANT INFORMATION
SELECT tenant.first_name, tenant.last_name, tenant.contact_number, tenant.occupancy_status, tenant.identification_number, room.room_number, room.room_type FROM tenant
INNER JOIN room_fee ON tenant.tenant_id = room_fee.tenant_id INNER JOIN room ON room_fee.room_number = room.room_number WHERE tenant.tenant_id = "b57bd7ab-5dc9-11ee-9182-31dbb6fccc0c";


-- # BILLING AND EXPENSES
-- when current fee for month is paid create new fee for preceding month
-- DELIMITER $$
-- CREATE PROCEDURE p_pay_room (
--     IN roomFeeId VARCHAR(255)
-- )
-- BEGIN
--     DECLARE var_room_number INT;
--     DECLARE var_tenant_id VARCHAR(255);
--     DECLARE var_prev_due DATE;
--     DECLARE var_new_due DATE;

--     -- Error handling
--     DECLARE EXIT HANDLER FOR SQLEXCEPTION
--     BEGIN
--         ROLLBACK;
--         SELECT 'payment failed' AS message;
--     END;

--     -- Retrieve values from room_fee
--     SELECT room_number, tenant_id, rent_due INTO var_room_number, var_tenant_id, var_prev_due
--     FROM room_fee
--     WHERE room_fee_id = roomFeeId;

--     -- Calculate the new due date
--     SET var_new_due = CONCAT(YEAR(var_prev_due), '-', MONTH(var_prev_due) + 1, '-', '05');

--     START TRANSACTION;

--     -- Pay the current month bill
--     UPDATE room_fee SET date_paid = CURDATE(), is_paid = TRUE WHERE room_fee_id = roomFeeId;

--     -- Add a new bill for the next month
--     INSERT INTO room_fee VALUES (UUID(), var_room_number, var_tenant_id, NULL, var_new_due, FALSE);

--     COMMIT;

--     SELECT 'bill paid successfully' AS message;
-- END $$
-- DELIMITER ;



-- -- #pay utility_fee
-- -- pay(update) utility_fee and then create a new utility_fee for next month
-- DELIMITER $$
-- CREATE PROCEDURE p_pay_utility(
--     IN utilityFeeId VARCHAR(255)
-- )
-- BEGIN
--     DECLARE var_new_due DATE;
--     declare var_prev_due DATE;
--     declare var_tenant_id varchar(255);
--     declare var_utility_id varchar(255);

--     -- error handler
--     DECLARE EXIT HANDLER FOR SQLEXCEPTION
--     BEGIN
--         ROLLBACK;
--         SELECT 'pay utility fail' AS message;
--     END;

--     SELECT utility_due, utility_id, tenant_id INTO var_prev_due, var_utility_id, var_tenant_id FROM utility_fee
--     WHERE utility_fee_id = utilityFeeId;

--     SET var_new_due = CONCAT(YEAR(var_prev_due), '-', MONTH(var_prev_due) + 1, '-', '05');

--     START TRANSACTION;
    
--     -- Pay utility_fee
--     UPDATE utility_fee SET date_paid = CURDATE(), is_paid = TRUE WHERE utility_fee_id = utilityFeeId;
    
--     -- Add new unpaid utility_fee
--     INSERT INTO utility_fee VALUES(UUID(), NULL, var_new_utility_due, FALSE, utilityId, tenantId);

--     COMMIT;
--     SELECT 'pay utility success' AS message;
-- END $$
-- DELIMITER ;


-- -- #pay necessities
-- DELIMITER $$

-- CREATE PROCEDURE p_pay_necessity(
--     IN necessityFeeId VARCHAR(255)
-- )
-- BEGIN
--     DECLARE var_new_due DATE;
--     DECLARE var_prev_due DATE;
--     DECLARE var_tenant_id VARCHAR(255);
--     DECLARE var_necessity_id VARCHAR(255);

--     -- Error handler
--     DECLARE EXIT HANDLER FOR SQLEXCEPTION
--     BEGIN
--         ROLLBACK;
--         SELECT 'Pay necessity fail' AS message;
--     END;

--     SELECT necessity_due, tenant_id, necessity_id INTO var_prev_due, var_tenant_id, var_necessity_id
--     FROM necessity_fee
--     WHERE necessity_fee_id = necessityFeeId;

--     SET var_new_due = CONCAT(YEAR(var_prev_due), '-', MONTH(var_prev_due) + 1, '-', '5');

--     START TRANSACTION;

--     -- Pay necessity_fee
--     UPDATE necessity_fee
--     SET date_paid = CURDATE(), is_paid = TRUE
--     WHERE necessity_fee_id = necessityFeeId;

--     -- Add new unpaid utility_fee
--     INSERT INTO necessity_fee
--     VALUES(UUID(), var_tenant_id, var_necessity_id, FALSE, NULL, var_new_due);

--     COMMIT;

--     SELECT 'Pay necessity success' AS message;
-- END $$

-- DELIMITER ;



-- #TENANT HISTORY AND REPORTS for utility, necessity, and room fees.


-- #PAYMENT MANAGEMENT#
-- # GENERATE BILLS/INVOICES for room, utility, and necessity
-- create view v_room_fee_invoice as
-- select tenant.tenant_id ,tenant.first_name, tenant.last_name, room_fee.room_fee_id, room_fee.room_number, room_fee.rent_due, room_fee.is_paid, room.room_fee from tenant
-- inner join room_fee on tenant.tenant_id = room_fee.tenant_id inner join room on room_fee.room_number = room.room_number 
-- where room_fee.is_paid = false 

-- create view v_necessity_fee_invoice as 
-- select tenant.tenant_id ,tenant.first_name, tenant.last_name, necessity_fee.necessity_fee_id, necessity_fee.necessity_due, necessity_fee.is_paid, necessity.necessity_type, necessity.necessity_fee
-- from tenant inner join necessity_fee on tenant.tenant_id = necessity_fee.tenant_id inner join necessity on 
-- necessity_fee.necessity_id = necessity.necessity_id where necessity_fee.is_paid = false 

-- create view v_utility_fee_invoice as 
-- SELECT tenant.tenant_id ,tenant.first_name, tenant.last_name, utility_fee.utility_fee_id,utility_fee.utility_due, utility_fee.is_paid, utility.utility_type, utility.utility_fee
-- from tenant inner join utility_fee on tenant.tenant_id = utility_fee.tenant_id inner join utility on utility_fee.utility_id = utility.utility_id
-- where utility_fee.is_paid = false 

-- # GET specific room_fee
-- select room_fee.room_number, room_fee.rent_due, room.room_fee from room_fee inner join room on
-- room_fee.room_number = room.room_number where room_fee_id = ?
-- -- # GET specific utility_fee
-- select utility_fee.utility_due, utility.utility_type, utility.utility_fee from utility_fee inner join utility on
-- utility_fee.utility_id = utility.utility_id where utility_fee.utility_fee_id = ?
-- -- # GET specific necessity_fee
-- select necessity_fee.necessity_due, necessity.necessity_type, necessity.necessity_fee from necessity_fee inner join
-- necessity on necessity_fee.necessity_id = necessity.necessity_id where necessity_fee.necessity_fee_id = ?

-- # GET recent payments from last 7 days
CREATE VIEW v_recent_payments AS 
SELECT distinct CONCAT(first_name, " ", last_name) AS NAME, room.room_number, utility.utility_type, necessity.necessity_type  FROM tenant 
LEFT JOIN room_fee ON tenant.tenant_id = room_fee.tenant_id LEFT JOIN room ON room_fee.room_number = room.room_number 
LEFT JOIN utility_fee ON utility_fee.tenant_id = tenant.tenant_id LEFT JOIN utility ON utility.utility_id = utility_fee.utility_id
LEFT JOIN necessity_fee ON necessity_fee.tenant_id = tenant.tenant_id LEFT JOIN necessity ON necessity.necessity_id = necessity_fee.necessity_id 
WHERE room_fee.date_paid >= CURDATE() - INTERVAL 7 DAY OR necessity_fee.date_paid >= CURDATE() - INTERVAL 7 DAY OR utility_fee.date_paid >= CURDATE() - INTERVAL 7 DAY
;


-- # Analytics
-- Paid Analytics/ show unpaid to paid ratio
-- CREATE VIEW v_paid_unpaid_analytics AS 
-- SELECT is_paid FROM room_fee WHERE MONTH(rent_due) = MONTH(CURDATE()) AND YEAR(rent_due) = YEAR(CURDATE()) 
-- UNION all SELECT is_paid  from necessity_fee WHERE MONTH(necessity_due) = MONTH(CURDATE()) AND YEAR(necessity_due) = YEAR(CURDATE())
-- UNION all SELECT is_paid from utility_fee WHERE MONTH(utility_due) = MONTH(CURDATE()) AND YEAR(utility_due) = YEAR(CURDATE());

