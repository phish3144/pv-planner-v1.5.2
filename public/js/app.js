// Global variables
let currentView = 'week'; // Default view
let currentDate = new Date();
let appointments = [];
let staff = [];
let teams = [];
let customers = [];
let isLoggedIn = false;

// DOM Elements
const calendarContainer = document.getElementById('calendar-container');
const currentDateElement = document.getElementById('current-date');
const dayViewBtn = document.getElementById('day-view-btn');
const weekViewBtn = document.getElementById('week-view-btn');
const monthViewBtn = document.getElementById('month-view-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const prevDayBtn = document.getElementById('prev-day-btn');
const nextDayBtn = document.getElementById('next-day-btn');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const todayBtn = document.getElementById('today-btn');
const loginBtn = document.getElementById('login-btn');
const staffBtn = document.getElementById('staff-btn');
const newAppointmentBtn = document.getElementById('new-appointment-btn');
const modal = document.getElementById('modal');
const loginModal = document.getElementById('login-modal');
const staffModal = document.getElementById('staff-modal');
const appointmentForm = document.getElementById('appointment-form');
const loginForm = document.getElementById('login-form');
const staffForm = document.getElementById('staff-form');
const teamForm = document.getElementById('team-form');
const customerForm = document.getElementById('customer-form');
const closeButtons = document.querySelectorAll('.close');
const cancelBtn = document.querySelector('.cancel-btn');
const cancelStaffBtn = document.querySelector('.cancel-staff-btn');
const cancelTeamBtn = document.querySelector('.cancel-team-btn');
const cancelCustomerBtn = document.querySelector('.cancel-customer-btn');
const tabButtons = document.querySelectorAll('.tab-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Remove kiosk mode button if it exists
    setTimeout(() => {
        const kioskButton = document.getElementById('kiosk-mode-btn');
        if (kioskButton) {
            kioskButton.remove();
            console.log("Kiosk mode button removed");
        }
    }, 100);
    
    // Load data
    loadData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial calendar view
    updateCalendarView();
    
    // Update UI based on login status
    updateUIForLoginStatus();
});

// Load data from the server
function loadData() {
    // In a real application, this would be an API call
    // For now, we'll use mock data
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            appointments = data.appointments || [];
            staff = data.staff || [];
            teams = data.teams || [];
            customers = data.customers || [];
            renderCalendar();
            renderStaffList();
            renderTeamsList();
            renderCustomersList();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            // Load mock data if API fails
            loadMockData();
        });
}

// Load mock data for development
function loadMockData() {
    // Mock staff data
    staff = [
        { id: '1', name: 'Max Mustermann', position: 'Monteur', email: 'max@example.com', phone: '0123456789', color: '#4285F4', team_ids: [] },
        { id: '2', name: 'Anna Schmidt', position: 'Monteur', email: 'anna@example.com', phone: '0123456788', color: '#EA4335', team_ids: [] },
        { id: '3', name: 'Thomas Weber', position: 'Monteur', email: 'thomas@example.com', phone: '0123456787', color: '#FBBC05', team_ids: [] }
    ];
    
    // Mock teams data
    teams = [
        { id: '1', name: 'Team Nord', color: '#34A853', member_ids: ['1', '2'] },
        { id: '2', name: 'Team Süd', color: '#9C27B0', member_ids: ['3'] }
    ];
    
    // Update staff with team assignments
    staff[0].team_ids = ['1'];
    staff[1].team_ids = ['1'];
    staff[2].team_ids = ['2'];
    
    // Mock customer data
    customers = [
        { id: '1', name: 'Müller GmbH', address: 'Hauptstraße 1, 10115 Berlin', contact: 'Herr Müller', email: 'info@mueller-gmbh.de', phone: '030-12345678' },
        { id: '2', name: 'Schmidt & Co.', address: 'Industrieweg 42, 70565 Stuttgart', contact: 'Frau Schmidt', email: 'kontakt@schmidt-co.de', phone: '0711-87654321' }
    ];
    
    // Mock appointment data
    appointments = [
        {
            id: '1',
            title: 'PV-Anlage Installation',
            location: 'Musterstraße 1, 12345 Musterstadt',
            description: 'Installation einer 10kW Anlage',
            start: '2025-04-24T08:00:00',
            end: '2025-04-24T16:00:00',
            staff_ids: ['1', '2'],
            team_ids: ['1'],
            status: 'geplant'
        },
        {
            id: '2',
            title: 'Wartung',
            location: 'Beispielweg 42, 54321 Beispielstadt',
            description: 'Jährliche Wartung der PV-Anlage',
            start: '2025-04-25T09:00:00',
            end: '2025-04-25T12:00:00',
            staff_ids: ['3'],
            team_ids: ['2'],
            status: 'geplant'
        }
    ];
    
    renderCalendar();
    renderStaffList();
    renderTeamsList();
    renderCustomersList();
}

