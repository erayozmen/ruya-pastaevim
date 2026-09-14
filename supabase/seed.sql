-- Local/dev seed data, run automatically by `supabase db reset`.
--
-- What IS seeded: verified real business info (site_settings), the
-- starter category list, and the customizer option lists — all of these
-- come from the approved project brief / original HTML design and are
-- either confirmed real (site_settings) or legitimate starter
-- configuration (categories, customizer options).
--
-- What is deliberately NOT seeded, per the brief's explicit instruction
-- not to invent business facts:
--   - cakes / cake_images  (no confirmed real products yet)
--   - gallery_items        (the HTML's gallery items are demo captions
--                            tied to fictional cake names, not real
--                            products)
--   - reviews               (no real customer testimonials yet)
--   - profiles              (needs a real auth.users id — created
--                            manually once the admin account exists,
--                            see supabase/README.md)
--   - order_requests         (transactional data, not seed data)
--
-- Category and theme image_url values below reuse the Unsplash demo
-- images from the reference HTML purely as visual placeholders. They are
-- NOT real product photography and must be replaced via the admin media
-- library once real photos exist.

insert into public.site_settings (
  id, brand_name, baker_name, instagram_username, instagram_url,
  whatsapp_number, phone
) values (
  true, 'Rüyam Pasta Evim', 'Gülden Kantor', '@ruyapastaevim',
  'https://www.instagram.com/ruyapastaevim/', '905419090725', '0541 909 07 25'
);

-- Starter categories (demo/starter data — confirm with the business
-- before treating as final).
insert into public.categories (name, slug, description, image_url, icon_emoji, sort_order) values
  ('Doğum Günü Pastaları', 'dogum-gunu-pastalari',
   'Rakam pastalar, vintage bento konseptler ve unutulmaz kutlamalar için özel renk paletleri.',
   'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
   '🎂', 1),
  ('Çocuk Pastaları', 'cocuk-pastalari',
   'Sevimli hayvan figürleri, masal kahramanları ve çocukların dünyasına uygun sağlıklı içerikler.',
   'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
   '🧸', 2),
  ('Nişan & Söz Pastaları', 'nisan-soz-pastalari',
   'Canlı çiçek dokunuşları, altın varaklar ve masanıza zarafet katacak romantik tasarımlar.',
   'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
   '💍', 3),
  ('Baby Shower & Cinsiyet', 'baby-shower',
   'Pudra pastel renkler, minik patikler, bulutlar ve heyecan dolu cinsiyet partisi sürprizleri.',
   'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
   '🍼', 4),
  ('Düğün & Özel Kutlama', 'dugun-ozel-kutlama',
   'Çok katlı gösterişli tasarımlar, yenilebilir çiçekler ve unutulmaz lezzet dengesi.',
   'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
   '💐', 5),
  ('Özel Konsept & Bento', 'ozel-konsept-bento',
   'Kore bento tarzı esprili yazılar, sanatsal pasta tabloları ve sadece size özel fikirler.',
   'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80',
   '✨', 6);

insert into public.customizer_portions (label, value, emoji, sort_order) values
  ('6 - 8', '6-8 Kişilik', '🎂', 1),
  ('10 - 12', '10-12 Kişilik', '🎂', 2),
  ('15 - 20', '15-20 Kişilik', '🎂', 3),
  ('25+ (Katlı)', '25+ Kişilik (Katlı)', '🎂', 4);

insert into public.customizer_themes (label, value, emoji, image_url, sort_order) values
  ('Romantik', '🎀 Romantik', '🎀',
   'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=700&q=80', 1),
  ('Çiçekli & Doğal', '🌸 Çiçekli', '🌸',
   'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=700&q=80', 2),
  ('Çocuk / Bebek', '🧸 Çocuk', '🧸',
   'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80', 3),
  ('Doğum Günü', '🎂 Doğum Günü', '🎂',
   'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=700&q=80', 4),
  ('Nişan / Söz', '💍 Nişan', '💍',
   'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=700&q=80', 5),
  ('Minimal & Bento', '✨ Minimal', '✨',
   'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=700&q=80', 6);

insert into public.customizer_colors (label, value, swatch_hex, sort_order) values
  ('Pudra Pembe', 'Pudra Pembe', '#F6C7C9', 1),
  ('Lavanta', 'Lavanta & Lila', '#DCC9E8', 2),
  ('Şeftali', 'Sıcak Şeftali', '#F4B49D', 3),
  ('Pastel Mavi', 'Bebek Mavisi / Mint', '#BEE3F8', 4),
  ('Krem & Altın', 'Krem & Altın Dokunuş', '#FFF8F0', 5);

insert into public.customizer_flavors (label, value, sort_order) values
  ('🍓 Belçika Çikolatası & Taze Çilek (En Çok Tercih Edilen)', 'Belçika Çikolatası & Taze Çilek', 1),
  ('🫐 Vanilyalı Beyaz Krema & Orman Meyveleri', 'Vanilyalı Beyaz Krema & Orman Meyveleri', 2),
  ('🥜 Fıstık Krokan & Tuzlu Karamel', 'Fıstık Krokan & Karamel', 3),
  ('🍋 Ferah Limon Curd & Beyaz Çikolata Ganaj', 'Limon Curd & Beyaz Çikolata', 4);
