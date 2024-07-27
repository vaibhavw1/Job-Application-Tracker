const addProfileBtn = document.getElementById('add-profile-btn');
const profileDropdown = document.querySelector('.dropdown');
const profileDropdownButton = document.querySelector('#profileDropdown');
const profileList = document.getElementById('allProfilesList');
const profileDropDownList = document.getElementById('profileList')
const profileForm = document.getElementById('profileForm');
const profileIdInput = document.getElementById('profileId');
const profileNameInput = document.getElementById('profileName');
const resumeLinkInput = document.getElementById('resumeLink');
const careerGoalsInput = document.getElementById('carrergoals');
const apiUrl = 'http://localhost:3000/profile';
const token = localStorage.getItem('token');
const selectedProfile = localStorage.getItem('selectedProfile');
const profileId = localStorage.getItem('selectedProfileId');

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        alert('No token found in localStorage');
        return;
    }

    if (selectedProfile) {
        profileDropdownButton.textContent = selectedProfile;
    }

    addProfileBtn.addEventListener('click', () => {
        if(profileForm.style.display === 'none'){
            profileForm.style.display='block';
        }else{
            profileForm.style.display='none';
        }


        
        profileIdInput.value = '';
        profileNameInput.value = '';
        careerGoalsInput.value = '';
        resumeLinkInput.value = '';
    });

    await fetchProfiles();
});

function displayProfiles(profiles) {
    profileList.innerHTML = '';

    profiles.forEach(profile => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

        const itemText = document.createElement('p');
        itemText.textContent = `Name: ${profile.name}  - Resume Link : ${profile.resumeLink}`;

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

        profileList.appendChild(listItem);

        editButton.addEventListener('click', () => {
            profileForm.style.display = 'block';
            profileNameInput.value = profile.name;
            careerGoalsInput.value = profile.carrerGoals;
            profileIdInput.value = profile.id;
        });

        deleteButton.addEventListener('click', async () => {
            try {
                await axios.delete(`${apiUrl}/delete-profile/?name=${profile.name}`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                profileList.removeChild(listItem);
            } catch (error) {
                console.log(error);
            }
        });
    });
}





async function fetchProfiles() {
    try {
        const response = await axios.get(`${apiUrl}/get-profiles`, {
            headers: {
                'Authorization': `${token}`
            }
        });

        if (response.status === 200) {
            const profiles = response.data.profiles;
            displayProfilesDropdown(profiles);
            displayProfiles(profiles);
        } else {
            throw new Error('Failed to fetch profiles');
        }
    } catch (error) {
        console.log(error);
    }
}

function displayProfilesDropdown(profiles) {
    profileDropDownList.innerHTML = '';

    profiles.forEach(profile => {
        const profileItem = document.createElement('li');
        profileItem.innerHTML = `<a class="dropdown-item" href="#">${profile.name}</a>`;
        profileItem.addEventListener('click', () => {
            setProfile(profile);
        });
        profileDropDownList.appendChild(profileItem);
    });
}

function setProfile(profile) {
    
    profileDropdownButton.textContent = profile.name;
    profileNameInput.value = profile.name;
    localStorage.setItem('selectedProfile', profile.name);
    localStorage.setItem('selectedProfileId',profile.id);

    
}

profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name',profileNameInput.value);
    formData.append('carrergoals', careerGoalsInput.value);
    formData.append('resumeLink', resumeLinkInput.files[0]);

    const profileId = profileIdInput.value;
    const profileData = {
        name: profileNameInput.value,
        resumeLink: resumeLinkInput.value,
        careerGoals: careerGoalsInput.value
    };

    try {

        const profile = await axios.post(`${apiUrl}/add-profile`, formData, {
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        setProfile(profile.data.profile);
        profileForm.reset();
        profileForm.style.display = 'none';
        await fetchProfiles();
    } catch (error) {
        console.log(error);
    }
});
