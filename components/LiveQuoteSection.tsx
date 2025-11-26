
import React from 'react';
import { QuoteData, DeadlineType, OrderData } from '../types';
import { styles, DEADLINE_CONFIG } from '../constants';
import { DeadlineBar } from './DeadlineBar';

interface LiveQuoteSectionProps {
  quoteData: QuoteData;
  selectedDeadline: DeadlineType;
  onDeadlineChange: (val: DeadlineType) => void;
  orderData: OrderData;
  excludedIndices: number[];
  toggleItemExclusion: (index: number) => void;
}

export const LiveQuoteSection: React.FC<LiveQuoteSectionProps> = ({ 
  quoteData, 
  selectedDeadline,
  onDeadlineChange,
  orderData,
  excludedIndices,
  toggleItemExclusion
}) => {
  // Filter items logic
  const activeItems = quoteData.items.map((item, index) => ({
    ...item,
    originalIndex: index,
    isExcluded: excludedIndices.includes(index)
  }));

  // Calculate totals based ONLY on included items
  const baseNet = activeItems
    .filter(i => !i.isExcluded)
    .reduce((sum, item) => sum + item.price, 0);
  
  // Calculate modifier
  const modifierConfig = DEADLINE_CONFIG[selectedDeadline];
  const modifierValue = baseNet * modifierConfig.modifier;
  
  const finalNet = baseNet + modifierValue;
  const vat = finalNet * 0.23;
  const totalGross = finalNet + vat;

  const handleCopyToClipboard = () => {
    // Only copy active items
    const itemsText = activeItems
      .filter(i => !i.isExcluded)
      .map((item, idx) => 
        `${idx + 1}. ${item.name} | ${item.details} | ${item.price.toFixed(2)} zł`
      ).join('\n');

    const clientInfo = orderData.type === 'company' 
      ? `${orderData.companyName} (${orderData.nip})`
      : `${orderData.firstName} ${orderData.lastName}`;
    
    const clientDisplay = clientInfo.trim().length > 2 ? clientInfo : "(Dane klienta nieuzupełnione)";

    const textToCopy = `OFERTA MONTAŻU REKLAM - MontażReklam24.pl
---------------------------------------------
Klient: ${clientDisplay}
Data: ${new Date().toLocaleDateString()}
Adres montażu: ${orderData.street ? orderData.street + ', ' + orderData.city : '(Adres nieuzupełniony)'}

SZCZEGÓŁY WYCENY (WYBRANE POZYCJE):
${itemsText}

Suma częściowa netto: ${baseNet.toFixed(2)} zł

WARUNKI REALIZACJI:
Termin: ${modifierConfig.label}
Korekta za termin: ${modifierValue > 0 ? '+' : ''}${modifierValue.toFixed(2)} zł

---------------------------------------------
RAZEM NETTO: ${finalNet.toFixed(2)} zł
VAT (23%): ${vat.toFixed(2)} zł
RAZEM BRUTTO: ${totalGross.toFixed(2)} zł
---------------------------------------------
Metoda płatności: ${orderData.paymentMethod === 'proforma' ? 'Faktura Proforma' : 'Szybka płatność'}

UWAGA: Wycena sporządzona na podstawie wymiarów podanych przez Klienta. 
W przypadku istotnych różnic po wykonaniu pomiaru, cena może ulec korekcie (dopłata lub zwrot nadpłaty).
`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Oferta (tylko zaznaczone pozycje) została skopiowana do schowka!");
    }).catch(err => {
      console.error("Błąd kopiowania", err);
      alert("Nie udało się skopiować oferty.");
    });
  };

  return (
    <div style={styles.quoteSection}>
      <div style={styles.sectionTitle}>
        <span>📊</span>
        <span>Kalkulator Wyceny</span>
      </div>

      {/* DEADLINE BAR ON TOP */}
      <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
         <DeadlineBar selectedDeadline={selectedDeadline} onChange={onDeadlineChange} />
      </div>
      
      {quoteData.items.length === 0 ? (
        <div style={{ color: '#6b7280', fontStyle: 'italic', padding: '10px' }}>
          Rozpocznij rozmowę, aby otrzymać wycenę...
        </div>
      ) : (
        <>
          <table style={styles.quoteTable}>
            <thead>
              <tr>
                <th style={{...styles.th, width: '40px', textAlign: 'center'}}>#</th>
                <th style={styles.th}>Usługa / Materiał</th>
                <th style={styles.th}>Szczegóły</th>
                <th style={{...styles.th, textAlign: 'right'}}>Cena Netto</th>
              </tr>
            </thead>
            <tbody>
              {activeItems.map((item) => (
                <tr key={item.originalIndex} style={{ opacity: item.isExcluded ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <input 
                      type="checkbox" 
                      checked={!item.isExcluded}
                      onChange={() => toggleItemExclusion(item.originalIndex)}
                      style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{...styles.td, textDecoration: item.isExcluded ? 'line-through' : 'none'}}>{item.name}</td>
                  <td style={styles.td}>{item.details}</td>
                  <td style={{...styles.td, textAlign: 'right', fontWeight: 500, textDecoration: item.isExcluded ? 'line-through' : 'none'}}>
                    {item.price.toFixed(2)} zł
                  </td>
                </tr>
              ))}
              
              {/* BASE SUM */}
              <tr>
                <td colSpan={3} style={{...styles.td, textAlign: 'right', paddingTop: '15px', color: '#6b7280'}}>Suma pośrednia (aktywne):</td>
                <td style={{...styles.td, textAlign: 'right', paddingTop: '15px'}}>
                  {baseNet.toFixed(2)} zł
                </td>
              </tr>

              {/* DEADLINE MODIFIER ROW */}
              {selectedDeadline !== 'standard' && (
                <tr>
                  <td colSpan={2}></td>
                  <td style={{...styles.td, color: modifierConfig.color, fontWeight: 600, textAlign: 'right'}}>
                      {selectedDeadline === 'express' ? 'Dopłata Express' : 'Rabat za termin'} ({modifierConfig.label})
                  </td>
                  <td style={{...styles.td, textAlign: 'right', color: modifierConfig.color, fontWeight: 600}}>
                      {modifierValue > 0 ? '+' : ''}{modifierValue.toFixed(2)} zł
                  </td>
                </tr>
              )}

              {/* FINAL CALCULATIONS */}
              <tr style={{borderTop: '2px solid #e5e7eb'}}>
                <td colSpan={3} style={{...styles.td, textAlign: 'right', paddingTop: '15px', fontWeight: 700}}>Suma Netto (po korekcie):</td>
                <td style={{...styles.td, textAlign: 'right', paddingTop: '15px', fontWeight: 700}}>
                  {finalNet.toFixed(2)} zł
                </td>
              </tr>
              <tr>
                <td colSpan={3} style={{...styles.td, textAlign: 'right'}}>VAT (23%):</td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  {vat.toFixed(2)} zł
                </td>
              </tr>
              <tr>
                <td colSpan={3} style={{...styles.td, textAlign: 'right', ...styles.totalRow}}>DO ZAPŁATY (Brutto):</td>
                <td style={{...styles.td, textAlign: 'right', ...styles.totalRow, color: '#2563EB'}}>
                  {totalGross.toFixed(2)} zł
                </td>
              </tr>
            </tbody>
          </table>

          {/* DISCLAIMER / NOTE */}
          <div style={{ marginTop: '15px', fontSize: '12px', color: '#64748b', fontStyle: 'italic', textAlign: 'center', lineHeight: '1.4' }}>
            * Podana cena jest estymacją na podstawie wstępnych wymiarów. <br/>
            Po wykonaniu pomiaru, w przypadku istotnych różnic w powierzchni, zastrzegamy sobie prawo do korekty wyceny (dopłata lub zwrot nadpłaty).
          </div>

          {/* DEADLINE INFO BELOW QUOTE */}
          <div style={{
            marginTop: '20px', 
            padding: '12px', 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: '6px',
            color: '#0369a1',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>📅</span>
            <span>Wybrany termin realizacji:</span>
            <strong style={{textTransform: 'uppercase'}}>{modifierConfig.label}</strong>
          </div>

          {/* CENTERED COPY BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
            <button style={styles.copyBtn} onClick={handleCopyToClipboard}>
              📋 Kopiuj Ofertę do Schowka (Email)
            </button>
          </div>
        </>
      )}
    </div>
  );
};
