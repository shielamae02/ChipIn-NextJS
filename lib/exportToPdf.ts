import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export function exportToPDF({
  sessionName,
  createdBy,
  balances,
  transactions,
  participants,
  totalAmount,
}: {
  sessionName: string;
  createdBy: string;
  balances: Record<string, number>;
  transactions: Transaction[];
  participants: Participant[];
  totalAmount: string;
}) {
  const doc = new jsPDF();
  const now = new Date();

  // Helper to get participant name
  const getName = (id: string): string => {
    const match = participants.find((p) => p.id === id);
    return match?.name ?? "-";
  };

  // Header
  doc.setFontSize(16);
  doc.text(`${sessionName} by ${createdBy}`, 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Downloaded on ${now.toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    })}`,
    14,
    27
  );

  // Section 1: Current Balances
  doc.text(`Total Expenses: ${totalAmount}`, 14, 34);
  doc.text("Current Balances:", 14, 45);
  autoTable(doc, {
    startY: 47,
    head: [["Participant", "Balance"]],
    body: Object.entries(balances).map(([id, balance]) => [
      getName(id),
      formatCurrency(balance),
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [60, 141, 188] },
    margin: { top: 10 },
  });

  const startY = doc.previousAutoTable?.finalY ?? 170;
  doc.text("Settlement Plan:", 14, startY + 10);

  // Section 2: Settlement Plan
  autoTable(doc, {
    startY: startY + 12,
    head: [["From", "To", "Amount"]],
    body: transactions.map((t) => [
      getName(t.from),
      getName(t.to),
      formatCurrency(t.amount),
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [46, 204, 113] },
    margin: { top: 10 },
  });

  // Save the PDF
  doc.save(`${sessionName.replace(/\s+/g, "_").toLowerCase()}_summary.pdf`);
}
