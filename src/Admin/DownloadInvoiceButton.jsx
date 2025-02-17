import React from 'react';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { FileDown } from 'lucide-react';

const formatNumber = (value) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  return typeof numericValue === "number" && !isNaN(numericValue)
    ? numericValue.toFixed(2)
    : "0.00";
};

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 5,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderRadius: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingVertical: 4,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
    color: '#374151',
  },
  value: {
    width: '70%',
    color: '#4b5563',
  },
  table: {
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#4b5563',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginTop: 8,
    paddingTop: 8,
    fontWeight: 'bold',
  },
});

// PDF Document component
const InvoiceDocument = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>MAHASPICE CATERERS</Text>
        <Text style={styles.subtitle}>Invoice for Order #{order.order_id}</Text>
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{order.customer_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{order.customer_phone1}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{order.customer_address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Order Date:</Text>
          <Text style={styles.value}>
            {new Date(order.order_date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Event Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Guest Count:</Text>
          <Text style={styles.value}>{order.guest_count}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tables:</Text>
          <Text style={styles.value}>{order.tables}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Staff:</Text>
          <Text style={styles.value}>{order.staff}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Helpers:</Text>
          <Text style={styles.value}>{order.helpers}</Text>
        </View>
      </View>

      {/* Selected Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selected Menu Items</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Category</Text>
            <Text style={styles.tableHeaderCell}>Item Name</Text>
          </View>
          {/* Table Rows */}
          {Object.entries(order.selected_items).map(([category, items]) =>
            items.map((item, index) => (
              <View key={`${category}-${index}`} style={styles.tableRow}>
                <Text style={styles.tableCell}>{category}</Text>
                <Text style={styles.tableCell}>{item.item_name}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Price Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>
        <View style={styles.priceRow}>
          <Text>Plate Price</Text>
          <Text>₹{formatNumber(order.plate_price)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Table Charges</Text>
          <Text>₹{formatNumber(order.table_charges)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Staff Charges</Text>
          <Text>₹{formatNumber(order.staff_charges)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Helper Charges</Text>
          <Text>₹{formatNumber(order.helper_charges)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Discount</Text>
          <Text>-₹{formatNumber(order.discount)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Subtotal</Text>
          <Text>₹{formatNumber(order.subtotal)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>GST ({order.gst_percent}%)</Text>
          <Text>₹{formatNumber(order.gst)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Delivery Fee</Text>
          <Text>₹{formatNumber(order.delivery_fee)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Total Amount</Text>
          <Text>₹{formatNumber(order.total)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// Download button component
const DownloadInvoiceButton = ({ order }) => (
  <PDFDownloadLink
    document={<InvoiceDocument order={order} />}
    fileName={`mahaspice-invoice-${order.order_id}.pdf`}
  >
    {({ loading }) => (
      <button
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        <FileDown className="w-5 h-5" />
        {loading ? 'Generating PDF...' : 'Download Invoice'}
      </button>
    )}
  </PDFDownloadLink>
);

export default DownloadInvoiceButton;