// Set up event listeners
function setupEventListeners() {
    // View buttons
    dayViewBtn.addEventListener('click', () => changeView('day'));
    weekViewBtn.addEventListener('click', () => changeView('week'));
    monthViewBtn.addEventListener('click', () => changeView('month'));
    
    // Navigation buttons
    prevBtn.addEventListener('click', navigatePrevious);
    nextBtn.addEventListener('click', navigateNext);
    todayBtn.addEventListener('click', navigateToday);
    
    // Day navigation buttons
    prevDayBtn.addEventListener('click', navigatePreviousDay);
    nextDayBtn.addEventListener('click', navigateNextDay);
    
    // Week navigation buttons
    prevWeekBtn.addEventListener('click', navigatePreviousWeek);
    nextWeekBtn.addEventListener('click', navigateNextWeek);
    
    // New appointment button
    if (newAppointmentBtn) {
        newAppointmentBtn.addEventListener('click', () => {
            openAppointmentModal(new Date());
        });
    }
    
    // Staff button
    if (staffBtn) {
        staffBtn.addEventListener('click', openStaffModal);
    }
    
    // Login button
    loginBtn.addEventListener('click', () => {
        if (isLoggedIn) {
            logout();
        } else {
            openLoginModal();
        }
    });
    
    // Close buttons for modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'none';
            loginModal.style.display = 'none';
            if (staffModal) staffModal.style.display = 'none';
        });
    });
    
    // Cancel buttons
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (cancelStaffBtn) {
        cancelStaffBtn.addEventListener('click', () => {
            document.getElementById('staff-form-container').style.display = 'none';
        });
    }
    
    if (cancelTeamBtn) {
        cancelTeamBtn.addEventListener('click', () => {
            document.getElementById('team-form-container').style.display = 'none';
        });
    }
    
    if (cancelCustomerBtn) {
        cancelCustomerBtn.addEventListener('click', () => {
            document.getElementById('customer-form-container').style.display = 'none';
        });
    }
    
    // Tab buttons
    if (tabButtons) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show selected tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Add staff button
    const addStaffBtn = document.getElementById('add-staff-btn');
    if (addStaffBtn) {
        addStaffBtn.addEventListener('click', () => {
            openStaffForm();
        });
    }
    
    // Add team button
    const addTeamBtn = document.getElementById('add-team-btn');
    if (addTeamBtn) {
        addTeamBtn.addEventListener('click', () => {
            openTeamForm();
        });
    }
    
    // Add customer button
    const addCustomerBtn = document.getElementById('add-customer-btn');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', () => {
            openCustomerForm();
        });
    }
    
    // Form submissions
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (staffForm) {
        staffForm.addEventListener('submit', handleStaffSubmit);
    }
    
    if (teamForm) {
        teamForm.addEventListener('submit', handleTeamSubmit);
    }
    
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerSubmit);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (staffModal && event.target === staffModal) {
            staffModal.style.display = 'none';
        }
    });
}

// Change calendar view
function changeView(view) {
    currentView = view;
    
    // Update active button
    dayViewBtn.classList.remove('active');
    weekViewBtn.classList.remove('active');
    monthViewBtn.classList.remove('active');
    
    switch (view) {
        case 'day':
            dayViewBtn.classList.add('active');
            break;
        case 'week':
            weekViewBtn.classList.add('active');
            break;
        case 'month':
            monthViewBtn.classList.add('active');
            break;
    }
    
    updateCalendarView();
}

// Update calendar view based on current settings
function updateCalendarView() {
    // Update date display
    updateDateDisplay();
    
    // Render calendar
    renderCalendar();
}

// Update the displayed date
function updateDateDisplay() {
    const options = { year: 'numeric', month: 'long' };
    
    if (currentView === 'day') {
        options.day = 'numeric';
    }
    
    currentDateElement.textContent = currentDate.toLocaleDateString('de-DE', options);
}

// Navigate to previous period
function navigatePrevious() {
    switch (currentView) {
        case 'day':
            currentDate.setDate(currentDate.getDate() - 1);
            break;
        case 'week':
            currentDate.setDate(currentDate.getDate() - 7);
            break;
        case 'month':
            currentDate.setMonth(currentDate.getMonth() - 1);
            break;
    }
    
    updateCalendarView();
}

// Navigate to next period
function navigateNext() {
    switch (currentView) {
        case 'day':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
        case 'week':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
        case 'month':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
    }
    
    updateCalendarView();
}

// Navigate to previous day
function navigatePreviousDay() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateCalendarView();
}

// Navigate to next day
function navigateNextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateCalendarView();
}

// Navigate to previous week
function navigatePreviousWeek() {
    currentDate.setDate(currentDate.getDate() - 7);
    updateCalendarView();
}

// Navigate to next week
function navigateNextWeek() {
    currentDate.setDate(currentDate.getDate() + 7);
    updateCalendarView();
}

// Navigate to today
function navigateToday() {
    currentDate = new Date();
    updateCalendarView();
}

// Render the calendar based on current view
function renderCalendar() {
    switch (currentView) {
        case 'day':
            renderDayView();
            break;
        case 'week':
            renderWeekView();
            break;
        case 'month':
            renderMonthView();
            break;
    }
}

// Render day view
function renderDayView() {
    // Clear container
    calendarContainer.innerHTML = '';
    
    // Create day view structure
    const dayView = document.createElement('div');
    dayView.className = 'day-view';
    
    // Format date for display
    const dateStr = currentDate.toLocaleDateString('de-DE', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Create header
    const header = document.createElement('div');
    header.className = 'day-header';
    header.textContent = dateStr;
    dayView.appendChild(header);
    
    // Create time slots (from 6:00 to 19:00)
    const timeContainer = document.createElement('div');
    timeContainer.className = 'time-container';
    
    for (let hour = 6; hour < 20; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'calendar-time-slot';
        timeSlot.dataset.hour = hour;
        
        const timeLabel = document.createElement('div');
        timeLabel.className = 'calendar-time';
        timeLabel.textContent = `${hour}:00`;
        timeSlot.appendChild(timeLabel);
        
        // Add click event for planners to add appointments
        if (isLoggedIn) {
            timeSlot.addEventListener('click', () => {
                openAppointmentModal(new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                    hour
                ));
            });
        }
        
        timeContainer.appendChild(timeSlot);
    }
    
    dayView.appendChild(timeContainer);
    
    // Add appointments for this day
    const dayStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    );
    
    const dayEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23, 59, 59
    );
    
    const dayAppointments = appointments.filter(appointment => {
        const startDate = new Date(appointment.start);
        return startDate >= dayStart && startDate <= dayEnd;
    });
    
    dayAppointments.forEach(appointment => {
        const appointmentEl = createAppointmentElement(appointment);
        const startDate = new Date(appointment.start);
        const hour = startDate.getHours();
        
        // Find the appropriate time slot
        const timeSlot = timeContainer.querySelector(`[data-hour="${hour}"]`);
        if (timeSlot) {
            timeSlot.appendChild(appointmentEl);
        }
    });
    
    calendarContainer.appendChild(dayView);
}

