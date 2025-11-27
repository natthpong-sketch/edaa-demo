import { GoogleGenAI } from "@google/genai";
import { AssetFormData, RequestType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMemoDraft = async (data: AssetFormData): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  const typeText = data.requestType === RequestType.UPDATE 
    ? 'ขออนุมัติปรับปรุงข้อมูลบัญชีทรัพย์สิน' 
    : 'ขออนุมัติจำหน่ายทรัพย์สินออกจากบัญชี';

  // Construct asset list string for the prompt
  let assetDetails = "";
  if (data.isAttachmentMode) {
    assetDetails = "รายละเอียดปรากฏตามสิ่งที่ส่งมาด้วย (เอกสารแนบ)";
  } else if (data.items.length > 0) {
    assetDetails = data.items.map((item, index) => 
      `${index + 1}. ${item.assetName} (ประเภท: ${item.assetType || 'ไม่ระบุ'}) รหัสทรัพย์สิน: ${item.mainAssetId}-${item.subAssetId}`
    ).join("\n    ");
  } else {
    assetDetails = "ไม่ระบุ";
  }

  const prompt = `
    คุณคือผู้ช่วยธุรการมืออาชีพ หน้าที่ของคุณคือร่าง "บันทึกข้อความ" (Memo) ราชการ/ภายในบริษัท ภาษาไทย
    
    ข้อมูลสำหรับร่างหนังสือ:
    - เรื่อง: ${typeText}
    - เรียน: ผู้จัดการฝ่ายบัญชีทรัพย์สิน
    - จาก: ${data.requesterName} ตำแหน่ง ${data.position} สังกัด ${data.department}
    - รายการทรัพย์สิน: 
    ${assetDetails}
    
    - เหตุผลความจำเป็น: ${data.reason}
    - หมายเหตุเพิ่มเติม: ${data.additionalNote || '-'}
    
    คำสั่ง:
    1. เขียนในรูปแบบบันทึกข้อความที่เป็นทางการ (มีส่วนหัว ส่วนเนื้อหา และส่วนลงชื่อ)
    2. ใช้ภาษาที่สุภาพ เป็นทางการ และกระชับ
    3. จัดรูปแบบให้อ่านง่าย
    4. ไม่ต้องใส่ วันที่ (ให้เว้นว่างไว้เติมเอง)
    5. เนื้อหาต้องระบุความประสงค์ชัดเจนว่าต้องการทำอะไร (แก้ไข หรือ จำหน่าย) กับทรัพย์สินรายการดังกล่าว เพราะอะไร
    6. **การแสดงรายการทรัพย์สิน**:
       - หากมีข้อมูลรายการทรัพย์สิน (ไม่ใช่เอกสารแนบ) ให้จัดรูปแบบเป็น "ตาราง" หรือรายการลำดับ (Bullet points) ที่ชัดเจนในเนื้อหาจดหมาย โดยต้องมี รหัสทรัพย์สิน และ ชื่อทรัพย์สิน ครบถ้วน
       - หากเป็นโหมดเอกสารแนบ ให้ใช้ข้อความว่า "รายละเอียดปรากฏตามสิ่งที่ส่งมาด้วย"
    7. **ส่วนลงนาม**: ต้องมีพื้นที่สำหรับการลงนาม 3 ส่วน เรียงลำดับลงมา:
       - ลำดับที่ 1: ผู้แจ้งความประสงค์ (${data.requesterName || '................................................'}) ลงชื่อพร้อมระบุตำแหน่ง
       - ลำดับที่ 2: หัวหน้าแผนก (${data.headOfDepartment || '................................................'}) ลงชื่อในฐานะผู้ตรวจสอบ/หัวหน้าแผนก
       - ลำดับที่ 3: หัวหน้าหน่วยงาน (${data.headOfUnit || '................................................'}) ลงชื่อในฐานะผู้อนุมัติ/หัวหน้าหน่วยงาน
       (โดยให้เว้นบรรทัดสำหรับเซ็นชื่อในแต่ละลำดับด้วย)
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "ขออภัย ไม่สามารถร่างหนังสือได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
  } catch (error) {
    console.error("Error generating memo:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาตรวจสอบ API Key หรือลองใหม่อีกครั้ง";
  }
};