// types/jspdf-autotable.d.ts
import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    previousAutoTable?: {
      finalY: number;
    };
  }
}