// Render week view
function renderWeekView() {
    // Clear container
    calendarContainer.innerHTML = '';
    
    // Get the first day of the week (Monday)
    const firstDayOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    firstDayOfWeek.setDate(diff);
    
    // Create week view table
    const table = document.createElement('table');
    table.className = 'calendar-week-view';
    
    // Create header row with days
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = 'calendar-header';
    
    // Add time column header
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Zeit';
    headerRow.appendChild(timeHeader);
    
    // Add day columns
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(firstDayOfWeek);
        dayDate.setDate(firstDayOfWeek.getDate() + i);
        
        const dayHeader = document.createElement('th');
        dayHeader.textContent = dayDate.toLocaleDateString('de-DE', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'numeric' 
        });
        
        // Highlight today
        if (isToday(dayDate)) {
            dayHeader.classList.add('today');
        }
        
        headerRow.appendChild(dayHeader);
    }
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body with time slots
    const tbody = document.createElement('tbody');
    
    // Create rows for each hour (from 6:00 to 19:00)
    for (let hour = 6; hour < 20; hour++) {
        const row = document.createElement('tr');
        
        // Add time cell
        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        timeCell.textContent = `${hour}:00`;
        row.appendChild(timeCell);
        
        // Add day cells
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(firstDayOfWeek);
            dayDate.setDate(firstDayOfWeek.getDate() + i);
            dayDate.setHours(hour, 0, 0, 0);
            
            const cell = document.createElement('td');
            cell.className = 'day-cell';
            cell.dataset.date = dayDate.toISOString();
            
            // Add click event for planners to add appointments
            if (isLoggedIn) {
                cell.addEventListener('click', () => {
                    openAppointmentModal(dayDate);
                });
            }
            
            // Add appointments for this time slot
            const cellStart = new Date(dayDate);
            const cellEnd = new Date(dayDate);
            cellEnd.setHours(hour + 1, 0, 0, 0);
            
            const cellAppointments = appointments.filter(appointment => {
                const startDate = new Date(appointment.start);
                return startDate >= cellStart && startDate < cellEnd;
            });
            
            cellAppointments.forEach(appointment => {
                const appointmentEl = createAppointmentElement(appointment);
                cell.appendChild(appointmentEl);
            });
            
            row.appendChild(cell);
        }
        
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    calendarContainer.appendChild(table);
}

// Render month view
function renderMonthView() {
    // Clear container
    calendarContainer.innerHTML = '';
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    
    // Get the last day of the month
    const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    );
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Adjust for Monday as first day of week
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Create month view table
    const table = document.createElement('table');
    table.className = 'calendar-month-view';
    
    // Create header row with weekday names
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    weekdays.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body with weeks
    const tbody = document.createElement('tbody');
    
    // Calculate the number of rows needed
    const daysInMonth = lastDayOfMonth.getDate();
    const totalDays = firstDayOfWeek + daysInMonth;
    const totalRows = Math.ceil(totalDays / 7);
    
    let date = 1;
    
    // Create rows for each week
    for (let i = 0; i < totalRows; i++) {
        const row = document.createElement('tr');
        
        // Create cells for each day
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            
            // Add date number if it's within the current month
            if ((i === 0 && j < firstDayOfWeek) || date > daysInMonth) {
                cell.className = 'empty-cell';
            } else {
                cell.className = 'month-day-cell';
                
                // Create date container
                const dateContainer = document.createElement('div');
                dateContainer.className = 'date-container';
                dateContainer.textContent = date;
                
                // Highlight today
                const currentMonthDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    date
                );
                
                if (isToday(currentMonthDate)) {
                    dateContainer.classList.add('today');
                }
                
                cell.appendChild(dateContainer);
                
                // Create appointments container
                const appointmentsContainer = document.createElement('div');
                appointmentsContainer.className = 'month-appointments';
                
                // Add appointments for this day
                const dayStart = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    date
                );
                
                const dayEnd = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    date,
                    23, 59, 59
                );
                
                const dayAppointments = appointments.filter(appointment => {
                    const startDate = new Date(appointment.start);
                    return startDate >= dayStart && startDate <= dayEnd;
                });
                
                dayAppointments.forEach(appointment => {
                    const appointmentEl = document.createElement('div');
                    appointmentEl.className = 'month-appointment';
                    appointmentEl.textContent = appointment.title;
                    
                    // Add click event to view/edit appointment
                    appointmentEl.addEventListener('click', (event) => {
                        event.stopPropagation();
                        if (isLoggedIn) {
                            openAppointmentModal(new Date(appointment.start), appointment);
                        }
                    });
                    
                    appointmentsContainer.appendChild(appointmentEl);
                });
                
                cell.appendChild(appointmentsContainer);
                
                // Add click event for planners to add appointments
                if (isLoggedIn) {
                    cell.addEventListener('click', () => {
                        openAppointmentModal(new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            date,
                            9 // Default to 9:00 AM
                        ));
                    });
                }
                
                date++;
            }
            
            row.appendChild(cell);
        }
        
        tbody.appendChild(row);
        
        // Stop if we've displayed all days
        if (date > daysInMonth) {
            break;
        }
    }
    
    table.appendChild(tbody);
    calendarContainer.appendChild(table);
}

