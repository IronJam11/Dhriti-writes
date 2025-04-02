# DhritiWrites

DhritiWrites is a freelancing project designed to provide a platform for writers to create their own personal websites effortlessly. It comes with essential features to help writers engage their audience while maintaining a sleek and modern UI.

## Features

- **Free Mailing to Subscribers** – Stay connected with your audience through free email notifications.
- **Dark/Light Mode** – Aesthetic UI with theme switching using Material UI (MUI).
- **Authentication** – Secure login and signup system.
- **Aesthetic Pieces Display** – Beautifully designed layout for showcasing written works.

## Tech Stack

### Backend
- **Django** – Handles server-side logic and API management.

### Frontend
- **React + Vite + TypeScript** – Ensures a fast, scalable, and type-safe UI.
- **Material UI (MUI)** – Provides a modern and responsive design.

### Database
- **SQLite** – Lightweight database for efficient storage and retrieval.

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Python (3.x)
- Node.js (latest LTS version)
- npm or yarn

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dhritiWrites.git
   cd dhritiWrites/backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations and start the Django server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install  # or yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev  # or yarn dev
   ```

## Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries or contributions, reach out at [your email/contact info].
