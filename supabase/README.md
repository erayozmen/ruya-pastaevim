# Supabase — database altyapısı (Sprint 2)

Bu klasör yalnızca **database şemasını** içerir: migration'lar, seed verisi
ve doğrulama script'i. Henüz gerçek bir Supabase projesine bağlanmadı —
bu Sprint 2'nin kapsamı dışında bırakıldı çünkü hangi Supabase projesinin
kullanılacağı bu sprint başlarken belirsizdi.

## Yerel geliştirme (Docker gerekir)

```bash
npx supabase start   # local Postgres + Studio + API ayağa kalkar
npx supabase db reset  # migrations + seed.sql'i sıfırdan uygular
npx supabase stop
```

`supabase start` çıktısındaki `ANON_KEY` / `SERVICE_ROLE_KEY` **yerel,
sabit demo anahtarlardır** (Supabase CLI'nin varsayılanı) — gerçek bir
projenin anahtarları değildir, commit edilseler bile risk taşımazlar.
Gerçek proje anahtarları asla bu repoya girmemeli.

## Gerçek bir Supabase projesine bağlanmak (Sprint 3+)

```bash
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push        # migrations/ içindekileri uzak projeye uygular
```

`.env.local` içine (Git'e **eklenmez**, `.gitignore` zaten `.env*`'i hariç
tutuyor):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# service role key SADECE server-side/CI ortam değişkeni olarak saklanır,
# asla NEXT_PUBLIC_ önekiyle client'a sızdırılmaz.
```

## İlk admin kullanıcısını oluşturmak

`profiles` tablosuna **otomatik satır ekleyen bir trigger yok** —
kasıtlı bir güvenlik kararı: `app_role` enum'ında şu an tek değer
(`ADMIN`) var, dolayısıyla yeni kayıt olan her kullanıcıya otomatik admin
rolü vermek anlamına gelirdi. Bunun yerine:

1. Supabase Dashboard → Authentication'dan (veya `supabase.auth.admin.createUser`
   ile server-side) gerçek admin için bir kullanıcı oluşturun.
2. Aldığınız `auth.users.id` ile tek satır ekleyin:

   ```sql
   insert into public.profiles (id, role) values ('<auth-user-uuid>', 'ADMIN');
   ```

Bu adım Sprint 4'te (Auth + Admin layout) tekrar ele alınacak.

## Şema doğrulama

`supabase/tests/rls_manual_check.sql` migration değil — Git'e dahil ama
`supabase/migrations/`'a değil, ayrı bir doğrulama script'i. Hiçbir
zaman otomatik uygulanmaz. Yerel ortamda çalıştırmak için:

```bash
npx supabase start
docker exec -i supabase_db_ruyam-pasta-evim psql -U postgres -d postgres \
  < supabase/tests/rls_manual_check.sql
```

14 kontrolü kapsar: tablo/FK/constraint varlığı, RLS'in her tabloda aktif
olması, anonim kullanıcının yalnızca `is_active = true` kayıtları
görmesi, anonim `order_requests` INSERT/SELECT/UPDATE davranışı, rating
check constraint, `site_settings` singleton kısıtı, ve admin/non-admin
authenticated kullanıcı senaryoları.

## Tasarım notları

- **Snapshot alanlar**: `order_requests.portion_label` /
  `theme_label` / `color_label` / `flavor_label` bilinçli olarak
  `customizer_*` tablolarına FK değil — sipariş anındaki metni donduran
  düz metin kopyalarıdır. Admin daha sonra bir seçenek etiketini
  değiştirse bile geçmiş siparişler değişmemelidir.
- **`order_requests` üzerinde anon SELECT yok**: Sprint 6'da sipariş
  formu `.insert(...)` sonrası `.select()` **çağırmamalı** — RETURNING/
  select, RLS'in SELECT policy'sine tabidir ve anon'un böyle bir policy'si
  yok (bilinçli). Detay: `supabase/tests/rls_manual_check.sql` §6 yorumu.
- **`cakes.category_id` → `ON DELETE RESTRICT`**: bir kategori, ona bağlı
  pastalar varken silinemez; pasta hiçbir zaman kategorisiz kalmaz.
- **`gallery_items.category_id` / `reviews.cake_id` / `reviews.category_id`
  → `ON DELETE SET NULL`**: galeri görseli veya yorum, referans verdiği
  kayıt silinse de anlamını korur, o yüzden silinmez.
