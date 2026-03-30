-- Create project-images storage bucket
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true);

-- Create policies for project-images bucket
create policy "Public read images" on storage.objects
  for select using (bucket_id = 'project-images');

create policy "Authenticated upload images" on storage.objects
  for insert with check (bucket_id = 'project-images');

create policy "Authenticated update images" on storage.objects
  for update using (bucket_id = 'project-images');

create policy "Authenticated delete images" on storage.objects
  for delete using (bucket_id = 'project-images');
