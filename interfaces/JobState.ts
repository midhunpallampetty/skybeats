 interface JobInterface{
    designation:string
    Image:string
    description:string
  }
  export interface JobState {
    selectedJob: JobInterface | null;
  }
  