// Create an appointment element
function createAppointmentElement(appointment) {
    const appointmentEl = document.createElement('div');
    appointmentEl.className = 'appointment';
    appointmentEl.dataset.id = appointment.id;
    
    // Format times
    const startDate = new Date(appointment.start);
    const endDate = new Date(appointment.end);
    const timeStr = `${formatTime(startDate)} - ${formatTime(endDate)}`;
    
    // Create title
    const title = document.createElement('div');
    title.className = 'appointment-title';
    title.textContent = appointment.title;
    appointmentEl.appendChild(title);
    
    // Create time
    const time = document.createElement('div');
    time.className = 'appointment-time';
    time.textContent = timeStr;
    appointmentEl.appendChild(time);
    
    // Create location
    const location = document.createElement('div');
    location.className = 'appointment-location';
    location.textContent = appointment.location;
    appointmentEl.appendChild(location);
    
    // Add staff indicators and names if available
    if (appointment.staff_ids && appointment.staff_ids.length > 0) {
        const staffContainer = document.createElement('div');
        staffContainer.className = 'appointment-staff';
        
        // Create staff label
        const staffLabel = document.createElement('div');
        staffLabel.className = 'assignment-label';
        staffLabel.textContent = 'Monteure:';
        staffContainer.appendChild(staffLabel);
        
        // Create staff list
        const staffList = document.createElement('div');
        staffList.className = 'assignment-list';
        
        appointment.staff_ids.forEach(staffId => {
            const staffMember = staff.find(s => s.id === staffId);
            if (staffMember) {
                const staffItem = document.createElement('div');
                staffItem.className = 'assignment-item';
                
                const staffIndicator = document.createElement('span');
                staffIndicator.className = 'staff-indicator';
                staffIndicator.style.backgroundColor = staffMember.color;
                staffItem.appendChild(staffIndicator);
                
                const staffName = document.createElement('span');
                staffName.className = 'staff-name';
                staffName.textContent = staffMember.name;
                staffItem.appendChild(staffName);
                
                staffList.appendChild(staffItem);
            }
        });
        
        staffContainer.appendChild(staffList);
        appointmentEl.appendChild(staffContainer);
    }
    
    // Add team indicators and names if available
    if (appointment.team_ids && appointment.team_ids.length > 0) {
        const teamContainer = document.createElement('div');
        teamContainer.className = 'appointment-teams';
        
        // Create team label
        const teamLabel = document.createElement('div');
        teamLabel.className = 'assignment-label';
        teamLabel.textContent = 'Teams:';
        teamContainer.appendChild(teamLabel);
        
        // Create team list
        const teamList = document.createElement('div');
        teamList.className = 'assignment-list';
        
        appointment.team_ids.forEach(teamId => {
            const team = teams.find(t => t.id === teamId);
            if (team) {
                const teamItem = document.createElement('div');
                teamItem.className = 'assignment-item';
                
                const teamIndicator = document.createElement('span');
                teamIndicator.className = 'team-indicator';
                teamIndicator.style.backgroundColor = team.color;
                teamItem.appendChild(teamIndicator);
                
                const teamName = document.createElement('span');
                teamName.className = 'team-name';
                teamName.textContent = team.name;
                teamItem.appendChild(teamName);
                
                teamList.appendChild(teamItem);
            }
        });
        
        teamContainer.appendChild(teamList);
        appointmentEl.appendChild(teamContainer);
    }
    
    // Add status indicator
    const statusClass = `status-${appointment.status}`;
    appointmentEl.classList.add(statusClass);
    
    // Add click event to view/edit appointment
    appointmentEl.addEventListener('click', (event) => {
        event.stopPropagation();
        if (isLoggedIn) {
            openAppointmentModal(startDate, appointment);
        }
    });
    
    return appointmentEl;
}

