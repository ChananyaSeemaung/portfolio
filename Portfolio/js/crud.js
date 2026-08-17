const mainSitePage = document.getElementById('main-site-page');
const dashboardPage = document.getElementById('dashboard-page');
const crudModal = document.getElementById('crud-modal');
const btnOpenCreate = document.getElementById('btn-open-create');
const btnGoDashboard = document.getElementById('btn-go-dashboard');

if (btnGoDashboard) {
    btnGoDashboard.addEventListener('click', () => {
        mainSitePage.classList.add('hidden');
        dashboardPage.classList.remove('hidden');
        renderProjects();
    });
}

// สลับไปหน้า Dashboard
function loadSavedProjects() {
    const savedProjects = localStorage.getItem('myPortfolioDB');

    if (savedProjects) {
        projects = JSON.parse(savedProjects);
        renderProjects();
    }
}

// ฟังก์ชันเปิด-ปิด Modal (หน้าต่างป๊อปอัป)
function openModal() {
    if (crudModal) crudModal.classList.remove('hidden');
}

function closeModal() {
    if (crudModal) {
        crudModal.classList.add('hidden');
        document.getElementById('crud-form').reset(); 
        document.getElementById('file-name-text').innerText = 'ยังไม่ได้เลือกไฟล์';
        document.getElementById('proj-image-base64').value = 'assets/images/portfolio.png';
    }
}

const imageFileInput = document.getElementById('proj-image-file');
const fileNameText = document.getElementById('file-name-text');
const imageBase64Input = document.getElementById('proj-image-base64');

if (imageFileInput) {
    imageFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileNameText.innerText = file.name;
            const reader = new FileReader();
            reader.onload = function(event) {
                imageBase64Input.value = event.target.result; 
            };
            reader.readAsDataURL(file);
        } else {
            fileNameText.innerText = 'ยังไม่ได้เลือกไฟล์';
            imageBase64Input.value = 'assets/images/portfolio.png';
        }
    });
}

let projects = [];
let editIndex = -1;

function saveProjects() {
    localStorage.setItem('myPortfolioDB', JSON.stringify(projects));
}

if (btnOpenCreate) {
    btnOpenCreate.addEventListener('click', () => {
        editIndex = -1; 
        document.getElementById('modal-title').innerText = '📝 Create New Portfolio';
        openModal();
    });
}

// --- ฟังก์ชัน R: Read (เวอร์ชันเชื่อมโยงหน้าแดชบอร์ด + หน้าแรกสุด) ---
function renderProjects() {
    const dashboardContainer = document.getElementById('dashboard-container');
    const frontContainer = document.getElementById('portfolio-container'); 
    
    // ใช้รูป Portfolio ล่าสุดเป็นรูปโปรไฟล์
    if (projects.length > 0) {
        const profileImg = projects[projects.length - 1].image;

        const heroImg = document.getElementById('hero-profile-img');
        const resumeImg = document.getElementById('resume-profile-img');

        if (heroImg) heroImg.src = profileImg;
        if (resumeImg) resumeImg.src = profileImg;
    }

    // ล้างข้อมูลเก่าของทั้งสองหน้าจอออกก่อน
    if (dashboardContainer) dashboardContainer.innerHTML = '';
    if (frontContainer) frontContainer.innerHTML = '';

    // วนลูปข้อมูลใน projects ก้อนเดิมของคุณ
    projects.forEach((item, index) => {
        
        // 1. วาดลงหน้า Dashboard (เวอร์ชันมีปุ่ม Update / Delete สำหรับจัดการหลังบ้าน)
        if (dashboardContainer) {
            const dashboardCard = `
                <div class="bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                    <div>
                        <div class="w-full h-40 bg-gray-100 rounded-xl overflow-hidden border-2 border-black mb-4">
                            <img src="${item.image}" class="w-full h-full object-cover">
                        </div>
                        <h3 class="text-lg font-bold text-gray-800 mb-1">${item.title}</h3>
                        <p class="text-sm text-gray-600 mb-4 break-words">${item.desc}</p>
                    </div>
                    <div class="flex gap-2 border-t-2 border-black pt-3 mt-auto">
                        <button onclick="editProject(${index})" class="flex-1 bg-orange-300 text-xs font-bold py-2 px-3 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">🔄 Update</button>
                        <button onclick="deleteProject(${index})" class="flex-1 bg-red-400 text-white text-xs font-bold py-2 px-3 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">🗑️ Delete</button>
                    </div>
                </div>
            `;
            dashboardContainer.insertAdjacentHTML('beforeend', dashboardCard);
        }

        // 2. วาดลงหน้าแรกสุด (เวอร์ชันคลีน ๆ โชว์แค่รูปภาพกับรายละเอียดสวย ๆ ไม่มีปุ่มกวนใจโชว์สาธารณะ)
        if (frontContainer) {
            const frontCard = `
                <div class="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col group text-black">
                    <div class="h-48 w-full border-b-4 border-black bg-gray-100 overflow-hidden">
                        <img src="${item.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    </div>
                    <div class="p-4 flex-1">
                        <h4 class="font-black text-sm mb-1">${item.title}</h4>
                        <p class="text-[11px] text-gray-600 font-medium whitespace-pre-wrap">${item.desc}</p>
                    </div>
                </div>
            `;
            frontContainer.insertAdjacentHTML('beforeend', frontCard);
        }
    });
}

