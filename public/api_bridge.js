
// API Bridge to connect React frontend with PHP backend
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the bridge
  window.apiConnect = {
    // Base URL for API calls
    baseUrl: '',

    // Generic fetch request with error handling
    async fetchApi(endpoint, method = 'GET', data = null, headers = {}) {
      try {
        const options = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          credentials: 'include' // Include cookies
        };

        if (data && (method === 'POST' || method === 'PUT')) {
          options.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
        const result = await response.json();

        return result;
      } catch (error) {
        console.error('API Error:', error);
        return { status: 'error', message: 'Network error. Please try again.' };
      }
    },

    // Citizen auth methods
    async citizenRegister(userData) {
      return await this.fetchApi('citizen_register.php', 'POST', userData);
    },

    async citizenLogin(credentials) {
      return await this.fetchApi('citizen_login.php', 'POST', credentials);
    },

    // Officer auth methods
    async officerRegister(userData) {
      return await this.fetchApi('officer_register.php', 'POST', userData);
    },

    async officerLogin(credentials) {
      return await this.fetchApi('officer_login.php', 'POST', credentials);
    },

    // Complaint methods
    async submitComplaint(complaintData) {
      return await this.fetchApi('submit_complaint.php', 'POST', complaintData);
    },

    async getCitizenComplaints() {
      return await this.fetchApi('get_citizen_complaints.php');
    },

    async getOfficerComplaints() {
      return await this.fetchApi('get_officer_complaints.php');
    },

    async updateComplaintStatus(complaintId, status, remarks) {
      return await this.fetchApi('update_complaint_status.php', 'POST', {
        complaint_id: complaintId,
        status,
        remarks
      });
    },

    // Feedback methods
    async submitFeedback(feedbackData) {
      return await this.fetchApi('submit_feedback.php', 'POST', feedbackData);
    },
    
    // Area issues methods
    async getAreaIssues(area) {
      return await this.fetchApi(`get_area_issues.php?area=${encodeURIComponent(area)}`);
    },
    
    // Special method for file uploads that need FormData
    async uploadWithFormData(endpoint, formData) {
      try {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        return await response.json();
      } catch (error) {
        console.error('Upload API Error:', error);
        return { status: 'error', message: 'Network error during file upload. Please try again.' };
      }
    }
  };

  // Export to window for global access
  window.apiConnect = window.apiConnect;
  
  console.log("API Bridge initialized successfully");
});
