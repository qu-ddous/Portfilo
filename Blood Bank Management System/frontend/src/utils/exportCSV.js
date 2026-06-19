/**
 * exportCSV.js — CSV export utility for BloodLink tables
 */

/**
 * Convert array of objects to CSV string
 * @param {Object[]} data - Array of row objects
 * @param {string[]} [columns] - Optional column keys to include (in order)
 * @returns {string} CSV string
 */
const toCSVString = (data, columns) => {
  if (!data || data.length === 0) return '';

  const keys = columns || Object.keys(data[0]);

  // Header row
  const header = keys.join(',');

  // Data rows
  const rows = data.map((row) =>
    keys
      .map((key) => {
        const val = row[key] ?? '';
        // Escape quotes and wrap in quotes if value has comma/newline/quote
        const str = String(val).replace(/"/g, '""');
        return /[,\n"]/.test(str) ? `"${str}"` : str;
      })
      .join(',')
  );

  return [header, ...rows].join('\n');
};

/**
 * Download data as a CSV file
 * @param {Object[]} data - Array of row objects
 * @param {string} filename - File name without extension
 * @param {string[]} [columns] - Optional column keys to include
 */
export const exportCSV = (data, filename = 'export', columns) => {
  const csv = toCSVString(data, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export donors table CSV
 * @param {Object[]} donors
 */
export const exportDonorsCSV = (donors) => {
  const columns = ['name', 'email', 'phone', 'blood_type', 'age', 'weight', 'is_eligible', 'last_donation', 'next_eligible_date'];
  exportCSV(donors, 'bloodlink_donors', columns);
};

/**
 * Export blood inventory CSV
 * @param {Object[]} inventory
 */
export const exportInventoryCSV = (inventory) => {
  const columns = ['blood_type', 'units', 'collection_date', 'expiry_date', 'status'];
  exportCSV(inventory, 'bloodlink_inventory', columns);
};

/**
 * Export blood requests CSV
 * @param {Object[]} requests
 */
export const exportRequestsCSV = (requests) => {
  const columns = ['patient_name', 'blood_type', 'units', 'urgency', 'status', 'required_date', 'created_at'];
  exportCSV(requests, 'bloodlink_requests', columns);
};

/**
 * Export donations report CSV
 * @param {Object[]} donations
 */
export const exportDonationsCSV = (donations) => {
  const columns = ['donor_name', 'blood_type', 'units', 'date', 'test_status'];
  exportCSV(donations, 'bloodlink_donations', columns);
};