// Open appointment modal
function openAppointmentModal(date, appointment = null) {
    // Only allow planners to add/edit appointments
    if (!isLoggedIn) {
        return;
    }
    
    // Set modal title
    const modalTitle = document.getElementById('modal-title');
    modalTitle.textContent = appointment ? 'Termin bearbeiten' : 'Termin hinzufügen';
    
    // Get form elements
    const titleInput = document.getElementById('title');
    const locationInput = document.getElementById('location');
    const descriptionInput = document.getElementById('description');
    const startDateInput = document.getElementById('start-date');
    const startTimeInput = document.getElementById('start-time');
    const endDateInput = document.getElementById('end-date');
    const endTimeInput = document.getElementById('end-time');
    const statusSelect = document.getElementById('status');
    
    // Clear previous values
    titleInput.value = '';
    locationInput.value = '';
    descriptionInput.value = '';
    
    // Format date for inputs
    const dateStr = formatDateForInput(date);
    const timeStr = formatTimeForInput(date);
    
    // Set default values
    startDateInput.value = dateStr;
    startTimeInput.value = timeStr;
    
    // Default end time is 1 hour later
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 1);
    endDateInput.value = formatDateForInput(endDate);
    endTimeInput.value = formatTimeForInput(endDate);
    
    // Set status to 'planned' by default
    statusSelect.value = 'geplant';
    
    // Populate staff selection
    const staffSelection = document.getElementById('staff-selection');
    staffSelection.innerHTML = '';
    
    staff.forEach(staffMember => {
        const staffCheckbox = document.createElement('div');
        staffCheckbox.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `staff-${staffMember.id}`;
        checkbox.name = `staff-${staffMember.id}`;
        checkbox.value = staffMember.id;
        
        const label = document.createElement('label');
        label.htmlFor = `staff-${staffMember.id}`;
        label.textContent = staffMember.name;
        
        // Add color indicator
        const colorIndicator = document.createElement('span');
        colorIndicator.className = 'color-indicator';
        colorIndicator.style.backgroundColor = staffMember.color;
        label.prepend(colorIndicator);
        
        staffCheckbox.appendChild(checkbox);
        staffCheckbox.appendChild(label);
        staffSelection.appendChild(staffCheckbox);
    });
    
    // Populate team selection
    const teamSelection = document.getElementById('team-selection');
    teamSelection.innerHTML = '';
    
    teams.forEach(team => {
        const teamCheckbox = document.createElement('div');
        teamCheckbox.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `team-${team.id}`;
        checkbox.name = `team-${team.id}`;
        checkbox.value = team.id;
        
        const label = document.createElement('label');
        label.htmlFor = `team-${team.id}`;
        label.textContent = team.name;
        
        // Add color indicator
        const colorIndicator = document.createElement('span');
        colorIndicator.className = 'color-indicator';
        colorIndicator.style.backgroundColor = team.color;
        label.prepend(colorIndicator);
        
        teamCheckbox.appendChild(checkbox);
        teamCheckbox.appendChild(label);
        teamSelection.appendChild(teamCheckbox);
    });
    
    // Add event listener to customer dropdown for auto-filling address and notes
    const customerSelect = document.getElementById('customer');
    if (customerSelect) {
        customerSelect.addEventListener('change', function() {
            const selectedCustomerId = this.value;
            if (selectedCustomerId) {
                const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
                if (selectedCustomer) {
                    // Auto-fill address from customer
                    const locationInput = document.getElementById('location');
                    if (locationInput && selectedCustomer.address) {
                        locationInput.value = selectedCustomer.address;
                    }
                    
                    // Auto-fill notes/description from customer
                    const descriptionInput = document.getElementById('description');
                    if (descriptionInput && selectedCustomer.notes) {
                        descriptionInput.value = selectedCustomer.notes;
                    }
                }
            }
        });
    }
    
    // If editing an existing appointment, populate with its data
    if (appointment) {
        appointmentForm.dataset.appointmentId = appointment.id;
        
        titleInput.value = appointment.title;
        locationInput.value = appointment.location;
        descriptionInput.value = appointment.description || '';
        
        // Set customer if available
        if (appointment.customer_id) {
            const customerSelect = document.getElementById('customer');
            if (customerSelect) {
                customerSelect.value = appointment.customer_id;
            }
        }
        
        const startDate = new Date(appointment.start);
        const endDate = new Date(appointment.end);
        
        startDateInput.value = formatDateForInput(startDate);
        startTimeInput.value = formatTimeForInput(startDate);
        endDateInput.value = formatDateForInput(endDate);
        endTimeInput.value = formatTimeForInput(endDate);
        
        statusSelect.value = appointment.status;
        
        // Check assigned staff
        if (appointment.staff_ids) {
            appointment.staff_ids.forEach(staffId => {
                const checkbox = document.getElementById(`staff-${staffId}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        // Check assigned teams
        if (appointment.team_ids) {
            appointment.team_ids.forEach(teamId => {
                const checkbox = document.getElementById(`team-${teamId}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    } else {
        delete appointmentForm.dataset.appointmentId;
    }
    
    // Show modal
    modal.style.display = 'block';
}

// Handle appointment form submission
function handleAppointmentSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const title = document.getElementById('title').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const startDate = document.getElementById('start-date').value;
    const startTime = document.getElementById('start-time').value;
    const endDate = document.getElementById('end-date').value;
    const endTime = document.getElementById('end-time').value;
    const status = document.getElementById('status').value;
    const customerId = document.getElementById('customer').value;
    
    // Get selected staff
    const staffIds = [];
    staff.forEach(staffMember => {
        const checkbox = document.getElementById(`staff-${staffMember.id}`);
        if (checkbox && checkbox.checked) {
            staffIds.push(staffMember.id);
        }
    });
    
    // Get selected teams
    const teamIds = [];
    teams.forEach(team => {
        const checkbox = document.getElementById(`team-${team.id}`);
        if (checkbox && checkbox.checked) {
            teamIds.push(team.id);
        }
    });
    
    // Create appointment object
    const appointment = {
        title,
        location,
        description,
        start: `${startDate}T${startTime}:00`,
        end: `${endDate}T${endTime}:00`,
        staff_ids: staffIds,
        team_ids: teamIds,
        status
    };
    
    // Add customer ID if selected
    if (customerId) {
        appointment.customer_id = customerId;
    }
    
    // Check if editing or creating
    const appointmentId = appointmentForm.dataset.appointmentId;
    
    if (appointmentId) {
        // Update existing appointment
        appointment.id = appointmentId;
        
        // Find and update the appointment in the array
        const index = appointments.findIndex(a => a.id === appointmentId);
        if (index !== -1) {
            appointments[index] = appointment;
        }
    } else {
        // Create new appointment with unique ID
        appointment.id = Date.now().toString();
        appointments.push(appointment);
    }
    
    // Save data (in a real app, this would be an API call)
    saveData();
    
    // Close modal
    modal.style.display = 'none';
    
    // Update calendar
    renderCalendar();
}

// Open login modal
function openLoginModal() {
    loginModal.style.display = 'block';
}

// Handle login form submission
function handleLoginSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in a real app, this would be an API call)
    if (username === 'admin' && password === 'password') {
        isLoggedIn = true;
        loginModal.style.display = 'none';
        
        // Update UI based on login status
        updateUIForLoginStatus();
        
        // Update calendar to show interactive elements
        renderCalendar();
    } else {
        alert('Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.');
    }
}

// Logout function
function logout() {
    isLoggedIn = false;
    
    // Update UI based on login status
    updateUIForLoginStatus();
    
    // Update calendar to hide interactive elements
    renderCalendar();
}

// Open staff management modal
function openStaffModal() {
    // Render staff and teams lists
    renderStaffList();
    renderTeamsList();
    renderCustomersList();
    
    // Show modal
    staffModal.style.display = 'block';
}

