// Import the App component from the App.svelte file
import App from "./App.svelte";

// Create an instance of the App component
const app = new App({
  // Specify the target DOM element where the Svelte component will be rendered
  target: document.querySelector('#app'),
});

// Export the app instance for potential use elsewhere
export default app;
