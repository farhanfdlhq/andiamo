import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BatchOrder, Region } from '../../types';
import { REGION_LABELS, BUTTON_COLOR, BUTTON_TEXT_COLOR, PRIMARY_COLOR } from '../../constants';

interface BatchFormProps {
  initialBatch?: BatchOrder | null;
  onSubmit: (batchData: Omit<BatchOrder, 'id'> | BatchOrder) => void;
  isEditMode: boolean;
}

const BatchForm: React.FC<BatchFormProps> = ({ initialBatch, onSubmit, isEditMode }) => {
  const [formData, setFormData] = useState<Omit<BatchOrder, 'id'> | BatchOrder>(
    initialBatch || {
      title: '',
      region: Region.INDO_ITALI,
      description: '',
      shortDescription: '',
      images: [],
      whatsappLink: '',
      status: 'active',
      departureDate: '',
      arrivalDate: '',
    }
  );
  const [imageUrls, setImageUrls] = useState(initialBatch?.images.join(', ') || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialBatch) {
      setFormData(initialBatch);
      setImageUrls(initialBatch.images.join(', '));
    }
  }, [initialBatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImageUrls(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imagesArray = imageUrls.split(',').map(url => url.trim()).filter(url => url);
    if (imagesArray.length > 50) {
        alert("Maksimum 50 gambar diperbolehkan.");
        return;
    }
    onSubmit({ ...formData, images: imagesArray });
  };
  
  const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm font-inter";
  const labelClass = "block text-sm font-medium text-gray-700 font-inter";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className={labelClass}>Judul Batch</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={inputClass} style={{borderColor: PRIMARY_COLOR}} />
      </div>

      <div>
        <label htmlFor="shortDescription" className={labelClass}>Deskripsi Singkat</label>
        <textarea name="shortDescription" id="shortDescription" rows={3} value={formData.shortDescription} onChange={handleChange} required className={inputClass} style={{borderColor: PRIMARY_COLOR}} />
         <p className="mt-1 text-xs text-gray-500 font-inter">Ditampilkan di kartu batch (max 150 karakter disarankan).</p>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Deskripsi Lengkap</label>
        <textarea name="description" id="description" rows={8} value={formData.description} onChange={handleChange} required className={inputClass} style={{borderColor: PRIMARY_COLOR}} />
        <p className="mt-1 text-xs text-gray-500 font-inter">Dapat berisi HTML sederhana untuk formatting (list, paragraf, bold).</p>
      </div>

      <div>
        <label htmlFor="region" className={labelClass}>Region</label>
        <select name="region" id="region" value={formData.region} onChange={handleChange} required className={inputClass} style={{borderColor: PRIMARY_COLOR}}>
          {(Object.keys(REGION_LABELS) as Array<keyof typeof REGION_LABELS>).map(key => (
            <option key={key} value={key}>{REGION_LABELS[key]}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="imageUrls" className={labelClass}>URL Gambar (pisahkan dengan koma)</label>
        <textarea name="imageUrls" id="imageUrls" rows={4} value={imageUrls} onChange={handleImageUrlsChange} className={inputClass} style={{borderColor: PRIMARY_COLOR}} placeholder="https://example.com/image1.jpg, https://example.com/image2.png" />
        <p className="mt-1 text-xs text-gray-500 font-inter">Maksimum 50 gambar. Gambar pertama akan jadi thumbnail.</p>
      </div>

      <div>
        <label htmlFor="whatsappLink" className={labelClass}>Link WhatsApp</label>
        <input type="url" name="whatsappLink" id="whatsappLink" value={formData.whatsappLink} onChange={handleChange} required className={inputClass} style={{borderColor: PRIMARY_COLOR}} placeholder="https://wa.me/62xxxx" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="departureDate" className={labelClass}>Perkiraan Tanggal Berangkat</label>
            <input type="date" name="departureDate" id="departureDate" value={formData.departureDate || ''} onChange={handleChange} className={inputClass} style={{borderColor: PRIMARY_COLOR}}/>
        </div>
        <div>
            <label htmlFor="arrivalDate" className={labelClass}>Perkiraan Tanggal Tiba</label>
            <input type="date" name="arrivalDate" id="arrivalDate" value={formData.arrivalDate || ''} onChange={handleChange} className={inputClass} style={{borderColor: PRIMARY_COLOR}}/>
        </div>
      </div>

      <div>
        <label htmlFor="status" className={labelClass}>Status</label>
        <select name="status" id="status" value={formData.status} onChange={handleChange} required className={inputClass} style={{borderColor: PRIMARY_COLOR}}>
          <option value="active">Aktif</option>
          <option value="closed">Ditutup</option>
        </select>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4">
        <button
            type="button"
            onClick={() => navigate('/admin/batches')}
            className="font-inter px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-300 border-2"
            style={{ borderColor: BUTTON_COLOR, color: BUTTON_COLOR }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0';}}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white';}}
        >
            Batal
        </button>
        <button
          type="submit"
          className="font-inter px-6 py-2.5 rounded-md text-sm font-medium transition-colors duration-300"
          style={{ backgroundColor: BUTTON_COLOR, color: BUTTON_TEXT_COLOR }}
        >
          {isEditMode ? 'Simpan Perubahan' : 'Buat Batch'}
        </button>
      </div>
    </form>
  );
};

export default BatchForm;
