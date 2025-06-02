# Backend - ABC Helpdesk App

## Setup Instructions

1. Ensure you have Node.js and npm installed on your system.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the `backend` folder based on the `.env.abchelpdeskapp` file.
5. Run the application:
   ```bash
   npm start
   ```

## API Documentation

### Authentication
- **POST** `/register`: Register a new user.
- **POST** `/login`: Login and receive a JWT token.

### Tickets
- **POST** `/tickets`: Create a new ticket (Customer only).
- **PUT** `/tickets/:id`: Update ticket status, priority, or assignment (Agent only).
- **GET** `/tickets`: Get a list of tickets with optional filters.
- **GET** `/tickets/:id`: Get ticket details with comments.
- **POST** `/tickets/:id/comments`: Add a comment to a ticket.

### Admin
- **POST** `/admin/users`: Create a new user.
- **DELETE** `/admin/users/:id`: Deactivate a user.
- **GET** `/admin/metrics`: View performance metrics.
- **GET** `/admin/export-tickets`: Export tickets to CSV or Excel.

### Reports
- **GET** `/reports/average-times`: Get average response and resolution times.
- **GET** `/reports/tickets-summary`: Get ticket counts by status and priority.
- **GET** `/reports/top-agents`: Get top-performing agents.

## Deployment Instructions

1. Ensure Docker and docker-compose are installed on your system.
2. Navigate to the project root and run:
   ```bash
   docker-compose up --build
   ```
3. The backend will be available at [http://localhost:5000](http://localhost:5000).

## Sample Data for Testing

Use the following SQL script to insert sample data into the database:
```sql
INSERT INTO users (name, email, password_hash, role) VALUES
('John Doe', 'john@example.com', 'hashed_password', 'customer'),
('Jane Smith', 'jane@example.com', 'hashed_password', 'agent'),
('Admin User', 'admin@example.com', 'hashed_password', 'admin');

INSERT INTO tickets (title, description, status, priority, customer_id, created_at, updated_at) VALUES
('Issue with login', 'Cannot log in to the system', 'open', 'high', 1, GETDATE(), GETDATE()),
('Feature request', 'Add dark mode', 'open', 'low', 1, GETDATE(), GETDATE());
```
