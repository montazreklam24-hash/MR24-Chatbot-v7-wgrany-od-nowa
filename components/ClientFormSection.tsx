
import React from 'react';
import { OrderData, UploadedFile } from '../types';
import { styles } from '../constants';
import { FileDropZone } from './FileDropZone';

interface ClientFormSectionProps {
  orderData: OrderData;
  setOrderData: (data: OrderData | ((prev: OrderData) => OrderData)) => void;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[])) => void;
  handleFileChange: (files: File[]) => void;
  removeFile: (index: number) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

export const ClientFormSection: React.FC<ClientFormSectionProps> = ({
  orderData,
  setOrderData,
  uploadedFiles,
  handleFileChange,
  removeFile,
  handleSubmit,
  isSubmitting
}) => {
  
  const handleInputChange = (field: keyof OrderData, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={styles.formSection}>
      <div style={styles.sectionTitle}>
        <span>👤</span>
        <span>Dane do zamówienia</span>
      </div>

      <div style={styles.toggleContainer}>
        <button
          style={styles.toggleBtn(orderData.type === 'company')}
          onClick={() => setOrderData(prev => ({ ...prev, type: 'company' }))}
        >
          Firma (Faktura VAT)
        </button>
        <button
          style={styles.toggleBtn(orderData.type === 'private')}
          onClick={() => setOrderData(prev => ({ ...prev, type: 'private' }))}
        >
          Osoba prywatna
        </button>
      </div>

      {/* COMMON FIELDS */}
      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>Imię *</label>
          <input 
            style={styles.formInput} 
            value={orderData.firstName} 
            onChange={e => handleInputChange('firstName', e.target.value)}
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label}>Nazwisko *</label>
          <input 
            style={styles.formInput} 
            value={orderData.lastName} 
            onChange={e => handleInputChange('lastName', e.target.value)}
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>E-mail *</label>
          <input 
            style={styles.formInput} 
            type="email"
            value={orderData.email} 
            onChange={e => handleInputChange('email', e.target.value)}
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label}>Telefon *</label>
          <input 
            style={styles.formInput} 
            value={orderData.phone} 
            onChange={e => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>

      {/* COMPANY FIELDS */}
      {orderData.type === 'company' && (
        <>
          <div style={styles.row}>
            <div style={{...styles.col, flex: 2}}>
              <label style={styles.label}>Nazwa Firmy *</label>
              <input 
                style={styles.formInput} 
                value={orderData.companyName} 
                onChange={e => handleInputChange('companyName', e.target.value)}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>NIP *</label>
              <input 
                style={styles.formInput} 
                value={orderData.nip} 
                onChange={e => handleInputChange('nip', e.target.value)}
              />
            </div>
          </div>
          <div style={styles.row}>
            <div style={{...styles.col, flex: 2}}>
              <label style={styles.label}>Ulica i numer (Firma) *</label>
              <input 
                style={styles.formInput} 
                value={orderData.companyAddress} 
                onChange={e => handleInputChange('companyAddress', e.target.value)}
              />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Kod pocztowy *</label>
              <input 
                style={styles.formInput} 
                value={orderData.companyZip} 
                onChange={e => handleInputChange('companyZip', e.target.value)}
              />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Miasto *</label>
              <input 
                style={styles.formInput} 
                value={orderData.companyCity} 
                onChange={e => handleInputChange('companyCity', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* PRIVATE / INSTALLATION ADDRESS */}
      <div style={styles.row}>
        <div style={{...styles.col, flex: 2}}>
          <label style={styles.label}>
            {orderData.type === 'company' ? 'Adres montażu (Ulica i numer) *' : 'Adres zamieszkania / montażu *'}
          </label>
          <input 
            style={styles.formInput} 
            value={orderData.street} 
            onChange={e => handleInputChange('street', e.target.value)}
          />
        </div>
      </div>
      <div style={styles.row}>
        <div style={styles.col}>
          <label style={styles.label}>Kod pocztowy *</label>
          <input 
            style={styles.formInput} 
            value={orderData.zip} 
            onChange={e => handleInputChange('zip', e.target.value)}
          />
        </div>
        <div style={styles.col}>
          <label style={styles.label}>Miasto *</label>
          <input 
            style={styles.formInput} 
            value={orderData.city} 
            onChange={e => handleInputChange('city', e.target.value)}
          />
        </div>
      </div>

      {/* PLIKI */}
      <div style={{marginTop: '30px', marginBottom: '30px'}}>
        <label style={{...styles.label, marginBottom: '10px', display: 'block'}}>
          Pliki / Zdjęcia / Projekty
        </label>
        
        <FileDropZone onFilesAdded={handleFileChange} />

        {uploadedFiles.length > 0 && (
          <div style={styles.fileList}>
            {uploadedFiles.map((f, i) => (
              <div key={i} style={styles.fileItem}>
                <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                  {f.preview ? (
                     <img src={f.preview} alt="preview" style={{width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px'}} />
                  ) : (
                    <span>📄</span>
                  )}
                  <span>{f.file.name}</span>
                  <span style={{color: '#9ca3af', fontSize: '12px'}}>
                    ({(f.file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button style={styles.removeFileBtn} onClick={() => removeFile(i)}>USUŃ</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAYMENT SECTION */}
      <div style={styles.paymentSection}>
        <div style={styles.sectionTitle}>
          <span>💳</span>
          <span>Metoda płatności</span>
        </div>
        
        <div 
          style={styles.paymentOption(orderData.paymentMethod === 'proforma')}
          onClick={() => handleInputChange('paymentMethod', 'proforma')}
        >
          <div style={{fontSize: '24px'}}>📄</div>
          <div>
            <div style={{fontWeight: 600}}>Faktura Proforma (Przelew tradycyjny)</div>
            <div style={{fontSize: '13px', color: '#64748b'}}>Otrzymasz fakturę na maila. Realizacja po zaksięgowaniu.</div>
          </div>
        </div>

        <div 
          style={styles.paymentOption(orderData.paymentMethod === 'przelewy24')}
          onClick={() => handleInputChange('paymentMethod', 'przelewy24')}
        >
          <div style={{fontSize: '24px'}}>⚡</div>
          <div>
            <div style={{fontWeight: 600}}>Szybka płatność (Przelewy24 / BLIK)</div>
            <div style={{fontSize: '13px', color: '#64748b'}}>Natychmiastowe rozpoczęcie realizacji zamówienia.</div>
          </div>
        </div>
      </div>

      <button style={styles.submitBtn} onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Wysyłanie...' : 'Złóż zamówienie z obowiązkiem zapłaty'}
      </button>
    </div>
  );
};
