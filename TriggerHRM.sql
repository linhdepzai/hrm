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
		while @i < 5
		begin
			declare @UserId uniqueidentifier = (select Id from (select row_number() over(order by FullName asc) as row, * from Employee where Status = 3 and LeaveDate is null) c where row = @i);
			declare @CheckRequest int = (select count(*) as count from OnLeave where [EmployeeId] = @UserId and cast([DateLeave] as date) = cast(getdate() as date) and [Status] = 3);
			if (@CheckRequest <> 0)
			begin
				declare @Request int = (select [Option] from OnLeave where EmployeeId = @UserId and cast(DateLeave as date) = cast(getdate() as date) and Status = 3);
				if (@Request <> 3)
				begin
					insert into TimeKeeping([Id], [EmployeeId], [Date], [Checkin], [Checkout], [Punish]) values (newid(), @UserId, getdate(), '0001-01-01 00:00:00.0000000', '0001-01-01 00:00:00.0000000', 0);
				end
			end
			else
			begin
				insert into TimeKeeping([Id], [EmployeeId], [Date], [Checkin], [Checkout], [Punish]) values (newid(), @UserId, getdate(), '0001-01-01 00:00:00.0000000', '0001-01-01 00:00:00.0000000', 0);
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
	while @i < 5
	begin
		declare @UserId uniqueidentifier = (select [Id] from (select row_number() over(order by [FullName] asc) as row, * from Employee where [Status] = 3 and [LeaveDate] is null) c where row = @i);
		declare @StartTime time = cast((select [MorningStartTime] from TimeWorking where [EmployeeId] = @UserId) as time);
		declare @EndTime time = cast((select [AfternoonEndTime] from TimeWorking where [EmployeeId] = @UserId) as time);
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
					set @StartTime = cast((select [AfternoonStartTime] from TimeWorking where [EmployeeId] = @UserId) as time)
				end
				else if (@Request = 2)
				begin
					set @EndTime = cast((select [MorningEndTime] from TimeWorking where [EmployeeId] = @UserId) as time);
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
				update TimeKeeping set [Punish] = 1 where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date]) values (newid(), @UserId, 'No check in, check out', 100000, getdate());
			end
			else if (@Checkin = cast('00:00:00.0000000' as time))
			begin
				update TimeKeeping set [Punish] = 1 where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date]) values (newid(), @UserId, 'No check in', 50000, getdate());
			end
			else if (@Checkout = cast('00:00:00.0000000' as time))
			begin
				update TimeKeeping set [Punish] = 1 where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date]) values (newid(), @UserId, 'No check out', 50000, getdate());
			end
			else if (@Checkin > @StartTime)
			begin
				update TimeKeeping set [Punish] = 1 where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date]) values (newid(), @UserId, 'Check in late', 20000, getdate());
			end
			else if (@Checkout < @EndTime)
			begin
				update TimeKeeping set [Punish] = 1 where [EmployeeId] = @UserId and cast([Date] as date) = @Today;
				insert into Payoff([Id], [EmployeeId], [Reason], [Amount], [Date]) values (newid(), @UserId, 'Check out early', 20000, getdate());
			end
		end
		set @i = @i + 1;
	end
go
