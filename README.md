## CopilotAgentModePrompt to Deploy a Fictitious Helpdesk App for ABC Ltd

# Step 1: Initialize the project
- Create a new branch with the name "build-abchelpdesk-app" and create a full-stack web application project for a help desk system named "ABC-helpdesk-app" using Node.js for the backend and React.js for the frontend. Set up a monorepo structure with separate folders for backend and frontend.

# Step 2: Backend Initialization (Node.js)
In the backend folder, initialize a Node.js project using Express.js. Set up basic REST API routing, install `express`, `cors`, `dotenv`, `pg`, and `jsonwebtoken`. Add middleware for error handling and logging.

# Step 3: SQL Server Database Setup
Create a Microsoft SQL Server schema for the help desk app. Include tables for:
- users (id, name, email, password_hash, role)
- tickets (id, title, description, status, priority, customer_id, agent_id, created_at, updated_at)
- comments (id, ticket_id, user_id, message, created_at)
- ticket_status_history (id, ticket_id, status, changed_by_user_id, changed_at)
- Add drop statements at the top for in case there is an existing table
- Use SQL syntax and include foreign key constraints. Add the SQL file to the backend folder.

# Step 4:  Database Connection
- Create a database utility module in Node.js to connect to the Microsoft SQL Server database using the mssql library and environment variables for DB credentials.

# Step 5: User Authentication
- Implement user registration and login endpoints with password hashing (bcrypt) and JWT-based authentication. Protect ticket routes using authentication middleware.

# Step 6: Ticket API Routes
Build RESTful API endpoints for:
- Creating a new ticket
- Updating a ticket (status, priority, assignment)
- Getting a list of all tickets with filters for status and priority
- Getting ticket details with comments
- Adding a comment to a ticket
- Use role-based access control to ensure only support agents or customers can perform specific actions.

# Step 7: Frontend Setup (React.js)
- In the frontend folder, create a new React app using Vite. Install Axios, React Router, and Tailwind CSS for UI styling. Configure routing for public and protected pages.

# Step 8: Frontend Pages and Components
Create the following React components/pages:
- Login and Registration page
- Customer Dashboard: Submit ticket, view own tickets
- Agent Dashboard: View all tickets, filter, assign, change status
- Ticket Details Page with comments
- Header and Sidebar navigation
- Use Tailwind CSS for styling and Axios to connect to backend API.

# Step 9: Authentication in React
- Implement login/logout functionality using JWT stored in local storage. Create an Axios instance that attaches the token to Authorization headers. Redirect users based on role after login.

# Step 10: Ticket Management UI
- Design the dashboard for agents to view, filter, and assign tickets. Display ticket metadata like title, status, priority, and time since creation. Add buttons for changing ticket status and adding comments inline.

# Step 11: Implement Admin Panel
Add an admin panel where only admins can:
- Create or deactivate users
- View performance metrics (e.g., number of tickets resolved by agent)
- Export tickets to CSV or Excel

# Step 12: Reporting and Analytics
Add backend endpoints and frontend UI to generate reports on:
- Average response and resolution time
- Number of tickets by status and priority
- Top performing agents
Use charts with Chart.js or Recharts in the React frontend.

# Step 13: Deploy the Application
- Add Dockerfiles for backend and frontend. Write a `docker-compose.yml` to bring up mssql, backend, and frontend. Add a `.env.example` for environment configuration. Document deployment steps in README.md.

# Step 14: Documentation
- Generate README.md files for both backend and frontend folders. Include setup steps, API documentation, and deployment instructions. Add sample data for testing.

# Step 15: Set GitHub Remote Repository
 - Create a remote git Repository with the name "abcdltd-helpdesk-app"
 - Add remote origin to the local repository
 - Push the code to the remote repository. 
