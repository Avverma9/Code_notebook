import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SearchAppBar from './components/Bars/Header';
import ContentForm from './components/Content/AddContent';
import Content from './components/Content/Content';

function App() {
    return (
        <Router>
            <SearchAppBar /> {/* This will always be visible */}
            <Content/>
            <Routes>
                
                <Route path="/add-notes" element={<ContentForm />} /> {/* Route for adding notes */}
            </Routes>
        </Router>
    );
}

export default App;
