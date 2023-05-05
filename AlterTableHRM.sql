insert into Position([Name], [Color]) values 
	('Admin', '#000000'),
	('Dev', '#0099FF'),
	('QA', '#FF66FF'),
	('BA', '#009900'),
	('PM', '#FF6600'),
	('DevOps', '#003300'),
	('DataEngineer', '#AAAAAA'),
	('ScrumMaster', '#FF3300')
insert into Employee([Id], [UserCode], [FullName], [Sex], [Email], [Password], [Phone], [DoB], [Level], [Position], [StartingDate], [Bank], [BankAccount], [TaxCode], [InsuranceStatus], [Identify], [PlaceOfOrigin], [PlaceOfResidence], [DateOfIssue], [IssuedBy], [Status], [CreationTime], [IsDeleted])
	values (newid(), '0000000000', 'Admin', 1, 'admin@gmail.com', '123456', '0123456789', '2001-01-01 00:00:00.0000000', 3, 0, '2001-01-01 00:00:00.0000000', 'VCB', '23112001', '9876543210', '0123698745', '001122334455', 'High Noise', 'Hoang Mike', '2001-01-01T00:00:00.000Z', 'It''s me', 3, getdate(), 0)