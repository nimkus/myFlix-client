# Bunbuster App

**Hop into the Bunnyverse and find your favorite blockbusters in a world inhabited entirely by bunnies.**

Welcome to **Bunbuster**, where the only stars in the show are fluffy, whisker-twitching, carrot-chomping bunnies! Dive into a parallel universe where every blockbuster is bunny-themed: heroes with floppy ears, villains with twitchy noses, and epic adventures that will leave you hopping with joy.

Whether you're a fan of crime-dramas like _The Harefather_, action-packed epics like _The Bunfinity Wars_, or magical adventures like _Hare-y Potter and the Sorcerer’s Carrot_, **Bunbuster** has all the fur-flying entertainment you’ll ever need.

---

## **Why Choose Bunbuster?**

### 🐇 **Enter the Bunnyverse**

Explore an extensive database of hilariously crafted bunny-themed blockbusters, complete with rich descriptions, quirky genres, and beloved bunny directors.

### 🥕 **Tail-Wagging Favorites**

Save your favorite movies for quick access, so you can easily share hare-larious hits with friends or re-binge your beloved bunny flicks.

### 📱 **Seamless Experience**

Enjoy a polished, single-page app design with responsive views and intuitive navigation, ensuring a thumpin' good time on any device—desktop, tablet, or mobile.

### 🐾 **Powered by BunnyAPI**

Get the latest whisker-twitching updates as our app fetches all the bunny movie magic directly from the server, keeping your carrot cravings satisfied.

---

## **Features That’ll Have You Hopping with Joy**

- **🎞️ Bunny-fied Movie Listings:** Scroll through an endlessly entertaining lineup of bunny blockbusters.
- **🌟 Save Your Favorites:** Keep a curated list of your top hare-tastic flicks—no burrow required!
- **💻 Rich Interactions:** Enjoy a dynamic, responsive interface with multiple views tailored to your browsing preferences.
- **🎥 Built for Movie Lovers:** Whether you’re in the mood to browse or build a bunny movie marathon, Bunbuster has you covered.

---

So, grab some popcorn (and maybe a carrot or two) and dive into **Bunbuster**—the only movie database that proves the fluff is always greener in the Bunnyverse! 🐇🎥

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

### Main View

- Returns ALL movies to the user (each movie item with an image, title, and description).
- Filter the list of movies with a “search” feature by:
  - Title
  - Genre
  - Director
- Displays the name of the user who is currently signed in.
- Ability to:
  - Select a movie for more details.
  - Navigate to Profile view, Director Overview, or Genre Overview.
  - Log out.

### Genre Overview

- View a list of all genres (with names).
- Ability to:
  - Select a genre for more details.
  - Navigate to Profile view, Main (Movie) View, or Director Overview.

### Director Overview

- View a list of all directors, with each director's:
  - Name
  - Date of birth
  - Date of death (if applicable)
- Ability to:
  - Select a director for more details.
  - Navigate to Profile view, Main (Movie) View, or Genre Overview.

### Single Movie View

- Detailed information about a movie:
  - Description
  - Year of release
  - Genre
  - Director
  - Image
  - Duration
  - Language
  - IMDB Rating
- Ability to:
  - Access more info about genres or directors via links.
  - Add the movie to your favorite list.

### Single Genre View

- Displays data about a genre, including:
  - Name
  - Description

### Single Director View

- Displays data about a director, including:
  - Name
  - Bio
  - Birth year
  - Death year (if applicable)

### Login View

- Allows users to log in with a username and password.

### Signup View

- Allows new users to register with:
  - Username
  - Password
  - Email
  - Date of birth

### Profile View

- Displays user registration details.
- Allows users to:
  - Edit their info (username, password, email, date of birth).
  - View and manage their favorite movies.
  - Remove a movie from their favorites.
  - Deregister their account.

## Technologies Used

## Technologies Used

- **Build Tool**: [Parcel](https://parceljs.org/) - Zero-config, fast, and efficient bundler for modern web applications.
- **Language**: [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - A versatile, high-level programming language for building web apps.
- **Framework**: [React](https://reactjs.org/) - A popular JavaScript library for building user interfaces.
- **Styling**: [Sass](https://sass-lang.com/) - CSS preprocessor for better organization and functionality.
- **UI Components**: [React-Bootstrap](https://react-bootstrap.github.io/) - Bootstrap components for React.
- **Version Control**: [Git](https://git-scm.com/) - Version control system for tracking changes.

## Installation

Follow these steps to set up the project locally:

### Prerequisites

- Install [Node.js](https://nodejs.org/) (v14.0.0 or higher recommended).
- Ensure npm (Node Package Manager) is installed (comes with Node.js).

### Steps

1. Clone the repository:

   ```
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Open your browser and navigate to:

   ```
   http://localhost:1234
   ```

5. To create a production build:

   ```
   npm run build
   ```

## Usage

Once the application is running, users can:

1. **Browse Movies**: View a list of all movies with titles, movie poster, and further info.
2. **Search**: Use the search bar to filter movies by title, genre, or director.
3. **Explore Details**: Get detailed information about a movie, genre or director by clicking on it.
4. **Browse Genres and Directors**: View a list of all directors and genres, and click on them for further information.
5. **Manage Favorites**: Add or remove movies from your favorite list.
6. **Sign Up/Deregister**: Create an account, with the option to permanently delete the account and all your user data if desired.
7. **Edit Profile**: Update account information (username, email address, birthday, and password).

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add a new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes necessary tests.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out:

- GitHub: [nimkus](https://github.com/nimkus)
