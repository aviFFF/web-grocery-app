// components/Invoice.js
import React from "react";
import { jsPDF } from "jspdf";

const Invoice = ({ order }) => {
  const fetchInvoice = () => {
    try {
      const doc = new jsPDF();

      // Add Invoice Title
      doc.setFontSize(18);
      doc.text("Invoice", 105, 10, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Order ID: ${order.id}`, 10, 30);
      doc.text(
        `Customer: ${order.attributes.firstname} ${order.attributes.lastname}`,
        10,
        40
      );
      doc.text(`Phone: ${order.attributes.phone}`, 10, 50);
      doc.text(
        `Address: ${order.attributes.address} - ${order.attributes.pincode}`,
        10,
        60
      );
      doc.text(`Total Value: ₹${order.attributes.totalOrderValue}`, 10, 70);
      doc.text(`Payment Mode: ${order.attributes.paymentid}`, 10, 80);

      // Add Products
      doc.text("Products:", 10, 100);
      let yPosition = 110;
      order.attributes.Orderitemlist?.forEach((orderItem, idx) => {
        doc.text(
          `${idx + 1}. ${orderItem.product?.data?.attributes?.name}`,
          10,
          yPosition
        );
        doc.text(
          `Price: ₹${orderItem.product?.data?.attributes?.sellingPrice}`,
          10,
          yPosition + 10
        );
        doc.text(`Quantity: ${orderItem.quantity}`, 10, yPosition + 20);
        yPosition += 30;
      });

      // Save the PDF
      doc.save(`invoice-${order.id}.pdf`);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={fetchInvoice}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Generate Invoice
      </button>
    </div>
  );
};

export default Invoice;
