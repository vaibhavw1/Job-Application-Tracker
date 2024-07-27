const addProfileBtn = document.getElementById('add-profile-btn');
const profileDropdown = document.querySelector('.dropdown-container');
const profileDropdownButton = document.querySelector('#profileDropdown');
const profileList = document.getElementById('profileList');
const applyBtn = document.getElementById('apply-btn');
const addCompanyBtn = document.getElementById('company-btn');
const applicationForm = document.querySelector('#applicationForm');
const companyForm = document.querySelector('#companyForm');
const applicationList = document.getElementById('applicationList');
const companyNameSelect = applicationForm.querySelector('#companyName');
const searchInput = document.getElementById('searchInput');
const showChartBtn = document.getElementById('show-chart-btn');

const token = localStorage.getItem('token');
const profile = localStorage.getItem('selectedProfile');
const profileId = localStorage.getItem('selectedProfileId');

const host = 'localhost';
const port = '3000';

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        alert('No token found in localStorage');
        return;
    }

    if (profile) {
        profileDropdownButton.textContent = profile;
    }
    applicationForm.style.display = 'none';
    addProfileBtn.addEventListener('click', fetchProfiles);
    await fetchProfiles();
});

companyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const companyName = event.target.companyName.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const companySize = event.target.companySize.value;
    const industry = event.target.industry.value;
    const notes = event.target.notes.value;

    const companyData = {
        name: companyName,
        email: email,
        phone: phone,
        companySize: companySize,
        industry: industry,
        notes: notes,
        profileId: profileId
    }

    try {
        const created = await axios.post(`http://${host}:${port}/company/add-company`, companyData, {
            headers: {
                'Authorization': `${token}`
            }
        });
        await displayCompanies(created.data.companies);
        companyForm.reset();

    } catch (error) {
        console.log(error);
    }

})


