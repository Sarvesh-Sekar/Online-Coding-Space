import React from 'react';
import UpcomingTests from './components/Upcoming';
import { Routes, Route } from 'react-router-dom';
import ViewCodePage from './components/ViewCodePage';
import Login from './components/Login';
import Protected from './components/Protected';
import Home from './components/Home';
import TestsPage from './components/TestsPage';
import ProblemsPage from './components/ProblemsPage';
import CodeSpace from './components/CodePage';
import TestForm from './components/TestForm';
import AdminPostedQuestions from './components/AdminPosted';
import AdminListPage from './components/AdminList';
import ProtectedRoute from './components/ProtectedRoute';
import ViewSubmissionsPage from './components/ViewSubmissionsPage';
import InstructionsPage from './components/InstructionsPage';
import Attended from './components/Attended';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/protected" element={<ProtectedRoute element={Protected} />} />
        <Route path="/tests" element={<ProtectedRoute element={TestsPage} />} />
        <Route path="/upcoming" element={<ProtectedRoute element={UpcomingTests} />} />
        <Route path="/attended" element={<ProtectedRoute element={Attended} />} />
        <Route path="/questions" element={<ProtectedRoute element={TestForm} />} />
        <Route path="/tests/:customId/questions/:userId" element={<ProtectedRoute element={ProblemsPage} />} />
        <Route path="/codespace/:customId/:userId" element={<ProtectedRoute element={CodeSpace} />} />
        <Route path="/posted" element={<ProtectedRoute element={AdminPostedQuestions} />} />
        <Route path="/posted/:customId/questions/:userId" element={<ProtectedRoute element={AdminListPage} />} />
        <Route path="/posted/submissions/:customId/:questionId" element={<ProtectedRoute element={ViewSubmissionsPage} />} />
        <Route path="/posted/view-code/:userId/:problemId" element={<ProtectedRoute element={ViewCodePage} />} />
        <Route path = "/instructions/:customId/:userId" element = {<ProtectedRoute element={InstructionsPage}/>}/>

      </Routes>
    </div>
  );
}

export default App;
