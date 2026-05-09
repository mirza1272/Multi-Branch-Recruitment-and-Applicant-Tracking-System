# HRConnect Database Schema Plan

This document outlines the complete database schema required to implement the backend for the HRConnect platform. It has been carefully derived by analyzing the frontend forms, state variables, local storage mock data, and screen requirements across the entire project.

## Proposed Schema

### 1. `users` Table
Stores all authentication and profile data for both 'Candidate' and 'HR' roles.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | PRIMARY KEY | Unique identifier for the user. |
| `name` | VARCHAR(255) | NOT NULL | Full name of the user. |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Used for login and contact. |
| `password_hash` | VARCHAR(255) | NOT NULL | Encrypted password (e.g., bcrypt). |
| `phone` | VARCHAR(20) | | Phone number (numeric). |
| `location` | VARCHAR(255) | | City/Country or address. |
| `role` | ENUM | NOT NULL | `'Candidate'` or `'HR'`. |
| `skills` | TEXT | | Comma-separated skills (for Candidates). |
| `company` | VARCHAR(255) | | Company name (for HR). |
| `bio` | TEXT | | Short biography or description. |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time. |
| `updated_at` | TIMESTAMP | | Last profile update. |

### 2. `jobs` Table
Stores job postings created by HR users.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | PRIMARY KEY | Unique identifier for the job. |
| `hr_id` | UUID / INT | FOREIGN KEY (users.id) | The HR user who posted the job. |
| `title` | VARCHAR(255) | NOT NULL | e.g. "Senior Software Engineer". |
| `category` | VARCHAR(100) | NOT NULL | e.g. "Engineering", "Marketing". |
| `employment_type` | ENUM | NOT NULL | `'Full Time'`, `'Part Time'`, `'Contract'`, `'Remote'`. |
| `salary_range` | VARCHAR(100) | | e.g. "$5k - $8k". |
| `location` | VARCHAR(255) | | Job location (if not remote). |
| `branch_name` | VARCHAR(255) | | Assigned branch (links to branches). |
| `seats` | INT | DEFAULT 1 | Number of open positions. |
| `description` | TEXT | NOT NULL | Detailed job description. |
| `requirements` | TEXT | NOT NULL | Key technical/soft skill requirements. |
| `deadline` | DATE | | Application deadline. |
| `status` | ENUM | DEFAULT 'Active' | `'Active'`, `'Closed'`, `'Draft'`. |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When the job was posted. |

### 3. `applications` Table
Stores job applications submitted by candidates.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | PRIMARY KEY | Unique identifier for application. |
| `candidate_id`| UUID / INT | FOREIGN KEY (users.id) | The candidate applying. |
| `job_id` | UUID / INT | FOREIGN KEY (jobs.id) | The job being applied to. |
| `qualification` | VARCHAR(100) | | Highest education qualification. |
| `experience_years`| INT | | Total years of experience. |
| `current_company` | VARCHAR(255) | | Candidate's current company. |
| `skills` | TEXT | | Relevant skills. |
| `q1_answer` | TEXT | | Answer: "Why interested in position?" |
| `q2_answer` | TEXT | | Answer: "Notable achievement" |
| `resume_url` | VARCHAR(512) | NOT NULL | Link to uploaded resume file. |
| `cover_letter_url`| VARCHAR(512) | | Link to uploaded cover letter file. |
| `status` | ENUM | DEFAULT 'Pending'| `'Pending'`, `'Shortlisted'`, `'Interview Scheduled'`, `'Rejected'`, `'Hired'`. |
| `applied_at` | TIMESTAMP | DEFAULT NOW() | Date and time of application. |

### 4. `branches` Table
Manages the operating branches added by HR admins in the dashboard.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | PRIMARY KEY | Unique identifier. |
| `name` | VARCHAR(255) | NOT NULL, UNIQUE | e.g., "Main Branch", "London Office". |
| `status` | ENUM | DEFAULT 'ACTIVE' | `'ACTIVE'`, `'INACTIVE'`. |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Date added. |

### 5. `contact_messages` Table
Stores inquiries submitted through the "Contact Us" page.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | PRIMARY KEY | Unique identifier. |
| `first_name` | VARCHAR(255) | NOT NULL | Sender's first name. |
| `last_name` | VARCHAR(255) | NOT NULL | Sender's last name. |
| `email` | VARCHAR(255) | NOT NULL | Sender's email. |
| `message` | TEXT | NOT NULL | The actual message content. |
| `status` | ENUM | DEFAULT 'Unread' | `'Unread'`, `'Read'`, `'Resolved'`. |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When message was sent. |

## Relationships & Foreign Keys
1. **User (HR) -> Jobs**: One-to-Many. An HR user can post multiple jobs.
2. **User (Candidate) -> Applications**: One-to-Many. A candidate can apply to multiple jobs.
3. **Job -> Applications**: One-to-Many. A job can receive multiple applications.
4. **Branch -> Jobs**: One-to-Many. A branch can have multiple jobs assigned to it.
