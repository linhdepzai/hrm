--Hang ngay se xoa cac ban ghi request pending
create or alter proc removeRequestOffPending --run at 11:59
as
	update RequestOff set [IsDeleted] = 1, [DeletionTime] = getdate(), [DeleteUserId] = '00000000-0000-0000-0000-000000000000' where [Status] != 3 and cast(getdate() as date) > cast([DayOff] as date);
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
		declare @totalUser int = (select count(*) from AppUser);
		while @i <= @totalUser
		begin
			declare @UserId uniqueidentifier = (select Id from (select row_number() over(order by Email asc) as row, * from AppUser) c where row = @i);
			declare @CheckRequest int = (select count(*) as count from RequestOff where [UserId] = @UserId and cast([DayOff] as date) = cast(getdate() as date) and [Status] = 3);
			if (@CheckRequest <> 0)
			begin
				declare @Request int = (select [Option] from RequestOff where [UserId] = @UserId and cast([DayOff] as date) = cast(getdate() as date) and Status = 3);
				if (@Request <> 3)
				begin
					insert into TimeKeeping([Id], [UserId], [AppUserId], [Date], [Checkin], [Checkout], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, @UserId, getdate(), '0001-01-01 00:00:00.0000000', '0001-01-01 00:00:00.0000000', 0, getdate(), @UserId, 0);
				end
			end
			else
			begin
				insert into TimeKeeping([Id], [UserId], [AppUserId], [Date], [Checkin], [Checkout], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, @UserId, getdate(), '0001-01-01 00:00:00.0000000', '0001-01-01 00:00:00.0000000', 0, getdate(), @UserId, 0);
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
	declare @totalUser int = (select count(*) from AppUser);
	while @i <= @totalUser
	begin
		declare @UserId uniqueidentifier = (select [Id] from (select row_number() over(order by Email asc) as row, * from AppUser) c where row = @i);
		select top 1* from TimeWorking where [UserId] = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc
		declare @StartTime time = cast((select top 1 [MorningStartTime] from TimeWorking where [UserId] = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc) as time);
		declare @EndTime time = cast((select top 1 [AfternoonEndTime] from TimeWorking where [UserId] = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc) as time);
		declare @CheckDateOff int = (select count(*) as count from TimeKeeping where [UserId] = @UserId and cast([Date] as date) = @Today);
		if (@CheckDateOff <> 0)
		begin
			declare @Checkin time = cast((select [Checkin] from TimeKeeping where [UserId] = @UserId and cast([Date] as date) = @Today) as time);
			declare @Checkout time = cast((select [Checkout] from TimeKeeping where [UserId] = @UserId and cast([Date] as date) = @Today) as time);
			declare @CheckRequest int = (select count(*) as count from RequestOff where [UserId] = @UserId and cast([DayOff] as date) = @Today and [Status] = 3)
			if (@CheckRequest <> 0)
			begin
				declare @Request int = (select [Option] from RequestOff where [UserId] = @UserId and cast([DayOff] as date) = cast(getdate() as date) and Status = 3);
				if (@Request = 1)
				begin
					set @StartTime = cast((select top 1 [AfternoonStartTime] from TimeWorking where [UserId] = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc) as time)
				end
				else if (@Request = 2)
				begin
					set @EndTime = cast((select top 1 [MorningEndTime] from TimeWorking where [UserId] = @UserId and cast([ApplyDate] as Date) < @Today order by [ApplyDate] desc) as time);
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
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [UserId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [UserId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'No check in, check out', 100000, getdate(), 0, getdate(), @UserId, 0);
			end
			else if (@Checkin = cast('00:00:00.0000000' as time))
			begin
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [UserId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [UserId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'No check in', 50000, getdate(), 0, getdate(), @UserId, 0);
			end
			else if (@Checkout = cast('00:00:00.0000000' as time))
			begin
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [UserId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [UserId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'No check out', 50000, getdate(), 0, getdate(), @UserId, 0);
			end
			else if (@Checkin > @StartTime)
			begin
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [UserId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [UserId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'Check in late', 20000, getdate(), 0, getdate(), @UserId, 0);
			end
			else if (@Checkout < @EndTime)
			begin
				update TimeKeeping set [Punish] = 1, [LastModificationTime] = getdate(), [LastModifierUserId] = @UserId where [UserId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [UserId], [Reason], [Amount], [Date], [Punish], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), @UserId, 'Check out early', 20000, getdate(), 0, getdate(), @UserId, 0);
			end
		end
		set @i = @i + 1;
	end
go
--Tao review hang thang
create or alter proc createReviewMonth --Run at 01 every month
as
	declare @i int = 1;
	declare @totalUser int = (select count(*) from AppUser);
	while @i <= @totalUser
	begin
		declare @UserId uniqueidentifier = (select [Id] from (select row_number() over(order by Email asc) as row, * from AppUser) c where row = @i);
		declare @oldLevel int = (select [Level] from Employee where [AppUserId] = @UserId and [IsDeleted]=0);
		declare @manager uniqueidentifier = (select top 1[Manager] from Employee where [AppUserId] = @UserId and [IsDeleted]=0);
		insert into Evaluate([Id], [DateEvaluate], [PMId], [UserId], [OldLevel], [NewLevel], [Note], [CreationTime], [CreatorUserId], [IsDeleted]) values (newid(), getdate(), @manager, @UserId, @oldLevel, @oldLevel, '', getdate(), @manager, 0);
		set @i = @i + 1;
	end
go
-- Tinh luong hang thang
create or alter proc autoCalSalary --Run at 01 every month
as
	declare @i int = 1;
	declare @totalUser int = (select count(*) from AppUser);
	while @i <= @totalUser
	begin
		declare @UserId uniqueidentifier = (select [Id] from (select row_number() over(order by [Email] asc) as row, * from AppUser) c where row = @i);
		-- cal salary
		declare @Salary uniqueidentifier = (select top 1[SalaryId] from EmployeeSalary e join Salary r on e.SalaryId = r.Id where e.AppUserId = @UserId);
		-- cal totalWorkday
		declare @totalWorkday int = (select count(*) from TimeKeeping where [UserId] = @UserId and datepart(month, [Date]) = (datepart(month, getdate()) - 1) and [Punish] = 0);
		-- cal total punish
		declare @totalPunish int = (select sum([Amount]) from Payoff where [UserId] = @UserId and datepart(month, [Date]) = (datepart(month, getdate()) - 1) and [IsDeleted] = 0 and [Punish] = 0);
		if(@totalPunish is null) begin set @totalPunish = 0 end;
		-- cal total bounty
		declare @totalBounty int = (select sum([Amount]) from Payoff where [UserId] = @UserId and datepart(month, [Date]) = (datepart(month, getdate()) - 1) and [IsDeleted] = 0 and [Punish] = 1);
		if(@totalBounty is null) begin set @totalBounty = 0 end;
		-- cal total actualSalary
		declare @Money int = (select [Money] from Salary where [Id] = @Salary);
		declare @Welfare int = (select [Welfare] from Salary where [Id] = @Salary);
		declare @ActualSalary int = @Money + @Welfare + @totalBounty - @totalPunish;
		insert into SalaryReport ([Id], [Date], [totalWorkdays], [UserId], [Salary], [Punish], [Bounty], [ActualSalary], [CreatorUserId], [CreationTime], [IsDeleted], [IsConfirm])
			values (newid(), getdate(), @totalWorkday, @UserId, @Salary, @totalPunish, @totalBounty, @ActualSalary, '00000000-0000-0000-0000-000000000000', getdate(), 0, 1);
		set @i = @i + 1;
	end
go