applicationForm.addEventListener('submit', async (event) => {
    event.preventDefault();


    const companyNameInput = document.getElementById('companyName');
    const dateInput = document.getElementById('date');
    const notesInput = document.getElementById('notes');
    const resumeInput = document.getElementById('resumeLink');
    const applicationStatusInput = document.getElementById('applicationStatus')


    const formData = new FormData();
    formData.append('companyName', companyNameInput.value);
    formData.append('date', dateInput.value);
    formData.append('file', resumeInput.files[0]);
    formData.append('notes', notesInput.value);
    formData.append('status', applicationStatusInput.value);
    formData.append('profileId', profileId);

    try {

        await axios.post(`http://${host}:${port}/application/apply`, formData, {
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        // applicationForm.reset();
        await displayApplications();


    } catch (error) {
        console.log(error);
    }



})




addProfileBtn.addEventListener('click', async () => {
    window.location.href = '../profile/profile.html'
});

applyBtn.addEventListener('click', async () => {
    companyForm.style.display = 'none';

    if (applicationForm.style.display === 'none') {
        applicationForm.style.display = 'block';
        setButton(applyBtn);
        unsetButton(addCompanyBtn);
        loadCompanies();
        applicationList.innerHTML = '';
        await displayApplications();
    } else {
        applicationForm.style.display = 'none';
    }

})

addCompanyBtn.addEventListener('click', async () => {
    applicationForm.style.display = 'none';
    if (companyForm.style.display === 'none') {
        companyForm.style.display = 'block';
        setButton(addCompanyBtn);
        unsetButton(applyBtn);
        applicationList.innerHTML = '';
        await displayCompanies();
    } else {
        companyForm.style.display = 'none';
    }

})




async function fetchProfiles() {
    try {
        const response = await axios.get(`http://${host}:${port}/profile/get-profiles`, {
            headers: {
                'Authorization': `${token}`
            }
        });

        if (response.status === 200) {
            const profiles = response.data.profiles;
            if (profiles.length > 0) {
                displayProfilesDropdown(profiles);
            } else {
                profileDropdown.style.display = 'none';
            }
        } else {
            throw new Error('Failed to fetch profiles');
        }

    } catch (error) {
        console.log(error);
    }
}

function displayProfilesDropdown(profiles) {
    profileDropdown.style.display = 'block';

    profileList.innerHTML = ''; // Clear previous profiles if any

    profiles.forEach(profile => {
        const profileItem = document.createElement('li');
        profileItem.innerHTML = `<a class="dropdown-item" href="#">${profile.name}</a>`;
        profileItem.addEventListener('click', () => {
            setProfile(profile.name, profile.id);
        });
        profileList.appendChild(profileItem);
    });
}

function setProfile(profileName, profileId) {
    profileDropdownButton.textContent = profileName;
    localStorage.setItem('selectedProfile', profileName);
    localStorage.setItem('selectedProfileId', profileId);
}




function setButton(btn) {
    if (btn.classList.contains('btn-secondary')) {
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
    }
}

function unsetButton(btn) {
    if (btn.classList.contains('btn-primary')) {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');

    }
}

async function displayApplications() {

    applicationList.innerHTML = '';

    const created = await axios.post(`http://${host}:${port}/application/get-applications`, {
        profileId: profileId
    },
        {
            headers: {
                'Authorization': `${token}`
            }
        });


    const companyNameInput = document.getElementById('companyName');
    const dateInput = document.getElementById('date');
    const notesInput = document.getElementById('notes');
    const resumeInput = document.getElementById('resumeLink');
    const applicationStatusInput = document.getElementById('applicationStatus')




    const applications = created.data.applications;

    for (item of applications) {
        const name = item.companyName;
        const date = item.date;
        const status = item.status;
        const notes = item.notes;

        const div = document.createElement('div');


        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        const itemText = document.createElement('p');
        itemText.textContent = ` ${name} -  ${notes}`;

        const buttonGroup = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm me-2';
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Delete';

        const updateStatusButton = document.createElement('button');
        updateStatusButton.className = 'btn btn-info btn-sm me-2 mt-2 mb-2';
        updateStatusButton.textContent = 'Update Status';

        const statusDropdown = document.createElement('select');
        statusDropdown.className = 'form-select me-2';
        const statuses = ["pending", "accepted", "rejected", "interviewing", "offer"];
        statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            if (status === item.status) {
                option.selected = true;
            }
            statusDropdown.appendChild(option);
        });

        const reminderDateInput = document.createElement('input');
        reminderDateInput.className = 'form-control me-2 mb-2';
        reminderDateInput.type = 'datetime-local';

        const setReminderButton = document.createElement('button');
        setReminderButton.className = 'btn btn-secondary btn-sm me-2';
        setReminderButton.textContent = 'Set Reminder';


        buttonGroup.appendChild(statusDropdown);
        buttonGroup.appendChild(updateStatusButton);
        buttonGroup.appendChild(reminderDateInput);
        buttonGroup.appendChild(setReminderButton);
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);
        listItem.appendChild(itemText);
        listItem.appendChild(buttonGroup);
        div.appendChild(listItem);

        applicationList.appendChild(div);



        editButton.addEventListener('click', async () => {

            companyNameInput.value = name;
            dateInput.value = date;
            notesInput.value = notes;
            applicationStatusInput.value = status;
            applicationForm.style.display = 'block';
            applicationList.removeChild(listItem);
        });

        deleteButton.addEventListener('click', async () => {
            await axios.delete(`http://${host}:${port}/application/delete?profile=${profileId}&applicationId=${item.id}`, { headers: { "Authorization": token } });
            applicationList.removeChild(listItem);
        });

        updateStatusButton.addEventListener('click', async () => {
            const newStatus = statusDropdown.value;
            await axios.post(`http://${host}:${port}/application/update-status`, {
                applicationId: item.id,
                status: newStatus
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            item.status = newStatus;
        });


        setReminderButton.addEventListener('click', async () => {
            const reminderDate = reminderDateInput.value;
            if (reminderDate) {
                await axios.post(`http://${host}:${port}/reminder/remind`, {
                    applicationId: item.id,
                    date: reminderDate,

                }, {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                alert('Reminder set for ' + reminderDate);
            } else {
                alert('Please select a date for the reminder.');
            }
        });


    }

}


async function displayCompanies() {

    applicationList.innerHTML = '';

    const created = await axios.get(`http://${host}:${port}/company/get-companies/?profile=${profileId}`, {
        headers: {
            'Authorization': `${token}`
        }
    });


    const companyInput = companyForm.querySelector('#companyName');
    const emailInput = companyForm.querySelector('#email');
    const phoneInput = companyForm.querySelector('#phone');
    const companySizeInput = companyForm.querySelector('#companySize');
    const industryInput = companyForm.querySelector('#industry');
    const notesInput = companyForm.querySelector('#notes');



    const companies = created.data.companies;

    for (item of companies) {
        const name = item.name;
        const email = item.email;
        const phone = item.phone;
        const companySize = item.companySize;
        const industry = item.industry;
        const notes = item.notes;

        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        const itemText = document.createElement('p');
        itemText.textContent = `${name}`;

        const buttonGroup = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm me-2';
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Delete';

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);
        listItem.appendChild(itemText);
        listItem.appendChild(buttonGroup);

        applicationList.appendChild(listItem);



        editButton.addEventListener('click', async () => {

            companyForm.style.display = 'block';
            companyInput.value = name;
            emailInput.value = email;
            phoneInput.value = phone;
            companySizeInput.value = companySize;
            industryInput.value = industry;
            notesInput.value = notes;


            applicationList.removeChild(listItem);
        });

        deleteButton.addEventListener('click', async () => {
            await axios.delete(`http://${host}:${port}/company/delete?profile=${profileId}&name=${name}`, { headers: { "Authorization": token } });
            applicationList.removeChild(listItem);
        });


    }



}

async function loadCompanies() {

    try {

        const created = await axios.get(`http://${host}:${port}/company/get-companies/?profile=${profileId}`, {
            headers: {
                'Authorization': `${token}`
            }
        });

        const companies = created.data.companies;

        companyNameSelect.innerHTML = '<option value="" selected disabled>Select Company</option>';

        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company.name;
            option.textContent = company.name;
            companyNameSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching company sizes:', error);
        companySizeSelect.innerHTML = '<option value="" selected disabled>Error loading sizes</option>';
    }


}

searchInput.addEventListener('input', filterApplications);

function filterApplications() {
    const query = searchInput.value.toLowerCase();
    const applicationItems = applicationList.getElementsByTagName('div');

    Array.from(applicationItems).forEach((item) => {
        const text = item.querySelector('.list-group-item').querySelector('p').textContent.toLowerCase();
        

        if (text.includes(query) ) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

showChartBtn.addEventListener('click', async () => {
    clearScreens();
    await displayApplicationChart();
});

function clearScreens() {
    applicationForm.style.display = 'none';
    companyForm.style.display = 'none';
    applicationList.innerHTML = '';
}

async function displayApplicationChart() {
    try {
        const response = await axios.post(`http://${host}:${port}/application/get-applications`, {
            profileId: profileId
        }, {
            headers: {
                'Authorization': `${token}`
            }
        });

        const applications = response.data.applications;

        
        const statusCounts = {
            pending: 0,
            accepted: 0,
            rejected: 0,
            interviewing: 0,
            offer: 0
        };

        applications.forEach(app => {
            statusCounts[app.status]++;
        });

        
        const statusLabels = Object.keys(statusCounts);
        const statusData = Object.values(statusCounts);

        
        const chartContainer = document.createElement('div');
        chartContainer.innerHTML = '<canvas id="statusChart"></canvas>';
        applicationList.appendChild(chartContainer);

        
        const ctx = document.getElementById('statusChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: statusLabels,
                datasets: [{
                    label: 'Application Status',
                    data: statusData,
                    backgroundColor: [
                        '#007BFF',
                        '#28A745',
                        '#DC3545',
                        '#FFC107',
                        '#17A2B8'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(0) + ' applications';
                            }
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error fetching applications or creating chart:', error);
        alert('Failed to display application status chart');
    }
}
