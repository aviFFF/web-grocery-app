import jsPDF from "jspdf";
import "jspdf-autotable";
import { IoArrowDownOutline } from "react-icons/io5";

const InvoiceTemplate = ({ order, vendor }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text("Tax Invoice", 105, 15, { align: "center" });
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 20, 200, 20);

    // Seller Information
    doc.setFontSize(12);
    doc.text("Sold By / Seller", 10, 30);
    doc.text(`Vendor Name: ${vendor.name || "N/A"}`, 10, 35);
    doc.text(`Address: ${vendor.address || "N/A"}`, 10, 40);
    doc.text(`GSTIN: ${vendor.gstin || "N/A"}`, 10, 45);
    doc.text(`FSSAI License Number: ${vendor.fssaiLicense || "N/A"}`, 10, 50);

    // Invoice and Customer Information
    doc.text(`Invoice Number: ${order.invoiceNumber || "N/A"}`, 140, 30);
    doc.text(
      `Invoice Date: ${
        order.invoiceDate
          ? new Date(order.invoiceDate).toLocaleDateString()
          : "N/A"
      }`,
      140,
      35
    );
    doc.text(`Order ID: ${order.id || "N/A"}`, 140, 40);
    doc.text(`Customer Name: ${order.customerName || "N/A"}`, 140, 45);
    doc.text(`Customer Address: ${order.customerAddress || "N/A"}`, 140, 50);

    // Product Table
    const tableColumns = [
      "Sr. No.",
      "Item Description",
      "MRP (₹)",
      "Discount (₹)",
      "Qty",
      "Taxable Value (₹)",
      "CGST (₹)",
      "SGST (₹)",
      "Total (₹)",
    ];
    const tableRows = order.items.map((item, index) => [
      index + 1,
      item.description || "N/A",
      item.mrp?.toFixed(2) || "0.00",
      item.discount?.toFixed(2) || "0.00",
      item.quantity || "0",
      item.taxableValue?.toFixed(2) || "0.00",
      item.cgst?.toFixed(2) || "0.00",
      item.sgst?.toFixed(2) || "0.00",
      item.total?.toFixed(2) || "0.00",
    ]);

    doc.autoTable({
      startY: 60,
      head: [tableColumns],
      body: tableRows,
      styles: { fontSize: 10, halign: "center", valign: "middle" },
      headStyles: { fillColor: [22, 160, 133] }, // Green header background
    });

    // Footer Summary
    const totalAmount = order.items.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const totalQuantity = order.items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    doc.setFontSize(12);
    doc.text(
      `Total Quantity: ${totalQuantity}`,
      10,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Total Amount: ₹${totalAmount.toFixed(2)}`,
      140,
      doc.lastAutoTable.finalY + 10
    );
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Thank you for your business!",
      105,
      doc.lastAutoTable.finalY + 20,
      { align: "center" }
    );

    // Download PDF
    doc.save(`invoice-${order.id || "unknown"}.pdf`);
  };

  return (
    <div className="flex items-end justify-end">
      <button
        onClick={generatePDF}
        className=" text-black px-2 md:px-4 justify-center py-2 flex rounded-md border border-blue-500 hover:bg-blue-500 hover:text-white"
      >
        <IoArrowDownOutline className="text-black text-2xl" />
        Download Invoice
      </button>
    </div>
  );
};

export default InvoiceTemplate;
