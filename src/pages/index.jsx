import Layout from "./Layout.jsx";

import Home from "./Home";

import Workouts from "./Workouts";

import ActiveWorkout from "./ActiveWorkout";

import History from "./History";

import Exercises from "./Exercises";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Workouts: Workouts,
    
    ActiveWorkout: ActiveWorkout,
    
    History: History,
    
    Exercises: Exercises,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Workouts" element={<Workouts />} />
                
                <Route path="/ActiveWorkout" element={<ActiveWorkout />} />
                
                <Route path="/History" element={<History />} />
                
                <Route path="/Exercises" element={<Exercises />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}