// Render staff list
function renderStaffList() {
    const staffListContainer = document.getElementById('staff-list-container');
    if (!staffListContainer) return;
    
    staffListContainer.innerHTML = '';
    
    staff.forEach(staffMember => {
        const staffItem = document.createElement('div');
        staffItem.className = 'staff-item';
        
        const staffInfo = document.createElement('div');
        staffInfo.className = 'staff-info';
        
        // Add color indicator
        const colorIndicator = document.createElement('span');
        colorIndicator.className = 'color-indicator';
        colorIndicator.style.backgroundColor = staffMember.color;
        staffInfo.appendChild(colorIndicator);
        
        // Add name and position
        const nameElement = document.createElement('span');
        nameElement.className = 'staff-name';
        nameElement.textContent = staffMember.name;
        staffInfo.appendChild(nameElement);
        
        const positionElement = document.createElement('span');
        positionElement.className = 'staff-position';
        positionElement.textContent = staffMember.position;
        staffInfo.appendChild(positionElement);
        
        staffItem.appendChild(staffInfo);
        
        // Add edit button
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => {
            openStaffForm(staffMember);
        });
        staffItem.appendChild(editButton);
        
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            if (confirm(`Möchten Sie ${staffMember.name} wirklich löschen?`)) {
                deleteStaff(staffMember.id);
            }
        });
        staffItem.appendChild(deleteButton);
        
        staffListContainer.appendChild(staffItem);
    });
}

