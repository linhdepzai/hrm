insert into Position([Id], [Name], [Color]) values 
	(newid(), 'Admin', '#000000'),
	(newid(), 'Accoutant', '#ff822d'),
	(newid(), 'Dev', '#0099FF'),
	(newid(), 'QA', '#FF66FF'),
	(newid(), 'BA', '#009900'),
	(newid(), 'PM', '#FF6600'),
	(newid(), 'DevOps', '#003300'),
	(newid(), 'DataEngineer', '#AAAAAA'),
	(newid(), 'ScrumMaster', '#FF3300');
declare @AdminId uniqueidentifier = (select [Id] from Position where [Name]='Admin');
declare @AccoutantId uniqueidentifier = (select [Id] from Position where [Name]='Accoutant');
declare @DevId uniqueidentifier = (select [Id] from Position where [Name]='Dev');
declare @QAId uniqueidentifier = (select [Id] from Position where [Name]='QA');
declare @BAId uniqueidentifier = (select [Id] from Position where [Name]='BA');
declare @PMId uniqueidentifier = (select [Id] from Position where [Name]='PM');
declare @DevOpsId uniqueidentifier = (select [Id] from Position where [Name]='DevOps');
declare @DataEngineerId uniqueidentifier = (select [Id] from Position where [Name]='DataEngineer');
declare @ScrumMasterId uniqueidentifier = (select [Id] from Position where [Name]='ScrumMaster');

insert into AppRole([Id], [Name]) values (newid(),'Admin');
insert into AppRole([Id], [Name]) values (newid(),'Leader');
insert into AppRole([Id], [Name]) values (newid(),'Accountant');
insert into AppRole([Id], [Name]) values (newid(),'Employee');

insert into AppUser([Id],[Email],[Password]) values(newid(),'admin@gmail.com','123456');
declare @AppUserId uniqueidentifier = (select [Id] from AppUser where [Email]='admin@gmail.com');

insert into Employee([Id], [AppUserId], [UserCode], [FullName], [Gender], [Phone], [DoB], [Level], [PositionId], [JoinDate], [Bank], [BankAccount], [TaxCode], [InsuranceStatus], [Identify], [PlaceOfOrigin], [PlaceOfResidence], [DateOfIssue], [IssuedBy], [Status], [IsActive], [CreatorUserId], [CreationTime], [IsDeleted])
	values (newid(), @AppUserId, '0000000000', 'Admin', 1, '0123456789', '2001-01-01 00:00:00.0000000', 3, @AdminId, '2001-01-01 00:00:00.0000000', 'VCB', '23112001', '9876543210', '0123698745', '001122334455', 'High Noise', 'Hoang Mike', '2001-01-01T00:00:00.000Z', 'It''s me', 3, 1, '00000000-0000-0000-0000-000000000000', getdate(), 0)

insert into AppUserRole([Id], [UserId], [RoleId]) values (newid(), @AppUserId, @AdminId);

insert into Salary([Id], [Level], [PositionId], [Money], [Welfare], [CreatorUserId], [CreationTime], [IsDeleted])
	values 
	(newid(), 1, @AdminId, 99999999, 50000000, @AppUserId, getdate(), 0),
	(newid(), 2, @AdminId, 99999999, 50000000, @AppUserId, getdate(), 0),
	(newid(), 3, @AdminId, 99999999, 50000000, @AppUserId, getdate(), 0),
	(newid(), 4, @AdminId, 99999999, 50000000, @AppUserId, getdate(), 0),
	(newid(), 5, @AdminId, 99999999, 50000000, @AppUserId, getdate(), 0),
	(newid(), 1, @AccoutantId, 4000000, 2000000, @AppUserId, getdate(), 0),
	(newid(), 2, @AccoutantId, 8000000, 4000000, @AppUserId, getdate(), 0),
	(newid(), 3, @AccoutantId, 12000000, 6000000, @AppUserId, getdate(), 0),
	(newid(), 4, @AccoutantId, 18000000, 9000000, @AppUserId, getdate(), 0),
	(newid(), 5, @AccoutantId, 25000000, 12000000, @AppUserId, getdate(), 0),
	(newid(), 1, @DevId, 0, 0, @AppUserId, getdate(), 0),
	(newid(), 2, @DevId, 8000000, 4000000, @AppUserId, getdate(), 0),
	(newid(), 3, @DevId, 12000000, 6000000, @AppUserId, getdate(), 0),
	(newid(), 4, @DevId, 20000000, 10000000, @AppUserId, getdate(), 0),
	(newid(), 5, @DevId, 40000000, 20000000, @AppUserId, getdate(), 0),
	(newid(), 1, @QAId, 0, 0, @AppUserId, getdate(), 0),
	(newid(), 2, @QAId, 8000000, 4000000, @AppUserId, getdate(), 0),
	(newid(), 3, @QAId, 12000000, 6000000, @AppUserId, getdate(), 0),
	(newid(), 4, @QAId, 20000000, 10000000, @AppUserId, getdate(), 0),
	(newid(), 5, @QAId, 40000000, 20000000, @AppUserId, getdate(), 0),
	(newid(), 1, @BAId, 0, 0, @AppUserId, getdate(), 0),
	(newid(), 2, @BAId, 0, 0, @AppUserId, getdate(), 0),
	(newid(), 3, @BAId, 21000000, 10000000, @AppUserId, getdate(), 0),
	(newid(), 4, @BAId, 50000000, 25000000, @AppUserId, getdate(), 0),
	(newid(), 5, @BAId, 99999999, 50000000, @AppUserId, getdate(), 0),
	(newid(), 1, @DevOpsId, 0, 0, @AppUserId, getdate(), 0),
	(newid(), 2, @DevOpsId, 0, 0, @AppUserId, getdate(), 0),
	(newid(), 3, @DevOpsId, 23000000, 11000000, @AppUserId, getdate(), 0),
	(newid(), 4, @DevOpsId, 42000000, 20000000, @AppUserId, getdate(), 0),
	(newid(), 5, @DevOpsId, 56000000, 32000000, @AppUserId, getdate(), 0),
	(newid(), 1, @DataEngineerId, 7000000, 3000000, @AppUserId, getdate(), 0),
	(newid(), 2, @DataEngineerId, 12000000, 6000000, @AppUserId, getdate(), 0),
	(newid(), 3, @DataEngineerId, 15000000, 7500000, @AppUserId, getdate(), 0),
	(newid(), 4, @DataEngineerId, 20000000, 10000000, @AppUserId, getdate(), 0),
	(newid(), 5, @DataEngineerId, 30000000, 15000000, @AppUserId, getdate(), 0),
	(newid(), 1, @ScrumMasterId, 23000000, 10000000, @AppUserId, getdate(), 0),
	(newid(), 2, @ScrumMasterId, 40000000, 20000000, @AppUserId, getdate(), 0),
	(newid(), 3, @ScrumMasterId, 60000000, 30000000, @AppUserId, getdate(), 0),
	(newid(), 4, @ScrumMasterId, 90000000, 40000000, @AppUserId, getdate(), 0),
	(newid(), 5, @ScrumMasterId, 99999999, 50000000, @AppUserId, getdate(), 0);