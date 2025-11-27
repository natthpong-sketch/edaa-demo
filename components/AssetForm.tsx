import React, { useState } from 'react';
import { AssetFormData, RequestType, AssetItem } from '../types';
import { FileText, User, Briefcase, Hash, Tag, AlignLeft, Layers, CornerDownRight, PenTool, Plus, Trash2, Paperclip, AlertCircle } from 'lucide-react';

interface AssetFormProps {
  formData: AssetFormData;
  setFormData: React.Dispatch<React.SetStateAction<AssetFormData>>;
  onSubmit: () => void;
  isGenerating: boolean;
}

const AssetForm: React.FC<AssetFormProps> = ({ formData, setFormData, onSubmit, isGenerating }) => {
  
  // Local state for the "New Item" inputs
  const [newItem, setNewItem] = useState<AssetItem>({
    assetType: '',
    mainAssetId: '',
    subAssetId: '',
    assetName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleMainIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setNewItem(prev => ({ ...prev, mainAssetId: val }));
  };

  const handleSubIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = e.target.value.replace(/\D/g, '');
     setNewItem(prev => ({ ...prev, subAssetId: val }));
  };

  const addItem = () => {
    if (newItem.mainAssetId && newItem.subAssetId && newItem.assetName) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
      // Reset new item inputs
      setNewItem({
        assetType: newItem.assetType, // Keep type for convenience
        mainAssetId: '',
        subAssetId: '',
        assetName: ''
      });
    }
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const toggleAttachmentMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isAttachmentMode: e.target.checked }));
  };

  const addReasonSuggestion = (suggestion: string) => {
    setFormData(prev => ({
      ...prev,
      reason: prev.reason ? `${prev.reason}\n${suggestion}` : suggestion
    }));
  };

  const getReasonSuggestions = () => {
    if (formData.requestType === RequestType.UPDATE) {
      return [
        "ตามคำสั่งโยกย้ายหน่วยงาน ที่ ... ลงวันที่ ...",
        "เนื่องจากผู้ถือครองเดิมเกษียณอายุราชการ",
        "มีการย้ายสถานที่ตั้งทรัพย์สินไปที่ ...",
        "ปรับปรุงข้อมูลศูนย์ต้นทุน (Cost Center)"
      ];
    } else {
      return [
        "ทรัพย์สินชำรุดเสียหาย ไม่สามารถซ่อมแซมได้",
        "ทรัพย์สินสูญหาย (มีใบแจ้งความประกอบ)",
        "หมดความจำเป็นในการใช้งาน / ตกรุ่น (Obsolete)",
        "บริจาคให้หน่วยงานภายนอก"
      ];
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-600" />
        กรอกข้อมูลทรัพย์สิน
      </h2>
      
      <div className="space-y-4">
        {/* User Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ขอ / ผู้ถือครอง</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="requesterName"
                value={formData.requesterName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="นายรักงาน ขยันยิ่ง"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ตำแหน่ง</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="เจ้าหน้าที่ปฏิบัติการ"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">หน่วยงาน / แผนก</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="แผนก IT Support"
            />
          </div>
        </div>

        <hr className="my-4 border-slate-100" />

        {/* Request Type */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทคำร้อง</label>
            <select
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value={RequestType.UPDATE}>ขอปรับปรุงข้อมูลทรัพย์สิน (Update Asset Data)</option>
              <option value={RequestType.DISPOSAL}>ขอจำหน่ายทรัพย์สิน (Asset Disposal)</option>
            </select>
        </div>

        {/* Assets List Section */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
             <h3 className="font-semibold text-slate-700 flex items-center gap-2">
               <Layers className="w-5 h-5 text-slate-500" />
               รายการทรัพย์สิน
             </h3>
             <div className="flex items-center gap-2">
               <input 
                 type="checkbox" 
                 id="attachmentMode" 
                 checked={formData.isAttachmentMode}
                 onChange={toggleAttachmentMode}
                 className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
               />
               <label htmlFor="attachmentMode" className="text-sm text-slate-600 cursor-pointer select-none">
                 เกิน 5 รายการ (ใช้เอกสารแนบ)
               </label>
             </div>
          </div>

          {formData.isAttachmentMode ? (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200 flex items-center gap-3">
               <Paperclip className="w-5 h-5" />
               <p className="text-sm">ระบบจะระบุในหนังสือว่า <strong>"รายละเอียดปรากฏตามสิ่งที่ส่งมาด้วย"</strong> โปรดแนบไฟล์ Excel หรือเอกสารรายการทรัพย์สินแยกต่างหาก</p>
            </div>
          ) : (
            <>
               {/* List of Added Items */}
               {formData.items.length > 0 && (
                 <div className="mb-4 overflow-hidden border border-slate-200 rounded-lg">
                   <table className="min-w-full divide-y divide-slate-200">
                     <thead className="bg-slate-100">
                       <tr>
                         <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">รหัสทรัพย์สิน</th>
                         <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ชื่อทรัพย์สิน</th>
                         <th className="px-3 py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">ลบ</th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-slate-200">
                       {formData.items.map((item, idx) => (
                         <tr key={idx}>
                           <td className="px-3 py-2 text-sm text-slate-900 font-mono">
                             {item.mainAssetId}-{item.subAssetId}
                           </td>
                           <td className="px-3 py-2 text-sm text-slate-700">
                             {item.assetName}
                           </td>
                           <td className="px-3 py-2 text-center">
                             <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}

               {/* Input for New Item */}
               {formData.items.length < 5 ? (
                 <div className="grid grid-cols-1 gap-3 p-3 bg-white border border-blue-100 rounded-lg shadow-sm">
                    <p className="text-xs font-semibold text-blue-600 mb-1">เพิ่มรายการใหม่ (รายการที่ {formData.items.length + 1}/5)</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                       <select
                          name="assetType"
                          value={newItem.assetType}
                          onChange={handleNewItemChange}
                          className="col-span-2 w-full px-3 py-2 border border-slate-300 rounded text-sm"
                       >
                          <option value="">-- เลือกประเภท --</option>
                          <option value="คอมพิวเตอร์และอุปกรณ์">คอมพิวเตอร์และอุปกรณ์</option>
                          <option value="เครื่องใช้สำนักงาน">เครื่องใช้สำนักงาน</option>
                          <option value="เฟอร์นิเจอร์">เฟอร์นิเจอร์</option>
                          <option value="ยานพาหนะ">ยานพาหนะ</option>
                          <option value="เครื่องจักร">เครื่องจักร</option>
                          <option value="อื่นๆ">อื่นๆ</option>
                       </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 relative">
                        <input
                          type="text"
                          name="mainAssetId"
                          maxLength={12}
                          value={newItem.mainAssetId}
                          onChange={handleMainIdChange}
                          placeholder="รหัสหลัก (9-12 หลัก)"
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="subAssetId"
                          maxLength={4}
                          value={newItem.subAssetId}
                          onChange={handleSubIdChange}
                          placeholder="ย่อย (4)"
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="relative">
                       <input
                         type="text"
                         name="assetName"
                         value={newItem.assetName}
                         onChange={handleNewItemChange}
                         placeholder="ชื่อทรัพย์สิน เช่น Dell Latitude 7420"
                         className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                       />
                    </div>

                    <button 
                      onClick={addItem}
                      disabled={!newItem.mainAssetId || !newItem.subAssetId || !newItem.assetName}
                      className="mt-1 w-full flex items-center justify-center gap-2 py-2 bg-slate-800 text-white rounded text-sm hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                    >
                      <Plus className="w-4 h-4" /> เพิ่มรายการ
                    </button>
                 </div>
               ) : (
                 <div className="text-center p-3 bg-slate-100 text-slate-500 text-sm rounded-lg">
                    ครบ 5 รายการแล้ว หากมีมากกว่านี้โปรดเลือก "เกิน 5 รายการ"
                 </div>
               )}
            </>
          )}
        </div>

        {/* Reason Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {formData.requestType === RequestType.UPDATE ? 'เหตุผลในการขอปรับปรุง / รายละเอียด' : 'สาเหตุการจำหน่าย'}
          </label>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {getReasonSuggestions().map((suggestion, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={() => addReasonSuggestion(suggestion)}
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                    + {suggestion}
                </button>
            ))}
          </div>

          <div className="relative">
            <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={formData.requestType === RequestType.UPDATE ? "ระบุสาเหตุและรายละเอียดที่ต้องการแก้ไข..." : "ระบุสาเหตุความชำรุด หรือสูญหาย..."}
            />
          </div>
        </div>

        {/* Signature Section Info */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
             <PenTool className="w-5 h-5 text-slate-500" />
             <h3 className="text-sm font-semibold text-slate-700">รายชื่อผู้บังคับบัญชา (สำหรับการลงนาม)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อหัวหน้าแผนก (ถ้ามี)</label>
                <input
                  type="text"
                  name="headOfDepartment"
                  value={formData.headOfDepartment || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="ลงนามลำดับที่ 2"
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ชื่อหัวหน้าหน่วยงาน (ถ้ามี)</label>
                <input
                  type="text"
                  name="headOfUnit"
                  value={formData.headOfUnit || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="ลงนามลำดับที่ 3"
                />
             </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onSubmit}
          disabled={isGenerating || (!formData.isAttachmentMode && formData.items.length === 0) || !formData.reason}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md transition-all flex justify-center items-center gap-2
            ${isGenerating || (!formData.isAttachmentMode && formData.items.length === 0) || !formData.reason
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]'}`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังร่างหนังสือ...
            </>
          ) : (
            'สร้างร่างหนังสือ (Generate Draft)'
          )}
        </button>
      </div>
    </div>
  );
};

export default AssetForm;