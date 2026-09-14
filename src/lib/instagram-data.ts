/**
 * "Mutfağımızdan Çıkan Güzellikler" Instagram grid görselleri.
 *
 * Demo Unsplash görselleridir. İleride ya doğrudan Instagram embed'i
 * ya da Supabase Storage'a yüklenen gerçek fotoğraflarla değiştirilecek.
 */
export interface InstagramShot {
  image: string;
  alt: string;
}

export const instagramShots: InstagramShot[] = [
  {
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    alt: "Instagram Pasta 1",
  },
  {
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=80",
    alt: "Instagram Pasta 2",
  },
  {
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
    alt: "Instagram Pasta 3",
  },
  {
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=80",
    alt: "Instagram Pasta 4",
  },
  {
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80",
    alt: "Instagram Pasta 5",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80",
    alt: "Instagram Pasta 6",
  },
];
