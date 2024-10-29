import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast styles
import Content from './components/content';
import ContentForm from './components/form';
import SearchAppBar from './components/header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <Router>
                <SearchAppBar />
                <Routes>
                    <Route path="/" element={<Content />} /> {/* Default route to display Content */}
                    <Route path="/add-notes" element={<ContentForm />} /> {/* Route for adding notes */}
                </Routes>
                <ToastContainer /> {/* Include the ToastContainer here if needed */}
            </Router>
        </div>
    );
}

export default App;
