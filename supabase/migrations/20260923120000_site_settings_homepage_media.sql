-- Admin-managed homepage content: the Hero and Story sections previously
-- had no way to change their image or copy without a code change. All new
-- columns are nullable (or admin-editable text with a neutral default), so
-- the existing site_settings singleton row and its RLS policies (public
-- read, admin-only update) already cover them without any policy change.
alter table public.site_settings
  add column hero_image_url text,
  add column story_title text not null default 'Hikayemiz',
  add column story_text text not null default $$15 yıldır bu işi sevgiyle yapıyoruz. Her özel günün kendine ait bir hikâyesi olduğuna inanıyor, o hikâyeye eşlik edecek pastaları ve lezzetleri özenle hazırlıyoruz.

Rüya Pasta Evim'de amacımız, hayalinizdeki tasarımı birlikte şekillendirerek sizin için güzel bir anıya dönüşecek lezzetler hazırlamak.$$,
  add column story_image_url text;
