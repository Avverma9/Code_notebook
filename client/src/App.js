import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast styles
import Content from './components/content';
import ContentForm from './components/form';
import SearchAppBar from './components/header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import List from './components/list';

function App() {
    return (
        <div className="App">
            <Router>
                <SearchAppBar />
                <Routes>
                    <Route path="/question" element={<Content />} />
                    <Route path="/" element={<List />} />
                    <Route path="/add-notes" element={<ContentForm />} />
                </Routes>
                <ToastContainer />
            </Router>
        </div>
    );
}

export default App;
