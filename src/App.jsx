import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import RecoveryAssistant from './pages/RecoveryAssistant';
import EmergencyScript from './pages/EmergencyScript';
import CaregiverAssistant from './pages/CaregiverAssistant';
import Learn from './pages/Learn';
import Progress from './pages/Progress';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'recovery':
        return <RecoveryAssistant />;
      case 'emergency':
        return <EmergencyScript />;
      case 'caregiver':
        return <CaregiverAssistant />;
      case 'learn':
        return <Learn />;
      case 'progress':
        return <Progress />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
