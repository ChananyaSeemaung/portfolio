document.addEventListener('DOMContentLoaded', () => {
    const btnExportPdf = document.getElementById('btn-export-pdf'); // ปุ่ม PDF เมนูข้าง
    const previewModal = document.getElementById('pdf-preview-modal');
    const previewArea = document.getElementById('pdf-preview-area');
    const btnConfirmDownload = document.getElementById('btn-confirm-download'); // ปุ่มโหลดจริงใน Modal

    // 1. เมื่อกดปุ่ม PDF เมนูข้าง -> เปิดหน้าต่างพรีวิว
    if (btnExportPdf) {
        btnExportPdf.addEventListener('click', () => {
            const originalResume = document.getElementById('resume');
            if (originalResume) {
                // ล้างพื้นที่เก่าในกล่องพรีวิวก่อน
                previewArea.innerHTML = '';
                
                // 💡 แก้จุดที่ 1: ใช้ cloneNode(true) เพื่อก๊อปปี้มาทั้งกล่องแม่ คลาส และโครงสร้างทั้งหมด
                const clonedResume = originalResume.cloneNode(true);
                
                // ลบ id ออกเพื่อไม่ให้ตัวพรีวิวไปซ้ำซ้อนกับตัวจริงบนหน้าเว็บ
                clonedResume.removeAttribute('id'); 
                
                // นำตัวพรีวิวที่สมบูรณ์ไปใส่ในกล่องแสดงผล
                previewArea.appendChild(clonedResume);
                
                // เปิดมอดอลพรีวิว
                previewModal.classList.remove('hidden');
            }
        });
    }

    // 2. เมื่อกดปุ่ม "ดาวน์โหลดไฟล์ PDF จริง" ด้านในหน้าต่างพรีวิว
    if (btnConfirmDownload) {
        btnConfirmDownload.addEventListener('click', () => {
            // ดึงข้อมูลโดยตรงจากกล่อง #resume ตัวจริงที่อยู่บนหน้าเว็บหลัก เพื่อความเป๊ะและคมชัดที่สุด
            const element = document.getElementById('resume'); 

            const options = {
                margin:       0, // ล็อกขอบเป็น 0 เพราะเรากำหนดขนาด A4 ไว้ใน HTML แล้ว
                filename:     'My_Resume_Portfolio.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2,           // เพิ่มความคมชัดตัวอักษร
                    useCORS: true,      // เปิดให้รองรับการดึงรูปภาพโปรไฟล์
                    scrollY: 0,         // 💡 แก้จุดที่ 2: บังคับให้ดึงภาพจากบนสุดเสมอ (แก้บั๊กกระดาษขาวเวลามีการเลื่อนจอ)
                    scrollX: 0
                },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // เปลี่ยนสถานะปุ่มตอนกำลังเรนเดอร์ไฟล์
            btnConfirmDownload.innerText = '⏳ กำลังสร้างไฟล์...';
            btnConfirmDownload.disabled = true;

            // สั่งเริ่มดาวน์โหลด PDF
            html2pdf().set(options).from(element).save()
                .then(() => {
                    btnConfirmDownload.innerText = '💾 ดาวน์โหลดไฟล์ PDF จริง';
                    btnConfirmDownload.disabled = false;
                    closePreviewModal(); // ดาวน์โหลดเสร็จแล้วสั่งปิดมอดอลพรีวิวอัตโนมัติ
                })
                .catch((err) => {
                    console.error('PDF Export Error:', err);
                    alert('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF กรุณาลองใหม่อีกครั้ง');
                    btnConfirmDownload.innerText = '💾 ดาวน์โหลดไฟล์ PDF จริง';
                    btnConfirmDownload.disabled = false;
                });
        });
    }
});

// ฟังก์ชันสำหรับสั่งปิดหน้าต่างมอดอลพรีวิว
function closePreviewModal() {
    const previewModal = document.getElementById('pdf-preview-modal');
    if (previewModal) {
        previewModal.classList.add('hidden');
    }
}