insert into storage.buckets (id, name, public)
values ('project-documents', 'project-documents', true);

create policy "Public read documents" on storage.objects
  for select using (bucket_id = 'project-documents');

create policy "Authenticated upload documents" on storage.objects
  for insert with check (bucket_id = 'project-documents');