const crudForm = document.getElementById('crud-form');
if (crudForm) {
    crudForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newProject = {
            title: document.getElementById('proj-title').value,
            desc: document.getElementById('proj-desc').value,
            image: document.getElementById('proj-image-base64').value
        };

        if (editIndex === -1) {
            projects.push(newProject);
        } else {
            projects[editIndex] = newProject;
        }
        saveProjects();
        renderProjects();
        closeModal();
    });
}

window.editProject = function(index) {
    editIndex = index;
    const projectToEdit = projects[index];

    document.getElementById('modal-title').innerText = '🔄 Update Portfolio';

    document.getElementById('proj-title').value = projectToEdit.title;
    document.getElementById('proj-desc').value = projectToEdit.desc;

    document.getElementById('proj-image-base64').value = projectToEdit.image;
    document.getElementById('file-name-text').innerText = 'ใช้รูปภาพเดิม (เลือกใหม่เพื่อเปลี่ยน)';

    openModal();
};

// 🛠️ แก้ไขเรียบร้อย: เติม renderProjects() เพื่อให้หน้าจอรีเฟรชทันทีพอกดลบ
window.deleteProject = function(index) {
    const confirmDelete = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผลงานชิ้นนี้?");
    if (confirmDelete) {
        projects.splice(index, 1);
        saveProjects();
        renderProjects(); 
    }
};

renderProjects();

const resumeModal = document.getElementById('resume-modal');
const btnOpenResume = document.getElementById('btn-open-resume');
const resumeForm = document.getElementById('resume-form');

function openResumeModal() {
    if (resumeModal) resumeModal.classList.remove('hidden');
}
window.closeResumeModal = function() {
    if (resumeModal) resumeModal.classList.add('hidden');
}

