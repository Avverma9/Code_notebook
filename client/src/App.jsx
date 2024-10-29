import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast styles
import './App.css';
import SearchAppBar from './components/Bars/Header';
import ContentForm from './components/Content/AddContent';
import Content from './components/Content/Content';

function App() {
    return (
        <Router>
            <SearchAppBar /> {/* This will always be visible */}
            <ContentForm />
            <Content />
            <Routes></Routes>
            <ToastContainer /> {/* ToastContainer for displaying notifications */}
        </Router>
    );
}

export default App;
