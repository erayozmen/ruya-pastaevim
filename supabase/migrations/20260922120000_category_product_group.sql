-- Products (cakes table) stay one generic store; the category decides
-- whether a product belongs to "Pastalar" (cake) or "Börek & Hamur İşleri"
-- (pastry). Existing categories default to 'cake'. RLS is unchanged.
alter table public.categories
  add column product_group text not null default 'cake',
  add constraint categories_product_group_check check (product_group in ('cake', 'pastry'));

create index categories_product_group_idx on public.categories (product_group);
