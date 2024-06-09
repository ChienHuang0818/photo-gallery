
# Photo Gallery Project

This is a stunning photo gallery application built with React, Redux, and TypeScript, integrated with the Unsplash API.

## Getting Started

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ChienHuang0818/photo-gallery.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd photo-gallery
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

### Running the Project Locally

To run the app in development mode:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

### Running Tests

To launch the test runner in the interactive watch mode:

```bash
npm test
```

## Additional Features

- **Photo Search:** Users can search for photos using keywords.
- **Photo Details:** Clicking on any photo displays detailed information, including author and description.
- **Load More:** Supports infinite scrolling and loading more photos functionality.
- **Error Handling:** Provides detailed error messages to ensure a user-friendly experience.

## Design Considerations

- **State Management with Redux:** The project uses Redux for state management to keep the state predictable and manageable.
- **TypeScript for Reliability:** TypeScript is used to enhance code reliability and maintainability.
- **Optimized UI with Styled Components:** The UI is designed using styled components to offer the best visual experience while browsing photos.

## Project Structure

Here's an overview of the project's structure:

```
yourprojectname/
├── public/
├── src/
│   ├── api/
│   │   ├── unsplash.ts
│   ├── assets/
│   │   ├── logo.png
│   ├── components/
│   │   ├── test/
│   │   │   ├── __mocks__/
│   │   │   ├── Gallery.test.tsx
│   │   │   ├── Loader.test.tsx
│   │   │   ├── Integration.test.tsx
│   │   │   ├── photoSlice.test.ts
│   │   │   ├── store.test.ts
│   │   ├── Gallery.tsx
│   │   ├── Loader.tsx
│   ├── store/
│   │   ├── photoSlice.ts
│   │   ├── store.ts   
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
├── package.json
├── README.md
├── tsconfig.json

```

## Example Usage

### Search Photos
- Enter a keyword in the search bar and press "Search".

### Load More Photos
- Scroll down to the bottom of the page or click "Load More" to fetch more photos.

### View Photo Details
- Click on any photo to view its details.

## Contact

If you have any questions or suggestions, feel free to contact me:

- **Email:** betty556611@gmail.com
- **GitHub:** https://github.com/ChienHuang0818
- **Demo Video:** https://www.youtube.com/watch?v=vX3-2fnk2PU&t=2s
