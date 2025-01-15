import jsPDF from "jspdf";
import "jspdf-autotable";

const InvoiceTemplate = ({ order }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("Tax Invoice", 105, 15, { align: "center" });

    // Seller Information
    doc.setFontSize(12);
    doc.text("Sold By / Seller", 10, 30);
    doc.text(`Vendor Name: Shree Krishna General Store`, 10, 35);
    doc.text("Maharshi Nagar Near Maharshi University 226020", 10, 40);
    doc.text("GSTIN: XXXXXXXXXXXXXX", 10, 45);
    doc.text("FSSAI License Number: XXXXXXXXXXXXXX", 10, 50);

    // Invoice and Customer Information
    doc.text(`Invoice Number: ${order.invoiceNumber}`, 140, 30);
    doc.text(`Invoice Date: ${new Date(order.invoiceDate).toLocaleDateString()}`, 140, 35);
    doc.text(`Order ID: ${order.id}`, 140, 40);
    doc.text(`Customer Name: ${order.customerName}`, 140, 45);
    doc.text(`Customer Address: ${order.customerAddress}`, 140, 50, { maxWidth: 60 });

    // Product Table
    const tableColumns = [
      "Sr. No.",
      "Item Description",
      "MRP",
      "Discount",
      "Qty",
      "Taxable Value",
      "CGST",
      "SGST",
      "Total",
    ];
    const tableRows = order.items.map((item, index) => [
      index + 1,
      item.description,
      `₹${item.mrp.toFixed(2)}`,
      `₹${item.discount.toFixed(2)}`,
      item.quantity,
      `₹${item.taxableValue.toFixed(2)}`,
      `₹${item.cgst.toFixed(2)}`,
      `₹${item.sgst.toFixed(2)}`,
      `₹${item.total.toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: 60,
      head: [tableColumns],
      body: tableRows,
      styles: { fontSize: 10 },
    });

    // Footer Total
    const total = order.items.reduce((sum, item) => sum + item.total, 0);
    doc.text(`Total: ₹${total.toFixed(2)}`, 140, doc.lastAutoTable.finalY + 10);

    // Download PDF
    doc.save(`invoice-${order.id}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600"
    >
      Download Invoice
    </button>
  );
};

export default InvoiceTemplate;
