export type Candidate = {
  firstName: string;
  lastName: string;
  interviewRefNo: string;
  major: string;
  majorGroup: string;
}

export type ApiResponse = {
  design: Omit<Candidate, 'majorGroup'>[];
  content: Omit<Candidate, 'majorGroup'>[];
  programming: Omit<Candidate, 'majorGroup'>[];
  marketing: Omit<Candidate, 'majorGroup'>[];
}
