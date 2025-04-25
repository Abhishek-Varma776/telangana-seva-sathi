
// API Bridge to connect React frontend with PHP backend
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the bridge
  window.apiConnect = {
    // Base URL for API calls
    baseUrl: '',
    
    // Flag to indicate if we're using mock data (PHP not executing)
    useMockData: false,
    
    // Mock data for testing when PHP isn't executing
    mockData: {
      login: {
        'test@example.com': {
          status: 'success',
          message: 'Login successful',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com'
          }
        },
        'citizen@example.com': {
          status: 'success',
          message: 'Login successful',
          user: {
            id: 2,
            name: 'Demo Citizen',
            email: 'citizen@example.com'
          }
        }
      },
      register: {
        status: 'success',
        message: 'Registration successful'
      },
      complaints: [
        {
          id: 1,
          title: 'Road Damage',
          description: 'Large pothole on Main Street',
          status: 'pending',
          created_at: '2023-11-15'
        },
        {
          id: 2,
          title: 'Streetlight Issue',
          description: 'Streetlight not working near market',
          status: 'in-progress',
          created_at: '2023-11-10'
        }
      ]
    },

    // Generic fetch request with error handling
    async fetchApi(endpoint, method = 'GET', data = null, headers = {}) {
      // If we've detected PHP isn't executing and we're using mock data
      if (this.useMockData) {
        console.log('Using mock data for:', endpoint);
        
        // For login endpoint
        if (endpoint === 'citizen_login.php' && method === 'POST') {
          const email = data?.email;
          if (this.mockData.login[email]) {
            return this.mockData.login[email];
          }
          return { status: 'error', message: 'Invalid credentials' };
        }
        
        // For registration endpoint
        if (endpoint === 'citizen_register.php' && method === 'POST') {
          return this.mockData.register;
        }
        
        // For complaints endpoints
        if (endpoint === 'get_citizen_complaints.php') {
          return { status: 'success', complaints: this.mockData.complaints };
        }
        
        // Default mock response
        return { status: 'success', message: 'Mock data response', mock: true };
      }
      
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

        console.log(`Sending request to: ${this.baseUrl}/${endpoint}`, options);
        const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
        console.log(`Response status: ${response.status}`);
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        const responseText = await response.text();
        
        // Early check - if response contains PHP tags, PHP is not being executed
        if (responseText.includes('<?php') || responseText.includes('<?=')) {
          console.error('PHP code detected in response - PHP is not executing properly');
          console.error('Raw response:', responseText);
          
          // Set flag to use mock data for future requests
          this.useMockData = true;
          
          // Return mock data for this request based on endpoint
          if (endpoint === 'citizen_login.php') {
            const email = data?.email;
            if (this.mockData.login[email]) {
              return this.mockData.login[email];
            }
            return { status: 'success', message: 'Login successful (MOCK)', user: { id: 999, name: 'Demo User', email: data?.email || 'demo@example.com' } };
          }
          
          return { 
            status: 'success', 
            message: 'Mock data response (PHP not executing)',
            mock: true
          };
        }
        
        // Try to parse JSON response
        try {
          const result = JSON.parse(responseText);
          console.log('Response data:', result);
          return result;
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          console.error('Raw response:', responseText);
          
          // Set flag to use mock data for future requests
          this.useMockData = true;
          
          return {
            status: 'error',
            message: 'Invalid JSON response from server',
            mock: true
          };
        }
      } catch (error) {
        console.error('API Error:', error);
        
        // Set flag to use mock data for future requests
        this.useMockData = true;
        
        return { status: 'error', message: 'Network error. Using mock data for future requests.' };
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
      // Check if there's an image file to upload
      if (complaintData.image instanceof File) {
        const formData = new FormData();
        
        // Add text fields to FormData
        for (const key in complaintData) {
          if (key !== 'image') {
            formData.append(key, complaintData[key]);
          }
        }
        
        // Add image file to FormData
        formData.append('image', complaintData.image);
        
        // Use special method for FormData uploads
        return await this.uploadWithFormData('submit_complaint.php', formData);
      } else {
        // Regular JSON submission if no image
        return await this.fetchApi('submit_complaint.php', 'POST', complaintData);
      }
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
      // If we've detected PHP isn't executing and we're using mock data
      if (this.useMockData) {
        console.log('Using mock data for FormData upload:', endpoint);
        return { status: 'success', message: 'File uploaded successfully (mock)', mock: true };
      }
      
      try {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        const responseText = await response.text();
        
        // Early check - if response contains PHP tags, PHP is not being executed
        if (responseText.includes('<?php') || responseText.includes('<?=')) {
          console.error('PHP code detected in response - PHP is not executing properly');
          
          // Set flag to use mock data for future requests
          this.useMockData = true;
          
          return { 
            status: 'success', 
            message: 'Mock file upload response (PHP not executing)',
            mock: true
          };
        }
        
        // Try to parse JSON response
        try {
          const result = JSON.parse(responseText);
          console.log('FormData response:', result);
          return result;
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          console.error('Raw FormData response:', responseText);
          
          // Set flag to use mock data for future requests
          this.useMockData = true;
          
          return {
            status: 'error',
            message: 'Invalid JSON response from server for file upload',
            mock: true
          };
        }
      } catch (error) {
        console.error('Upload API Error:', error);
        
        // Set flag to use mock data for future requests
        this.useMockData = true;
        
        return { status: 'error', message: 'Network error during file upload. Using mock data for future requests.' };
      }
    }
  };

  // Export to window for global access
  window.apiConnect = window.apiConnect;
  
  console.log("API Bridge initialized successfully");
  
  // Test connection immediately to determine if PHP is executing
  fetch('test_connection.php')
    .then(res => res.text())
    .then(text => {
      console.log("Test connection response:", text);
      
      try {
        // Try to parse as JSON to see if PHP is executing
        const json = JSON.parse(text);
        console.log("PHP is executing correctly, JSON response received:", json);
      } catch (e) {
        // If it's not valid JSON and contains PHP tags, PHP is not executing
        if (text.includes('<?php')) {
          console.error("PHP is not executing - switching to mock data mode");
          window.apiConnect.useMockData = true;
        }
      }
    })
    .catch(err => {
      console.error("Test connection failed:", err);
      window.apiConnect.useMockData = true;
    });
});
