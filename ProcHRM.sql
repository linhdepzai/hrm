--Hang ngay se xoa cac ban ghi request pending
create or alter proc removeRequestOffPending --run at 11:59
as
	declare @AdminId uniqueidentifier = (select [Id] from Employee where [DepartmentId] is null and [Position] = 0 and [IsDeleted] = 0 and [Status] = 3);
	update OnLeave set [IsDeleted] = 1, [DeletionTime] = getdate(), [DeleteUserId] = @AdminId where [Status] != 3 and cast(getdate() as date) > cast([DateLeave] as date);
go
--Hang ngay se tao 1 ban ghi check in
--Neu ngay hom day co request off fullday thi ko tao ban ghi
create or alter proc addDailyCheckin --Run at 00:01
as
	declare @Saturday date = dateadd(day, -datepart(weekday, getdate()), cast(getdate() as date));
	declare @Sunday date = dateadd(day, 1 - datepart(weekday, getdate()), cast(getdate() as date));
	declare @Today date = cast(getdate() as date);
	if (@Today <> @Saturday and @Today <> @Sunday)
	begin
		declare @i int = 1;
		declare @totalUser int = (select count(*) from Employee where Status = 3 and LeaveDate is null);
		while @i <= @totalUser
		begin
			declare @UserId uniqueidentifier = (select Id from (select row_number() over(order by FullName asc) as row, * from Employee where Status = 3 and LeaveDate is null) c where row = @i);
			declare @CheckRequest int = (select count(*) as count from OnLeave where [EmployeeId] = @UserId and cast([DateLeave] as date) = cast(getdate() as date) and [Status] = 3);
			if (@CheckRequest <> 0)
			begin
				declare @Request int = (select [Option] from OnLeave where EmployeeId = @UserId and cast(DateLeave as date) = cast(getdate() as date) and Status = 3);
				if (@Request <> 3)
				begin
					insert into TimeKeeping([Id], [EmployeeId], [Date], [Checkin], [Checkout], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, getdate(), '0001-01-01 00:00:00.0000000', '0001-01-01 00:00:00.0000000', 0, getdate(), @UserId, 0);
				end
			end
			else
			begin
				insert into TimeKeeping([Id], [EmployeeId], [Date], [Checkin], [Checkout], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, getdate(), '0001-01-01 00:00:00.0000000', '0001-01-01 00:00:00.0000000', 0, getdate(), @UserId, 0);
			end
			set @i = @i + 1;
		end
	end
go
--Check phat hang ngay
--Neu quen check in hoac check out phat 50k
--Neu quen check in va check out phat 100k
--Neu check in muon hoac check out som phat 20k
create or alter proc addDailyPunish --Run at 23:59
as
	declare @Today date = cast(getdate() as date);
	declare @i int = 1;
	declare @totalUser int = (select count(*) from Employee where Status = 3 and LeaveDate is null);
	while @i <= @totalUser
	begin
		declare @UserId uniqueidentifier = (select [Id] from (select row_number() over(order by [FullName] asc) as row, * from Employee where [Status] = 3 and [LeaveDate] is null) c where row = @i);
		select top 1* from TimeWorking where EmployeeId = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc
		declare @StartTime time = cast((select top 1 [MorningStartTime] from TimeWorking where [EmployeeId] = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc) as time);
		declare @EndTime time = cast((select top 1 [AfternoonEndTime] from TimeWorking where [EmployeeId] = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc) as time);
		declare @CheckDateOff int = (select count(*) as count from TimeKeeping where [EmployeeId] = @UserId and cast([Date] as date) = @Today);
		if (@CheckDateOff <> 0)
		begin
			declare @Checkin time = cast((select [Checkin] from TimeKeeping where [EmployeeId] = @UserId and cast([Date] as date) = @Today) as time);
			declare @Checkout time = cast((select [Checkout] from TimeKeeping where [EmployeeId] = @UserId and cast([Date] as date) = @Today) as time);
			declare @CheckRequest int = (select count(*) as count from OnLeave where [EmployeeId] = @UserId and cast([DateLeave] as date) = @Today and [Status] = 3)
			if (@CheckRequest <> 0)
			begin
				declare @Request int = (select [Option] from OnLeave where EmployeeId = @UserId and cast(DateLeave as date) = cast(getdate() as date) and Status = 3);
				if (@Request = 1)
				begin
					set @StartTime = cast((select top 1 [AfternoonStartTime] from TimeWorking where [EmployeeId] = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc) as time)
				end
				else if (@Request = 2)
				begin
					set @EndTime = cast((select top 1 [MorningEndTime] from TimeWorking where [EmployeeId] = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc) as time);
				end
				else if (@Request = 4)
				begin
					set @StartTime = dateadd(hour, 2, @StartTime)
				end
				else if (@Request = 5)
				begin
					set @EndTime = dateadd(hour, -2, @EndTime)
				end
			end
			if (@Checkin = cast('00:00:00.0000000' as time) and @Checkout = cast('00:00:00.0000000' as time))
			begin
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'No check in, check out', 100000, getdate(), 0, getdate(), @UserId, 0);
			end
			else if (@Checkin = cast('00:00:00.0000000' as time))
			begin
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'No check in', 50000, getdate(), 0, getdate(), @UserId, 0);
			end
			else if (@Checkout = cast('00:00:00.0000000' as time))
			begin
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'No check out', 50000, getdate(), 0, getdate(), @UserId, 0);
			end
			else if (@Checkin > @StartTime)
			begin
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'Check in late', 20000, getdate(), 0, getdate(), @UserId, 0);
			end
			else if (@Checkout < @EndTime)
			begin
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'Check out early', 20000, getdate(), 0, getdate(), @UserId, 0);
			end
		end
		set @i = @i + 1;
	end
