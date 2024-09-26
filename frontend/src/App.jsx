import React from 'react';

import { Routes, Route } from 'react-router-dom';
import UpcomingTests from './components/User/Upcoming';
import ViewCodePage from './components/ViewCodePage';
import Login from './components/Login';
import Protected from './components/Protected';
import Dashboard from './components/Admin/DashBoardUser.jsx';
import Ongoing from './components/User/Ongoing.jsx';

import CodeSpace from './components/User/CodePage.jsx';
import TestForm from './components/Admin/TestForm';
import AdminPostedQuestions from './components/Admin/AdminPosted';
import SubmissionsPage from './components/Admin/Submissions';
import ProtectedRoute from './components/ProtectedRoute';

import InstructionsPage from './components/User/InstructionsPage';
import Attended from './components/User/Attended';
import AttendedTests from './components/AttendedTests.jsx';
import UpdateDetails from './components/User/UpdateDetails';
import InfoBoard from './components/Admin/InfoBoard';
import UserInfo from './components/Admin/UserInfo.jsx';
import CompletedTests from './components/CompletedTests.jsx';
import Analytics from './components/Admin/Analytics';
import StudentsAttended from './components/Admin/StudentsAttended';
import StudentsCompleted from './components/Admin/StudentsCompleted';
import CodeEditor from './components/Admin/CodeEditor';


function App() {
  return (
    <div>
      <Routes>
        
      <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
      <Route path="/upcoming-tests" element={<ProtectedRoute element={UpcomingTests} />} />
      <Route path="/attended-tests/:userId" element={<ProtectedRoute element={AttendedTests} />} />
      <Route path="/completed-tests/:userId" element={<ProtectedRoute element={CompletedTests} />} />
      <Route path="/user-attended-tests/:userId" element={<ProtectedRoute element={AttendedTests} />} />
      <Route path="/user-completed-tests/:userId" element={<ProtectedRoute element={CompletedTests} />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/protected" element={<ProtectedRoute element={Protected} />} />
        <Route path="/tests" element={<ProtectedRoute element={Ongoing} />} />
        <Route path="/upcoming" element={<ProtectedRoute element={UpcomingTests} />} />
        <Route path="/attended" element={<ProtectedRoute element={Attended} />} />
        <Route path="/questions" element={<ProtectedRoute element={TestForm} />} />
       
        <Route path="/codespace/:customId/:userId" element={<ProtectedRoute element={CodeSpace} />} />
        <Route path="/posted" element={<ProtectedRoute element={AdminPostedQuestions} />} />
        <Route path="/posted/:testId/questions" element={<ProtectedRoute element={SubmissionsPage} />} />
       
       
        <Route path = "/instructions/:customId/:userId" element = {<ProtectedRoute element={InstructionsPage}/>}/>
        <Route path = "/view-code/:historyId" element = {<ProtectedRoute element={ViewCodePage}/>}/>
        <Route path = "infoboard/" element = {<ProtectedRoute element={InfoBoard}/>}/>
        <Route path = "/update-details" element = {<ProtectedRoute element={UpdateDetails}/>}/>
        <Route path = "infoboard/user-info/:userId" element = {<ProtectedRoute element={UserInfo}/>}/>
        <Route path = "analytics/" element = {<ProtectedRoute element={Analytics}/>}/>
        <Route path = "/students-attended-details" element = {<ProtectedRoute element={StudentsAttended}/>}/>
        <Route path = "/students-completed-details" element = {<ProtectedRoute element={StudentsCompleted}/>}/>
        <Route path = "/codespace" element = {<ProtectedRoute element={CodeEditor}/>}/>


      </Routes>
    </div>
  );
}

export default App;