// Open staff form
function openStaffForm(staffMember = null) {
    const staffFormContainer = document.getElementById('staff-form-container');
    if (!staffFormContainer) return;
    
    // Show form
    staffFormContainer.style.display = 'block';
    
    // Get form elements
    const staffIdInput = document.getElementById('staff-id');
    const nameInput = document.getElementById('staff-name');
    const positionInput = document.getElementById('staff-position');
    const emailInput = document.getElementById('staff-email');
    const phoneInput = document.getElementById('staff-phone');
    const colorInput = document.getElementById('staff-color');
    
    // Clear previous values
    staffIdInput.value = '';
    nameInput.value = '';
    positionInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    colorInput.value = '#' + Math.floor(Math.random()*16777215).toString(16); // Random color
    
    // Populate team selection
    const teamsSelection = document.getElementById('staff-teams-selection');
    teamsSelection.innerHTML = '';
    
    teams.forEach(team => {
        const teamCheckbox = document.createElement('div');
        teamCheckbox.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `staff-team-${team.id}`;
        checkbox.name = `staff-team-${team.id}`;
        checkbox.value = team.id;
        
        const label = document.createElement('label');
        label.htmlFor = `staff-team-${team.id}`;
        label.textContent = team.name;
        
        // Add color indicator
        const colorIndicator = document.createElement('span');
        colorIndicator.className = 'color-indicator';
        colorIndicator.style.backgroundColor = team.color;
        label.prepend(colorIndicator);
        
        teamCheckbox.appendChild(checkbox);
        teamCheckbox.appendChild(label);
        teamsSelection.appendChild(teamCheckbox);
    });
    
    // If editing an existing staff member, populate with their data
    if (staffMember) {
        staffIdInput.value = staffMember.id;
        nameInput.value = staffMember.name;
        positionInput.value = staffMember.position;
        emailInput.value = staffMember.email || '';
        phoneInput.value = staffMember.phone || '';
        colorInput.value = staffMember.color;
        
        // Check teams this staff member belongs to
        if (staffMember.team_ids) {
            staffMember.team_ids.forEach(teamId => {
                const checkbox = document.getElementById(`staff-team-${teamId}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }
}

// Handle staff form submission
function handleStaffSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const staffId = document.getElementById('staff-id').value;
    const name = document.getElementById('staff-name').value;
    const position = document.getElementById('staff-position').value;
    const email = document.getElementById('staff-email').value;
    const phone = document.getElementById('staff-phone').value;
    const color = document.getElementById('staff-color').value;
    
    // Get selected teams
    const teamIds = [];
    teams.forEach(team => {
        const checkbox = document.getElementById(`staff-team-${team.id}`);
        if (checkbox && checkbox.checked) {
            teamIds.push(team.id);
        }
    });
    
    // Create staff object
    const staffMember = {
        name,
        position,
        email,
        phone,
        color,
        team_ids: teamIds
    };
    
    if (staffId) {
        // Update existing staff member
        staffMember.id = staffId;
        
        // Find and update the staff member in the array
        const index = staff.findIndex(s => s.id === staffId);
        if (index !== -1) {
            staff[index] = staffMember;
        }
        
        // Update team memberships
        teams.forEach(team => {
            const memberIndex = team.member_ids.indexOf(staffId);
            
            // Remove from team if not selected
            if (memberIndex !== -1 && !teamIds.includes(team.id)) {
                team.member_ids.splice(memberIndex, 1);
            }
            
            // Add to team if selected and not already a member
            if (teamIds.includes(team.id) && memberIndex === -1) {
                team.member_ids.push(staffId);
            }
        });
    } else {
        // Create new staff member with unique ID
        staffMember.id = Date.now().toString();
        staff.push(staffMember);
        
        // Add to selected teams
        teamIds.forEach(teamId => {
            const team = teams.find(t => t.id === teamId);
            if (team) {
                team.member_ids.push(staffMember.id);
            }
        });
    }
    
    // Save data (in a real app, this would be an API call)
    saveData();
    
    // Hide form
    document.getElementById('staff-form-container').style.display = 'none';
    
    // Update staff list
    renderStaffList();
    renderTeamsList();
    
    // Update calendar to reflect staff changes
    renderCalendar();
}

// Render teams list
function renderTeamsList() {
    const teamsListContainer = document.getElementById('teams-list-container');
    if (!teamsListContainer) return;
    
    teamsListContainer.innerHTML = '';
    
    teams.forEach(team => {
        const teamItem = document.createElement('div');
        teamItem.className = 'team-item';
        
        const teamInfo = document.createElement('div');
        teamInfo.className = 'team-info';
        
        // Add color indicator
        const colorIndicator = document.createElement('span');
        colorIndicator.className = 'color-indicator';
        colorIndicator.style.backgroundColor = team.color;
        teamInfo.appendChild(colorIndicator);
        
        // Add name
        const nameElement = document.createElement('span');
        nameElement.className = 'team-name';
        nameElement.textContent = team.name;
        teamInfo.appendChild(nameElement);
        
        // Add member count
        const memberCount = document.createElement('span');
        memberCount.className = 'member-count';
        memberCount.textContent = `${team.member_ids.length} Mitglieder`;
        teamInfo.appendChild(memberCount);
        
        teamItem.appendChild(teamInfo);
        
        // Add edit button
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => {
            openTeamForm(team);
        });
        teamItem.appendChild(editButton);
        
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            if (confirm(`Möchten Sie das Team "${team.name}" wirklich löschen?`)) {
                deleteTeam(team.id);
            }
        });
        teamItem.appendChild(deleteButton);
        
        teamsListContainer.appendChild(teamItem);
    });
}

// Open team form
function openTeamForm(team = null) {
    const teamFormContainer = document.getElementById('team-form-container');
    if (!teamFormContainer) return;
    
    // Show form
    teamFormContainer.style.display = 'block';
    
    // Get form elements
    const teamIdInput = document.getElementById('team-id');
    const nameInput = document.getElementById('team-name');
    const colorInput = document.getElementById('team-color');
    
    // Clear previous values
    teamIdInput.value = '';
    nameInput.value = '';
    colorInput.value = '#' + Math.floor(Math.random()*16777215).toString(16); // Random color
    
    // Populate staff selection
    const membersSelection = document.getElementById('team-members-selection');
    membersSelection.innerHTML = '';
    
    staff.forEach(staffMember => {
        const memberCheckbox = document.createElement('div');
        memberCheckbox.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `team-member-${staffMember.id}`;
        checkbox.name = `team-member-${staffMember.id}`;
        checkbox.value = staffMember.id;
        
        const label = document.createElement('label');
        label.htmlFor = `team-member-${staffMember.id}`;
        label.textContent = staffMember.name;
        
        // Add color indicator
        const colorIndicator = document.createElement('span');
        colorIndicator.className = 'color-indicator';
        colorIndicator.style.backgroundColor = staffMember.color;
        label.prepend(colorIndicator);
        
        memberCheckbox.appendChild(checkbox);
        memberCheckbox.appendChild(label);
        membersSelection.appendChild(memberCheckbox);
    });
    
    // If editing an existing team, populate with its data
    if (team) {
        teamIdInput.value = team.id;
        nameInput.value = team.name;
        colorInput.value = team.color;
        
        // Check members of this team
        if (team.member_ids) {
            team.member_ids.forEach(memberId => {
                const checkbox = document.getElementById(`team-member-${memberId}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }
}

// Handle team form submission
function handleTeamSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const teamId = document.getElementById('team-id').value;
    const name = document.getElementById('team-name').value;
    const color = document.getElementById('team-color').value;
    
    // Get selected members
    const memberIds = [];
    staff.forEach(staffMember => {
        const checkbox = document.getElementById(`team-member-${staffMember.id}`);
        if (checkbox && checkbox.checked) {
            memberIds.push(staffMember.id);
        }
    });
    
    // Create team object
    const team = {
        name,
        color,
        member_ids: memberIds
    };
    
    if (teamId) {
        // Update existing team
        team.id = teamId;
        
        // Find and update the team in the array
        const index = teams.findIndex(t => t.id === teamId);
        if (index !== -1) {
            // Get previous member IDs to update staff team_ids
            const previousMemberIds = teams[index].member_ids;
            
            // Update team
            teams[index] = team;
            
            // Update staff team memberships
            staff.forEach(staffMember => {
                // Remove from previous members if not in new members
                if (previousMemberIds.includes(staffMember.id) && !memberIds.includes(staffMember.id)) {
                    const teamIndex = staffMember.team_ids.indexOf(teamId);
                    if (teamIndex !== -1) {
                        staffMember.team_ids.splice(teamIndex, 1);
                    }
                }
                
                // Add to new members if not in previous members
                if (!previousMemberIds.includes(staffMember.id) && memberIds.includes(staffMember.id)) {
                    if (!staffMember.team_ids) {
                        staffMember.team_ids = [];
                    }
                    staffMember.team_ids.push(teamId);
                }
            });
        }
    } else {
        // Create new team with unique ID
        team.id = Date.now().toString();
        teams.push(team);
        
        // Update staff team memberships
        memberIds.forEach(memberId => {
            const staffMember = staff.find(s => s.id === memberId);
            if (staffMember) {
                if (!staffMember.team_ids) {
                    staffMember.team_ids = [];
                }
                staffMember.team_ids.push(team.id);
            }
        });
    }
    
    // Save data (in a real app, this would be an API call)
    saveData();
    
    // Hide form
    document.getElementById('team-form-container').style.display = 'none';
    
    // Update teams list
    renderTeamsList();
    renderStaffList();
    
    // Update calendar to reflect team changes
    renderCalendar();
}

// Save data to server
function saveData() {
    // In a real application, this would be an API call
    // For now, we'll just log the data
    console.log('Saving data:', { appointments, staff, teams, customers });
    
    // In a real application, you would send the data to the server
    // fetch('/api/data', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ appointments, staff, teams, customers }),
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Success:', data);
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });
}

// Helper function to check if a date is today
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Helper function to format time (e.g., "09:00")
function formatTime(date) {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

// Helper function to format date for input fields (YYYY-MM-DD)
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Helper function to format time for input fields (HH:MM)
function formatTimeForInput(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Update UI elements based on login status
function updateUIForLoginStatus() {
    // Show/hide new appointment button based on login status
    if (newAppointmentBtn) {
        newAppointmentBtn.style.display = isLoggedIn ? 'flex' : 'none';
    }
    
    // Update staff button visibility
    if (staffBtn) {
        staffBtn.style.display = isLoggedIn ? 'flex' : 'none';
    }
    
    // Update login button text
    if (loginBtn) {
        loginBtn.innerHTML = isLoggedIn ? 
            '<i class="fas fa-sign-out-alt"></i> Logout' : 
            '<i class="fas fa-user"></i> Login';
    }
}

// Render customers list
function renderCustomersList() {
    const customersListContainer = document.getElementById('customers-list-container');
    if (!customersListContainer) return;
    
    customersListContainer.innerHTML = '';
    
    customers.forEach(customer => {
        const customerItem = document.createElement('div');
        customerItem.className = 'customer-item';
        
        const customerInfo = document.createElement('div');
        customerInfo.className = 'customer-info';
        
        // Add name and address
        const nameElement = document.createElement('div');
        nameElement.className = 'customer-name';
        nameElement.textContent = customer.name;
        customerInfo.appendChild(nameElement);
        
        if (customer.address) {
            const addressElement = document.createElement('div');
            addressElement.className = 'customer-address';
            addressElement.textContent = customer.address;
            customerInfo.appendChild(addressElement);
        }
        
        customerItem.appendChild(customerInfo);
        
        // Add edit button
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => {
            openCustomerForm(customer);
        });
        customerItem.appendChild(editButton);
        
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            if (confirm(`Möchten Sie den Kunden "${customer.name}" wirklich löschen?`)) {
                deleteCustomer(customer.id);
            }
        });
        customerItem.appendChild(deleteButton);
        
        customersListContainer.appendChild(customerItem);
    });
    
    // Update customer dropdown in appointment form
    updateCustomerDropdown();
}

