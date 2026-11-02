create extension if not exists pgcrypto;

-- ===== ADMIN =====
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ===== ENUMS =====
create type public.stock_status as enum ('in_stock','out_of_stock','made_to_order');
create type public.inquiry_type as enum ('retail','b2b','export');
create type public.inquiry_status as enum ('new','contacted','closed');
create type public.payment_status as enum ('pending','paid','failed','refunded');
create type public.fulfillment_status as enum ('new','packed','shipped','delivered','cancelled');

-- ===== CATEGORIES =====
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ===== PRODUCTS =====
create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  sku text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  subcategory text,
  short_description text not null default '',
  description_md text not null default '',
  nutrition_info jsonb not null default '{}'::jsonb,   -- {"Energy":"350 kcal","Protein":"8 g",...}
  ingredients text,
  shelf_life text,
  dietary_tags text[] not null default '{}',            -- e.g. {vegan,gluten-free,vrat}
  images text[] not null default '{}',                  -- first = cover
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_b2b_only boolean not null default false,
  is_new_arrival boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products(category_id);
create index products_active_idx on public.products(is_active);
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ===== PACK SIZES / VARIANTS (each has its own price) =====
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,                                  -- "2LBS", "500g", "25kg bulk bag"
  weight_grams int not null check (weight_grams > 0),
  sku text not null unique,
  price_inr numeric(12,2) not null check (price_inr >= 0),
  price_usd numeric(12,2) not null check (price_usd >= 0),
  sale_price_inr numeric(12,2) check (sale_price_inr >= 0),
  sale_price_usd numeric(12,2) check (sale_price_usd >= 0),
  stock_status public.stock_status not null default 'in_stock',
  is_bulk_only boolean not null default false,          -- bulk packs are enquiry-only, not purchasable online
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index variants_product_idx on public.product_variants(product_id);

-- ===== INQUIRIES (retail / B2B / export leads) =====
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  business_name text,
  country text,
  city text,
  import_license_status text,
  estimated_order_volume text,
  product_interest text,
  inquiry_type public.inquiry_type not null default 'retail',
  message text,
  product_id uuid references public.products(id) on delete set null,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ===== SHIPPING ZONES (owner-editable) =====
create table public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_codes text[] not null default '{}',           -- ISO-3166 alpha-2
  rate_inr numeric(12,2) not null default 0,
  rate_usd numeric(12,2) not null default 0,
  free_above_inr numeric(12,2),
  free_above_usd numeric(12,2),
  est_days text,
  is_default boolean not null default false,            -- fallback "Rest of world"
  is_active boolean not null default true
);

-- ===== ORDERS =====
create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('MF-' || nextval('public.order_number_seq')::text),
  access_token uuid not null default gen_random_uuid(), -- guest order-status link secret
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  ship_line1 text not null,
  ship_line2 text,
  ship_city text not null,
  ship_state text not null,
  ship_postal_code text not null,
  ship_country text not null,                           -- ISO alpha-2
  currency text not null check (currency in ('INR','USD')),
  subtotal numeric(12,2) not null,
  shipping_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  payment_status public.payment_status not null default 'pending',
  fulfillment_status public.fulfillment_status not null default 'new',
  razorpay_order_id text unique,
  razorpay_payment_id text,
  paid_at timestamptz,
  courier text,
  tracking_number text,
  customer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_status_idx on public.orders(payment_status, fulfillment_status);
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  title_snapshot text not null,
  variant_label text not null,
  unit_price numeric(12,2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(12,2) not null
);
create index order_items_order_idx on public.order_items(order_id);

-- ===== ROW LEVEL SECURITY =====
alter table public.admin_users      enable row level security;
alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;
alter table public.inquiries        enable row level security;
alter table public.shipping_zones   enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;

-- admin_users: admins can read; writes only via SQL editor / service role
create policy "admins read admin_users" on public.admin_users for select to authenticated using (public.is_admin());

-- categories
create policy "public read active categories" on public.categories for select to anon, authenticated using (is_active = true);
create policy "admin all categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- products
create policy "public read active products" on public.products for select to anon, authenticated using (is_active = true);
create policy "admin all products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- variants
create policy "public read variants of active products" on public.product_variants for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.is_active = true));
create policy "admin all variants" on public.product_variants for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- inquiries: anyone may submit (as 'new'), only admins read/update/delete
create policy "public insert inquiries" on public.inquiries for insert to anon, authenticated with check (status = 'new');
create policy "admin read inquiries" on public.inquiries for select to authenticated using (public.is_admin());
create policy "admin update inquiries" on public.inquiries for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete inquiries" on public.inquiries for delete to authenticated using (public.is_admin());

-- shipping zones
create policy "public read shipping zones" on public.shipping_zones for select to anon, authenticated using (is_active = true);
create policy "admin all shipping zones" on public.shipping_zones for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- orders & items: NO public access. Orders are created/updated only by server routes using the service-role key.
create policy "admin read orders" on public.orders for select to authenticated using (public.is_admin());
create policy "admin update orders" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin read order_items" on public.order_items for select to authenticated using (public.is_admin());

-- ===== STORAGE =====
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/webp','image/jpeg','image/png'])
on conflict (id) do nothing;

create policy "public read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin insert product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin update product images" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
create policy "admin delete product images" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ===== SEED: categories (owner can edit/reorder in /admin/categories) =====
insert into public.categories (name, slug, sort_order) values
 ('Flours','flours',1),('Millet Flours','millet-flours',2),('Vrat Special Flours','vrat-special-flours',3),
 ('Sabudana','sabudana',4),('Mamra','mamra',5),('Balls','balls',6),('Poha','poha',7),('Fryums','fryums',8),
 ('Foochka & Khichiya','foochka-khichiya',9),('Rice','rice',10),('Snacks','snacks',11),('Sugar','sugar',12),
 ('Jaggery','jaggery',13),('Salt','salt',14),('Vadhvani Marcha','vadhvani-marcha',15),('Chikki','chikki',16),
 ('Laddu','laddu',17),('Shrikhand','shrikhand',18),('Pooja Kit','pooja-kit',19);

-- ===== SEED: shipping zones (starting rates, owner edits in /admin/shipping) =====
insert into public.shipping_zones (name, country_codes, rate_inr, rate_usd, free_above_inr, free_above_usd, est_days, is_default) values
 ('India', array['IN'], 99, 0, 999, null, '3-6 business days', false),
 ('United States & Canada', array['US','CA'], 0, 24, null, 150, '10-18 business days', false),
 ('European Union & UK', array['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','GB'], 0, 28, null, 160, '10-20 business days', false),
 ('Middle East', array['AE','SA','QA','KW','OM','BH'], 0, 20, null, 120, '7-12 business days', false),
 ('Africa', array['ZA','KE','NG','TZ','UG','GH','MU','EG'], 0, 30, null, 180, '12-22 business days', false),
 ('Rest of World', array[]::text[], 0, 35, null, 200, '12-25 business days', true);
