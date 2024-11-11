// تأكد من تعريف المتغير مرة واحدة فقط
let orphans = [];

function loadExcelData() {
    const url = 'orphans.xlsx';
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // استخدم اسم الورقة الأولى
            const sheet = workbook.Sheets[sheetName];
            orphans = XLSX.utils.sheet_to_json(sheet);
            console.log(orphans); // تحقق من البيانات المحملة في وحدة التحكم
        })
        .catch(error => console.error('Error loading Excel file:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    // تأكد من وجود العنصر في DOM قبل إضافة مستمع الحدث
    const loginForm = document.getElementById('login');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            console.log('Username:', username);
            console.log('Password:', password);
            
            // بيانات الاعتماد الصحيحة (يمكنك تغييرها أو جلبها من قاعدة بيانات)
            const validUsername = 'admin';
            const validPassword = 'admin';
            
            if (username === validUsername && password === validPassword) {
                console.log('Login successful');
                errorMessage.textContent = ''; // مسح رسالة الخطأ
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('content').style.display = 'block';
            } else {
                console.log('Login failed');
                errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
            }
        });
    } else {
        console.error('Element with id "login" not found.');
    }

    loadExcelData();

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            filterResults();
        });
    } else {
        console.error('Element with id "searchForm" not found.');
    }
});

function filterResults() {
    const searchInput1 = document.getElementById('searchInput1').value.toLowerCase();
    const searchInput2 = document.getElementById('searchInput2').value.toLowerCase();
    const searchInput3 = document.getElementById('searchInput3').value.toLowerCase();
    const searchInput4 = document.getElementById('searchInput4').value.toLowerCase();
    const resultsTableBody = document.querySelector('#resultsTable tbody');
    resultsTableBody.innerHTML = '';

    // التحقق من أن هناك على الأقل قيمتان مدخلتان
    const inputs = [searchInput1, searchInput2, searchInput3, searchInput4];
    const filledInputs = inputs.filter(input => input);

    if (filledInputs.length < 2) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8">يرجى إدخال قيمتين على الأقل للبحث.</td>`;
        resultsTableBody.appendChild(row);
        return;
    }

    const filteredOrphans = orphans.filter(orphan => {
        return (searchInput1 === '' || (orphan['اسم اليتيم'] && orphan['اسم اليتيم'].toLowerCase().includes(searchInput1))) &&
               (searchInput2 === '' || (orphan['اسم والد اليتيم'] && orphan['اسم والد اليتيم'].toLowerCase().includes(searchInput2))) &&
               (searchInput3 === '' || (orphan['اسم جد اليتيم'] && orphan['اسم جد اليتيم'].toLowerCase().includes(searchInput3))) &&
               (searchInput4 === '' || (orphan['كنية اليتيم'] && orphan['كنية اليتيم'].toLowerCase().includes(searchInput4)));
    });

    filteredOrphans.forEach(orphan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${orphan['اسم اليتيم'] || ''}</td>
            <td>${orphan['اسم والد اليتيم'] || ''}</td>
            <td>${orphan['اسم جد اليتيم'] || ''}</td>
            <td>${orphan['كنية اليتيم'] || ''}</td>
            <td>${orphan['اسم الأم'] || ''}</td>
            <td>${orphan['اسم أب الأم'] || ''}</td>
            <td>${orphan['كنية الأم'] || ''}</td>
            <td>${orphan['الجهة الكافلة'] || ''}</td> <!-- إضافة عمود الجهة الكافلة -->
        `;
        resultsTableBody.appendChild(row);
    });

    if (filteredOrphans.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8">لم يتم العثور على نتائج مطابقة.</td>`;
        resultsTableBody.appendChild(row);
    }
}