// 🎓 1. ฟังก์ชันสร้างสล็อตกรอกข้อมูล "การศึกษา" ในมอดอล
window.addEduRow = function(data = { year: '', title: '', detail: '', gpa: '' }) {
    const container = document.getElementById('modal-edu-container');
    if (!container) return; 
    const row = document.createElement('div');
    row.className = "edu-row border border-black p-3 rounded-lg relative bg-white space-y-1 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    row.innerHTML = `
        <button type="button" onclick="this.parentElement.remove()" class="absolute top-1 right-2 text-red-500 hover:text-red-700 font-bold text-xs">✕ ลบ</button>
        <div class="grid grid-cols-3 gap-1 pt-2">
            <input type="text" placeholder="ปี พ.ศ./ค.ศ." value="${data.year}" class="edu-year border border-gray-400 rounded p-1 text-[11px] font-bold">
            <input type="text" placeholder="ชื่อสถาบัน | วุฒิ" value="${data.title}" class="edu-title border border-gray-400 rounded p-1 text-[11px] col-span-2">
        </div>
        <div class="grid grid-cols-4 gap-1">
            <input type="text" placeholder="คณะ / สาขา" value="${data.detail}" class="edu-detail border border-gray-400 rounded p-1 text-[11px] col-span-3">
            <input type="text" placeholder="เกรด (GPA)" value="${data.gpa}" class="edu-gpa border border-gray-400 rounded p-1 text-[11px] text-center font-bold text-pink-600">
        </div>
    `;
    container.appendChild(row);
}

// 💼 2. ฟังก์ชันสร้างสล็อตกรอกข้อมูล "การทำงาน" ในมอดอล
window.addWorkRow = function(data = { year: '', title: '', detail: '' }) {
    const container = document.getElementById('modal-work-container');
    if (!container) return;
    const row = document.createElement('div');
    row.className = "work-row border border-black p-3 rounded-lg relative bg-white space-y-1 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    row.innerHTML = `
        <button type="button" onclick="this.parentElement.remove()" class="absolute top-1 right-2 text-red-500 hover:text-red-700 font-bold text-xs">✕ ลบ</button>
        <div class="grid grid-cols-3 gap-1 pt-2">
            <input type="text" placeholder="ปีทำงาน" value="${data.year}" class="work-year border border-gray-400 rounded p-1 text-[11px] font-bold">
            <input type="text" placeholder="ตำแหน่ง | บริษัท" value="${data.title}" class="work-title border border-gray-400 rounded p-1 text-[11px] col-span-2">
        </div>
        <input type="text" placeholder="รายละเอียดงานที่ทำ" value="${data.detail}" class="work-detail w-full border border-gray-400 rounded p-1 text-[11px]">
    `;
    container.appendChild(row);
}

// 🏢 3. ฟังก์ชันสร้างสล็อตกรอกข้อมูล "ฝึกงาน" ในมอดอล 
window.addTrainRow = function(data = { year: '', title: '', detail: '' }) {
    const container = document.getElementById('modal-train-container');
    if (!container) return;
    const row = document.createElement('div');
    row.className = "train-row border border-black p-3 rounded-lg relative bg-white space-y-1 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    row.innerHTML = `
        <button type="button" onclick="this.parentElement.remove()" class="absolute top-1 right-2 text-red-500 hover:text-red-700 font-bold text-xs">✕ ลบ</button>
        <div class="grid grid-cols-3 gap-1 pt-2">
            <input type="text" placeholder="ปีฝึกงาน" value="${data.year}" class="train-year border border-gray-400 rounded p-1 text-[11px] font-bold">
            <input type="text" placeholder="ตำแหน่ง | บริษัท" value="${data.title}" class="train-title border border-gray-400 rounded p-1 text-[11px] col-span-2">
        </div>
        <input type="text" placeholder="รายละเอียดงานที่ทำ" value="${data.detail}" class="train-detail w-full border border-gray-400 rounded p-1 text-[11px]">
    `;
    container.appendChild(row);
}

// ตอนกดปุ่มเปิดมอดอล -> โหลดข้อมูลเก่ามาสร้างเป็นปุ่มแถวกรอก
if (btnOpenResume) {
    btnOpenResume.addEventListener('click', () => {
        if(document.getElementById('input-resume-name')) document.getElementById('input-resume-name').value = document.getElementById('view-name')?.innerText || '';
        if(document.getElementById('input-resume-bio')) document.getElementById('input-resume-bio').value = document.getElementById('view-bio')?.innerText || '';
        if(document.getElementById('input-resume-birth')) document.getElementById('input-resume-birth').value = document.getElementById('view-birth')?.innerText || '';
        if(document.getElementById('input-resume-age')) document.getElementById('input-resume-age').value = document.getElementById('view-age')?.innerText || '';
        if(document.getElementById('input-resume-nation')) document.getElementById('input-resume-nation').value = document.getElementById('view-nation')?.innerText || '';
        if(document.getElementById('input-resume-phone')) document.getElementById('input-resume-phone').value = document.getElementById('view-phone')?.innerText || '';
        if(document.getElementById('input-resume-email')) document.getElementById('input-resume-email').value = document.getElementById('view-email')?.innerText || '';
        if(document.getElementById('input-resume-address')) document.getElementById('input-resume-address').value = document.getElementById('view-address')?.innerText || '';

        if(document.getElementById('modal-edu-container')) document.getElementById('modal-edu-container').innerHTML = '';
        if(document.getElementById('modal-work-container')) document.getElementById('modal-work-container').innerHTML = '';
        if(document.getElementById('modal-train-container')) document.getElementById('modal-train-container').innerHTML = '';

        const savedData = localStorage.getItem('myFlexibleResumeDB');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.education) parsed.education.forEach(edu => addEduRow(edu));
            if (parsed.work) parsed.work.forEach(w => addWorkRow(w));
            if (parsed.train) parsed.train.forEach(t => addTrainRow(t)); 
        } else {
            addEduRow();
            addWorkRow();
            addTrainRow(); 
        }

        const skillItems = document.querySelectorAll('#view-skills-container li');
        const skillArr = [];
        skillItems.forEach(li => skillArr.push(li.innerText));
        if(document.getElementById('input-resume-skills')) document.getElementById('input-resume-skills').value = skillArr.join('\n');

        openResumeModal();
    });
}

if (resumeForm) {
    resumeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const eduRows = document.querySelectorAll('.edu-row');
        const eduList = [];
        eduRows.forEach(row => {
            eduList.push({
                year: row.querySelector('.edu-year').value,
                title: row.querySelector('.edu-title').value,
                detail: row.querySelector('.edu-detail').value,
                gpa: row.querySelector('.edu-gpa').value
            });
        });

        const workRows = document.querySelectorAll('.work-row');
        const workList = [];
        workRows.forEach(row => {
            workList.push({
                year: row.querySelector('.work-year').value,
                title: row.querySelector('.work-title').value,
                detail: row.querySelector('.work-detail').value
            });
        });

        const trainRows = document.querySelectorAll('.train-row');
        const trainList = [];
        trainRows.forEach(row => {
            trainList.push({
                year: row.querySelector('.train-year').value,
                title: row.querySelector('.train-title').value,
                detail: row.querySelector('.train-detail').value
            });
        });

        const finalResumeData = {
            name: document.getElementById('input-resume-name')?.value || '',
            bio: document.getElementById('input-resume-bio')?.value || '',
            birth: document.getElementById('input-resume-birth')?.value || '',
            age: document.getElementById('input-resume-age')?.value || '',
            nation: document.getElementById('input-resume-nation')?.value || '',
            phone: document.getElementById('input-resume-phone')?.value || '',
            email: document.getElementById('input-resume-email')?.value || '',
            address: document.getElementById('input-resume-address')?.value || '',
            profileImage: document.getElementById('input-profile-image')?.value || '',

            education: eduList,
            work: workList,
            train: trainList, 
            skills: (document.getElementById('input-resume-skills')?.value || '')
                .split('\n')
                .map(s => s.trim())
                .filter(s => s !== '')
        };

        renderResumeToDOM(finalResumeData);
        localStorage.setItem('myFlexibleResumeDB', JSON.stringify(finalResumeData));
        closeResumeModal();
    });
}

function renderResumeToDOM(data) {
    if(document.getElementById('view-name')) document.getElementById('view-name').innerText = data.name || '';
    if(document.getElementById('view-bio')) document.getElementById('view-bio').innerText = data.bio || '';
    if(document.getElementById('view-birth')) document.getElementById('view-birth').innerText = data.birth || '';
    if(document.getElementById('view-age')) document.getElementById('view-age').innerText = data.age || '';
    if(document.getElementById('view-nation')) document.getElementById('view-nation').innerText = data.nation || '';
    if(document.getElementById('view-phone')) document.getElementById('view-phone').innerText = data.phone || '';
    if(document.getElementById('view-email')) document.getElementById('view-email').innerText = data.email || '';
    if(document.getElementById('view-address')) document.getElementById('view-address').innerText = data.address || '';

    const eduContainer = document.getElementById('view-edu-container');
    if (eduContainer && data.education) {
        eduContainer.innerHTML = '';
        data.education.forEach(edu => {
            eduContainer.innerHTML += `
                <div class="relative pl-6 border-l-2 border-black pb-2">
                    <div class="absolute -left-[7px] top-1 w-3 h-3 bg-pink-400 border border-black rounded-full"></div>
                    <span class="inline-block bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-md mb-1 shadow-[2px_2px_0px_0px_rgba(244,143,177,0.4)]">${edu.year}</span>
                    <h4 class="font-black text-sm text-gray-800">${edu.title}</h4>
                    <p class="text-xs text-gray-600 font-medium">${edu.detail}</p>
                    ${edu.gpa ? `<p class="text-xs font-black text-pink-500 mt-1 bg-pink-50 inline-block px-2 py-0.5 border border-pink-300 rounded">GPA : ${edu.gpa}</p>` : ''}
                </div>
            `;
        });
    }

    const workContainer = document.getElementById('view-work-container');
    if (workContainer && data.work) {
        workContainer.innerHTML = '';
        data.work.forEach(work => {
            workContainer.innerHTML += `
                <div class="relative pl-6 border-l-2 border-black pb-2">
                    <div class="absolute -left-[7px] top-1 w-3 h-3 bg-yellow-400 border border-black rounded-full"></div>
                    <span class="inline-block bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-md mb-1 shadow-[2px_2px_0px_0px_rgba(253,216,53,0.4)]">${work.year}</span>
                    <h4 class="font-black text-sm text-gray-800">${work.title}</h4>
                    <p class="text-xs text-gray-600 font-medium">${work.detail}</p>
                </div>
            `;
        });
    }

    const trainContainer = document.getElementById('view-train-container');
    if (trainContainer && data.train) { 
        trainContainer.innerHTML = '';
        data.train.forEach(train => { 
            trainContainer.innerHTML += `
                <div class="relative pl-6 border-l-2 border-black pb-2">
                    <div class="absolute -left-[7px] top-1 w-3 h-3 bg-purple-400 border border-black rounded-full"></div>
                    <span class="inline-block bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-md mb-1 shadow-[2px_2px_0px_0px_rgba(168,85,247,0.4)]">${train.year}</span>
                    <h4 class="font-black text-sm text-gray-800">${train.title}</h4>
                    <p class="text-xs text-gray-600 font-medium">${train.detail}</p>
                </div>
            `;
        });
    }

    const skillsContainer = document.getElementById('view-skills-container');
    if (skillsContainer && data.skills) {
        skillsContainer.innerHTML = '';
        data.skills.forEach(skill => {
            const li = document.createElement('li');
            li.innerText = skill;
            skillsContainer.appendChild(li);
        });
    }
}

function loadSavedResume() {
    const savedData = localStorage.getItem('myFlexibleResumeDB');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        renderResumeToDOM(parsedData);
    }
}

function syncProfileImage() {
    const heroImg = document.getElementById('hero-profile-img');
    const resumeImg = document.getElementById('resume-profile-img');

    if (heroImg && resumeImg) {
        resumeImg.src = heroImg.src;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadSavedResume();
    loadSavedProjects();
    syncProfileImage();
});