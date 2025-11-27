import React from 'react';
import { RequestType, ChecklistItem } from '../types';
import { CheckSquare, AlertCircle } from 'lucide-react';

interface ChecklistProps {
  requestType: RequestType;
}

const Checklist: React.FC<ChecklistProps> = ({ requestType }) => {
  
  const getItems = (type: RequestType): ChecklistItem[] => {
    if (type === RequestType.UPDATE) {
      return [
        { id: '1', label: 'แบบฟอร์มขอปรับปรุงข้อมูล (ถ้ามี)', required: true },
        { id: '2', label: 'ภาพถ่ายทรัพย์สินปัจจุบัน (เห็นป้ายทรัพย์สินชัดเจน)', required: true },
        { id: '3', label: 'เอกสารอ้างอิงการเปลี่ยนสถานที่/ผู้รับผิดชอบ (เช่น อีเมลอนุมัติ)', required: false },
      ];
    } else {
      return [
        { id: '1', label: 'แบบฟอร์มขอจำหน่ายทรัพย์สิน', required: true },
        { id: '2', label: 'ภาพถ่ายสภาพทรัพย์สินที่ชำรุด/เสื่อมสภาพ', required: true },
        { id: '3', label: 'ใบความเห็นช่าง/IT (กรณีเครื่องใช้ไฟฟ้า/คอมพิวเตอร์)', required: true },
        { id: '4', label: 'ใบแจ้งความ (กรณีสูญหาย)', required: false },
      ];
    }
  };

  const items = getItems(requestType);

  return (
    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
      <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
        <CheckSquare className="w-5 h-5" />
        รายการเอกสารประกอบ (Checklist)
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div className="mt-0.5">
              <input 
                type="checkbox" 
                id={`check-${item.id}`} 
                className="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
              />
            </div>
            <label htmlFor={`check-${item.id}`} className="text-slate-700 cursor-pointer text-sm leading-relaxed">
              <span className={item.required ? "font-semibold" : ""}>{item.label}</span>
              {item.required && <span className="text-red-500 ml-1">*จำเป็น</span>}
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-start gap-2 text-xs text-orange-700 bg-orange-100 p-3 rounded-lg">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>กรุณาเตรียมเอกสารให้ครบถ้วนและแนบไปพร้อมกับบันทึกข้อความ เพื่อความรวดเร็วในการดำเนินการของหน่วยงานบัญชีทรัพย์สิน</p>
      </div>
    </div>
  );
};

export default Checklist;