// Update customer dropdown in appointment form
function updateCustomerDropdown() {
    const customerSelect = document.getElementById('customer');
    if (!customerSelect) return;
    
    // Clear existing options except the first one
    while (customerSelect.options.length > 1) {
        customerSelect.remove(1);
    }
    
    // Add customer options
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });
}

// Open customer form
function openCustomerForm(customer = null) {
    const customerFormContainer = document.getElementById('customer-form-container');
    if (!customerFormContainer) return;
    
    // Show form
    customerFormContainer.style.display = 'block';
    
    // Get form elements
    const customerIdInput = document.getElementById('customer-id');
    const nameInput = document.getElementById('customer-name');
    const addressInput = document.getElementById('customer-address');
    const contactInput = document.getElementById('customer-contact');
    const emailInput = document.getElementById('customer-email');
    const phoneInput = document.getElementById('customer-phone');
    const notesInput = document.getElementById('customer-notes');
    
    // Clear previous values
    customerIdInput.value = '';
    nameInput.value = '';
    addressInput.value = '';
    contactInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    notesInput.value = '';
    
    // If editing an existing customer, populate with their data
    if (customer) {
        customerIdInput.value = customer.id;
        nameInput.value = customer.name || '';
        addressInput.value = customer.address || '';
        contactInput.value = customer.contact || '';
        emailInput.value = customer.email || '';
        phoneInput.value = customer.phone || '';
        notesInput.value = customer.notes || '';
    }
}

// Handle customer form submission
function handleCustomerSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const customerId = document.getElementById('customer-id').value;
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const contact = document.getElementById('customer-contact').value;
    const email = document.getElementById('customer-email').value;
    const phone = document.getElementById('customer-phone').value;
    const notes = document.getElementById('customer-notes').value;
    
    // Create customer object
    const customer = {
        name,
        address,
        contact,
        email,
        phone,
        notes
    };
    
    if (customerId) {
        // Update existing customer
        customer.id = customerId;
        
        // Find and update the customer in the array
        const index = customers.findIndex(c => c.id === customerId);
        if (index !== -1) {
            customers[index] = customer;
        }
    } else {
        // Create new customer with unique ID
        customer.id = Date.now().toString();
        customers.push(customer);
    }
    
    // Save data (in a real app, this would be an API call)
    saveData();
    
    // Hide form
    document.getElementById('customer-form-container').style.display = 'none';
    
    // Update customers list
    renderCustomersList();
}

// Function to delete a staff member
function deleteStaff(staffId) {
    // Remove staff from the array
    staff = staff.filter(s => s.id !== staffId);
    
    // Update appointments to remove this staff member
    appointments.forEach(appointment => {
        if (appointment.staff_ids && appointment.staff_ids.includes(staffId)) {
            appointment.staff_ids = appointment.staff_ids.filter(id => id !== staffId);
        }
    });
    
    // Update teams to remove this staff member
    teams.forEach(team => {
        if (team.member_ids && team.member_ids.includes(staffId)) {
            team.member_ids = team.member_ids.filter(id => id !== staffId);
        }
    });
    
    // Save data
    saveData();
    
    // Re-render staff list
    renderStaffList();
    
    // Re-render calendar to update appointments
    renderCalendar();
}

// Function to delete a team
function deleteTeam(teamId) {
    // Remove team from the array
    teams = teams.filter(t => t.id !== teamId);
    
    // Update appointments to remove this team
    appointments.forEach(appointment => {
        if (appointment.team_ids && appointment.team_ids.includes(teamId)) {
            appointment.team_ids = appointment.team_ids.filter(id => id !== teamId);
        }
    });
    
    // Update staff to remove this team from their team_ids
    staff.forEach(staffMember => {
        if (staffMember.team_ids && staffMember.team_ids.includes(teamId)) {
            staffMember.team_ids = staffMember.team_ids.filter(id => id !== teamId);
        }
    });
    
    // Save data
    saveData();
    
    // Re-render team list
    renderTeamsList();
    renderStaffList();
    
    // Re-render calendar to update appointments
    renderCalendar();
}

// Function to delete a customer
function deleteCustomer(customerId) {
    // Remove customer from the array
    customers = customers.filter(c => c.id !== customerId);
    
    // Update appointments that might reference this customer
    appointments.forEach(appointment => {
        if (appointment.customer_id === customerId) {
            delete appointment.customer_id;
        }
    });
    
    // Save data
    saveData();
    
    // Re-render customers list
    renderCustomersList();
    
    // Re-render calendar to update appointments
    renderCalendar();
}
