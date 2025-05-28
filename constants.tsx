import { Region, BatchOrder, RegionFilterOption, AdminSettings } from './types';

export const APP_NAME = "Andiamo.id";
export const PRIMARY_COLOR = "#FFD400";
export const SECONDARY_COLOR = "#000000";
export const TEXT_COLOR = "#000000";
export const BUTTON_COLOR = "#000000";
export const BUTTON_TEXT_COLOR = "#FFD400";

export const REGION_FILTERS: RegionFilterOption[] = [
  { value: "all", label: "Semua Batch" },
  { value: Region.INDO_ITALI, label: "Indonesia ke Italia" },
  { value: Region.ITALI_INDO, label: "Italia ke Indonesia" },
];

export const REGION_LABELS: Record<Region, string> = {
  [Region.INDO_ITALI]: "Indonesia → Italia",
  [Region.ITALI_INDO]: "Italia → Indonesia",
};

export let SAMPLE_BATCHES: BatchOrder[] = [
  {
    id: "1",
    title: "Jastip Barang Mewah dari Milan ke Jakarta",
    region: Region.ITALI_INDO,
    shortDescription: "Beli tas, sepatu, dan aksesoris branded langsung dari butiknya di Milan. Batch terbatas!",
    description: `
      <p>Open Jastip khusus barang-barang mewah dari Milan, Italia ke Jakarta, Indonesia!</p>
      <p>Apa saja yang bisa dititip?</p>
      <ul class="list-disc list-inside ml-4 my-2">
        <li>Tas branded (Gucci, Prada, LV, dll.)</li>
        <li>Sepatu desainer</li>
        <li>Aksesoris (jam tangan, perhiasan)</li>
        <li>Produk fashion lainnya</li>
      </ul>
      <p><strong>Keuntungan Jastip dengan Kami:</strong></p>
      <ul class="list-disc list-inside ml-4 my-2">
        <li>Originalitas terjamin, nota pembelian asli.</li>
        <li>Harga lebih kompetitif.</li>
        <li>Proses aman dan terpercaya.</li>
      </ul>
      <p>Slot terbatas! Hubungi kami segera untuk konsultasi dan list order Anda.</p>
    `,
    images: [
      "https://picsum.photos/seed/milan1/800/600",
      "https://picsum.photos/seed/milan2/800/600",
      "https://picsum.photos/seed/milan3/800/600",
      "https://picsum.photos/seed/milan4/800/600",
    ],
    whatsappLink: "https://wa.me/6281234567890?text=Halo%20Andiamo.id%2C%20saya%20tertarik%20dengan%20jastip%20Milan-Jakarta",
    status: "active",
    departureDate: "2024-08-15",
    arrivalDate: "2024-08-25",
  },
  {
    id: "2",
    title: "Titip Oleh-Oleh Khas Indonesia ke Roma",
    region: Region.INDO_ITALI,
    shortDescription: "Kangen makanan atau kerajinan Indonesia? Kami bantu bawakan ke Roma dan sekitarnya.",
    description: `
      <p>Untuk WNI atau siapa saja di Roma yang kangen produk Indonesia, kami buka jastip dari Jakarta!</p>
      <p>Contoh barang yang bisa dititip:</p>
      <ul class="list-disc list-inside ml-4 my-2">
        <li>Makanan kering (Indomie, bumbu instan, kopi, teh)</li>
        <li>Camilan khas Indonesia</li>
        <li>Kerajinan tangan (batik, tenun, ukiran)</li>
        <li>Buku atau majalah Indonesia</li>
      </ul>
      <p>Pengiriman aman dan sampai tujuan. Fee jastip terjangkau. Segera titip barang kangenanmu!</p>
    `,
    images: [
      "https://picsum.photos/seed/indo1/800/600",
      "https://picsum.photos/seed/indo2/800/600",
    ],
    whatsappLink: "https://wa.me/6281234567890?text=Halo%20Andiamo.id%2C%20saya%20mau%20jastip%20ke%20Roma",
    status: "active",
    departureDate: "2024-09-01",
  },
  {
    id: "3",
    title: "Jastip Produk Farmasi & Skincare Italia",
    region: Region.ITALI_INDO,
    shortDescription: "Dapatkan produk farmasi dan skincare Italia yang sulit ditemukan di Indonesia.",
    description: `
      <p>Special batch untuk produk farmasi dan skincare otentik dari Italia.</p>
      <p>Kami bisa membantu Anda mendapatkan:</p>
      <ul class="list-disc list-inside ml-4 my-2">
        <li>Vitamin dan suplemen tertentu</li>
        <li>Produk skincare dari brand farmasi Italia</li>
        <li>Obat-obatan ringan (dengan resep jika diperlukan dan legal)</li>
      </ul>
      <p>Konsultasikan kebutuhan Anda. Pembelian dilakukan langsung di apotek terpercaya di Italia.</p>
    `,
    images: [
      "https://picsum.photos/seed/farmasi1/800/600",
      "https://picsum.photos/seed/farmasi2/800/600",
      "https://picsum.photos/seed/farmasi3/800/600",
    ],
    whatsappLink: "https://wa.me/6281234567890?text=Halo%20Andiamo.id%2C%20saya%20tertarik%20jastip%20farmasi%20Italia",
    status: "active",
  },
   {
    id: "4",
    title: "Closed Batch: Mainan Anak Edukatif dari Bologna",
    region: Region.ITALI_INDO,
    shortDescription: "Batch ini sudah ditutup. Terima kasih atas partisipasinya!",
    description: `
      <p>Batch jastip mainan anak edukatif dari Bologna Fair telah selesai.</p>
      <p>Nantikan batch-batch menarik lainnya dari Andiamo.id!</p>
    `,
    images: [
      "https://picsum.photos/seed/toys1/800/600",
    ],
    whatsappLink: "https://wa.me/6281234567890?text=Halo%20Andiamo.id%2C%20info%20batch%20selanjutnya%3F",
    status: "closed",
    departureDate: "2024-07-01",
    arrivalDate: "2024-07-10",
  },
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  defaultWhatsAppNumber: "+6281234567890", // Default number from one of the batches
  defaultCTAMessage: "Halo Andiamo.id, saya tertarik dengan batch ini.",
};

