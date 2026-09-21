import { listMediaItems } from "./actions";
import { MediaLibrary } from "./MediaLibrary";

export default async function AdminMediaPage() {
  const items = await listMediaItems("cakes");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Medya Kütüphanesi</h1>

      <MediaLibrary items={items} />
    </div>
  );
}
