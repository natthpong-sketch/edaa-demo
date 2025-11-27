import React, { useState } from 'react';
import { AssetFormData, RequestType } from './types';
import AssetForm from './components/AssetForm';
import Checklist from './components/Checklist';
import { generateMemoDraft } from './services/geminiService';
import { FileDown, Copy, RefreshCw, FileText } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState<AssetFormData>({
    requesterName: '',
    department: '',
    position: '',
    // Initialize with empty list
    items: [],
    isAttachmentMode: false,
    
    requestType: RequestType.UPDATE,
    reason: '',
    additionalNote: '',
    headOfDepartment: '',
    headOfUnit: ''
  });

  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleGenerate = async () => {
    // Validation: Must have at least 1 item OR be in attachment mode, AND have a reason
    if ((formData.items.length === 0 && !formData.isAttachmentMode) || !formData.reason) return;
    
    setIsGenerating(true);
    setShowResult(true);
    
    setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const letter = await generateMemoDraft(formData);
    setGeneratedLetter(letter);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert('คัดลอกข้อความแล้ว');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>บันทึกข้อความ</title>
            <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;700&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Sarabun', sans-serif; padding: 50px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
              .content { white-space: pre-wrap; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <div class="content">${generatedLetter}</div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleExportWord = () => {
    // เตรียมเนื้อหา HTML พร้อมตกแต่ง Style สำหรับ Word
    // ใช้ <p> แทน \n เพื่อให้ Word จัดระยะบรรทัดได้ถูกต้อง
    const contentLines = generatedLetter.split('\n').map(line => {
        if (!line.trim()) return '<p>&nbsp;</p>'; // บรรทัดว่าง
        return `<p style="margin-bottom: 0pt; line-height: 1.5;">${line}</p>`;
    }).join('');

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>บันทึกข้อความ</title>
        <style>
          /* Import Font อาจจะไม่แสดงผลใน Word ถ้าเครื่องผู้ใช้ไม่มี แต่ใส่ไว้เพื่อความครบถ้วน */
          @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;700&display=swap');
          
          body {
            font-family: 'Sarabun', 'Angsana New', sans-serif;
            font-size: 16pt;
          }
          /* ตั้งค่าตารางพื้นฐาน เผื่อ AI ส่งตารางมา */
          table { border-collapse: collapse; width: 100%; margin: 10px 0; }
          td, th { border: 1px solid #000; padding: 8px; }
        </style>
      </head>
      <body>
        <div class="WordSection1">
    `;

    const footer = `
        </div>
      </body>
      </html>
    `;
    
    const sourceHTML = header + contentLines + footer;

    // สร้าง Blob พร้อมระบุ BOM (\ufeff) เพื่อรองรับภาษาไทย
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    
    // สร้าง URL สำหรับ Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // ตั้งชื่อไฟล์ตามชื่อผู้ขอ หรือวันที่
    const filename = `บันทึกข้อความ_${formData.requesterName || 'draft'}.doc`;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Asset Memo Generator</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            สำหรับผู้ใช้งาน/ผู้ถือครองทรัพย์สิน
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
              <p>
                <strong>คำแนะนำ:</strong> เนื่องจากท่านไม่มีสิทธิ์เข้าถึงระบบ SAP 
                กรุณากรอกข้อมูลในแบบฟอร์มด้านล่างเพื่อให้ระบบร่างหนังสือแจ้งหน่วยงานบัญชีทรัพย์สินโดยอัตโนมัติ
              </p>
            </div>
            
            <AssetForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right Column: Checklist (Sticky on Desktop) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Checklist requestType={formData.requestType} />
            </div>
          </div>

        </div>

        {/* Result Section */}
        {showResult && (
          <div id="result-section" className="mt-12 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">ร่างบันทึกข้อความ (Draft)</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium transition-colors"
                  disabled={!generatedLetter}
                >
                  <Copy className="w-4 h-4" />
                  คัดลอก
                </button>
                <button 
                   onClick={handleExportWord}
                   className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-2 text-sm font-medium transition-colors"
                   disabled={!generatedLetter}
                >
                   <FileText className="w-4 h-4" />
                   Word (.doc)
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 flex items-center gap-2 text-sm font-medium transition-colors"
                  disabled={!generatedLetter}
                >
                  <FileDown className="w-4 h-4" />
                  Print / PDF
                </button>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-slate-200 min-h-[400px]">
              {isGenerating ? (
                 <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p>AI กำลังเรียบเรียงข้อความและจัดรูปแบบตาราง...</p>
                 </div>
              ) : (
                <div className="prose max-w-none font-sarabun whitespace-pre-wrap text-slate-800 leading-relaxed">
                  {generatedLetter}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;