// --- Batch Management Functions ---
// These functions directly mutate the SAMPLE_BATCHES array for demo purposes.
// In a real app, this would interact with a backend API and a state management solution.

export const getAllBatches = (): BatchOrder[] => {
  return SAMPLE_BATCHES;
};

export const getBatchById = (id: string): BatchOrder | undefined => {
  return SAMPLE_BATCHES.find(batch => batch.id === id);
};

export const addBatch = (batch: Omit<BatchOrder, 'id'>): BatchOrder => {
  const newBatch: BatchOrder = {
    ...batch,
    id: String(Date.now() + Math.random()), // Simple unique ID generation
  };
  SAMPLE_BATCHES.unshift(newBatch); // Add to the beginning
  return newBatch;
};

export const updateBatch = (id: string, updates: Partial<Omit<BatchOrder, 'id'>>): BatchOrder | null => {
  const batchIndex = SAMPLE_BATCHES.findIndex(batch => batch.id === id);
  if (batchIndex === -1) {
    return null;
  }
  SAMPLE_BATCHES[batchIndex] = { ...SAMPLE_BATCHES[batchIndex], ...updates };
  return SAMPLE_BATCHES[batchIndex];
};

export const deleteBatch = (id: string): boolean => {
  const initialLength = SAMPLE_BATCHES.length;
  SAMPLE_BATCHES = SAMPLE_BATCHES.filter(batch => batch.id !== id);
  return SAMPLE_BATCHES.length < initialLength;
};