go
--Tao review hang thang
create or alter proc createReviewMonth --Run at 01 every month
as
	declare @i int = 1;
	declare @totalPm int = (select count(*) from MemberProject where [Type] = 1);
	while @i <= @totalPm
	begin
		declare @projectId uniqueidentifier = (select [ProjectId] from (select row_number() over(order by [CreationTime] asc) as row, * from MemberProject where [Type] = 1) c where row = @i);
		declare @leader uniqueidentifier = (select [EmployeeId] from MemberProject where [ProjectId] = @projectId and [Type] = 1);
		declare @totalMember int = (select count(*) from MemberProject where [ProjectId] = @projectId and [Type] = 2);
		declare @j int = 1;
		while @j <= @totalMember
		begin
			declare @member uniqueidentifier = (select [EmployeeId] from (select row_number() over(order by [CreationTime] asc) as row, * from MemberProject where [ProjectId] = @projectId and [Type] = 2) c where row = @j);
			declare @oldLevel int = (select [Level] from Employee where [Id] = @member);
			insert into Evaluate([Id], [DateEvaluate], [PMId], [EmployeeId], [OldLevel], [NewLevel], [Note], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), getdate(), @leader, @member, @oldLevel, @oldLevel, '', getdate(), @leader, 0);
			set @j = @j + 1;
		end
		set @i = @i + 1;
	end
go
-- Tinh luong hang thang
create or alter proc autoCalSalary --Run at 01 every month
as
	declare @i int = 1;
	declare @totalUser int = (select count(*) from Employee where Status = 3 and LeaveDate is null);
	while @i <= @totalUser
	begin
		declare @UserId uniqueidentifier = (select [Id] from (select row_number() over(order by [FullName] asc) as row, * from Employee where [Status] = 3 and [LeaveDate] is null) c where row = @i);
		-- cal salary
		declare @Salary uniqueidentifier = (select top 1[Salary] from SalaryForEmployee where [EmployeeId] = @UserId);
		-- cal totalWorkday
		declare @totalWorkday int = (select count(*) from TimeKeeping where EmployeeId = @UserId and datepart(month, [Date]) = (datepart(month, getdate()) - 1) and [Punish] = 0);
		-- cal total punish
		declare @totalPunish int = (select sum([Amount]) from Payoff where EmployeeId = @UserId and datepart(month, [Date]) = (datepart(month, getdate()) - 1) and [IsDeleted] = 0 and [Punish] = 0);
		if(@totalPunish is null) begin set @totalPunish = 0 end;
		-- cal total bounty
		declare @totalBounty int = (select sum([Amount]) from Payoff where EmployeeId = @UserId and datepart(month, [Date]) = (datepart(month, getdate()) - 1) and [IsDeleted] = 0 and [Punish] = 1);
		if(@totalBounty is null) begin set @totalBounty = 0 end;
		-- cal total actualSalary
		declare @Money int = (select [Money] from Salary where [Id] = @Salary);
		declare @Welfare int = (select [Welfare] from Salary where [Id] = @Salary);
		declare @ActualSalary int = @Money + @Welfare + @totalBounty - @totalPunish;
		insert into EmployeeSalary ([Id], [Date], [totalWorkdays], [EmployeeId], [Salary], [Punish], [Bounty], [ActualSalary], [CreatorUserId], [CreationTime], [IsDeleted], [IsConfirm])
			values (newid(), getdate(), @totalWorkday, @UserId, @Salary, @totalPunish, @totalBounty, @ActualSalary, '00000000-0000-0000-0000-000000000000', getdate(), 0, 0);
		set @i = @i + 1;
	end
go
