
interface ApiConnect {
  baseUrl: string;
  fetchApi: (endpoint: string, method?: string, data?: any, headers?: Record<string, string>) => Promise<any>;
  citizenRegister: (userData: any) => Promise<any>;
  citizenLogin: (credentials: any) => Promise<any>;
  officerRegister: (userData: any) => Promise<any>;
  officerLogin: (credentials: any) => Promise<any>;
  submitComplaint: (complaintData: any) => Promise<any>;
  getCitizenComplaints: () => Promise<any>;
  getOfficerComplaints: () => Promise<any>;
  updateComplaintStatus: (complaintId: number | string, status: string, remarks: string) => Promise<any>;
  submitFeedback: (feedbackData: any) => Promise<any>;
}

interface Window {
  apiConnect: ApiConnect;
}
