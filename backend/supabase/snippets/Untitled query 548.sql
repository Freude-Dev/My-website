drop policy "Public insert" on contact_messages;

create policy "Public insert" on contact_messages
for insert
with check (
  -- Name validation
  first_name is not null and length(first_name) between 1 and 100
  and last_name is not null and length(last_name) between 1 and 100

  -- Email validation
  and email is not null
  and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  and length(email) <= 254

  -- Phone is optional but if provided, keep it reasonable
  and (phone is null or length(phone) <= 20)

  -- Message must have meaningful content
  and message is not null and length(message) between 10 and 2000
);